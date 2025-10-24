# 项目文件结构

## 完整目录树

```
three-brothers-adventure/
│
├── 📂 client/                          # 前端代码
│   ├── public/
│   │   ├── index.html                  # HTML模板
│   │   └── assets/                     # 静态资源
│   │       ├── images/                 # 图片资源
│   │       │   ├── characters/         # 角色立绘
│   │       │   │   ├── cat.png
│   │       │   │   ├── dog.png
│   │       │   │   └── turtle.png
│   │       │   └── backgrounds/        # 背景图
│   │       └── sounds/                 # 音效（可选）
│   │
│   ├── src/
│   │   ├── 🚀 App.jsx                  # 根组件（路由管理）
│   │   ├── main.jsx                    # 应用入口
│   │   │
│   │   ├── pages/                      # 页面组件
│   │   │   ├── HomePage.jsx            # 首页（进入游戏/规则说明）
│   │   │   ├── LobbyPage.jsx           # 房间大厅（创建/加入房间）
│   │   │   └── GamePage.jsx            # 游戏主界面（剧情/战斗）
│   │   │
│   │   ├── components/                 # 可复用组件
│   │   │   │
│   │   │   ├── room/                   # 房间相关组件
│   │   │   │   ├── RoomCreator.jsx     # 创建房间表单
│   │   │   │   ├── RoomJoiner.jsx      # 加入房间表单
│   │   │   │   ├── RoomInfo.jsx        # 房间信息展示（房间号、玩家列表）
│   │   │   │   └── WaitingRoom.jsx     # 等待室（等待其他玩家）
│   │   │   │
│   │   │   ├── character/              # 角色相关组件
│   │   │   │   ├── CharacterSelector.jsx  # 角色选择界面
│   │   │   │   ├── CharacterCard.jsx      # 单个角色卡片
│   │   │   │   └── CharacterInfo.jsx      # 角色详细信息
│   │   │   │
│   │   │   ├── game/                   # 游戏进行中的组件
│   │   │   │   ├── StoryDisplay.jsx       # 剧情文本展示
│   │   │   │   ├── ActionPanel.jsx        # 操作面板（输入关键词/选择按钮）
│   │   │   │   ├── PlayerStatusBar.jsx    # 玩家状态栏（生命值、角色）
│   │   │   │   ├── InventoryPanel.jsx     # 背包面板（技能、道具）
│   │   │   │   └── ChatBox.jsx            # 聊天框（可选）
│   │   │   │
│   │   │   ├── battle/                 # 战斗相关组件
│   │   │   │   ├── BattleScene.jsx        # 战斗主界面
│   │   │   │   ├── BossCard.jsx           # BOSS信息卡片
│   │   │   │   ├── RatKingBattle.jsx      # 鼠鼠大王战斗界面
│   │   │   │   ├── ParrotBattle.jsx       # 百变小鹦战斗界面
│   │   │   │   └── ReaperBattle.jsx       # 死神战斗界面
│   │   │   │
│   │   │   └── common/                 # 通用组件
│   │   │       ├── Button.jsx             # 按钮组件
│   │   │       ├── Modal.jsx              # 弹窗组件
│   │   │       ├── Loading.jsx            # 加载动画
│   │   │       ├── ErrorMessage.jsx       # 错误提示
│   │   │       └── Notification.jsx       # 通知组件
│   │   │
│   │   ├── hooks/                      # 自定义Hooks
│   │   │   ├── useSocket.js            # Socket连接管理
│   │   │   ├── useGameState.js         # 游戏状态管理
│   │   │   ├── usePlayer.js            # 玩家信息管理
│   │   │   ├── useRoom.js              # 房间信息管理
│   │   │   └── useNotification.js      # 通知管理
│   │   │
│   │   ├── store/                      # 状态管理（Zustand）
│   │   │   ├── gameStore.js            # 游戏全局状态
│   │   │   ├── roomStore.js            # 房间状态
│   │   │   └── playerStore.js          # 玩家状态
│   │   │
│   │   ├── utils/                      # 工具函数
│   │   │   ├── constants.js            # 常量定义
│   │   │   ├── helpers.js              # 辅助函数
│   │   │   ├── validators.js           # 数据验证函数
│   │   │   └── formatters.js           # 格式化函数
│   │   │
│   │   └── styles/                     # 样式文件
│   │       ├── global.css              # 全局样式
│   │       └── tailwind.css            # Tailwind入口
│   │
│   ├── package.json                    # 依赖配置
│   ├── vite.config.js                  # Vite配置
│   ├── tailwind.config.js              # Tailwind配置
│   ├── postcss.config.js               # PostCSS配置
│   └── .env.example                    # 环境变量示例
│
├── 📂 server/                          # 后端代码
│   ├── 🚀 index.js                     # 服务器入口（Express + Socket.io）
│   │
│   ├── socket/                         # Socket事件处理器
│   │   ├── connectionHandler.js        # 连接管理（连接/断开）
│   │   ├── roomHandler.js              # 房间事件（创建/加入/离开）
│   │   ├── characterHandler.js         # 角色选择事件
│   │   ├── gameHandler.js              # 游戏逻辑事件（行动/选择）
│   │   └── chatHandler.js              # 聊天事件（可选）
│   │
│   ├── game-engine/                    # 游戏引擎核心
│   │   ├── 🎮 GameMaster.js            # AI主持人核心（剧情推进）
│   │   ├── RoomManager.js              # 房间管理器（CRUD、状态）
│   │   ├── PlayerManager.js            # 玩家管理器
│   │   ├── StoryEngine.js              # 剧情引擎（解析JSON、推进剧情）
│   │   ├── KeywordParser.js            # 关键词解析器
│   │   ├── EffectResolver.js           # 效果解析器（生命值变化、获得道具）
│   │   ├── BattleSystem.js             # 战斗系统核心
│   │   │   ├── RatKingBattle.js        # 鼠鼠大王战斗逻辑
│   │   │   ├── ParrotBattle.js         # 百变小鹦战斗逻辑
│   │   │   └── ReaperBattle.js         # 死神战斗逻辑
│   │   └── SkillSystem.js              # 技能系统
│   │
│   ├── data/                           # 游戏数据（JSON）
│   │   │
│   │   ├── act1/                       # 第一幕数据
│   │   │   ├── scene1-密室.json
│   │   │   └── scene2-藏匿.json
│   │   │
│   │   ├── act2/                       # 第二幕数据
│   │   │   └── memories.json           # 记忆回溯
│   │   │
│   │   ├── act3/                       # 第三幕数据（个人线）
│   │   │   ├── cat/                    # 猫线
│   │   │   │   ├── route1-kungfu.json
│   │   │   │   ├── route2-business.json
│   │   │   │   └── route3-robot.json
│   │   │   ├── dog/                    # 狗线
│   │   │   │   ├── route1-immortal.json
│   │   │   │   └── route2-transformer.json
│   │   │   └── turtle/                 # 龟线
│   │   │       ├── route1-ninja.json
│   │   │       ├── route2-cannon.json
│   │   │       └── route3-son-in-law.json
│   │   │
│   │   ├── act4/                       # 第四幕数据（BOSS战）
│   │   │   ├── boss1-rat-king.json
│   │   │   ├── boss2-parrot.json
│   │   │   └── boss3-reaper.json
│   │   │
│   │   ├── skills/                     # 技能数据
│   │   │   └── all-skills.json
│   │   │
│   │   └── items/                      # 道具数据
│   │       └── all-items.json
│   │
│   ├── utils/                          # 工具函数
│   │   ├── logger.js                   # 日志工具
│   │   ├── validator.js                # 数据验证
│   │   ├── idGenerator.js              # ID生成器
│   │   └── errorHandler.js             # 错误处理
│   │
│   ├── config/                         # 配置文件
│   │   └── constants.js                # 常量配置
│   │
│   ├── package.json                    # 依赖配置
│   └── .env.example                    # 环境变量示例
│
├── 📂 shared/                          # 前后端共享代码
│   ├── constants.js                    # 共享常量
│   ├── types.js                        # 数据结构定义
│   └── eventNames.js                   # Socket事件名称
│
├── 📂 docs/                            # 项目文档
│   ├── GAME_DESIGN.md                  # 游戏设计文档
│   ├── TECH_STACK.md                   # 技术栈文档
│   ├── CODE_STANDARDS.md               # 代码规范
│   ├── FOLDER_STRUCTURE.md             # 本文件
│   ├── DEVELOPMENT_LOG.md              # 开发日志
│   ├── API_REFERENCE.md                # API接口文档
│   ├── DATA_FORMAT.md                  # 数据格式规范
│   └── DEPLOYMENT.md                   # 部署文档
│
├── 📂 scripts/                         # 脚本工具
│   ├── data-converter.js               # Word转JSON工具
│   └── seed-data.js                    # 测试数据生成
│
├── .gitignore                          # Git忽略文件
├── README.md                           # 项目说明
├── railway.json                        # Railway配置
└── package.json                        # 根package.json（可选）
```

## 核心文件详细说明

### 前端关键文件

| 文件路径 | 职责 | 状态 | 优先级 |
|---------|------|------|--------|
| `client/src/App.jsx` | 路由管理、全局状态初始化 | ⏳ 待开发 | ⭐⭐⭐ |
| `client/src/hooks/useSocket.js` | WebSocket连接封装、事件监听 | ⏳ 待开发 | ⭐⭐⭐ |
| `client/src/store/gameStore.js` | 游戏状态管理（当前幕、场景、玩家） | ⏳ 待开发 | ⭐⭐⭐ |
| `client/src/pages/LobbyPage.jsx` | 房间大厅（创建/加入房间） | ⏳ 待开发 | ⭐⭐⭐ |
| `client/src/pages/GamePage.jsx` | 游戏主界面（剧情+战斗） | ⏳ 待开发 | ⭐⭐ |
| `client/src/components/character/CharacterSelector.jsx` | 角色选择界面 | ⏳ 待开发 | ⭐⭐ |
| `client/src/components/game/StoryDisplay.jsx` | 剧情文本展示 | ⏳ 待开发 | ⭐⭐ |
| `client/src/components/battle/BattleScene.jsx` | 战斗界面 | ⏳ 待开发 | ⭐ |

### 后端关键文件

| 文件路径 | 职责 | 状态 | 优先级 |
|---------|------|------|--------|
| `server/index.js` | Express服务器 + Socket.io初始化 | ⏳ 待开发 | ⭐⭐⭐ |
| `server/game-engine/GameMaster.js` | AI主持人核心逻辑 | ⏳ 待开发 | ⭐⭐⭐ |
| `server/game-engine/RoomManager.js` | 房间CRUD、玩家管理 | ⏳ 待开发 | ⭐⭐⭐ |
| `server/game-engine/StoryEngine.js` | 剧情解析、推进逻辑 | ⏳ 待开发 | ⭐⭐ |
| `server/game-engine/KeywordParser.js` | 关键词解析（道具+道具） | ⏳ 待开发 | ⭐⭐ |
| `server/game-engine/EffectResolver.js` | 效果执行（生命值、道具） | ⏳ 待开发 | ⭐⭐ |
| `server/game-engine/BattleSystem.js` | 战斗系统核心 | ⏳ 待开发 | ⭐ |
| `server/socket/roomHandler.js` | 房间事件处理 | ⏳ 待开发 | ⭐⭐⭐ |

### 数据文件

| 文件路径 | 内容 | 状态 | 优先级 |
|---------|------|------|--------|
| `server/data/act1/scene1-密室.json` | 第一关剧情、道具、效果 | ⏳ 待创建 | ⭐⭐⭐ |
| `server/data/act1/scene2-藏匿.json` | 第二关藏匿规则 | ⏳ 待创建 | ⭐⭐ |
| `server/data/act3/cat/route1-kungfu.json` | 猫线-功夫路线 | ⏳ 待创建 | ⭐ |
| `server/data/act4/boss1-rat-king.json` | 鼠鼠大王战斗数据 | ⏳ 待创建 | ⭐ |

## 文件状态标记

- ✅ **已完成**：功能完整且已测试通过
- ⏳ **开发中**：部分功能实现，还在迭代
- 📝 **待开发**：尚未开始，已规划
- 🐛 **有Bug**：功能有问题，需要修复
- 🔄 **重构中**：功能可用但代码质量待优化
- ⚠️ **待确认**：设计方案未定，需要讨论

## 文件依赖关系

### 前端依赖链

```
App.jsx
  └── pages/
      ├── LobbyPage.jsx
      │   ├── components/room/RoomCreator.jsx
      │   ├── components/room/RoomJoiner.jsx
      │   └── hooks/useSocket.js
      │
      └── GamePage.jsx
          ├── components/game/StoryDisplay.jsx
          ├── components/game/ActionPanel.jsx
          ├── components/battle/BattleScene.jsx
          └── hooks/useGameState.js
```

### 后端依赖链

```
index.js
  ├── socket/roomHandler.js
  │   └── game-engine/RoomManager.js
  │
  ├── socket/gameHandler.js
  │   ├── game-engine/GameMaster.js
  │   │   ├── game-engine/StoryEngine.js
  │   │   │   └── data/act1/scene1-密室.json
  │   │   └── game-engine/EffectResolver.js
  │   │
  │   └── game-engine/BattleSystem.js
  │       └── data/act4/boss1-rat-king.json
  │
  └── socket/characterHandler.js
```

## 开发顺序建议

### 第一阶段：基础框架（Week 1）

**Day 1-2：环境搭建**
- [ ] 创建客户端项目（Vite + React）
- [ ] 创建服务器项目（Express + Socket.io）
- [ ] 前后端连接测试

**Day 3-4：房间系统**
- [ ] `server/game-engine/RoomManager.js`
- [ ] `server/socket/roomHandler.js`
- [ ] `client/src/pages/LobbyPage.jsx`
- [ ] `client/src/hooks/useSocket.js`

**Day 5：角色选择**
- [ ] `server/socket/characterHandler.js`
- [ ] `client/src/components/character/CharacterSelector.jsx`

### 第二阶段：游戏逻辑（Week 2）

**Day 6-8：第一幕（密室）**
- [ ] `server/data/act1/scene1-密室.json`
- [ ] `server/game-engine/StoryEngine.js`
- [ ] `server/game-engine/KeywordParser.js`
- [ ] `client/src/components/game/StoryDisplay.jsx`

**Day 9-10：战斗系统（简化版）**
- [ ] `server/data/act4/boss1-rat-king.json`
- [ ] `server/game-engine/BattleSystem.js`
- [ ] `client/src/components/battle/BattleScene.jsx`

**Day 11-12：测试与修复**
- [ ] 3人联机测试
- [ ] Bug修复

**Day 13-14：部署上线**
- [ ] Railway配置
- [ ] 文档完善

## 文件大小预估

| 文件 | 预估行数 | 复杂度 |
|------|---------|--------|
| `server/index.js` | 50-100 | 简单 |
| `server/game-engine/RoomManager.js` | 150-250 | 中等 |
| `server/game-engine/GameMaster.js` | 300-500 | 复杂 |
| `server/game-engine/StoryEngine.js` | 200-400 | 复杂 |
| `client/src/pages/GamePage.jsx` | 200-300 | 中等 |
| `client/src/hooks/useSocket.js` | 100-150 | 中等 |

## 命名规范快速参考

```
文件夹         → 小写+连字符   game-engine/
React组件     → 大驼峰        LobbyPage.jsx
JS工具文件    → 小驼峰        gameUtils.js
JSON数据文件  → 小写+连字符   scene1-密室.json
常量文件      → 小驼峰        constants.js
```

## Git忽略文件（.gitignore）

```
# 依赖
node_modules/
.pnp/
.pnp.js

# 测试
coverage/

# 生产构建
build/
dist/

# 环境变量
.env
.env.local
.env.production.local

# 日志
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# 编辑器
.vscode/
.idea/
*.swp
*.swo

# 操作系统
.DS_Store
Thumbs.db

# Railway
.railway/
```

## 文件更新规则

### 何时更新此文档？

1. **新增文件/文件夹**时
2. **重构导致路径变化**时
3. **文件职责发生变化**时
4. **完成某个文件开发**时（更新状态）

### 更新格式

```markdown
## 更新日志

### 2024-XX-XX
- ✅ 完成 `server/index.js`（服务器入口）
- 🔄 重构 `client/src/hooks/useSocket.js`（拆分为多个Hook）
- 📝 新增 `server/game-engine/SkillSystem.js`（技能系统）
- 🐛 修复 `client/src/pages/GamePage.jsx`（状态同步Bug）
```

## 快速定位文件

### 我想实现XXX功能，应该修改哪个文件？

| 功能需求 | 文件路径 |
|---------|---------|
| 创建房间 | `server/game-engine/RoomManager.js` |
| 加入房间 | `server/socket/roomHandler.js` + `client/src/pages/LobbyPage.jsx` |
| 选择角色 | `server/socket/characterHandler.js` + `client/src/components/character/CharacterSelector.jsx` |
| 显示剧情 | `client/src/components/game/StoryDisplay.jsx` |
| 解析关键词 | `server/game-engine/KeywordParser.js` |
| 战斗逻辑 | `server/game-engine/BattleSystem.js` |
| 修改游戏数据 | `server/data/` 目录下的JSON文件 |

## 总结

这个文件结构的设计原则：
1. **职责清晰**：每个文件只做一件事
2. **模块化**：组件/功能独立，便于复用
3. **扁平化**：避免嵌套过深（最多3层）
4. **可扩展**：新增功能不影响现有结构

下一步行动：
- 在实际开发中严格遵循这个结构
- 发现问题及时更新文档
- 保持文件状态标记的准确性
