# Socket.io API接口文档

## 基本信息

- **协议**：WebSocket（Socket.io）
- **服务器地址**：
  - 本地开发：`http://localhost:3000`
  - 生产环境：`https://your-app.railway.app`
- **命名空间**：默认（`/`）

---

## 连接管理

### 连接服务器

**客户端代码**：
```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  reconnection: true,        // 自动重连
  reconnectionDelay: 1000,   // 重连延迟
  reconnectionAttempts: 5    // 最多重连5次
});

socket.on('connect', () => {
  console.log('已连接，Socket ID:', socket.id);
});

socket.on('disconnect', (reason) => {
  console.log('断开连接，原因:', reason);
});
```

---

## 房间相关事件

### 1. create-room（创建房间）

**描述**：玩家创建一个新的游戏房间

**发送方**：客户端 → 服务器

**数据格式**：
```typescript
{
  playerName: string,    // 玩家昵称（2-20字符）
  roomName?: string      // 房间名称（可选，2-30字符）
}
```

**示例**：
```javascript
socket.emit('create-room', {
  playerName: 'Player1',
  roomName: '欢乐小队'  // 可选
});
```

**接收事件**：
- 成功：`room-created`
- 失败：`error`

---

### 2. room-created（房间创建成功）

**描述**：服务器通知客户端房间已创建

**发送方**：服务器 → 客户端（创建者）

**数据格式**：
```typescript
{
  success: true,
  data: {
    roomId: string,        // 6位房间号（例："ABC123"）
    roomName: string,      // 房间名称
    host: string,          // 房主Socket ID
    players: [
      {
        id: string,        // Socket ID
        name: string,      // 玩家昵称
        character: null,   // 尚未选择角色
        hp: 8,             // 初始生命值
        maxHp: 8,          // 最大生命值
        isReady: false,    // 是否准备
        isHost: true       // 是否房主
      }
    ],
    gameState: 'waiting',  // 游戏状态
    createdAt: timestamp   // 创建时间
  }
}
```

**示例**：
```javascript
socket.on('room-created', (response) => {
  console.log('房间创建成功！');
  console.log('房间号:', response.data.roomId);
  // 显示房间信息给用户
});
```

---

### 3. join-room（加入房间）

**描述**：玩家通过房间号加入已存在的房间

**发送方**：客户端 → 服务器

**数据格式**：
```typescript
{
  roomId: string,        // 6位房间号
  playerName: string     // 玩家昵称
}
```

**示例**：
```javascript
socket.emit('join-room', {
  roomId: 'ABC123',
  playerName: 'Player2'
});
```

**接收事件**：
- 成功：`room-joined`
- 失败：`error`

---

### 4. room-joined（成功加入房间）

**描述**：服务器通知客户端已成功加入房间

**发送方**：服务器 → 客户端（加入者）

**数据格式**：
```typescript
{
  success: true,
  data: {
    roomId: string,
    roomName: string,
    players: Player[],    // 当前房间所有玩家
    gameState: string
  }
}
```

---

### 5. player-joined（有玩家加入）

**描述**：通知房间内所有玩家有新成员加入

**发送方**：服务器 → 客户端（房间内所有玩家）

**数据格式**：
```typescript
{
  player: {
    id: string,
    name: string,
    character: null,
    hp: 8,
    isReady: false
  },
  currentPlayers: Player[]  // 更新后的完整玩家列表
}
```

**示例**：
```javascript
socket.on('player-joined', (data) => {
  console.log(`${data.player.name} 加入了房间`);
  // 更新UI显示玩家列表
});
```

---

### 6. leave-room（离开房间）

**描述**：玩家主动离开房间

**发送方**：客户端 → 服务器

**数据格式**：
```typescript
{
  roomId: string
}
```

---

### 7. player-left（玩家离开）

**描述**：通知房间内其他玩家有人离开

**发送方**：服务器 → 客户端（房间内其他玩家）

**数据格式**：
```typescript
{
  playerId: string,
  playerName: string,
  currentPlayers: Player[]  // 更新后的玩家列表
}
```

---

## 角色选择相关事件

### 8. select-character（选择角色）

**描述**：玩家选择游戏角色

**发送方**：客户端 → 服务器

**数据格式**：
```typescript
{
  roomId: string,
  character: 'cat' | 'dog' | 'turtle'
}
```

**示例**：
```javascript
socket.emit('select-character', {
  roomId: 'ABC123',
  character: 'cat'
});
```

---

### 9. character-selected（角色已选择）

**描述**：通知房间内所有玩家某个角色已被选择

**发送方**：服务器 → 客户端（房间内所有玩家）

**数据格式**：
```typescript
{
  playerId: string,
  character: 'cat' | 'dog' | 'turtle',
  players: Player[]  // 更新后的玩家列表
}
```

---

### 10. ready（准备/取消准备）

**描述**：玩家切换准备状态

**发送方**：客户端 → 服务器

**数据格式**：
```typescript
{
  roomId: string,
  isReady: boolean
}
```

---

### 11. player-ready-changed（玩家准备状态变化）

**描述**：通知房间内所有玩家某人的准备状态改变

**发送方**：服务器 → 客户端（房间内所有玩家）

**数据格式**：
```typescript
{
  playerId: string,
  isReady: boolean,
  allReady: boolean  // 是否所有人都准备好了
}
```

---

## 游戏进行相关事件

### 12. start-game（开始游戏）

**描述**：房主点击开始游戏（需所有玩家准备）

**发送方**：客户端 → 服务器

**数据格式**：
```typescript
{
  roomId: string
}
```

---

### 13. game-started（游戏已开始）

**描述**：通知所有玩家游戏开始

**发送方**：服务器 → 客户端（房间内所有玩家）

**数据格式**：
```typescript
{
  roomId: string,
  gameState: 'playing',
  act: 1,               // 第几幕
  scene: 1,             // 第几场景
  storyText: string     // 开场剧情文本
}
```

---

### 14. player-action（玩家行动）

**描述**：玩家在游戏中进行操作（输入关键词/做选择）

**发送方**：客户端 → 服务器

**数据格式**：
```typescript
{
  roomId: string,
  actionType: 'keyword' | 'choice',
  data: {
    // keyword类型
    keyword?: string,      // 例："水潭+龟"
    
    // choice类型
    choiceId?: string,     // 选项ID
    value?: any            // 选择的值
  }
}
```

**示例**：
```javascript
// 关键词行动
socket.emit('player-action', {
  roomId: 'ABC123',
  actionType: 'keyword',
  data: { keyword: '水潭+龟' }
});

// 选择行动
socket.emit('player-action', {
  roomId: 'ABC123',
  actionType: 'choice',
  data: { 
    choiceId: 'hide-location',
    value: 'closet' 
  }
});
```

---

### 15. story-update（剧情更新）

**描述**：服务器推送新的剧情内容

**发送方**：服务器 → 客户端（房间内所有玩家）

**数据格式**：
```typescript
{
  roomId: string,
  storyText: string,     // 剧情文本
  effects: [             // 触发的效果
    {
      type: 'hp-change',
      target: 'cat',     // 目标角色
      value: -1,         // 变化值
      reason: '跳入水中受伤'
    },
    {
      type: 'item-gained',
      item: 'wooden-box',
      description: '获得木盒'
    }
  ],
  currentTurn: string,   // 当前回合玩家ID
  availableActions: [    // 可用的操作
    { type: 'keyword', prompt: '请输入关键词' },
    { type: 'wait', prompt: '等待其他玩家' }
  ]
}
```

---

### 16. hp-changed（生命值变化）

**描述**：通知玩家生命值变化

**发送方**：服务器 → 客户端（房间内所有玩家）

**数据格式**：
```typescript
{
  playerId: string,
  character: 'cat' | 'dog' | 'turtle',
  oldHp: number,
  newHp: number,
  reason: string         // 变化原因
}
```

---

### 17. player-death（玩家死亡）

**描述**：通知玩家角色死亡

**发送方**：服务器 → 客户端

**数据格式**：
```typescript
{
  playerId: string,
  character: string,
  canRevive: boolean,    // 是否可复活
  reviveCost: number     // 复活消耗生命值
}
```

---

### 18. revive-player（复活玩家）

**描述**：玩家选择复活队友

**发送方**：客户端 → 服务器

**数据格式**：
```typescript
{
  roomId: string,
  targetPlayerId: string  // 要复活的玩家ID
}
```

---

## 战斗相关事件

### 19. battle-start（战斗开始）

**描述**：进入BOSS战

**发送方**：服务器 → 客户端

**数据格式**：
```typescript
{
  roomId: string,
  bossId: 'rat-king' | 'parrot' | 'reaper',
  bossName: string,
  bossHp: number,
  battleType: 'solo' | 'team' | 'dice',
  rules: object          // 战斗规则
}
```

---

### 20. battle-action（战斗行动）

**描述**：玩家在战斗中的行动

**发送方**：客户端 → 服务器

**数据格式**：
```typescript
{
  roomId: string,
  actionType: string,    // 根据BOSS不同
  data: object           // 行动数据
}
```

**示例 - 鼠鼠大王战**：
```javascript
socket.emit('battle-action', {
  roomId: 'ABC123',
  actionType: 'select-hole',
  data: { holeNumber: 3 }  // 选择第3个洞
});
```

**示例 - 百变小鹦战**：
```javascript
socket.emit('battle-action', {
  roomId: 'ABC123',
  actionType: 'submit-answer',
  data: { answer: 'A' }
});
```

**示例 - 死神战**：
```javascript
socket.emit('battle-action', {
  roomId: 'ABC123',
  actionType: 'place-bet',
  data: { 
    amount: 50,
    choice: 'big'  // 大/小
  }
});
```

---

### 21. battle-result（战斗结果）

**描述**：一轮战斗的结果

**发送方**：服务器 → 客户端

**数据格式**：
```typescript
{
  roomId: string,
  roundResult: {
    success: boolean,
    bossHpChange: number,
    playerHpChanges: [
      { playerId: string, hpChange: number }
    ],
    message: string
  },
  bossHp: number,        // BOSS当前生命值
  continueGame: boolean  // 是否继续战斗
}
```

---

### 22. battle-end（战斗结束）

**描述**：BOSS战结束

**发送方**：服务器 → 客户端

**数据格式**：
```typescript
{
  roomId: string,
  victory: boolean,      // 是否胜利
  nextAct?: number,      // 下一幕（如果有）
  ending?: string        // 结局ID（如果游戏结束）
}
```

---

## 错误处理

### error（错误信息）

**描述**：所有错误都通过此事件返回

**发送方**：服务器 → 客户端（发送请求的玩家）

**数据格式**：
```typescript
{
  success: false,
  error: {
    code: string,        // 错误代码
    message: string,     // 用户可读的错误信息
    details?: object     // 可选的详细信息
  }
}
```

**错误代码列表**：

| 错误代码 | 说明 | 示例消息 |
|---------|------|---------|
| `INVALID_PLAYER_NAME` | 玩家名称无效 | "玩家名称长度必须在2-20之间" |
| `ROOM_NOT_FOUND` | 房间不存在 | "房间不存在或已解散" |
| `ROOM_FULL` | 房间已满 | "房间已满，最多3人" |
| `CHARACTER_TAKEN` | 角色已被选择 | "该角色已被其他玩家选择" |
| `NOT_HOST` | 不是房主 | "只有房主可以开始游戏" |
| `NOT_ALL_READY` | 未全部准备 | "还有玩家未准备" |
| `INVALID_ACTION` | 无效的操作 | "当前不是你的回合" |
| `GAME_NOT_STARTED` | 游戏未开始 | "游戏尚未开始" |

**示例**：
```javascript
socket.on('error', (errorData) => {
  console.error('错误:', errorData.error.message);
  // 显示错误提示给用户
  alert(errorData.error.message);
});
```

---

## 数据结构定义

### Room（房间对象）

```typescript
interface Room {
  roomId: string;          // 房间ID（6位大写字母数字）
  roomName: string;        // 房间名称
  host: string;            // 房主Socket ID
  players: Player[];       // 玩家列表（最多3个）
  gameState: GameState;    // 游戏状态
  currentAct: number;      // 当前幕数 1-4
  currentScene: number;    // 当前场景
  currentTurn: string;     // 当前回合玩家ID
  storyData: object;       // 当前剧情数据
  createdAt: number;       // 创建时间戳
}

type GameState = 
  | 'waiting'           // 等待玩家
  | 'character-select'  // 角色选择
  | 'playing'           // 游戏进行中
  | 'battle'            // 战斗中
  | 'ended';            // 游戏结束
```

### Player（玩家对象）

```typescript
interface Player {
  id: string;              // Socket ID
  name: string;            // 玩家昵称
  character: Character | null;  // 角色
  hp: number;              // 当前生命值
  maxHp: number;           // 最大生命值
  skills: Skill[];         // 技能列表
  items: Item[];           // 道具列表
  isReady: boolean;        // 是否准备
  isAlive: boolean;        // 是否存活
  isHost: boolean;         // 是否房主
}

type Character = 'cat' | 'dog' | 'turtle';
```

### Skill（技能对象）

```typescript
interface Skill {
  id: string;              // 技能ID
  name: string;            // 技能名称
  grade: SkillGrade;       // 技能等级
  description: string;     // 技能描述
  effect: string;          // 效果说明
  used: boolean;           // 是否已使用（一次性技能）
}

type SkillGrade = 'B' | 'A' | 'S' | 'SS' | 'SSS' | 'SSSS' | 'SSSSS';
```

### Item（道具对象）

```typescript
interface Item {
  id: string;              // 道具ID
  name: string;            // 道具名称
  grade: string;           // 道具等级
  description: string;     // 道具描述
  effect: string;          // 效果说明
  usable: boolean;         // 是否可使用
  used: boolean;           // 是否已使用
}
```

---

## 事件监听示例（完整）

### 客户端完整监听代码

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

// ========== 连接管理 ==========
socket.on('connect', () => {
  console.log('连接成功:', socket.id);
});

socket.on('disconnect', (reason) => {
  console.log('断开连接:', reason);
});

// ========== 房间事件 ==========
socket.on('room-created', (data) => {
  console.log('房间创建成功:', data.data.roomId);
});

socket.on('room-joined', (data) => {
  console.log('加入房间成功:', data.data.roomId);
});

socket.on('player-joined', (data) => {
  console.log('新玩家加入:', data.player.name);
});

socket.on('player-left', (data) => {
  console.log('玩家离开:', data.playerName);
});

// ========== 角色事件 ==========
socket.on('character-selected', (data) => {
  console.log('角色选择:', data.character);
});

socket.on('player-ready-changed', (data) => {
  console.log('准备状态变化:', data.isReady);
});

// ========== 游戏事件 ==========
socket.on('game-started', (data) => {
  console.log('游戏开始!');
});

socket.on('story-update', (data) => {
  console.log('剧情更新:', data.storyText);
});

socket.on('hp-changed', (data) => {
  console.log('生命值变化:', data);
});

// ========== 战斗事件 ==========
socket.on('battle-start', (data) => {
  console.log('战斗开始:', data.bossName);
});

socket.on('battle-result', (data) => {
  console.log('战斗结果:', data.roundResult);
});

socket.on('battle-end', (data) => {
  console.log('战斗结束:', data.victory ? '胜利' : '失败');
});

// ========== 错误处理 ==========
socket.on('error', (data) => {
  console.error('错误:', data.error.message);
});
```

---

## 最佳实践

### 1. 错误处理
所有emit操作都应该监听对应的成功事件和error事件：

```javascript
socket.emit('create-room', { playerName: 'Player1' });

socket.on('room-created', (data) => {
  // 成功处理
});

socket.on('error', (data) => {
  // 错误处理
});
```

### 2. 清理事件监听
组件卸载时清理监听器：

```javascript
useEffect(() => {
  socket.on('story-update', handleStoryUpdate);
  
  return () => {
    socket.off('story-update', handleStoryUpdate);
  };
}, []);
```

### 3. 房间ID保存
加入房间后保存房间ID，后续操作都需要：

```javascript
const [roomId, setRoomId] = useState(null);

socket.on('room-joined', (data) => {
  setRoomId(data.data.roomId);
});
```

---

## 调试技巧

### 查看所有事件
```javascript
socket.onAny((eventName, ...args) => {
  console.log(`事件: ${eventName}`, args);
});
```

### 手动触发事件（测试）
```javascript
// 在浏览器控制台
window.socket = socket;  // 暴露socket到全局

// 然后可以手动emit
socket.emit('create-room', { playerName: 'Test' });
```

---

**更新日期**：2024-XX-XX
**文档版本**：v1.0
