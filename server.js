const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// 存储所有房间的数据
const rooms = {};

// 角色配置
const CHARACTERS = {
  A: {
    id: 'A',
    name: '战士',
    icon: '🛡️',
    maxHp: 60,
    description: '高血量防御型角色，适合新手'
  },
  B: {
    id: 'B',
    name: '法师',
    icon: '🔮',
    maxHp: 40,
    description: '攻击伤害+1，高输出法术大师'
  },
  C: {
    id: 'C',
    name: '刺客',
    icon: '🗡️',
    maxHp: 45,
    description: '20%几率暴击造成双倍伤害'
  }
};

// BOSS配置
const BOSS_CONFIG = {
  maxHp: 100,
  name: '黑暗领主',
  attackMin: 1,
  attackMax: 6
};

// 提供静态文件
app.use(express.static('public'));

// 主页
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Socket.IO 连接处理
io.on('connection', (socket) => {
  console.log('用户连接:', socket.id);

  // 创建房间
  socket.on('createRoom', (data) => {
    const { roomId, playerName, playerId } = data;

    rooms[roomId] = {
      players: {},
      boss: {
        name: BOSS_CONFIG.name,
        hp: BOSS_CONFIG.maxHp,
        maxHp: BOSS_CONFIG.maxHp,
        isDead: false
      },
      gameStarted: false,
      gameOver: false,
      winner: null
    };

    rooms[roomId].players[playerId] = {
      id: playerId,
      name: playerName,
      character: null, // 未选择角色
      hp: 0,
      maxHp: 0,
      dice: null,
      damage: 0,
      rolling: false,
      isDead: false,
      socketId: socket.id
    };

    socket.join(roomId);
    socket.emit('roomCreated', {
      roomId,
      players: rooms[roomId].players,
      boss: rooms[roomId].boss,
      gameStarted: rooms[roomId].gameStarted,
      characters: CHARACTERS
    });

    console.log(`房间 ${roomId} 已创建，玩家: ${playerName}`);
  });

  // 加入房间
  socket.on('joinRoom', (data) => {
    const { roomId, playerName, playerId } = data;

    if (!rooms[roomId]) {
      socket.emit('error', { message: '房间不存在' });
      return;
    }

    if (Object.keys(rooms[roomId].players).length >= 3) {
      socket.emit('error', { message: '房间已满（最多3人）' });
      return;
    }

    if (rooms[roomId].gameStarted) {
      socket.emit('error', { message: '游戏已开始，无法加入' });
      return;
    }

    rooms[roomId].players[playerId] = {
      id: playerId,
      name: playerName,
      character: null, // 未选择角色
      hp: 0,
      maxHp: 0,
      dice: null,
      damage: 0,
      rolling: false,
      isDead: false,
      socketId: socket.id
    };

    socket.join(roomId);

    // 通知房间内所有人
    io.to(roomId).emit('playerJoined', {
      players: rooms[roomId].players,
      boss: rooms[roomId].boss,
      gameStarted: rooms[roomId].gameStarted,
      characters: CHARACTERS
    });

    console.log(`玩家 ${playerName} 加入房间 ${roomId}`);
  });

  // 选择角色
  socket.on('selectCharacter', (data) => {
    const { roomId, playerId, characterId } = data;

    if (!rooms[roomId] || !rooms[roomId].players[playerId]) {
      socket.emit('error', { message: '房间或玩家不存在' });
      return;
    }

    if (!CHARACTERS[characterId]) {
      socket.emit('error', { message: '角色不存在' });
      return;
    }

    if (rooms[roomId].gameStarted) {
      socket.emit('error', { message: '游戏已开始，无法更改角色' });
      return;
    }

    const player = rooms[roomId].players[playerId];
    const character = CHARACTERS[characterId];

    player.character = character;
    player.hp = character.maxHp;
    player.maxHp = character.maxHp;

    // 通知房间内所有人
    io.to(roomId).emit('characterSelected', {
      playerId,
      character,
      players: rooms[roomId].players
    });

    console.log(`玩家 ${player.name} 选择了角色 ${character.name}`);
  });

  // 开始游戏
  socket.on('startGame', (data) => {
    const { roomId } = data;

    if (rooms[roomId]) {
      // 检查所有玩家是否都选择了角色
      const allSelected = Object.values(rooms[roomId].players).every(p => p.character !== null);
      if (!allSelected) {
        socket.emit('error', { message: '所有玩家必须先选择角色！' });
        return;
      }

      rooms[roomId].gameStarted = true;
      io.to(roomId).emit('gameStarted', {
        players: rooms[roomId].players,
        boss: rooms[roomId].boss,
        gameStarted: true
      });
      console.log(`房间 ${roomId} 游戏开始`);
    }
  });

  // 摇骰子（攻击BOSS）
  socket.on('rollDice', (data) => {
    const { roomId, playerId } = data;

    if (!rooms[roomId] || !rooms[roomId].players[playerId]) return;

    const room = rooms[roomId];
    const player = room.players[playerId];

    // 检查玩家是否已死亡或游戏已结束
    if (player.isDead || room.gameOver) {
      socket.emit('error', { message: '无法行动' });
      return;
    }

    // 设置为摇骰中
    player.rolling = true;
    io.to(roomId).emit('playerRolling', { playerId });

    // 0.8秒后生成结果
    setTimeout(() => {
      const diceResult = Math.floor(Math.random() * 6) + 1;
      player.dice = diceResult;

      // 根据角色计算伤害
      let damage = diceResult;
      let isCritical = false;

      if (player.character) {
        // 法师：攻击伤害+1
        if (player.character.id === 'B') {
          damage += 1;
        }
        // 刺客：20%几率暴击（双倍伤害）
        else if (player.character.id === 'C') {
          if (Math.random() < 0.2) {
            damage *= 2;
            isCritical = true;
          }
        }
      }

      player.damage = damage;
      player.rolling = false;

      // 玩家对BOSS造成伤害
      room.boss.hp = Math.max(0, room.boss.hp - damage);

      const battleLog = [{
        type: 'player_attack',
        playerName: player.name,
        damage: damage,
        diceResult: diceResult,
        isCritical: isCritical,
        bossHp: room.boss.hp
      }];

      // 检查BOSS是否死亡
      if (room.boss.hp <= 0) {
        room.boss.isDead = true;
        room.gameOver = true;
        room.winner = 'players';

        io.to(roomId).emit('diceResult', {
          playerId,
          result: diceResult,
          players: room.players,
          boss: room.boss,
          battleLog,
          gameOver: true,
          winner: 'players'
        });

        console.log(`房间 ${roomId} - BOSS被击败！`);
        return;
      }

      // BOSS反击
      setTimeout(() => {
        const alivePlayers = Object.values(room.players).filter(p => !p.isDead);
        if (alivePlayers.length > 0) {
          // 随机选择一个存活的玩家进行攻击
          const target = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
          const bossDamage = Math.floor(Math.random() * (BOSS_CONFIG.attackMax - BOSS_CONFIG.attackMin + 1)) + BOSS_CONFIG.attackMin;

          target.hp = Math.max(0, target.hp - bossDamage);

          battleLog.push({
            type: 'boss_attack',
            targetName: target.name,
            damage: bossDamage,
            targetHp: target.hp
          });

          // 检查玩家是否死亡
          if (target.hp <= 0) {
            target.isDead = true;
            battleLog.push({
              type: 'player_died',
              playerName: target.name
            });
          }

          // 检查所有玩家是否都死亡
          const allDead = Object.values(room.players).every(p => p.isDead);
          if (allDead) {
            room.gameOver = true;
            room.winner = 'boss';

            io.to(roomId).emit('diceResult', {
              playerId,
              result: diceResult,
              players: room.players,
              boss: room.boss,
              battleLog,
              gameOver: true,
              winner: 'boss'
            });

            console.log(`房间 ${roomId} - BOSS获胜！`);
            return;
          }

          // 发送战斗结果
          io.to(roomId).emit('diceResult', {
            playerId,
            result: diceResult,
            players: room.players,
            boss: room.boss,
            battleLog
          });
        }
      }, 1000);

      console.log(`房间 ${roomId} - 玩家 ${player.name} 摇出 ${diceResult} 点，对BOSS造成 ${diceResult} 伤害`);
    }, 800);
  });

  // 重置游戏
  socket.on('resetGame', (data) => {
    const { roomId } = data;

    if (rooms[roomId]) {
      // 重置所有玩家状态（保留角色选择）
      Object.keys(rooms[roomId].players).forEach(playerId => {
        const player = rooms[roomId].players[playerId];
        player.hp = player.character ? player.character.maxHp : 0;
        player.dice = null;
        player.damage = 0;
        player.rolling = false;
        player.isDead = false;
      });

      // 重置BOSS
      rooms[roomId].boss = {
        name: BOSS_CONFIG.name,
        hp: BOSS_CONFIG.maxHp,
        maxHp: BOSS_CONFIG.maxHp,
        isDead: false
      };

      rooms[roomId].gameOver = false;
      rooms[roomId].winner = null;

      io.to(roomId).emit('gameReset', {
        players: rooms[roomId].players,
        boss: rooms[roomId].boss,
        gameOver: false
      });

      console.log(`房间 ${roomId} 游戏已重置`);
    }
  });

  // 断开连接
  socket.on('disconnect', () => {
    console.log('用户断开连接:', socket.id);
    
    // 从所有房间中移除该玩家
    Object.keys(rooms).forEach(roomId => {
      const players = rooms[roomId].players;
      const playerId = Object.keys(players).find(
        id => players[id].socketId === socket.id
      );
      
      if (playerId) {
        const playerName = players[playerId].name;
        delete players[playerId];
        
        // 如果房间空了，删除房间
        if (Object.keys(players).length === 0) {
          delete rooms[roomId];
          console.log(`房间 ${roomId} 已删除（无玩家）`);
        } else {
          // 通知其他玩家
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
});
