# 代码规范与风格指南

## 命名规范

### 文件命名

#### React组件文件
- **大驼峰命名**（PascalCase）
- 后缀：`.jsx`
```
✅ LobbyRoom.jsx
✅ CharacterSelector.jsx
✅ PlayerStatusBar.jsx

❌ lobbyroom.jsx
❌ character-selector.jsx
❌ playerStatusBar.js
```

#### 工具函数文件
- **小驼峰命名**（camelCase）
- 后缀：`.js`
```
✅ gameUtils.js
✅ socketHelpers.js
✅ validators.js

❌ GameUtils.js
❌ socket_helpers.js
```

#### 样式文件
- **小驼峰命名**
- 后缀：`.css`
```
✅ global.css
✅ gameBoard.css
```

#### 数据文件
- **小写+连字符**
- 后缀：`.json`
```
✅ act1-scene1.json
✅ boss-rat-king.json

❌ Act1Scene1.json
❌ boss_rat_king.json
```

### 变量命名

#### 常量
- **全大写+下划线**
```javascript
const MAX_PLAYERS = 3;
const DEFAULT_HP = 8;
const ROOM_ID_LENGTH = 6;
```

#### 普通变量
- **小驼峰命名**
- 见名知意
```javascript
✅ const playerName = 'Player1';
✅ const currentRoom = rooms.get(roomId);
✅ const isGameStarted = false;

❌ const pn = 'Player1';  // 太简略
❌ const player_name = 'Player1';  // 不用下划线
❌ const a = false;  // 无意义命名
```

#### 布尔值变量
- 使用 `is/has/can` 前缀
```javascript
const isAlive = true;
const hasKey = false;
const canJoinRoom = true;
```

#### 数组/列表
- 使用复数形式
```javascript
const players = [];
const rooms = new Map();
const skills = ['skill1', 'skill2'];
```

### 函数命名

#### 普通函数
- **小驼峰 + 动词开头**
```javascript
✅ function createRoom() { }
✅ function handlePlayerJoin() { }
✅ function calculateDamage() { }

❌ function room() { }  // 缺少动词
❌ function CreateRoom() { }  // 不用大驼峰
```

#### 事件处理函数
- 使用 `handle` 或 `on` 前缀
```javascript
function handleButtonClick() { }
function onPlayerDeath() { }
function handleRoomCreated() { }
```

#### 获取/设置函数
```javascript
function getPlayerById(id) { }
function setPlayerHP(playerId, hp) { }
function updateRoomState(roomId, state) { }
```

### React组件命名

- **大驼峰命名**
```javascript
function LobbyRoom() { }
function PlayerCard({ player }) { }
function BattleScene() { }
```

### Socket事件命名

- **小写 + 连字符**
```javascript
✅ socket.emit('create-room', data);
✅ socket.on('room-created', callback);
✅ socket.emit('player-join', data);

❌ socket.emit('createRoom', data);
❌ socket.on('room_created', callback);
```

## 注释规范

### 函数注释（JSDoc格式）

**必须注释**：所有导出函数、核心逻辑函数

```javascript
/**
 * 创建一个新的游戏房间
 * @param {string} playerName - 创建者的玩家名称
 * @param {string} [roomName] - 房间名称（可选）
 * @returns {object} 包含房间ID和房间信息的对象
 * @throws {Error} 当玩家名称无效时抛出错误
 */
function createRoom(playerName, roomName) {
  // 实现代码
}
```

### 行内注释

**复杂逻辑必须注释**：

```javascript
// ✅ 好的注释：解释"为什么"
// 检查房间是否已满（最多3人），如果满了拒绝加入
if (room.players.length >= MAX_PLAYERS) {
  return { error: '房间已满' };
}

// ❌ 不好的注释：只是重复代码
// 如果玩家数量大于等于3
if (room.players.length >= MAX_PLAYERS) {
  return { error: '房间已满' };
}
```

### 区块注释

**分隔不同功能模块**：

```javascript
// ==================== 房间管理函数 ====================

function createRoom() { }
function joinRoom() { }
function leaveRoom() { }

// ==================== 玩家管理函数 ====================

function addPlayer() { }
function removePlayer() { }
```

### TODO注释

**标记待完成功能**：

```javascript
// TODO: 添加房间密码功能
// FIXME: 修复断线重连的Bug
// NOTE: 这个函数性能可能需要优化
// HACK: 临时解决方案，后续需要重构
```

## 代码格式规范

### 缩进
- 使用 **2个空格**（不使用Tab）
- VS Code设置：`"editor.tabSize": 2`

### 分号
- **始终使用分号**
```javascript
✅ const name = 'test';
✅ function test() { return 1; }

❌ const name = 'test'
❌ function test() { return 1 }
```

### 引号
- 字符串使用 **单引号**
- JSX属性使用 **双引号**
```javascript
✅ const name = 'Player1';
✅ <div className="container">

❌ const name = "Player1";
❌ <div className='container'>
```

### 大括号
- **K&R风格**（大括号不换行）
```javascript
✅ 
if (condition) {
  doSomething();
} else {
  doOtherthing();
}

❌ 
if (condition) 
{
  doSomething();
}
```

### 空格使用
```javascript
// ✅ 运算符两侧有空格
const sum = a + b;

// ✅ 逗号后面有空格
function test(a, b, c) { }

// ✅ 冒号后面有空格
const obj = { name: 'test', age: 18 };

// ✅ 函数参数括号内不加空格
function test(a, b) { }  // 不是 ( a, b )

// ❌ 错误示例
const sum=a+b;
function test(a,b,c) { }
```

### 换行规则
```javascript
// ✅ 链式调用超过3个换行
players
  .filter(p => p.isAlive)
  .map(p => p.name)
  .join(', ');

// ✅ 对象属性过多换行
const player = {
  id: '123',
  name: 'Player1',
  character: 'cat',
  hp: 8,
  isAlive: true
};

// ✅ 函数参数过多换行
function createPlayer(
  id,
  name,
  character,
  hp,
  maxHp
) { }
```

## 项目结构约定

### 组件文件结构
```javascript
// 1. 导入依赖
import React, { useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';

// 2. 常量定义
const MAX_PLAYERS = 3;

// 3. 辅助函数（如果只在这个文件用）
function helper() { }

// 4. 主组件
function MyComponent() {
  // 4.1 Hooks
  const [state, setState] = useState();
  useEffect(() => { }, []);
  
  // 4.2 事件处理函数
  function handleClick() { }
  
  // 4.3 渲染逻辑
  return (
    <div>
      {/* JSX */}
    </div>
  );
}

// 5. 导出
export default MyComponent;
```

### 工具函数文件结构
```javascript
// 1. 导入依赖
import someLib from 'some-lib';

// 2. 常量定义
const CONSTANT = 'value';

// 3. 私有辅助函数
function _privateHelper() { }

// 4. 导出函数
export function publicFunction1() { }
export function publicFunction2() { }

// 5. 默认导出（可选）
export default {
  publicFunction1,
  publicFunction2
};
```

## Socket事件命名约定

### 客户端 → 服务器（动作）
```javascript
socket.emit('create-room', data);      // 创建房间
socket.emit('join-room', data);        // 加入房间
socket.emit('leave-room', data);       // 离开房间
socket.emit('select-character', data); // 选择角色
socket.emit('player-action', data);    // 玩家行动
socket.emit('submit-choice', data);    // 提交选择
```

### 服务器 → 客户端（状态/结果）
```javascript
socket.on('room-created', callback);   // 房间已创建
socket.on('room-joined', callback);    // 已加入房间
socket.on('player-joined', callback);  // 有玩家加入
socket.on('game-started', callback);   // 游戏开始
socket.on('story-update', callback);   // 剧情更新
socket.on('error', callback);          // 错误信息
```

### 广播事件（通知所有人）
```javascript
io.to(roomId).emit('player-list-updated', players);
io.to(roomId).emit('game-state-changed', newState);
```

## 错误处理规范

### 统一错误返回格式
```javascript
// ✅ 标准错误对象
{
  success: false,
  error: {
    code: 'ROOM_FULL',           // 错误代码（大写+下划线）
    message: '房间已满，无法加入',  // 用户可读信息
    details: { maxPlayers: 3 }   // 可选的详细信息
  }
}

// ✅ 标准成功对象
{
  success: true,
  data: { roomId: 'ABC123', ... }
}
```

### Try-Catch使用
```javascript
// ✅ 异步函数必须捕获错误
async function createRoom(playerName) {
  try {
    // 业务逻辑
    return { success: true, data: room };
  } catch (error) {
    console.error('创建房间失败:', error);
    return { 
      success: false, 
      error: { 
        code: 'CREATE_ROOM_FAILED', 
        message: '创建房间失败' 
      } 
    };
  }
}
```

### 参数验证
```javascript
function joinRoom(roomId, playerName) {
  // ✅ 前置验证
  if (!roomId || typeof roomId !== 'string') {
    return { 
      success: false, 
      error: { code: 'INVALID_ROOM_ID', message: '无效的房间ID' } 
    };
  }
  
  if (!playerName || playerName.trim() === '') {
    return { 
      success: false, 
      error: { code: 'INVALID_NAME', message: '玩家名称不能为空' } 
    };
  }
  
  // 业务逻辑
}
```

## React最佳实践

### 组件设计原则
```javascript
// ✅ 单一职责：一个组件只做一件事
function PlayerCard({ player }) { }      // 只负责显示玩家卡片
function PlayerList({ players }) { }     // 只负责显示玩家列表

// ❌ 职责混乱
function GamePage() { 
  // 包含了房间管理、角色选择、战斗系统... 太复杂
}
```

### Props命名
```javascript
// ✅ 清晰的Props命名
function Button({ onClick, isDisabled, children }) { }

// ✅ 事件处理函数以on开头
function PlayerCard({ player, onSelect, onRemove }) { }

// ❌ 含糊的命名
function Button({ handler, flag, content }) { }
```

### 条件渲染
```javascript
// ✅ 使用三元运算符（简单情况）
{isLoading ? <Spinner /> : <Content />}

// ✅ 使用 && 运算符（单一条件）
{error && <ErrorMessage error={error} />}

// ✅ 使用早期返回（复杂情况）
if (isLoading) return <Spinner />;
if (error) return <ErrorMessage />;
return <Content />;
```

### Hooks规则
```javascript
// ✅ Hooks必须在顶层调用
function Component() {
  const [state, setState] = useState();
  useEffect(() => { }, []);
  // ...
}

// ❌ 不能在条件语句中调用
function Component() {
  if (condition) {
    const [state, setState] = useState(); // 错误！
  }
}
```

## Git提交规范

### 提交信息格式
```
<类型>: <简短描述>

<详细描述>（可选）
```

### 类型标签
- `feat`: 新功能
- `fix`: Bug修复
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构（不是新功能也不是Bug修复）
- `test`: 测试相关
- `chore`: 构建工具、依赖更新

### 示例
```bash
✅ feat: 添加房间创建功能
✅ fix: 修复房间ID重复的Bug
✅ docs: 更新README部署说明
✅ style: 格式化LobbyRoom.jsx代码
✅ refactor: 重构GameMaster.js的剧情解析逻辑

❌ 更新了一些代码
❌ fix bug
❌ 完成今天的开发任务
```

## 性能优化规范

### React性能优化
```javascript
// ✅ 使用React.memo避免不必要的重渲染
const PlayerCard = React.memo(function PlayerCard({ player }) {
  return <div>{player.name}</div>;
});

// ✅ useCallback缓存函数
const handleClick = useCallback(() => {
  // 处理逻辑
}, [dependencies]);

// ✅ useMemo缓存计算结果
const sortedPlayers = useMemo(() => {
  return players.sort((a, b) => b.hp - a.hp);
}, [players]);
```

### 避免性能陷阱
```javascript
// ❌ 避免在渲染中创建新对象/函数
function Component() {
  return (
    <Child 
      style={{ color: 'red' }}  // 每次都是新对象
      onClick={() => {}}        // 每次都是新函数
    />
  );
}

// ✅ 提取到外部
const STYLE = { color: 'red' };
function Component() {
  const handleClick = useCallback(() => {}, []);
  return <Child style={STYLE} onClick={handleClick} />;
}
```

## 安全规范

### 输入验证
```javascript
// ✅ 所有用户输入必须验证
function validatePlayerName(name) {
  if (typeof name !== 'string') return false;
  if (name.length < 2 || name.length > 20) return false;
  if (!/^[a-zA-Z0-9_]+$/.test(name)) return false;
  return true;
}
```

### 防止XSS
```javascript
// ✅ React自动转义，但注意dangerouslySetInnerHTML
<div>{userInput}</div>  // 安全

// ❌ 危险用法
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

## 测试规范（可选）

### 测试文件命名
```
Component.jsx      → Component.test.jsx
utils.js           → utils.test.js
```

### 测试用例命名
```javascript
describe('RoomManager', () => {
  it('should create a room with valid player name', () => {
    // 测试代码
  });
  
  it('should reject room creation with empty name', () => {
    // 测试代码
  });
});
```

## 代码审查清单

提交代码前自查：

- [ ] 所有函数都有注释
- [ ] 变量命名见名知意
- [ ] 没有console.log（调试用）
- [ ] 错误处理完善
- [ ] 代码格式统一（运行Prettier）
- [ ] 无ESLint警告
- [ ] Git提交信息清晰

## 工具配置

### .prettierrc（代码格式化）
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

### .eslintrc.json（代码检查）
```json
{
  "extends": ["react-app"],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "warn"
  }
}
```

## 总结

核心原则：
1. **一致性**：全项目统一风格
2. **可读性**：代码像在讲故事
3. **可维护性**：6个月后自己能看懂
4. **团队友好**：新人能快速上手

遇到规范冲突时：**项目规范 > 个人习惯**
