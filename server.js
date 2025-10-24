const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
const fs = require('fs');
const path = require('path');

// 加载游戏数据
const sceneData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data/act1/scene1-room.json'), 'utf8')
);

// 存储所有房间的数据
const rooms = {};

// 提供静态文件
app.use(express.static('public'));
app.use('/data', express.static('data'));

// 主页
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// 生成房间ID
function generateRoomId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// 初始化房间游戏状态
function initializeRoomState() {
  return {
    gamePhase: 'character-selection', // character-selection, room-escape, completed
    catCanMove: sceneData.initialState.catCanMove,
    dogCanMove: sceneData.initialState.dogCanMove,
    turtleCanMove: sceneData.initialState.turtleCanMove,
    collectedLetters: [],
    discoveredAreas: [...sceneData.initialState.discoveredAreas],
    inventory: {},
    usedInteractions: [],
    suitcaseUnlocked: false,
    gameCompleted: false,
    storyLog: []
  };
}

// 检查交互条件是否满足
function checkCondition(condition, gameState, playerRole) {
  if (!condition) return true;

  for (const [key, value] of Object.entries(condition)) {
    if (key === 'catCanMove' && gameState.catCanMove !== value) return false;
    if (key === 'dogCanMove' && gameState.dogCanMove !== value) return false;
    if (key === 'turtleCanMove' && gameState.turtleCanMove !== value) return false;
    if (key === 'suitcaseUnlocked' && gameState.suitcaseUnlocked !== value) return false;
    if (key === 'hasItem' && !gameState.inventory[value]) return false;
    if (key === 'areaDiscovered' && !gameState.discoveredAreas.includes(value)) return false;
  }

  return true;
}

// 检查玩家是否可以触发该交互
function canPlayerTrigger(interaction, playerRole) {
  const roleMap = {
    'cat': 'cat',
    'dog': 'dog',
    'turtle': 'turtle'
  };

  return interaction.triggerBy.includes(roleMap[playerRole]);
}

// 处理交互效果
function applyEffect(effect, gameState, players, roomId, io) {
  const results = {
    success: true,
    storyText: effect.storyText,
    changes: []
  };

  switch (effect.type) {
    case 'getItem':
      gameState.inventory[effect.itemId] = true;
      results.changes.push({ type: 'item_acquired', itemId: effect.itemId });
      if (effect.addToInventory) {
        results.changes.push({ type: 'inventory_updated' });
      }
      if (effect.createItem) {
        gameState.inventory[effect.createItem] = true;
      }
      break;

    case 'damage':
      const targetPlayer = Object.values(players).find(p => p.character?.id === effect.target);
      if (targetPlayer) {
        targetPlayer.hp = Math.max(0, targetPlayer.hp + effect.value);
        results.changes.push({
          type: 'hp_changed',
          playerId: targetPlayer.id,
          value: effect.value,
          newHp: targetPlayer.hp
        });
      }
      break;

    case 'unlockAndRescue':
      if (effect.target === 'cat') {
        gameState.catCanMove = true;
        gameState.suitcaseUnlocked = true;
        results.changes.push({ type: 'cat_rescued' });
      } else if (effect.target === 'dog') {
        gameState.dogCanMove = true;
        results.changes.push({ type: 'dog_rescued' });
      }
      break;

    case 'discoverArea':
      effect.areas.forEach(areaId => {
        if (!gameState.discoveredAreas.includes(areaId)) {
          gameState.discoveredAreas.push(areaId);
        }
      });
      results.changes.push({
        type: 'areas_discovered',
        areas: effect.areas
      });
      break;

    case 'getLetter':
      if (!gameState.collectedLetters.includes(effect.letter)) {
        gameState.collectedLetters.push(effect.letter);
        results.changes.push({
          type: 'letter_collected',
          letter: effect.letter
        });
      }
      break;

    case 'riverGod':
      // 河神事件，需要玩家选择
      results.requiresChoice = true;
      results.choiceType = 'riverGod';
      break;

    case 'story':
      // 纯剧情，无额外效果
      break;
  }

  // 处理生命值奖励
  if (effect.rewardHp) {
    Object.values(players).forEach(p => {
      if (p.character) {
        p.hp = Math.min(p.maxHp, p.hp + effect.rewardHp);
      }
    });
    results.changes.push({
      type: 'all_hp_bonus',
      value: effect.rewardHp
    });
  }

  // 添加到故事日志
  gameState.storyLog.push({
    timestamp: Date.now(),
    text: effect.storyText,
    type: effect.type
  });

  return results;
}

// Socket.IO 连接处理
io.on('connection', (socket) => {
  console.log('用户连接:', socket.id);

  // 创建房间
  socket.on('createRoom', (data) => {
    const { roomId, playerName, playerId, character } = data;

    rooms[roomId] = {
      players: {},
      gameState: initializeRoomState(),
      sceneData: sceneData
    };

    rooms[roomId].players[playerId] = {
      id: playerId,
      name: playerName,
      character: character,
      hp: character.maxHp,
      maxHp: character.maxHp,
      socketId: socket.id,
      canMove: character.id === 'turtle' // 初始只有乌龟能行动
    };

    socket.join(roomId);
    socket.emit('roomCreated', {
      roomId,
      players: rooms[roomId].players,
      gameState: rooms[roomId].gameState,
      sceneData: sceneData
    });

    console.log(`房间 ${roomId} 已创建，玩家: ${playerName} (${character.name})`);
  });

  // 加入房间
  socket.on('joinRoom', (data) => {
    const { roomId, playerName, playerId, character } = data;

    if (!rooms[roomId]) {
      socket.emit('error', { message: '房间不存在' });
      return;
    }

    const playerCount = Object.keys(rooms[roomId].players).length;
    if (playerCount >= 3) {
      socket.emit('error', { message: '房间已满（最多3人）' });
      return;
    }

    // 检查角色是否已被选择
    const characterTaken = Object.values(rooms[roomId].players).some(
      p => p.character.id === character.id
    );
    if (characterTaken) {
      socket.emit('error', { message: '该角色已被其他玩家选择' });
      return;
    }

    rooms[roomId].players[playerId] = {
      id: playerId,
      name: playerName,
      character: character,
      hp: character.maxHp,
      maxHp: character.maxHp,
      socketId: socket.id,
      canMove: character.id === 'turtle'
    };

    socket.join(roomId);

    // 通知房间内所有人
    io.to(roomId).emit('playerJoined', {
      players: rooms[roomId].players,
      gameState: rooms[roomId].gameState,
      sceneData: sceneData
    });

    console.log(`玩家 ${playerName} (${character.name}) 加入房间 ${roomId}`);
  });

  // 开始游戏
  socket.on('startGame', (data) => {
    const { roomId } = data;

    if (!rooms[roomId]) {
      socket.emit('error', { message: '房间不存在' });
      return;
    }

    const playerCount = Object.keys(rooms[roomId].players).length;
    if (playerCount < 3) {
      socket.emit('error', { message: '需要3名玩家才能开始游戏' });
      return;
    }

    rooms[roomId].gameState.gamePhase = 'room-escape';

    io.to(roomId).emit('gameStarted', {
      gameState: rooms[roomId].gameState,
      message: sceneData.description
    });

    console.log(`房间 ${roomId} 游戏开始`);
  });

  // 处理关键词输入
  socket.on('submitKeyword', (data) => {
    const { roomId, playerId, keyword } = data;

    if (!rooms[roomId]) {
      socket.emit('error', { message: '房间不存在' });
      return;
    }

    const room = rooms[roomId];
    const player = room.players[playerId];

    if (!player) {
      socket.emit('error', { message: '玩家不存在' });
      return;
    }

    // 检查玩家是否能行动
    const playerRole = player.character.id;
    const canMove = (playerRole === 'cat' && room.gameState.catCanMove) ||
                    (playerRole === 'dog' && room.gameState.dogCanMove) ||
                    (playerRole === 'turtle' && room.gameState.turtleCanMove);

    if (!canMove) {
      socket.emit('keywordResult', {
        success: false,
        message: '你目前无法行动！'
      });
      return;
    }

    // 查找匹配的交互
    const normalizedKeyword = keyword.trim().toLowerCase();
    let matchedInteraction = null;

    for (const interaction of sceneData.interactions) {
      const keywords = [interaction.keyword, ...(interaction.aliases || [])];
      const match = keywords.some(kw => kw.toLowerCase() === normalizedKeyword);

      if (match && !room.gameState.usedInteractions.includes(interaction.keyword)) {
        // 检查玩家是否可以触发
        if (!canPlayerTrigger(interaction, playerRole)) {
          socket.emit('keywordResult', {
            success: false,
            message: '这个操作不适合你的角色！'
          });
          return;
        }

        // 检查条件
        if (!checkCondition(interaction.condition, room.gameState, playerRole)) {
          socket.emit('keywordResult', {
            success: false,
            message: '当前条件不满足，无法执行此操作。'
          });
          return;
        }

        matchedInteraction = interaction;
        break;
      }
    }

    if (!matchedInteraction) {
      socket.emit('keywordResult', {
        success: false,
        message: '没有找到匹配的关键词，请尝试其他组合。提示：格式如"水潭+龟"或"行李箱+猫"'
      });
      return;
    }

    // 应用交互效果
    const result = applyEffect(
      matchedInteraction.effect,
      room.gameState,
      room.players,
      roomId,
      io
    );

    // 标记该交互已使用（除非可重复使用）
    if (!matchedInteraction.effect.reusable) {
      room.gameState.usedInteractions.push(matchedInteraction.keyword);
    }

    // 更新玩家移动能力
    Object.values(room.players).forEach(p => {
      if (p.character.id === 'cat') p.canMove = room.gameState.catCanMove;
      if (p.character.id === 'dog') p.canMove = room.gameState.dogCanMove;
      if (p.character.id === 'turtle') p.canMove = room.gameState.turtleCanMove;
    });

    // 广播结果给所有玩家
    io.to(roomId).emit('keywordResult', {
      success: true,
      playerName: player.name,
      keyword: keyword,
      result: result,
      gameState: room.gameState,
      players: room.players
    });

    console.log(`房间 ${roomId} - ${player.name} 使用关键词: ${keyword}`);
  });

  // 尝试打开大门
  socket.on('tryOpenDoor', (data) => {
    const { roomId, playerId, password } = data;

    if (!rooms[roomId]) {
      socket.emit('error', { message: '房间不存在' });
      return;
    }

    const room = rooms[roomId];
    const correctPassword = sceneData.winCondition.password;

    if (password.toUpperCase() === correctPassword) {
      room.gameState.gameCompleted = true;

      io.to(roomId).emit('gameCompleted', {
        success: true,
        message: sceneData.winCondition.successText,
        gameState: room.gameState
      });

      console.log(`房间 ${roomId} - 游戏完成！`);
    } else {
      socket.emit('doorResult', {
        success: false,
        message: '密码错误！请检查你收集的字母。'
      });
    }
  });

  // 重置游戏
  socket.on('resetGame', (data) => {
    const { roomId } = data;

    if (rooms[roomId]) {
      // 重置游戏状态但保留玩家
      rooms[roomId].gameState = initializeRoomState();

      // 重置所有玩家状态
      Object.values(rooms[roomId].players).forEach(player => {
        player.hp = player.maxHp;
        player.canMove = player.character.id === 'turtle';
      });

      io.to(roomId).emit('gameReset', {
        players: rooms[roomId].players,
        gameState: rooms[roomId].gameState
      });

      console.log(`房间 ${roomId} 游戏已重置`);
    }
  });

  // 断开连接
  socket.on('disconnect', () => {
    console.log('用户断开连接:', socket.id);

    Object.keys(rooms).forEach(roomId => {
      const players = rooms[roomId].players;
      const playerId = Object.keys(players).find(
        id => players[id].socketId === socket.id
      );

      if (playerId) {
        const playerName = players[playerId].name;
        delete players[playerId];

        if (Object.keys(players).length === 0) {
          delete rooms[roomId];
          console.log(`房间 ${roomId} 已删除（无玩家）`);
        } else {
          io.to(roomId).emit('playerLeft', {
            playerId,
            playerName,
            players: rooms[roomId].players
          });
          console.log(`玩家 ${playerName} 离开房间 ${roomId}`);
        }
      }
    });
  });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
  console.log(`访问 http://localhost:${PORT}`);
  console.log('三兄弟的冒险2 - 密室逃脱');
});
