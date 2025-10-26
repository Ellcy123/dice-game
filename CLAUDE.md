# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**三兄弟的冒险2** (Three Brothers Adventure 2) - A 3-player online cooperative text adventure RPG game where players control three animal characters (Cat, Dog, Turtle) through a story-driven adventure with keyword-based interactions and boss battles.

## Development Commands

### Start the Server
```bash
npm start
# or
node server.js
```
Server runs on port 3000 by default (or PORT from environment variable)

### Development Mode (with auto-reload)
```bash
node --watch server.js  # Node.js 18+ required
```

### Access the Game
- **Login**: http://localhost:3000/login.html
- **Game**: http://localhost:3000/index.html (after login)

### Testing Socket.io Events
Use Postman or Thunder Client VS Code extension to test Socket.io events. See API_REFERENCE.md for event specifications.

## Architecture

### Tech Stack
- **Backend**: Node.js 18.x + Express 4.18+ + Socket.io 4.6+
- **Frontend**: Vanilla JavaScript (no framework) with Socket.io-client
- **Data Storage**: In-memory (Map/Array) + JSON files
- **Deployment Target**: Railway

### File Structure

```
dice-game/
├── server.js              # Main server (Express + Socket.io setup)
├── public/                # Static frontend files
│   ├── index.html         # Main game interface
│   ├── login.html         # Login/registration page
│   └── game.js            # Client-side game logic
└── data/                  # Game data (JSON)
    └── act1/
        └── scene1-room.json  # Scene data for Act 1
```

### Key Architecture Decisions

1. **Monolithic Structure**: Single server.js file handles all Socket.io events (no separate handlers yet)
2. **In-Memory Storage**: All game state stored in JavaScript objects:
   - `rooms` - Active game rooms
   - `users` - User accounts (username/password)
   - `sessions` - Token-based authentication (24hr expiry)
3. **Event-Driven**: Game logic triggered by Socket.io events, not REST endpoints
4. **No Database**: First version uses memory storage (data lost on restart)

### Core Data Structures

#### Room Object
```javascript
{
  roomId: string,           // 6-character unique ID
  roomName: string,
  host: socketId,
  players: [                // Max 3 players
    {
      id: socketId,
      name: string,
      character: 'cat'|'dog'|'turtle'|null,
      hp: number,
      maxHp: number,
      inventory: [],
      skills: [],
      isReady: boolean
    }
  ],
  gameState: 'waiting'|'character-selection'|'playing'|'finished',
  currentAct: number,
  currentScene: number,
  sceneData: object         // Loaded from JSON
}
```

#### User Object
```javascript
{
  username: {
    password: string,       // Plain text (TODO: hash in production)
    currentRoomId: string,
    currentPlayerId: string,
    lastActive: timestamp
  }
}
```

### Socket.io Event Flow

**Room Creation/Join**:
1. Client → `create-room` / `join-room`
2. Server validates & creates/joins room
3. Server → `room-created` / `room-joined` (to sender)
4. Server → `player-joined` (broadcast to room)

**Character Selection**:
1. Client → `select-character` (cat/dog/turtle)
2. Server validates uniqueness & updates
3. Server → `character-selected` (broadcast to room)

**Gameplay**:
1. Client → `player-action` (keyword/choice)
2. Server parses keyword, loads scene data
3. Server applies effects (HP changes, items, etc.)
4. Server → `story-update` (broadcast to room)

### Data Loading Pattern

Game scenes are loaded from JSON files on-demand:
```javascript
const sceneData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'data/act1/scene1-room.json'), 'utf8')
);
```

**Important**: Scene data structure defined in DATA_FORMAT.md

### Authentication Flow

1. Client sends username/password to `/register` or `/login` (HTTP POST)
2. Server validates & generates token
3. Server stores session in `sessions` object
4. Client stores token in localStorage
5. Client includes token in Socket.io connection handshake
6. Server verifies token on connection/events

**Token Expiry**: 24 hours

## Code Standards

### Language & Style
- **JavaScript ES6+** (not TypeScript - to reduce learning curve)
- **ES6 Modules** for future refactoring (currently using CommonJS in server.js)
- **中文注释** (Chinese comments for easier understanding)
- **async/await** for asynchronous operations

### Naming Conventions
- **Files**:
  - React components: `PascalCase.jsx` (future)
  - Utils: `camelCase.js`
  - Data files: `lowercase-with-hyphens.json`
- **Variables**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Functions**: `camelCase` with verb prefix (e.g., `createRoom`, `handlePlayerJoin`)
- **Booleans**: `is/has/can` prefix (e.g., `isReady`, `hasKey`)

See CODE_STANDARDS.md for complete style guide.

## Important Constraints

### Game Rules
- **Exactly 3 players** per room (no more, no less)
- **Unique characters**: Each player must choose different character (cat/dog/turtle)
- **Initial HP**: 8 for all players
- **Character-specific mechanics**: Different characters have different effects in certain scenes (e.g., cat deals +1 damage to rats)

### Technical Constraints
- **No persistent database** in v1.0 (memory only)
- **No user authentication validation** (basic username/password check only)
- **Single server instance** (no distributed sessions)
- **No TypeScript** (to keep complexity low)

## Key Game Mechanics

### Keyword System
Players interact by submitting keywords in format:
- `item + item` (e.g., "水潭+龟")
- `player + item` (e.g., "猫+囚笼")
- `player + player` (e.g., "猫+狗")

Server parses keywords and triggers corresponding scene effects from JSON data.

### Turn-Based Flow
1. Players take turns submitting actions
2. Server validates action against current scene data
3. Server applies effects (HP changes, inventory updates, story progression)
4. Server broadcasts updated game state to all players
5. Repeat until scene objective met

### Boss Battle System
Three boss battles with different mechanics:
- **Rat King**: Individual turn-based combat with hole selection
- **Parrot**: Team synchronization quiz
- **Reaper**: Dice gambling game

Each boss has unique rules defined in data/act4/ JSON files.

## Development Workflow

### Adding New Scene Data
1. Create JSON file in appropriate `data/actX/` directory
2. Follow DATA_FORMAT.md structure
3. Reference scene in server.js scene loading logic
4. Test keyword interactions in game

### Adding Socket.io Events
1. Define event in server.js `io.on('connection')` block
2. Implement validation logic
3. Update room/player state
4. Broadcast appropriate events to clients
5. Document in API_REFERENCE.md
6. Update client-side handler in public/game.js

### Common Development Tasks

**Adding a new keyword interaction**:
1. Edit scene JSON file in `data/`
2. Add keyword to `keywords` array with effects
3. No server code change needed (data-driven)

**Adding a new game state**:
1. Add state to `gameState` enum in room object
2. Update state transition logic in server.js
3. Add client-side UI handling in game.js

**Debugging connection issues**:
- Check browser console for Socket.io errors
- Check server logs for connection/disconnection events
- Verify token is being sent in handshake
- Check `sessions` object in server memory

## Deployment

### Railway Configuration
- **Entry point**: `server.js`
- **Node version**: 18.x (specified in package.json)
- **Port**: Uses `process.env.PORT` (Railway auto-assigns)
- **Static files**: Served from `public/` directory
- **No build step required** (vanilla JS)

### Environment Variables
No environment variables currently required. Future additions:
- `DATABASE_URL` (when PostgreSQL added)
- `JWT_SECRET` (for secure authentication)
- `NODE_ENV` (production/development)

## Known Technical Debt

These shortcuts were intentional for v1.0 (1-2 week timeline):
- Plain text password storage (TODO: bcrypt hashing)
- In-memory data (TODO: PostgreSQL migration)
- No input sanitization (TODO: add validation middleware)
- Hardcoded game data loading (TODO: dynamic scene loader)
- No error recovery for disconnections (TODO: reconnection logic)

## Future Architecture Plans

**v1.1+**:
- Refactor server.js into modular structure (see FOLDER_STRUCTURE.md)
- Add PostgreSQL with Prisma ORM
- Migrate to React frontend (Vite + Tailwind CSS)
- Add Zustand for state management
- Implement JWT authentication

## Additional Documentation

- **TECH_STACK.md**: Detailed technology decisions and rationale
- **API_REFERENCE.md**: Complete Socket.io event specifications
- **CODE_STANDARDS.md**: Full coding style guide
- **DATA_FORMAT.md**: JSON data structure specifications
- **FOLDER_STRUCTURE.md**: Planned modular architecture (future)
- **GAME_DESIGN.md.backup**: Complete game mechanics and story design

## Common Pitfalls

1. **Room ID case sensitivity**: Room IDs are case-sensitive (ABC123 ≠ abc123)
2. **Character selection order**: Must wait for all 3 players before starting game
3. **Token expiry**: Sessions expire after 24 hours, no automatic refresh
4. **Socket.io namespaces**: All events on default namespace `/`
5. **File paths**: Use `path.join(__dirname, ...)` for cross-platform compatibility
6. **JSON syntax**: Scene data files must have valid JSON (no trailing commas)

## Getting Help

For game design questions, refer to GAME_DESIGN.md.backup (original design document).
For technical implementation questions, this file and the referenced docs above should cover most scenarios.
