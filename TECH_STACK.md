# 技术栈与架构决策

## 项目定位

- **开发者**：零基础新手
- **开发周期**：1-2周快速上线
- **部署目标**：Railway（GitHub自动部署）
- **维护难度**：尽可能简化，便于后续迭代

## 最终技术选型

### 前端技术栈

#### 核心框架
- **React 18.2+**
  - 理由：生态成熟，学习资源丰富，适合新手
  - 使用函数式组件 + Hooks
  - 避免使用Class组件

#### 构建工具
- **Vite 5.0+**
  - 理由：启动快（相比Create React App快10倍+）
  - 配置简单
  - 热更新体验好
  - 不使用CRA（Create React App已过时）

#### 样式方案
- **Tailwind CSS 3.0+**
  - 理由：快速开发，无需写CSS文件
  - 响应式设计简单
  - 文件体积小（按需加载）
  - 配合DaisyUI组件库（可选）

#### 状态管理
- **Zustand 4.5+**
  - 理由：比Redux简单10倍
  - API直观，学习曲线平缓
  - 体积小（3KB）
  - 不使用Redux（过于复杂）
  - 不使用Context API（性能问题）

#### 实时通信
- **Socket.io-client 4.7+**
  - 理由：自动重连、心跳检测
  - 兼容性好（自动降级到轮询）
  - API友好

### 后端技术栈

#### 运行环境
- **Node.js 20.x LTS**
  - 理由：Railway原生支持，稳定版本
  - ES6+特性支持完善

#### Web框架
- **Express 4.18+**
  - 理由：简单易学，中间件生态丰富
  - 轻量级（相比Nest.js/Koa）
  - 文档完善

#### 实时通信
- **Socket.io 4.7+**
  - 理由：与前端配套
  - 房间（Room）管理简单
  - 事件广播机制完善

#### 数据存储方案

**第一版（简化版，1-2周上线）**：
- **内存存储**（变量/Map/Array）
  - 优点：开发快速，无需配置数据库
  - 缺点：服务器重启数据丢失
  - 适用场景：快速验证玩法

**完整版（后续迭代）**：
- **PostgreSQL**（Railway原生支持）
  - 理由：关系型数据库，Railway免费额度
  - ORM：Prisma（类型安全，易用）
  - 不使用MongoDB（Railway支持较弱）

### 开发工具

#### 代码编辑器
- **VS Code**
  - 必装插件：
    - ESLint（代码检查）
    - Prettier（代码格式化）
    - ES7+ React Snippets（快捷代码片段）
    - Tailwind CSS IntelliSense（样式提示）

#### 版本控制
- **Git + GitHub**
  - 理由：Railway自动部署依赖GitHub
  - 分支策略：简单的main分支即可

#### API测试
- **Postman** 或 **Thunder Client**（VS Code插件）
  - 用于测试Socket.io事件

### 部署方案

#### 托管平台
- **Railway**
  - 前端：Static Site部署
  - 后端：Node.js Service部署
  - 数据库：PostgreSQL（可选）
  - 免费额度：$5/月（够用）

#### CI/CD
- **GitHub Actions**（可选）
  - 自动化测试
  - 自动化部署
  - 第一版可不配置

## 技术约束与规范

### 代码风格
- **JavaScript**（不使用TypeScript）
  - 理由：降低学习成本
  - 后期可迁移到TS

### 模块化
- **ES6 Modules**（import/export）
  - 不使用CommonJS（require）

### 异步处理
- **async/await**
  - 避免回调地狱
  - 统一错误处理

### 注释规范
- **中文注释**（便于新手理解）
- **JSDoc格式**（便于工具提示）

## 依赖包清单

### 前端 package.json

```json
{
  "name": "three-brothers-client",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "socket.io-client": "^4.7.0",
    "zustand": "^4.5.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

### 后端 package.json

```json
{
  "name": "three-brothers-server",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js"
  },
  "dependencies": {
    "express": "^4.18.0",
    "socket.io": "^4.7.0",
    "cors": "^2.8.5",
    "uuid": "^9.0.0",
    "dotenv": "^16.4.0"
  },
  "devDependencies": {}
}
```

## 明确不使用的技术

### 前端
- ❌ **TypeScript**：增加学习成本
- ❌ **Redux**：过于复杂，Zustand足够
- ❌ **Next.js**：不需要SSR
- ❌ **Vue/Angular**：已选择React
- ❌ **Material-UI/Ant Design**：过重，用Tailwind
- ❌ **styled-components**：Tailwind更直观

### 后端
- ❌ **Nest.js**：过于重型
- ❌ **Koa**：生态不如Express
- ❌ **MongoDB**：Railway支持不佳
- ❌ **GraphQL**：不需要复杂查询
- ❌ **微服务架构**：单体应用足够

### 工具
- ❌ **Docker**：Railway自动化容器
- ❌ **Kubernetes**：过度工程化
- ❌ **Webpack**：Vite更快

## 性能优化策略

### 前端优化
1. **代码分割**：React.lazy + Suspense
2. **图片优化**：WebP格式，懒加载
3. **缓存策略**：localStorage保存游戏状态

### 后端优化
1. **房间清理**：定时清理空房间
2. **连接池**：控制最大连接数
3. **数据压缩**：Socket.io自动压缩

## 开发环境要求

### 本地开发
- Node.js 20+
- npm 10+
- Git 2.40+
- VS Code 1.85+

### 浏览器支持
- Chrome 100+
- Firefox 100+
- Safari 15+
- Edge 100+
- 移动端：iOS Safari 15+，Chrome Android 100+

## 安全考虑

### 第一版（基础安全）
- CORS配置
- Socket.io命名空间隔离
- 基础输入验证

### 完整版（后续）
- JWT认证
- 密码加密（bcrypt）
- 防刷机制（Rate Limiting）
- XSS防护

## 可扩展性设计

### 游戏引擎解耦
- 游戏逻辑与通信层分离
- 数据驱动设计（JSON配置）
- 便于后续添加新剧情

### 多实例支持（后期）
- Redis做Session共享
- 负载均衡

## 开发流程

### 分支策略
```
main（生产环境）
  ↑
develop（开发环境）
  ↑
feature/xxx（功能分支）
```

### 版本管理
- v1.0.0：核心功能（1-2周目标）
- v1.1.0：优化体验
- v2.0.0：新剧情/功能

## 成本估算

### 开发成本
- 开发时间：80-120小时
- 人力成本：1人

### 运营成本
- Railway免费额度：$5/月
- 域名（可选）：$10/年
- **总计**：几乎免费

## 技术债务管理

### 允许的技术债
- 第一版使用内存存储
- 第一版无用户认证
- 简化的错误处理

### 必须避免的
- 硬编码配置
- 全局变量滥用
- 无注释代码

## 学习资源推荐

### React学习
- React官方文档（中文）
- Bilibili：Codevolution React教程

### Socket.io学习
- Socket.io官方文档
- YouTube：Traversy Media实时聊天教程

### Tailwind CSS
- Tailwind Play（在线实验）
- Tailwind Components（组件库）

## 技术决策记录模板

```markdown
## 决策：[标题]
**日期**：2024-XX-XX
**状态**：已采纳 / 待讨论 / 已废弃

### 背景
[为什么需要做决策]

### 选项
1. 方案A：[描述] - 优点/缺点
2. 方案B：[描述] - 优点/缺点

### 决策
选择方案X，理由：[...]

### 影响
- 开发效率：[...]
- 性能：[...]
- 维护性：[...]
```

## 总结

这套技术栈的设计原则：
1. **简单优先**：降低学习曲线
2. **生态成熟**：避免踩坑
3. **快速迭代**：先跑通再优化
4. **成本可控**：几乎零成本运营

遇到技术问题时的决策顺序：
1. 是否能用现有技术解决？
2. 是否有成熟的开源方案？
3. 是否真的需要引入新技术？
