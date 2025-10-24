// 游戏状态
let socket;
let myId = '';
let myName = '';
let roomId = '';
let selectedCharacter = null;
let players = {};
let gameState = {};
let sceneData = {};

// 角色数据
const CHARACTERS = {
    cat: {
        id: 'cat',
        name: '天一',
        icon: '🐱',
        maxHp: 8,
        description: '猫咪，灵活敏捷但怕水'
    },
    dog: {
        id: 'dog',
        name: '二水',
        icon: '🐶',
        maxHp: 8,
        description: '狗狗，力量强大且忠诚'
    },
    turtle: {
        id: 'turtle',
        name: '包子',
        icon: '🐢',
        maxHp: 8,
        description: '乌龟，防御力高且擅长游泳'
    }
};

// 区域图标映射
const AREA_ICONS = {
    'water-pond': '💧',
    'suitcase': '🧳',
    'closet': '🚪',
    'hidden-room': '🏠',
    'cage': '⛓️',
    'vase': '🏺',
    'computer': '💻',
    'big-door': '🔐'
};

// 初始化Socket连接
function initSocket() {
    socket = io();

    socket.on('connect', () => {
        console.log('已连接到服务器');

        // 尝试重连到之前的房间
        const token = localStorage.getItem('authToken');
        if (token) {
            socket.emit('reconnectToRoom', { token });
        }
    });

    socket.on('disconnect', () => {
        console.log('与服务器断开连接');
        addStoryEntry('系统', '⚠️ 与服务器断开连接，正在尝试重连...');
    });

    socket.on('roomCreated', (data) => {
        roomId = data.roomId;
        players = data.players;
        gameState = data.gameState;
        sceneData = data.sceneData;
        showGameScreen();
    });

    socket.on('playerJoined', (data) => {
        players = data.players;
        gameState = data.gameState;
        updateWaitingScreen();
        updatePlayersPanel();
    });

    socket.on('gameStarted', (data) => {
        gameState = data.gameState;
        startGamePlay(data.message);
    });

    socket.on('keywordResult', (data) => {
        if (data.success) {
            // 更新游戏状态
            gameState = data.gameState;
            players = data.players;

            // 显示故事文本
            addStoryEntry(data.playerName, data.result.storyText);

            // 更新UI
            updateUI();
        } else {
            // 显示错误消息
            addStoryEntry('系统', data.message);
        }

        // 清空输入框
        document.getElementById('keywordInput').value = '';
    });

    socket.on('gameCompleted', (data) => {
        if (data.success) {
            showVictory(data.message);
        }
    });

    socket.on('doorResult', (data) => {
        if (!data.success) {
            addStoryEntry('系统', data.message);
        }
    });

    socket.on('playerLeft', (data) => {
        players = data.players;
        addStoryEntry('系统', `${data.playerName} 离开了房间`);
        updatePlayersPanel();
        updateWaitingScreen();
    });

    socket.on('error', (data) => {
        alert(data.message);
    });

    // 重连成功
    socket.on('reconnected', (data) => {
        console.log('重连成功:', data);
        roomId = data.roomId;
        myId = data.playerId;
        players = data.players;
        gameState = data.gameState;
        sceneData = data.sceneData;

        // 设置玩家信息
        const myPlayer = players[myId];
        if (myPlayer) {
            myName = myPlayer.name;
            selectedCharacter = myPlayer.character;
        }

        // 显示游戏界面
        showGameScreen();

        // 如果游戏已经开始，显示游戏场景
        if (gameState.gamePhase === 'room-escape') {
            document.getElementById('waitingScreen').style.display = 'none';
            document.getElementById('gameSceneScreen').style.display = 'flex';
            document.getElementById('controlsPanel').style.display = 'block';

            // 渲染场景
            renderScene();
            updateUI();
        }

        addStoryEntry('系统', '✅ 重新连接成功！');
    });

    // 重连失败
    socket.on('reconnectError', (data) => {
        console.log('重连失败:', data.message);
        // 重连失败时不显示错误，让用户正常创建/加入房间
    });

    // 其他玩家重连
    socket.on('playerReconnected', (data) => {
        addStoryEntry('系统', `${data.playerName} 重新连接`);
    });

    // 其他玩家断线
    socket.on('playerDisconnected', (data) => {
        addStoryEntry('系统', `${data.playerName} 断开连接`);
    });
}

// 角色选择
document.addEventListener('DOMContentLoaded', () => {
    initSocket();

    // 角色卡片点击事件
    const characterCards = document.querySelectorAll('.character-card');
    characterCards.forEach(card => {
        card.addEventListener('click', () => {
            // 移除其他选中状态
            characterCards.forEach(c => c.classList.remove('selected'));
            // 添加选中状态
            card.classList.add('selected');
            // 保存选择的角色
            const characterId = card.getAttribute('data-character');
            selectedCharacter = CHARACTERS[characterId];
        });
    });
});

// 生成ID
function generateRoomId() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function generatePlayerId() {
    return 'p' + Date.now() + Math.random().toString(36).substring(2, 7);
}

// 创建房间
function createRoom() {
    const nameInput = document.getElementById('playerName');
    if (!nameInput.value.trim()) {
        alert('请输入你的名字！');
        return;
    }
    if (!selectedCharacter) {
        alert('请选择一个角色！');
        return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('未登录，请先登录！');
        window.location.href = '/login.html';
        return;
    }

    myName = nameInput.value.trim();
    myId = generatePlayerId();
    const newRoomId = generateRoomId();

    socket.emit('createRoom', {
        roomId: newRoomId,
        playerName: myName,
        playerId: myId,
        character: selectedCharacter,
        token: token
    });
}

// 加入房间
function joinRoom() {
    const nameInput = document.getElementById('playerName');
    const roomInput = document.getElementById('roomIdInput');

    if (!nameInput.value.trim() || !roomInput.value.trim()) {
        alert('请输入你的名字和房间ID！');
        return;
    }
    if (!selectedCharacter) {
        alert('请选择一个角色！');
        return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
        alert('未登录，请先登录！');
        window.location.href = '/login.html';
        return;
    }

    myName = nameInput.value.trim();
    myId = generatePlayerId();
    roomId = roomInput.value.trim().toUpperCase();

    socket.emit('joinRoom', {
        roomId: roomId,
        playerName: myName,
        playerId: myId,
        character: selectedCharacter,
        token: token
    });

    setTimeout(() => {
        if (Object.keys(players).length > 0) {
            showGameScreen();
        }
    }, 500);
}

// 显示游戏界面
function showGameScreen() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'block';
    document.getElementById('roomIdDisplay').textContent = roomId;

    updateWaitingScreen();
    updatePlayersPanel();
}

// 更新等待界面
function updateWaitingScreen() {
    const playerCount = Object.keys(players).length;
    document.getElementById('playerCountDisplay').textContent = `(${playerCount}/3)`;

    const waitingList = document.getElementById('waitingPlayerList');
    waitingList.innerHTML = '';

    Object.values(players).forEach(player => {
        const item = document.createElement('div');
        item.className = 'player-item';
        item.innerHTML = `${player.character.icon} ${player.name} (${player.character.name})`;
        waitingList.appendChild(item);
    });

    // 显示/隐藏开始按钮
    const startBtn = document.getElementById('startGameBtn');
    if (playerCount === 3) {
        // 只有房主能看到开始按钮
        const playersList = Object.values(players);
        if (playersList[0].id === myId) {
            startBtn.style.display = 'block';
        }
    } else {
        startBtn.style.display = 'none';
    }
}

// 开始游戏
function startGame() {
    socket.emit('startGame', { roomId });
}

// 开始游戏玩法
function startGamePlay(message) {
    document.getElementById('waitingScreen').style.display = 'none';
    document.getElementById('gameSceneScreen').style.display = 'flex';
    document.getElementById('controlsPanel').style.display = 'block';

    // 显示场景描述
    document.getElementById('sceneDescription').textContent = message;

    // 渲染场景区域
    renderAreas();

    // 添加开场消息到日志
    addStoryEntry('系统', message);

    // 初始提示
    const myPlayer = players[myId];
    if (myPlayer && myPlayer.canMove) {
        addStoryEntry('系统', '你可以开始探索了！尝试输入关键词如"水潭+龟"');
    } else {
        addStoryEntry('系统', '你目前无法行动，等待队友拯救你！');
    }

    updateUI();
}

// 渲染场景区域
function renderAreas() {
    const grid = document.getElementById('areasGrid');
    grid.innerHTML = '';

    // 获取可见区域
    const visibleAreas = gameState.discoveredAreas || [];

    visibleAreas.forEach(areaId => {
        const areaInfo = sceneData.areas[areaId];
        if (!areaInfo) return;

        const card = document.createElement('div');
        card.className = 'area-card';
        card.innerHTML = `
            <div class="area-icon">${AREA_ICONS[areaId] || '📍'}</div>
            <div class="area-name">${areaInfo.name}</div>
        `;
        grid.appendChild(card);
    });
}

// 更新玩家面板
function updatePlayersPanel() {
    const container = document.getElementById('playersContainer');
    container.innerHTML = '';

    Object.values(players).forEach(player => {
        const hpPercent = (player.hp / player.maxHp) * 100;
        const isMe = player.id === myId;
        const canMove = player.canMove;

        const card = document.createElement('div');
        card.className = `player-card ${isMe ? 'me' : ''} ${!canMove ? 'cannot-move' : ''}`;

        card.innerHTML = `
            <div class="player-header">
                <div class="player-icon">${player.character.icon}</div>
                <div class="player-name">
                    ${player.name}
                    ${isMe ? '<br><span style="font-size: 10px; color: #f4d03f;">(你)</span>' : ''}
                </div>
            </div>
            <div class="hp-bar">
                <div class="hp-fill" style="width: ${hpPercent}%">
                    ${player.hp}/${player.maxHp}
                </div>
            </div>
            <span class="status-tag ${canMove ? 'active' : 'locked'}">
                ${canMove ? '✓ 可行动' : '🔒 被困'}
            </span>
        `;

        container.appendChild(card);
    });
}

// 更新UI
function updateUI() {
    updatePlayersPanel();
    renderAreas();
    updateLetters();
    updateInventory();
    updateDoorSection();
}

// 更新字母收集
function updateLetters() {
    const container = document.getElementById('lettersCollected');
    const letters = gameState.collectedLetters || [];

    if (letters.length === 0) {
        container.innerHTML = '<span style="color: #666; font-size: 12px;">暂无</span>';
    } else {
        container.innerHTML = '';
        letters.forEach(letter => {
            const badge = document.createElement('div');
            badge.className = 'letter-badge';
            badge.textContent = letter;
            container.appendChild(badge);
        });
    }
}

// 更新背包
function updateInventory() {
    const list = document.getElementById('inventoryList');
    const inventory = gameState.inventory || {};
    const items = Object.keys(inventory).filter(key => inventory[key]);

    if (items.length === 0) {
        list.innerHTML = '<li style="color: #666; font-size: 12px;">空空如也</li>';
    } else {
        list.innerHTML = '';
        items.forEach(itemId => {
            const itemInfo = sceneData.items?.[itemId];
            if (itemInfo) {
                const li = document.createElement('li');
                li.className = 'inventory-item';
                li.textContent = `${itemInfo.name} - ${itemInfo.description}`;
                list.appendChild(li);
            }
        });
    }
}

// 更新大门区域
function updateDoorSection() {
    const doorSection = document.getElementById('doorUnlockSection');
    const discoveredAreas = gameState.discoveredAreas || [];

    // 当发现大门时显示密码输入
    if (discoveredAreas.includes('big-door')) {
        doorSection.style.display = 'block';
    }
}

// 添加故事条目
function addStoryEntry(playerName, text) {
    const log = document.getElementById('storyLog');
    const entry = document.createElement('div');
    entry.className = 'story-entry';

    entry.innerHTML = `
        <div class="player-name">${playerName}</div>
        <div class="text">${text}</div>
    `;

    log.appendChild(entry);

    // 滚动到底部
    log.scrollTop = log.scrollHeight;
}

// 提交关键词
function submitKeyword() {
    const input = document.getElementById('keywordInput');
    const keyword = input.value.trim();

    if (!keyword) {
        alert('请输入关键词！');
        return;
    }

    socket.emit('submitKeyword', {
        roomId: roomId,
        playerId: myId,
        keyword: keyword
    });
}

// 回车提交
function handleKeywordEnter(event) {
    if (event.key === 'Enter') {
        submitKeyword();
    }
}

// 尝试开门
function tryOpenDoor() {
    const password = document.getElementById('doorPassword').value.trim();

    if (!password) {
        alert('请输入密码！');
        return;
    }

    socket.emit('tryOpenDoor', {
        roomId: roomId,
        playerId: myId,
        password: password
    });
}

// 显示胜利界面
function showVictory(message) {
    const banner = document.getElementById('victoryBanner');
    const messageEl = document.getElementById('victoryMessage');

    messageEl.textContent = message;
    banner.style.display = 'block';
}

// 复制房间ID
function copyRoomId() {
    navigator.clipboard.writeText(roomId).then(() => {
        const display = document.getElementById('roomIdDisplay');
        const originalText = display.textContent;
        display.textContent = '已复制!';
        setTimeout(() => {
            display.textContent = originalText;
        }, 2000);
    }).catch(() => {
        prompt('复制这个房间ID分享给朋友:', roomId);
    });
}

// 退出登录
function logout() {
    if (confirm('确定要退出登录吗？当前游戏进度将保存，下次登录可继续。')) {
        // 清除本地存储的token
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');

        // 断开socket连接
        if (socket) {
            socket.disconnect();
        }

        // 跳转到登录页面
        window.location.href = '/login.html';
    }
}
