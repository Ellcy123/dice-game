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
      players: {}
    };

    rooms[roomId].players[playerId] = {
      id: playerId,
      name: playerName,
      dice: null,
      rolling: false,
      socketId: socket.id
    };

    socket.join(roomId);
    socket.emit('roomCreated', { roomId, players: rooms[roomId].players });
    
    console.log(`房间 ${roomId} 已创建，玩家: ${playerName}`);
  });

  // 加入房间
  socket.on('joinRoom', (data) => {
    const { roomId, playerName, playerId } = data;
    
    if (!rooms[roomId]) {
      socket.emit('error', { message: '房间不存在' });
      return;
    }

    if (Object.keys(rooms[roomId].players).length >= 6) {
      socket.emit('error', { message: '房间已满' });
      return;
    }

    rooms[roomId].players[playerId] = {
      id: playerId,
      name: playerName,
      dice: null,
      rolling: false,
      socketId: socket.id
    };

    socket.join(roomId);
    
    // 通知房间内所有人
    io.to(roomId).emit('playerJoined', { 
      players: rooms[roomId].players 
    });
    
    console.log(`玩家 ${playerName} 加入房间 ${roomId}`);
  });

  // 摇骰子
  socket.on('rollDice', (data) => {
    const { roomId, playerId } = data;
    
    if (rooms[roomId] && rooms[roomId].players[playerId]) {
      // 设置为摇骰中
      rooms[roomId].players[playerId].rolling = true;
      io.to(roomId).emit('playerRolling', { playerId });
      
      // 0.5秒后生成结果
      setTimeout(() => {
        const result = Math.floor(Math.random() * 6) + 1;
        rooms[roomId].players[playerId].dice = result;
        rooms[roomId].players[playerId].rolling = false;
        
        io.to(roomId).emit('diceResult', { 
          playerId, 
          result,
          players: rooms[roomId].players
        });
        
        console.log(`玩家 ${playerId} 在房间 ${roomId} 摇出了 ${result} 点`);
      }, 500);
    }
  });

  // 重置游戏
  socket.on('resetGame', (data) => {
    const { roomId } = data;
    
    if (rooms[roomId]) {
      Object.keys(rooms[roomId].players).forEach(playerId => {
        rooms[roomId].players[playerId].dice = null;
        rooms[roomId].players[playerId].rolling = false;
      });
      
      io.to(roomId).emit('gameReset', { 
        players: rooms[roomId].players 
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
