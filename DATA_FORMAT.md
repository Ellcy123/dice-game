# 游戏数据JSON格式规范

## 数据来源

所有游戏数据从**《三兄弟的冒险》2.docx**文档转换而来。

本文档定义了如何将Word文档中的游戏设计转换为JSON格式的数据文件。

---

## 第一幕：密室场景

### 文件位置
`server/data/act1/scene1-密室.json`

### 数据结构

```json
{
  "sceneId": "act1-scene1",
  "sceneName": "密室",
  "description": "你们醒来后发现被困在一个密室当中。你好像听到了有人在哭泣，密室的布局很奇怪，有一汪水潭，一个行李箱,一个衣柜。",
  
  "initialState": {
    "catCanMove": false,
    "dogCanMove": false,
    "turtleCanMove": true,
    "description": "猫、狗无法行动，需龟与主持人对话触发关键词对应的剧情内容，拯救伙伴并逃脱。"
  },
  
  "areas": [
    {
      "areaId": "water-pond",
      "name": "水潭",
      "description": "一汪清澈的水潭",
      "interactions": [
        {
          "keyword": "水潭+龟",
          "triggerBy": ["turtle"],
          "effect": {
            "type": "getItem",
            "itemId": "wooden-box",
            "storyText": "包子潜入水中获得木盒，水下另有物品但无法拿取"
          }
        },
        {
          "keyword": "水潭+猫",
          "triggerBy": ["cat"],
          "effect": {
            "type": "damage",
            "target": "cat",
            "value": -1,
            "storyText": "天一跳入水中（不会游泳），因'要面子'未呼救，生命值-1"
          }
        },
        {
          "keyword": "水潭+狗",
          "triggerBy": ["dog"],
          "effect": {
            "type": "getItem",
            "itemId": "monitor",
            "storyText": "从水潭捞起显示器，体感'凑凑的'"
          }
        },
        {
          "keyword": "水潭+行李箱",
          "triggerBy": ["cat", "dog", "turtle"],
          "effect": {
            "type": "story",
            "storyText": "将行李箱做成'梅利号'船，船沉后取回行李箱"
          }
        },
        {
          "keyword": "水潭+电脑",
          "triggerBy": ["cat", "dog", "turtle"],
          "effect": {
            "type": "riverGod",
            "storyText": "电脑入水后出现河神，如实回答可生命值+1",
            "rewardHp": 1,
            "condition": "truthful"
          }
        }
      ]
    },
    
    {
      "areaId": "suitcase",
      "name": "行李箱",
      "description": "一个带密码锁的行李箱",
      "password": "000",
      "interactions": [
        {
          "keyword": "行李箱+龟",
          "triggerBy": ["turtle"],
          "effect": {
            "type": "unlock",
            "target": "suitcase",
            "resultText": "行李箱带三位初始密码（000，玩家无法获取），主持人解锁后可救出猫，猫恢复行动"
          }
        },
        {
          "keyword": "行李箱+猫",
          "triggerBy": ["cat"],
          "effect": {
            "type": "getItem",
            "itemId": "key",
            "storyText": "天一撕烂行李箱，获得内钥匙"
          }
        }
      ]
    },
    
    {
      "areaId": "closet",
      "name": "衣柜",
      "description": "一个大衣柜",
      "interactions": [
        {
          "keyword": "衣柜+龟",
          "triggerBy": ["turtle"],
          "effect": {
            "type": "discoverArea",
            "newAreaId": "hidden-room",
            "storyText": "龟在衣柜下方发现了一个按钮，按下去后衣柜打开了。后面居然有一个小房间。小房间：房间内有一个巨大的囚笼，狗被困在其中，房间内还有一个花瓶和一个电脑。墙上有一扇只可以用四位密码触发打开的大门"
          }
        },
        {
          "keyword": "衣柜+猫",
          "triggerBy": ["cat"],
          "effect": {
            "type": "getLetter",
            "letter": "C",
            "storyText": "猫在衣柜上面发现了一个模模糊糊的字母：C"
          }
        },
        {
          "keyword": "衣柜+钥匙",
          "triggerBy": ["cat", "dog", "turtle"],
          "effect": {
            "type": "getItem",
            "itemId": "red-crystal-heart",
            "rewardHp": 1,
            "reusable": true,
            "storyText": "打开衣柜暗格，获得红水晶心，食用后生命值+1（钥匙可复用）"
          }
        }
      ]
    },
    
    {
      "areaId": "hidden-room",
      "name": "小房间",
      "description": "衣柜后的隐藏房间",
      "discovered": false,
      "items": [
        {
          "itemId": "cage",
          "name": "囚笼",
          "contains": "dog"
        },
        {
          "itemId": "vase",
          "name": "花瓶"
        },
        {
          "itemId": "computer",
          "name": "电脑"
        }
      ]
    }
  ],
  
  "items": [
    {
      "itemId": "wooden-box",
      "name": "木盒",
      "description": "一个神秘的木盒",
      "canOpen": false,
      "interactions": [
        {
          "keyword": "木盒+狗",
          "effect": {
            "type": "getLetter",
            "letter": "E",
            "storyText": "二水咬开木盒，获得字条'E'"
          }
        }
      ]
    },
    {
      "itemId": "monitor",
      "name": "显示器",
      "interactions": [
        {
          "keyword": "显示器+电脑",
          "effect": {
            "type": "getLetter",
            "letter": "H",
            "storyText": "更换显示器后打开电脑，获得字母'H'"
          }
        }
      ]
    },
    {
      "itemId": "key",
      "name": "钥匙",
      "reusable": true,
      "interactions": [
        {
          "keyword": "钥匙+囚笼",
          "condition": "dog-in-cage",
          "effect": {
            "type": "unlock",
            "target": "cage",
            "storyText": "打开囚笼，二水恢复行动"
          }
        }
      ]
    }
  ],
  
  "winCondition": {
    "type": "password",
    "password": "ECHO",
    "door": "big-door",
    "requiredLetters": ["C", "H", "E", "O"],
    "description": "输入四位密码'ECHO'（由之前获得的字母C、E、O、H组合）可打开大门"
  }
}
```

---

## 第一幕：藏匿场景

### 文件位置
`server/data/act1/scene2-藏匿.json`

### 数据结构

```json
{
  "sceneId": "act1-scene2",
  "sceneName": "藏匿",
  "description": "准备逃离时遇到'黑色兜帽男'（持未知武器），决定藏匿躲避。",
  
  "gameType": "hide-and-seek",
  "rules": {
    "totalAreas": 8,
    "maxPlayersPerArea": 2,
    "attackRounds": 5,
    "damagePerHit": -1,
    "bonusForNeverHit": 3
  },
  
  "areas": [
    { "areaId": "water-pond", "name": "水潭", "capacity": 2 },
    { "areaId": "closet", "name": "衣柜", "capacity": 2 },
    { "areaId": "small-room", "name": "小房间", "capacity": 2 },
    { "areaId": "cage", "name": "囚笼", "capacity": 2 },
    { "areaId": "computer-desk", "name": "电脑桌", "capacity": 2 },
    { "areaId": "corner", "name": "墙角", "capacity": 2 },
    { "areaId": "vase", "name": "花瓶", "capacity": 2 },
    { "areaId": "suitcase", "name": "行李箱", "capacity": 2 }
  ],
  
  "attackSequence": [
    {
      "round": 1,
      "targetArea": "random",
      "description": "黑色兜帽男进行第一次攻击"
    },
    {
      "round": 2,
      "targetArea": "random",
      "description": "黑色兜帽男进行第二次攻击"
    },
    {
      "round": 3,
      "targetArea": "random",
      "description": "黑色兜帽男进行第三次攻击"
    },
    {
      "round": 4,
      "targetArea": "random",
      "description": "黑色兜帽男进行第四次攻击"
    },
    {
      "round": 5,
      "targetArea": "random",
      "description": "黑色兜帽男进行第五次攻击"
    }
  ],
  
  "ending": {
    "storyText": "兜帽男未找到玩家，自语'该来的逃不掉'后离开。",
    "nextScene": "act2-memories"
  }
}
```

---

## 第二幕：记忆回溯

### 文件位置
`server/data/act2/memories.json`

### 数据结构

```json
{
  "actId": "act2",
  "actName": "过往",
  "description": "听到兜帽男的话后，三人涌入过往记忆，需抓取自身记忆。",
  
  "gameType": "yes-no-questions",
  "rules": {
    "questionFormat": "YES or NO",
    "playerCanOnlyAskOwnPerspective": true,
    "wrongPerspectiveAnswer": "不重要"
  },
  
  "hiddenTasks": [
    {
      "taskId": "task1",
      "name": "找到三因",
      "description": "找到三人故事的成因"
    },
    {
      "taskId": "task2",
      "name": "找到身份",
      "description": "找到自身对应的真实身份"
    }
  ],
  
  "perspectives": [
    {
      "perspectiveId": "perspective-turtle",
      "character": "turtle",
      "playerName": "二水",
      "memoryText": "25岁冬天，见妈妈忙碌后入睡，醒来在陌生处，遇持刀陌生人，再睁眼时爸爸抱着自己哭泣",
      "truth": "乌龟因年事已高自然死亡",
      "keyInfo": [
        "25岁生日",
        "冬天",
        "看到妈妈忙碌",
        "睡觉",
        "陌生地方醒来",
        "持刀陌生人",
        "爸爸哭泣"
      ]
    },
    {
      "perspectiveId": "perspective-dog",
      "character": "dog",
      "playerName": "包子",
      "memoryText": "调皮走丢后被陌生人抓走",
      "truth": "狗狗因走丢被狗贩子抓走",
      "keyInfo": [
        "调皮",
        "走丢",
        "被抓走",
        "陌生人"
      ]
    },
    {
      "perspectiveId": "perspective-cat",
      "character": "cat",
      "playerName": "天一",
      "memoryText": "生病无法医治，主人将自己安乐",
      "truth": "猫咪因重病被主人安乐死",
      "keyInfo": [
        "生病",
        "无法医治",
        "主人",
        "安乐死"
      ]
    }
  ]
}
```

---

## 第三幕：个人剧情线

### 猫线 - 功夫路线

#### 文件位置
`server/data/act3/cat/route1-kungfu.json`

#### 数据结构

```json
{
  "routeId": "cat-kungfu",
  "character": "cat",
  "routeName": "打铁还需自身硬，你决定学习功夫",
  "description": "半年内寻得师父'鸿猫'，被收为关门弟子，号'功夫猫'",
  
  "choices": [
    {
      "choiceId": "meditation",
      "question": "静心修炼选择",
      "storyText": "你正在静心修炼时，一只麻雀在你面前不停叽叽喳喳。",
      "options": [
        {
          "optionId": "A",
          "text": "无视麻雀干扰",
          "result": {
            "skillId": "calm-mind",
            "skillName": "心如止水",
            "skillGrade": "A",
            "skillEffect": "BOSS战第一关卡免巧克力伤害",
            "storyText": "你无视麻雀的干扰，专注于内心修炼。师父鸿猫赞赏你的定力，传授你'心如止水'心法。"
          }
        },
        {
          "optionId": "B",
          "text": "赶走麻雀并坦白",
          "result": {
            "skillId": "meow-call",
            "skillName": "喵喵叫",
            "skillGrade": "B",
            "skillEffect": "BOSS战第一关卡对鼠鼠大王伤害+1",
            "storyText": "你赶走麻雀后向师父坦白，师父教你用'喵喵叫'震慑敌人。"
          }
        },
        {
          "optionId": "C",
          "text": "专注麻雀节奏",
          "result": {
            "skillId": "borrow-force",
            "skillName": "借力打力",
            "skillGrade": "S",
            "skillEffect": "BOSS战第一关卡可一次性选2个老鼠洞",
            "storyText": "你专注于麻雀的节奏，领悟了'借力打力'的精髓。"
          }
        },
        {
          "optionId": "D",
          "text": "烤麻雀",
          "result": {
            "skillId": "feast",
            "skillName": "大快朵颐",
            "skillGrade": "B",
            "skillEffect": "生命值+2",
            "hpBonus": 2,
            "storyText": "你烤了麻雀美餐一顿，体力大增。"
          }
        }
      ]
    },
    
    {
      "choiceId": "lightness-skill",
      "question": "轻功修炼选择",
      "storyText": "师父让你选择一种轻功修炼方式。",
      "options": [
        {
          "optionId": "A",
          "text": "雪地修炼",
          "result": {
            "skillId": "snow-step",
            "skillName": "踏雪无痕",
            "skillGrade": "A",
            "skillEffect": "BOSS战第二关卡，若选择非最少人选区域，则不掉生命值"
          }
        },
        {
          "optionId": "B",
          "text": "水面修炼",
          "result": {
            "skillId": "water-walk",
            "skillName": "水上漂",
            "skillGrade": "S",
            "skillEffect": "BOSS战第二关卡可选择不参与"
          }
        },
        {
          "optionId": "C",
          "text": "树林修炼",
          "result": {
            "skillId": "rat-hunter",
            "skillName": "鼠类克星",
            "skillGrade": "B",
            "skillEffect": "BOSS战第一关卡对鼠鼠大王伤害+1"
          }
        },
        {
          "optionId": "D",
          "text": "不学轻功练体气",
          "result": {
            "skillId": "body-qi",
            "skillName": "啾咪真经",
            "skillGrade": "B",
            "skillEffect": "生命值+2",
            "hpBonus": 2
          }
        }
      ]
    }
  ]
}
```

---

## 第四幕：BOSS战

### 鼠鼠大王战

#### 文件位置
`server/data/act4/boss1-rat-king.json`

#### 数据结构

```json
{
  "bossId": "rat-king",
  "bossName": "鼠鼠大王",
  "bossHp": 6,
  "description": "原本是一只宠物仓鼠，刚来到这个世界受尽了欺负，因此经常挖洞躲在地下。久而久之，凭借着自己的努力，建立了地下世界，常年生活在地下八英尺左右的位置，现在是underground的king，万鼠膜拜。",
  
  "battleType": "choice",
  "playerMode": "solo",
  
  "rules": {
    "holeCount": 5,
    "playerChoosesHole": true,
    "randomizeElementsEachRound": true,
    "soloPlay": true,
    "switchOnDeath": true
  },
  
  "characterEffects": {
    "cat": {
      "damageMultiplier": 2,
      "reason": "天敌克制，对鼠鼠大王伤害+1"
    },
    "dog": {
      "cannotJoin": true,
      "reason": "多管闲事，本关卡不允许狗玩家登场（其余玩家全部阵亡后失效）"
    },
    "turtle": {
      "damageMultiplier": 0.5,
      "reason": "师傅压制，对鼠鼠大王伤害减半"
    }
  },
  
  "holeElements": [
    {
      "elementId": "A",
      "name": "鼠鼠大王",
      "effect": {
        "type": "damage-boss",
        "baseDamage": 1,
        "description": "若成功击中鼠鼠大王，鼠鼠大王生命值-1（若有攻击加成类技能或道具则按照加成后计算）"
      }
    },
    {
      "elementId": "B",
      "name": "巧克力酱",
      "effect": {
        "type": "damage-allies",
        "targets": ["cat", "dog"],
        "damage": -1,
        "description": "你击中了鼠鼠大王珍藏的巧克力酱，猫与狗不小心误食，虽及时医治但也对身体造成了损伤，猫、狗生命值-1"
      }
    },
    {
      "elementId": "C",
      "name": "囤货区",
      "effect": {
        "type": "heal-all",
        "heal": 1,
        "description": "你击中了鼠鼠大王准备过冬的食物储藏室，你们三人因此饱餐一顿，全体生命值+1"
      }
    },
    {
      "elementId": "D",
      "name": "狗",
      "effect": {
        "type": "damage-player",
        "target": "current",
        "damage": -1,
        "description": "你不小心命中了被困在这里的狗狗，这小子睚眦必报，给了你一口，生命值-1（若有攻击加成类技能或道具效果累计）"
      }
    },
    {
      "elementId": "E",
      "name": "龟/猫",
      "effect": {
        "type": "damage-ally",
        "target": "random",
        "excludeCurrent": true,
        "damage": -1,
        "description": "你不小心命中了龟/猫玩家，对其造成了1点伤害（若有攻击加成类技能或道具则按照加成后计算）"
      }
    }
  ],
  
  "winCondition": {
    "type": "boss-hp-zero",
    "nextBoss": "parrot"
  }
}
```

### 百变小鹦战

#### 文件位置
`server/data/act4/boss2-parrot.json`

#### 数据结构

```json
{
  "bossId": "parrot",
  "bossName": "百变小鹦",
  "bossHp": 4,
  "description": "掌握多国语言的天才鹦鹉，是这个世界的百鸟之王，哲学家，喜欢提出各种生活上的问题难倒敌人。",
  
  "battleType": "sync-choice",
  "playerMode": "team",
  
  "rules": {
    "noDiscussion": true,
    "sameChoiceWins": true,
    "differentChoiceDamage": -1,
    "fixedDamage": 1
  },
  
  "questions": [
    {
      "questionId": "q1",
      "text": "你的同学带了很多零食，分给了周围同学，但是没分给你，你会选择：",
      "options": [
        { "id": "A", "text": "毫不在意" },
        { "id": "B", "text": "笑着问是不是把你忘了" }
      ]
    },
    {
      "questionId": "q2",
      "text": "你在村口听八卦，发现八卦的对象是你，你会选择：",
      "options": [
        { "id": "A", "text": "跟他们解释" },
        { "id": "B", "text": "默默吃瓜" },
        { "id": "C", "text": "编个更离谱的八卦" }
      ]
    },
    {
      "questionId": "q3",
      "text": "你刚看完恐怖片，非常害怕，这时你想上卫生间，你会选择：",
      "options": [
        { "id": "A", "text": "憋着等朋友回来再去" },
        { "id": "B", "text": "憋着对身体不好只能去" }
      ]
    }
  ],
  
  "winCondition": {
    "type": "boss-hp-zero",
    "nextBoss": "reaper"
  }
}
```

### 死神战

#### 文件位置
`server/data/act4/boss3-reaper.json`

#### 数据结构

```json
{
  "bossId": "reaper",
  "bossName": "死神",
  "bossHp": 0,
  "description": "引路人，带领你们来到这里的人。如果想逃出去，请打败他。",
  
  "battleType": "dice-gambling",
  "playerMode": "team",
  
  "rules": {
    "maxRounds": 15,
    "winCondition": {
      "type": "reach-points",
      "requiredPoints": 1000
    },
    "loseCondition": [
      { "type": "exceed-rounds", "maxRounds": 15 },
      { "type": "zero-hp" }
    ],
    "initialStake": "allPlayersHp"
  },
  
  "rounds": [
    {
      "roundNumber": 1,
      "type": "big-small",
      "description": "请选择大或小 (1-2-3为小, 4-5-6为大)",
      "multiplier": 2,
      "options": ["big", "small"]
    },
    {
      "roundNumber": 2,
      "type": "compare-last",
      "description": "请选择本轮的点数比上轮的大或小或等于",
      "multiplier": { "big": 2, "small": 2, "equal": 5 },
      "options": ["big", "small", "equal"]
    },
    {
      "roundNumber": 5,
      "type": "odd-even",
      "description": "请选择奇或偶",
      "multiplier": 2,
      "options": ["odd", "even"]
    },
    {
      "roundNumber": 7,
      "type": "penalty",
      "description": "无需下注，若点数为奇数，扣除50生命值",
      "condition": "odd",
      "penalty": -50
    },
    {
      "roundNumber": 11,
      "type": "death-number",
      "description": "点数为4直接死亡，其余赔率2",
      "deathNumber": 4,
      "multiplier": 2
    },
    {
      "roundNumber": 15,
      "type": "final",
      "description": "大于等于4赔率2；大于等于5赔率3；等于6赔率10",
      "multipliers": {
        "gte4": 2,
        "gte5": 3,
        "eq6": 10
      }
    }
  ],
  
  "winCondition": {
    "type": "reach-points",
    "points": 1000,
    "ending": "true-ending"
  }
}
```

---

## 技能数据格式

### 文件位置
`server/data/skills/all-skills.json`

### 数据结构

```json
{
  "skills": [
    {
      "skillId": "calm-mind",
      "name": "心如止水",
      "grade": "A",
      "character": "cat",
      "route": "kungfu",
      "description": "专注内心，不受外界干扰",
      "effect": "BOSS战第一关卡免巧克力伤害",
      "usageType": "passive",
      "usedInBattle": "boss1"
    },
    {
      "skillId": "water-walk",
      "name": "水上漂",
      "grade": "S",
      "character": "cat",
      "route": "kungfu",
      "description": "轻功修炼至极致，可在水面行走",
      "effect": "BOSS战第二关卡可选择不参与",
      "usageType": "active",
      "usedInBattle": "boss2"
    }
  ]
}
```

---

## 道具数据格式

### 文件位置
`server/data/items/all-items.json`

### 数据结构

```json
{
  "items": [
    {
      "itemId": "time-machine",
      "name": "时光机",
      "grade": "SSS",
      "character": "cat",
      "route": "robot",
      "description": "可以回到过去的神奇道具",
      "effect": "回到战斗开始前那一刻，重新开始本场战斗",
      "usageType": "single-use",
      "usedInBattle": "any"
    },
    {
      "itemId": "any-door",
      "name": "任意门",
      "grade": "SSSS",
      "character": "cat",
      "route": "robot",
      "description": "可以前往任何地方的门",
      "effect": "你可选择任意关卡开始挑战",
      "usageType": "single-use",
      "usedInBattle": "pre-battle"
    }
  ]
}
```

---

## 结局数据格式

### 文件位置
`server/data/endings/all-endings.json`

### 数据结构

```json
{
  "endings": [
    {
      "endingId": "ending-0",
      "name": "死于鼠鼠大王",
      "condition": {
        "type": "defeat",
        "bossId": "rat-king"
      },
      "storyText": "牛，为你点赞！"
    },
    {
      "endingId": "ending-1",
      "name": "疯人院",
      "condition": {
        "type": "victory",
        "bossId": "rat-king",
        "notChallenge": ["parrot", "reaper"]
      },
      "scenes": [
        {
          "perspective": "player",
          "title": "第一幕 - 密室",
          "text": "一觉醒来，我们三人居然被困在密室了..."
        },
        {
          "perspective": "nurse",
          "title": "第一幕 - 密室",
          "text": "这三位重度妄想症的病人不知道玩什么小游戏呢..."
        }
      ]
    },
    {
      "endingId": "ending-2",
      "name": "我也永远爱你",
      "condition": {
        "type": "challenge",
        "bossId": "reaper"
      },
      "storyText": "你们不计后果的向死神发起挑战，最终打动了死神...",
      "characterMessages": {
        "cat": "铲屎官，好久不见，我在这面混的很好，你呢？...",
        "dog": "爸爸妈妈，你们啥时候亖啊？这面可好玩啦...",
        "turtle": "主人，我很想你..."
      }
    }
  ]
}
```

---

## 数据转换工具

### 使用脚本转换Word文档

创建 `scripts/data-converter.js`：

```javascript
/**
 * 将Word文档内容转换为JSON格式
 * 使用方法：node scripts/data-converter.js
 */

// 示例：手动转换密室场景
function convertScene1ToJSON() {
  const scene1 = {
    sceneId: "act1-scene1",
    sceneName: "密室",
    description: "...",
    // ... 按照格式填充数据
  };
  
  return JSON.stringify(scene1, null, 2);
}
```

---

## 数据验证规则

### 必填字段检查

1. **场景数据**：
   - `sceneId`（唯一）
   - `sceneName`
   - `description`
   - `areas`（至少1个）
   - `winCondition`

2. **交互数据**：
   - `keyword`（格式："对象+对象"）
   - `effect.type`
   - `effect.storyText`

3. **BOSS数据**：
   - `bossId`（唯一）
   - `bossName`
   - `bossHp`
   - `battleType`
   - `rules`

---

## 总结

### 数据文件清单

| 文件 | 内容 | 状态 |
|------|------|------|
| `act1/scene1-密室.json` | 第一关剧情 | 📝 待创建 |
| `act1/scene2-藏匿.json` | 第二关游戏 | 📝 待创建 |
| `act2/memories.json` | 记忆回溯 | 📝 待创建 |
| `act3/cat/*` | 猫线3条路线 | 📝 待创建 |
| `act3/dog/*` | 狗线2条路线 | 📝 待创建 |
| `act3/turtle/*` | 龟线3条路线 | 📝 待创建 |
| `act4/boss1-rat-king.json` | 鼠鼠大王战 | 📝 待创建 |
| `act4/boss2-parrot.json` | 百变小鹦战 | 📝 待创建 |
| `act4/boss3-reaper.json` | 死神战 | 📝 待创建 |
| `skills/all-skills.json` | 所有技能 | 📝 待创建 |
| `items/all-items.json` | 所有道具 | 📝 待创建 |
| `endings/all-endings.json` | 所有结局 | 📝 待创建 |

### 下一步行动

1. 使用此文档作为参考，逐步创建JSON文件
2. 每创建一个文件，在StoryEngine中测试解析
3. 发现问题及时调整数据格式

---

**更新日期**：2024-XX-XX
**文档版本**：v1.0
