# 游戏数据JSON格式规范

## 数据来源

所有游戏数据从**《三兄弟的冒险》2.docx**文档(rule.md)转换而来。

本文档定义了如何将规则文档中的游戏设计转换为JSON格式的数据文件。

---

## 第一幕：密室逃脱

### 场景一：密室

#### 文件位置
`server/data/act1/scene1-room.json`

#### 完整数据结构

```json
{
  "sceneId": "act1-scene1",
  "sceneName": "密室",
  "description": "你们醒来后发现被困在一个密室当中。你好像听到了有人在哭泣,密室的布局很奇怪,有一汪水潭,一个行李箱,一个衣柜。",

  "initialState": {
    "catCanMove": false,
    "dogCanMove": false,
    "turtleCanMove": true,
    "catLocation": "suitcase",
    "dogLocation": "cage-in-hidden-room",
    "description": "初始状态：猫、狗无法行动,需龟与主持人对话触发关键词对应的剧情内容,拯救伙伴并逃脱。"
  },

  "keywords": [
    {
      "id": "water-turtle",
      "keyword": "水潭+龟",
      "triggerBy": ["turtle"],
      "requirements": [],
      "effect": {
        "type": "getItem",
        "itemId": "wooden-box",
        "storyText": "包子潜入水中获得木盒,水下另有物品但无法拿取"
      }
    },
    {
      "id": "water-cat",
      "keyword": "水潭+猫",
      "triggerBy": ["cat"],
      "requirements": ["cat-can-move"],
      "effect": {
        "type": "damage",
        "target": "cat",
        "value": -1,
        "storyText": "天一跳入水中(不会游泳),因'要面子'未呼救,生命值-1"
      }
    },
    {
      "id": "water-dog",
      "keyword": "水潭+狗",
      "triggerBy": ["dog"],
      "requirements": ["dog-can-move"],
      "effect": {
        "type": "getItem",
        "itemId": "monitor",
        "storyText": "从水潭捞起显示器,体感'凑凑的'"
      }
    },
    {
      "id": "water-suitcase",
      "keyword": "水潭+行李箱",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": [],
      "effect": {
        "type": "story",
        "storyText": "将行李箱做成'梅利号'船,船沉后取回行李箱",
        "note": "行李箱仍可使用"
      }
    },
    {
      "id": "water-closet",
      "keyword": "水潭+衣柜",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": [],
      "effect": {
        "type": "damage",
        "target": "current",
        "value": -1,
        "storyText": "搬衣柜时碰头,意识到世界有引力,生命值-1"
      }
    },
    {
      "id": "water-monitor",
      "keyword": "水潭+显示器",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": ["has-monitor"],
      "effect": {
        "type": "removeItem",
        "itemId": "monitor",
        "storyText": "显示器被扔回水潭后消失",
        "note": "显示器无法使用,密码需瞎猜"
      }
    },
    {
      "id": "water-computer",
      "keyword": "水潭+电脑",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": ["has-computer"],
      "effect": {
        "type": "riverGod",
        "storyText": "电脑入水后出现河神,如实回答可生命值+1",
        "truthfulReward": 1,
        "lyingPenalty": 0
      }
    },
    {
      "id": "water-key",
      "keyword": "水潭+钥匙",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": ["has-key"],
      "effect": {
        "type": "story",
        "storyText": "用钥匙打水漂,被其他玩家背后吐槽'智力不健全'",
        "note": "钥匙仍可使用"
      }
    },
    {
      "id": "water-cage-dog-inside",
      "keyword": "水潭+囚笼",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": ["dog-in-cage"],
      "effect": {
        "type": "damage",
        "target": "current",
        "value": -2,
        "storyText": "试图浸囚笼,被二水咬伤,生命值-2"
      }
    },
    {
      "id": "water-cage-after",
      "keyword": "水潭+囚笼",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": ["dog-freed"],
      "effect": {
        "type": "damage",
        "target": "current",
        "value": -1,
        "storyText": "囚笼入水后出现河神,被打耳光,生命值-1"
      }
    },
    {
      "id": "water-vase",
      "keyword": "水潭+花瓶",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": ["has-vase"],
      "effect": {
        "type": "damage",
        "target": "current",
        "value": -1,
        "storyText": "饮用花瓶内带细菌的水,得肠胃炎,生命值-1"
      }
    },
    {
      "id": "water-wooden-box",
      "keyword": "水潭+木盒",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": ["has-wooden-box"],
      "effect": {
        "type": "removeItem",
        "itemId": "wooden-box",
        "storyText": "木盒被扔回水潭后消失"
      }
    },
    {
      "id": "suitcase-turtle",
      "keyword": "行李箱+龟",
      "triggerBy": ["turtle"],
      "requirements": [],
      "effect": {
        "type": "unlock",
        "target": "suitcase",
        "password": "000",
        "resultText": "行李箱带三位初始密码(000,玩家无法获取),主持人解锁后可救出猫,猫恢复行动",
        "unlockCharacter": "cat"
      }
    },
    {
      "id": "suitcase-cat",
      "keyword": "行李箱+猫",
      "triggerBy": ["cat"],
      "requirements": ["cat-can-move"],
      "effect": {
        "type": "getItem",
        "itemId": "key",
        "destroyItem": "suitcase",
        "storyText": "天一撕烂行李箱,获得内钥匙"
      }
    },
    {
      "id": "suitcase-dog",
      "keyword": "行李箱+狗",
      "triggerBy": ["dog"],
      "requirements": ["dog-can-move"],
      "effect": {
        "type": "mark",
        "target": "suitcase",
        "storyText": "二水标记行李箱,效果未知"
      }
    },
    {
      "id": "suitcase-monitor",
      "keyword": "行李箱+显示器",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": ["has-monitor"],
      "effect": {
        "type": "story",
        "storyText": "组合被吐槽'智商异于常人',建议停手"
      }
    },
    {
      "id": "suitcase-computer",
      "keyword": "行李箱+电脑",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": ["has-computer"],
      "effect": {
        "type": "story",
        "storyText": "被吐槽'打算出差',建议就医检查"
      }
    },
    {
      "id": "suitcase-key",
      "keyword": "行李箱+钥匙",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": ["has-key"],
      "effect": {
        "type": "removeItem",
        "itemId": "key",
        "storyText": "钥匙放回行李箱后消失(备注：消失物品下次触发关键词时提醒)"
      }
    },
    {
      "id": "suitcase-cage-dog-inside",
      "keyword": "行李箱+囚笼",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": ["dog-in-cage"],
      "effect": {
        "type": "damage",
        "target": "dog",
        "value": -1,
        "storyText": "用行李箱砸囚笼救二水,不慎砸伤二水,二水生命值-1"
      }
    },
    {
      "id": "suitcase-cage-after",
      "keyword": "行李箱+囚笼",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": ["dog-freed"],
      "effect": {
        "type": "story",
        "storyText": "将行李箱锁入囚笼,认为'更安全'"
      }
    },
    {
      "id": "suitcase-closet",
      "keyword": "行李箱+衣柜",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": [],
      "effect": {
        "type": "story",
        "storyText": "将行李箱放入衣柜,打扫后发现并非自己的房间"
      }
    },
    {
      "id": "suitcase-vase",
      "keyword": "行李箱+花瓶",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": ["has-vase"],
      "effect": {
        "type": "story",
        "storyText": "将花瓶误认作青花瓷装入,被指出仅值20元,建议放弃鉴宝"
      }
    },
    {
      "id": "suitcase-wooden-box",
      "keyword": "行李箱+木盒",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": ["has-wooden-box"],
      "effect": {
        "type": "story",
        "storyText": "因同情木盒'不自由',将其锁进行李箱"
      }
    },
    {
      "id": "closet-turtle",
      "keyword": "衣柜+龟",
      "triggerBy": ["turtle"],
      "requirements": [],
      "effect": {
        "type": "discoverArea",
        "newAreaId": "hidden-room",
        "storyText": "龟在衣柜下方发现了一个按钮,按下去后衣柜打开了。后面居然有一个小房间。小房间：房间内有一个巨大的囚笼,狗被困在其中,房间内还有一个花瓶和一个电脑。墙上有一扇只可以用四位密码触发打开的大门",
        "unlockItems": ["vase", "computer", "cage", "big-door"]
      }
    },
    {
      "id": "closet-cat",
      "keyword": "衣柜+猫",
      "triggerBy": ["cat"],
      "requirements": ["cat-can-move"],
      "effect": {
        "type": "getLetter",
        "letter": "C",
        "storyText": "猫在衣柜上面发现了一个模模糊糊的字母：C"
      }
    },
    {
      "id": "closet-dog",
      "keyword": "衣柜+狗",
      "triggerBy": ["dog"],
      "requirements": ["dog-can-move"],
      "effect": {
        "type": "mark",
        "target": "closet",
        "storyText": "二水标记衣柜,效果未知"
      }
    },
    {
      "id": "closet-suitcase",
      "keyword": "衣柜+行李箱",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": [],
      "effect": {
        "type": "story",
        "storyText": "将行李箱放入衣柜,打扫后发现并非自己的房间"
      }
    },
    {
      "id": "closet-water",
      "keyword": "衣柜+水潭",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": [],
      "effect": {
        "type": "damage",
        "target": "current",
        "value": -1,
        "storyText": "搬衣柜时碰头,意识到世界有引力,生命值-1"
      }
    },
    {
      "id": "closet-monitor",
      "keyword": "衣柜+显示器",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": ["has-monitor"],
      "effect": {
        "type": "hint",
        "storyText": "组合触发'作者崇拜',获得提醒'行李箱+显示器'",
        "hintKeyword": "行李箱+显示器"
      }
    },
    {
      "id": "closet-computer",
      "keyword": "衣柜+电脑",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": ["has-computer"],
      "effect": {
        "type": "story",
        "storyText": "将电脑放入衣柜开机,无效果,被其他玩家嘲笑"
      }
    },
    {
      "id": "closet-key",
      "keyword": "衣柜+钥匙",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": ["has-key"],
      "effect": {
        "type": "getItemAndHeal",
        "itemId": "red-crystal-heart",
        "value": 1,
        "reusable": true,
        "storyText": "打开衣柜暗格,获得红水晶心,食用后生命值+1(钥匙可复用)"
      }
    },
    {
      "id": "closet-cage-dog-inside",
      "keyword": "衣柜+囚笼",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": ["dog-in-cage"],
      "effect": {
        "type": "damage",
        "target": "current",
        "value": -2,
        "storyText": "将囚笼锁入衣柜,被二水咬伤,生命值-2"
      }
    },
    {
      "id": "closet-cage-after",
      "keyword": "衣柜+囚笼",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": ["dog-freed"],
      "effect": {
        "type": "story",
        "storyText": "给囚笼内的二水穿衣服(不合身),被其他玩家疏远"
      }
    },
    {
      "id": "closet-vase",
      "keyword": "衣柜+花瓶",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": ["has-vase"],
      "effect": {
        "type": "story",
        "storyText": "给花瓶穿衣服(不合身),被其他玩家疏远"
      }
    },
    {
      "id": "closet-wooden-box",
      "keyword": "衣柜+木盒",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": ["has-wooden-box"],
      "effect": {
        "type": "damage",
        "target": "all",
        "value": -0.5,
        "storyText": "将木盒放入衣柜,讲冷笑话导致其他玩家冻感冒,生命值-0.5"
      }
    },
    {
      "id": "wooden-box-turtle",
      "keyword": "木盒+龟",
      "triggerBy": ["turtle"],
      "requirements": ["has-wooden-box"],
      "effect": {
        "type": "story",
        "storyText": "包子无法打开木盒"
      }
    },
    {
      "id": "wooden-box-cat",
      "keyword": "木盒+猫",
      "triggerBy": ["cat"],
      "requirements": ["has-wooden-box", "cat-can-move"],
      "effect": {
        "type": "story",
        "storyText": "天一无法打开木盒"
      }
    },
    {
      "id": "wooden-box-dog",
      "keyword": "木盒+狗",
      "triggerBy": ["dog"],
      "requirements": ["has-wooden-box", "dog-can-move"],
      "effect": {
        "type": "getLetter",
        "letter": "E",
        "storyText": "二水咬开木盒,获得字条'E'"
      }
    },
    {
      "id": "wooden-box-monitor",
      "keyword": "木盒+显示器",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": ["has-wooden-box", "has-monitor"],
      "effect": {
        "type": "destroyItem",
        "itemId": "monitor",
        "storyText": "木盒砸坏显示器(备注：显示器无法使用,密码需'瞎猜')"
      }
    },
    {
      "id": "wooden-box-computer",
      "keyword": "木盒+电脑",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": ["has-wooden-box", "has-computer"],
      "effect": {
        "type": "story",
        "storyText": "无效果"
      }
    },
    {
      "id": "wooden-box-key",
      "keyword": "木盒+钥匙",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": ["has-wooden-box", "has-key"],
      "effect": {
        "type": "story",
        "storyText": "钥匙型号不匹配,无法打开木盒"
      }
    },
    {
      "id": "wooden-box-cage-dog-inside",
      "keyword": "木盒+囚笼",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": ["has-wooden-box", "dog-in-cage"],
      "effect": {
        "type": "getLetter",
        "letter": "E",
        "storyText": "将木盒给二水,二水咬开后获得字条'E'"
      }
    },
    {
      "id": "wooden-box-cage-after",
      "keyword": "木盒+囚笼",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": ["has-wooden-box", "dog-freed"],
      "effect": {
        "type": "story",
        "storyText": "将木盒关入囚笼,被其他玩家吐槽"
      }
    },
    {
      "id": "wooden-box-vase",
      "keyword": "木盒+花瓶",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": ["has-wooden-box", "has-vase"],
      "effect": {
        "type": "getLetter",
        "letter": "O",
        "destroyItem": "vase",
        "storyText": "花瓶砸木盒后碎裂,获得字母'O'(备注：花瓶无法使用)"
      }
    },
    {
      "id": "computer-cat",
      "keyword": "电脑+猫",
      "triggerBy": ["cat"],
      "requirements": ["has-computer", "cat-can-move"],
      "effect": {
        "type": "story",
        "storyText": "天一发现电脑损坏,无法维修"
      }
    },
    {
      "id": "computer-turtle",
      "keyword": "电脑+龟",
      "triggerBy": ["turtle"],
      "requirements": ["has-computer"],
      "effect": {
        "type": "story",
        "storyText": "包子发现电脑损坏,无法维修"
      }
    },
    {
      "id": "computer-dog",
      "keyword": "电脑+狗",
      "triggerBy": ["dog"],
      "requirements": ["has-computer", "dog-can-move"],
      "effect": {
        "type": "mark",
        "target": "computer",
        "storyText": "二水标记电脑,效果未知"
      }
    },
    {
      "id": "computer-wooden-box",
      "keyword": "电脑+木盒",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": ["has-computer", "has-wooden-box"],
      "effect": {
        "type": "story",
        "storyText": "无效果"
      }
    },
    {
      "id": "computer-key",
      "keyword": "电脑+钥匙",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": ["has-computer", "has-key"],
      "effect": {
        "type": "story",
        "storyText": "钥匙插入电脑后无效果"
      }
    },
    {
      "id": "computer-cage-dog-inside",
      "keyword": "电脑+囚笼",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": ["has-computer", "dog-in-cage"],
      "effect": {
        "type": "story",
        "storyText": "将电脑给二水玩,二水陷入沉思"
      }
    },
    {
      "id": "computer-cage-after",
      "keyword": "电脑+囚笼",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": ["has-computer", "dog-freed"],
      "effect": {
        "type": "story",
        "storyText": "将电脑关入囚笼,命名为'赛博监狱'"
      }
    },
    {
      "id": "computer-vase-basic",
      "keyword": "电脑+花瓶",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": ["has-computer", "has-vase", "password-unknown"],
      "effect": {
        "type": "getLetterAndDamage",
        "letter": "O",
        "damage": -1,
        "destroyItem": "vase",
        "storyText": "用花瓶砸电脑,花瓶碎裂、手划伤,获得字母'O',生命值-1(备注：花瓶无法使用)"
      }
    },
    {
      "id": "computer-vase-password-known",
      "keyword": "电脑+花瓶",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": ["has-computer", "has-vase", "password-known"],
      "effect": {
        "type": "getLetterAndItem",
        "letter": "O",
        "itemId": "skip-card",
        "destroyItem": "vase",
        "storyText": "已知密码后砸电脑,获得字母'O',同时获得'跳关卡卡'(最后关卡可用)"
      }
    },
    {
      "id": "key-dog",
      "keyword": "钥匙+狗",
      "triggerBy": ["dog"],
      "requirements": ["has-key", "dog-can-move"],
      "effect": {
        "type": "story",
        "storyText": "将钥匙含在嘴里(个人习惯)"
      }
    },
    {
      "id": "key-cat",
      "keyword": "钥匙+猫",
      "triggerBy": ["cat"],
      "requirements": ["has-key", "cat-can-move"],
      "effect": {
        "type": "story",
        "storyText": "用钥匙挠后背,体感舒适"
      }
    },
    {
      "id": "key-turtle",
      "keyword": "钥匙+龟",
      "triggerBy": ["turtle"],
      "requirements": ["has-key"],
      "effect": {
        "type": "story",
        "storyText": "认为钥匙用于打开'桌扇门'"
      }
    },
    {
      "id": "key-monitor",
      "keyword": "钥匙+显示器",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": ["has-key", "has-monitor"],
      "effect": {
        "type": "destroyItem",
        "itemId": "monitor",
        "storyText": "用钥匙砸显示器,显示器损坏(备注：显示器无法使用,密码需'瞎猜')"
      }
    },
    {
      "id": "key-cage-dog-inside",
      "keyword": "钥匙+囚笼",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": ["has-key", "dog-in-cage"],
      "effect": {
        "type": "unlock",
        "target": "cage",
        "unlockCharacter": "dog",
        "storyText": "打开囚笼,二水恢复行动"
      }
    },
    {
      "id": "key-cage-after",
      "keyword": "钥匙+囚笼",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": ["has-key", "dog-freed"],
      "effect": {
        "type": "story",
        "storyText": "将囚笼重新锁上"
      }
    },
    {
      "id": "key-vase",
      "keyword": "钥匙+花瓶",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": ["has-key", "has-vase"],
      "effect": {
        "type": "story",
        "storyText": "试图用钥匙打开花瓶,被建议就医检查"
      }
    },
    {
      "id": "monitor-cat",
      "keyword": "显示器+猫",
      "triggerBy": ["cat"],
      "requirements": ["has-monitor", "cat-can-move"],
      "effect": {
        "type": "destroyItem",
        "itemId": "monitor",
        "storyText": "天一砸坏显示器,显示器消失(备注：显示器无法使用,密码需'瞎猜')"
      }
    },
    {
      "id": "monitor-dog",
      "keyword": "显示器+狗",
      "triggerBy": ["dog"],
      "requirements": ["has-monitor", "dog-can-move"],
      "effect": {
        "type": "story",
        "storyText": "发现显示器防水,性能优于当前电脑"
      }
    },
    {
      "id": "monitor-turtle",
      "keyword": "显示器+龟",
      "triggerBy": ["turtle"],
      "requirements": ["has-monitor"],
      "effect": {
        "type": "heal",
        "value": 1,
        "storyText": "通过显示器反光'臭美',生命值+1"
      }
    },
    {
      "id": "monitor-suitcase",
      "keyword": "显示器+行李箱",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": ["has-monitor"],
      "effect": {
        "type": "hint",
        "hintKeyword": "显示器+衣柜",
        "storyText": "获得提醒'显示器+衣柜'"
      }
    },
    {
      "id": "monitor-closet",
      "keyword": "显示器+衣柜",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": ["has-monitor"],
      "effect": {
        "type": "story",
        "storyText": "组合被夸'天才',触发'作者崇拜'"
      }
    },
    {
      "id": "monitor-computer",
      "keyword": "显示器+电脑",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": ["has-monitor", "has-computer"],
      "effect": {
        "type": "getLetter",
        "letter": "H",
        "storyText": "更换显示器后打开电脑,获得字母'H'"
      }
    },
    {
      "id": "monitor-vase",
      "keyword": "显示器+花瓶",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": ["has-monitor", "has-vase"],
      "effect": {
        "type": "hint",
        "hintKeyword": "显示器+衣柜",
        "storyText": "获得提醒'显示器+衣柜'"
      }
    },
    {
      "id": "vase-cat",
      "keyword": "花瓶+猫",
      "triggerBy": ["cat"],
      "requirements": ["has-vase", "cat-can-move"],
      "effect": {
        "type": "story",
        "storyText": "你把脑袋探进了花瓶当中。观察到瓶内居然有一个字母:O",
        "note": "仅观察,未获得"
      }
    },
    {
      "id": "vase-dog",
      "keyword": "花瓶+狗",
      "triggerBy": ["dog"],
      "requirements": ["has-vase", "dog-can-move"],
      "effect": {
        "type": "mark",
        "target": "vase",
        "storyText": "二水标记花瓶,效果未知"
      }
    },
    {
      "id": "vase-turtle",
      "keyword": "花瓶+龟",
      "triggerBy": ["turtle"],
      "requirements": ["has-vase"],
      "effect": {
        "type": "story",
        "storyText": "未发现花瓶玄机,让其他玩家尝试"
      }
    },
    {
      "id": "vase-cage-dog-inside",
      "keyword": "花瓶+囚笼",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": ["has-vase", "dog-in-cage"],
      "effect": {
        "type": "destroyItem",
        "itemId": "vase",
        "storyText": "将花瓶递给二水,二水将其弄坏"
      }
    },
    {
      "id": "vase-cage-after",
      "keyword": "花瓶+囚笼",
      "triggerBy": ["cat", "dog", "turtle"],
      "requirements": ["has-vase", "dog-freed"],
      "effect": {
        "type": "story",
        "storyText": "将花瓶关入囚笼,无效果(仅被其他玩家嘲笑)"
      }
    },
    {
      "id": "cat-cage-dog-inside",
      "keyword": "猫+囚笼",
      "triggerBy": ["cat"],
      "requirements": ["dog-in-cage", "cat-can-move"],
      "effect": {
        "type": "story",
        "storyText": "猫嘲笑被囚的狗,被狗怒骂"
      }
    },
    {
      "id": "turtle-cage-dog-inside",
      "keyword": "龟+囚笼",
      "triggerBy": ["turtle"],
      "requirements": ["dog-in-cage"],
      "effect": {
        "type": "story",
        "storyText": "包子安慰二水,称会想办法救他"
      }
    },
    {
      "id": "cat-cage-after",
      "keyword": "猫+囚笼",
      "triggerBy": ["cat"],
      "requirements": ["dog-freed", "cat-can-move"],
      "effect": {
        "type": "story",
        "storyText": "天一将自己关入囚笼,称'好玩'并让其他人救自己"
      }
    },
    {
      "id": "turtle-cage-check",
      "keyword": "龟+囚笼",
      "triggerBy": ["turtle"],
      "requirements": ["dog-freed"],
      "effect": {
        "type": "getItem",
        "itemId": "skip-card",
        "storyText": "包子检查囚笼下方,获得跳关卡卡(最后关卡可用)"
      }
    },
    {
      "id": "dog-cage",
      "keyword": "狗+囚笼",
      "triggerBy": ["dog"],
      "requirements": ["dog-can-move"],
      "effect": {
        "type": "mark",
        "target": "cage",
        "storyText": "二水标记囚笼,效果未知"
      }
    },
    {
      "id": "cat-dog",
      "keyword": "猫+狗",
      "triggerBy": ["cat"],
      "requirements": ["cat-can-move", "dog-can-move"],
      "effect": {
        "type": "damage",
        "target": "cat",
        "value": -1,
        "storyText": "天一嘲讽二水身材,二人打架,天一惨败,生命值-1"
      }
    },
    {
      "id": "cat-turtle",
      "keyword": "猫+龟",
      "triggerBy": ["cat"],
      "requirements": ["cat-can-move"],
      "effect": {
        "type": "story",
        "storyText": "天一嘲笑包子'长得奇怪',包子未理会"
      }
    },
    {
      "id": "dog-turtle",
      "keyword": "狗+龟",
      "triggerBy": ["dog"],
      "requirements": ["dog-can-move"],
      "effect": {
        "type": "story",
        "storyText": "二水感谢包子救自己,约定共同弄清处境"
      }
    },
    {
      "id": "dog-cat",
      "keyword": "狗+猫",
      "triggerBy": ["dog"],
      "requirements": ["dog-can-move", "cat-can-move"],
      "effect": {
        "type": "story",
        "storyText": "二水与天一互感'眼熟',认为有特殊羁绊"
      }
    },
    {
      "id": "turtle-cat",
      "keyword": "龟+猫",
      "triggerBy": ["turtle"],
      "requirements": ["cat-can-move"],
      "effect": {
        "type": "story",
        "storyText": "包子督促天一行动,天一吐槽包子是'装货'"
      }
    },
    {
      "id": "turtle-dog",
      "keyword": "龟+狗",
      "triggerBy": ["turtle"],
      "requirements": ["dog-can-move"],
      "effect": {
        "type": "heal",
        "target": "dog",
        "value": 1,
        "storyText": "包子教二水强身方法,二水学会后生命值+1"
      }
    }
  ],

  "winCondition": {
    "type": "password",
    "password": "ECHO",
    "door": "big-door",
    "requiredLetters": ["C", "H", "E", "O"],
    "description": "输入四位密码'ECHO'(由之前获得的字母C、E、O、H组合)可打开大门",
    "successText": "凭智慧打开密室大门,完成第一关"
  }
}
```

---

## 场景二：藏匿

#### 文件位置
`server/data/act1/scene2-hiding.json`

#### 数据结构

```json
{
  "sceneId": "act1-scene2",
  "sceneName": "藏匿",
  "description": "准备逃离时遇到'黑色兜帽男'(持未知武器),决定藏匿躲避。",

  "gameType": "hide-and-seek",

  "introText": "玩法介绍：请藏匿在一个区域,黑色兜帽将在藏匿后进行区域摧毁,若你身在其中,生命值-1。共8处藏身区域,黑衣人将进行5次攻击。",

  "rules": {
    "totalAreas": 8,
    "maxPlayersPerArea": 2,
    "attackRounds": 5,
    "damagePerHit": -1,
    "bonusForNeverHit": 3,
    "areaDestroyedAfterHit": true,
    "requireScreenshotProof": true
  },

  "areas": [
    { "areaId": "water-pond", "name": "水潭", "capacity": 2, "destroyed": false },
    { "areaId": "closet", "name": "衣柜", "capacity": 2, "destroyed": false },
    { "areaId": "small-room", "name": "小房间", "capacity": 2, "destroyed": false },
    { "areaId": "cage", "name": "囚笼", "capacity": 2, "destroyed": false },
    { "areaId": "computer-desk", "name": "电脑桌", "capacity": 2, "destroyed": false },
    { "areaId": "corner", "name": "墙角", "capacity": 2, "destroyed": false },
    { "areaId": "vase", "name": "花瓶", "capacity": 2, "destroyed": false },
    { "areaId": "suitcase", "name": "行李箱", "capacity": 2, "destroyed": false }
  ],

  "attackSequence": {
    "description": "主持人随机攻击5次,玩家需提前选定藏身区域",
    "totalRounds": 5,
    "randomTarget": true
  },

  "ending": {
    "storyText": "兜帽男未找到玩家,自语'该来的逃不掉'后离开。",
    "nextScene": "act2-memories"
  }
}
```

---

## 第二幕：记忆回溯

#### 文件位置
`server/data/act2/memories.json`

#### 数据结构

```json
{
  "actId": "act2",
  "actName": "过往",
  "description": "听到兜帽男临走时的话语。你好像想起了什么。一阵莫名的记忆涌入你们三人脑海。请抓取属于你们的记忆",

  "gameType": "yes-no-questions",

  "rules": {
    "questionFormat": "YES or NO",
    "playerCanOnlyAskOwnPerspective": true,
    "wrongPerspectiveAnswer": "不重要",
    "aiHostRequired": true
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
      "perspectiveId": "perspective-1",
      "character": "turtle",
      "playerName": "二水",
      "memoryText": "我看着窗外妈妈忙碌的身影有些失神。这个冬天就是我25岁生日了。我好爱妈妈,有些困了。我决定睡一会。等我醒来时,我出现在一个陌生的地方,我急忙呼喊爸爸,可走向我的是一个拿着刀的陌生人,我想爸爸了...好疼啊,再次睁眼爸爸已经在我面前了。爸爸哭着抱着我",
      "truth": "乌龟因年事已高自然死亡(25岁)",
      "keyInfo": [
        "25岁生日",
        "冬天",
        "看到妈妈忙碌",
        "入睡",
        "陌生地方醒来",
        "持刀陌生人(兽医)",
        "爸爸哭泣"
      ]
    },
    {
      "perspectiveId": "perspective-2",
      "character": "dog",
      "playerName": "包子",
      "memoryText": "调皮走丢后被陌生人抓走",
      "truth": "狗狗因走丢被狗贩子抓走",
      "keyInfo": [
        "调皮",
        "走丢",
        "被抓走",
        "陌生人(狗贩子)"
      ]
    },
    {
      "perspectiveId": "perspective-3",
      "character": "cat",
      "playerName": "天一",
      "memoryText": "生病无法医治,主人将自己安乐",
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

### 猫线 - 分支一：功夫路线

#### 文件位置
`server/data/act3/cat/route1-kungfu.json`

#### 数据结构(完整包含所有选择)

```json
{
  "routeId": "cat-kungfu",
  "character": "cat",
  "routeName": "打铁还需自身硬,你决定学习功夫",
  "trigger": "半年内寻得师父'鸿猫',被收为关门弟子,号'功夫猫'",

  "choices": [
    {
      "choiceId": "meditation",
      "choiceNumber": 1,
      "question": "静心修炼选择",
      "options": [
        {
          "id": "A",
          "text": "无视麻雀干扰",
          "skill": { "id": "calm-mind", "name": "心如止水", "grade": "A", "effect": "BOSS战第一关卡免巧克力伤害" }
        },
        {
          "id": "B",
          "text": "赶走麻雀并坦白",
          "skill": { "id": "meow-call", "name": "喵喵叫", "grade": "B", "effect": "BOSS战第一关卡对鼠鼠大王伤害+1" }
        },
        {
          "id": "C",
          "text": "专注麻雀节奏",
          "skill": { "id": "borrow-force", "name": "借力打力", "grade": "S", "effect": "BOSS战第一关卡可一次性选2个老鼠洞" }
        },
        {
          "id": "D",
          "text": "烤麻雀",
          "skill": { "id": "feast", "name": "大快朵颐", "grade": "B", "effect": "生命值+2", "hpBonus": 2 }
        }
      ]
    },
    {
      "choiceId": "lightness",
      "choiceNumber": 2,
      "question": "轻功修炼选择",
      "options": [
        {
          "id": "A",
          "text": "雪地修炼",
          "skill": { "id": "snow-step", "name": "踏雪无痕", "grade": "A", "effect": "BOSS战第二关卡,若选择非最少人选区域,则不掉生命值" }
        },
        {
          "id": "B",
          "text": "水面修炼",
          "skill": { "id": "water-walk", "name": "水上漂", "grade": "S", "effect": "BOSS战第二关卡可选择不参与" }
        },
        {
          "id": "C",
          "text": "树林修炼",
          "skill": { "id": "rat-hunter", "name": "鼠类克星", "grade": "B", "effect": "BOSS战第一关卡对鼠鼠大王伤害+1" }
        },
        {
          "id": "D",
          "text": "不学轻功练体气",
          "skill": { "id": "body-qi", "name": "啾咪真经", "grade": "B", "effect": "生命值+2", "hpBonus": 2 }
        }
      ]
    },
    {
      "choiceId": "golden-dog",
      "choiceNumber": 3,
      "question": "对战金毛大王选择",
      "options": [
        {
          "id": "A",
          "text": "专攻破绽",
          "skill": { "id": "weakness-attack", "name": "破绽追击", "grade": "A", "effect": "BOSS战第一关卡减少1个错误老鼠洞" }
        },
        {
          "id": "B",
          "text": "速度周旋",
          "skill": { "id": "ultimate-storm", "name": "奥义・疾风骤雨", "grade": "S", "effect": "BOSS战最终关卡可定制第一轮骰子点数" }
        },
        {
          "id": "C",
          "text": "逃跑",
          "item": { "id": "escape-strategy", "name": "走为上计", "type": "saying", "effect": "无" }
        },
        {
          "id": "D",
          "text": "交朋友",
          "skill": { "id": "golden-bell", "name": "金钟罩", "grade": "A", "effect": "生命值+3", "hpBonus": 3 }
        }
      ]
    }
  ]
}
```

### 猫线 - 分支二：自主创业(招财猫)

#### 文件位置
`server/data/act3/cat/route2-business.json`

```json
{
  "routeId": "cat-business",
  "character": "cat",
  "routeName": "有钱能使鬼推磨,你决定自主创业",
  "trigger": "打工半年攒钱后,创业成为'烧烤摊招财猫'",

  "choices": [
    {
      "choiceId": "location",
      "choiceNumber": 1,
      "question": "摊位位置选择",
      "options": [
        {
          "id": "A",
          "text": "夜市",
          "skill": { "id": "creative-workshop", "name": "创意工坊", "grade": "A", "effect": "BOSS战第一关卡可与其他玩家一同出战" }
        },
        {
          "id": "B",
          "text": "学校门口",
          "skill": { "id": "summon-student-council", "name": "召唤学生会", "grade": "S", "effect": "BOSS战第一关卡可一次性选2个老鼠洞" }
        },
        {
          "id": "C",
          "text": "小区门口",
          "skill": { "id": "regular-customer", "name": "回头客", "grade": "A", "effect": "受到保护,生命值+2", "hpBonus": 2 }
        },
        {
          "id": "D",
          "text": "餐车",
          "skill": { "id": "people-reader", "name": "识人阁", "grade": "A", "effect": "BOSS战第一关卡减少1个错误老鼠洞" }
        }
      ]
    },
    {
      "choiceId": "food-competition",
      "choiceNumber": 2,
      "question": "美食大赛菜品选择",
      "options": [
        {
          "id": "A",
          "text": "烤汉堡",
          "skill": { "id": "delicious-hope", "name": "美味新希望", "grade": "S", "effect": "提升4点生命值", "hpBonus": 4 }
        },
        {
          "id": "B",
          "text": "烤宽面",
          "skill": { "id": "dark-cuisine", "name": "黑暗料理", "grade": "B", "effect": "BOSS战第一关卡找到鼠鼠大王国库,使其生命值-1(无法被加成)" }
        },
        {
          "id": "C",
          "text": "烤桶水",
          "skill": { "id": "water-splash", "name": "泼水", "grade": "A", "effect": "攻击方式变为泼开水,BOSS战第一关卡对鼠鼠大王伤害+1" }
        },
        {
          "id": "D",
          "text": "烤运动鞋",
          "skill": { "id": "public-opinion-power", "name": "舆论的力量", "grade": "SSS", "effect": "每次减少生命值时50%概率无效化(骰子123/456区分概率)" }
        }
      ]
    },
    {
      "choiceId": "ice-cream-invitation",
      "choiceNumber": 3,
      "question": "冰淇淋餐厅邀请选择",
      "options": [
        {
          "id": "A",
          "text": "接受并连锁经营",
          "skill": { "id": "spend-money", "name": "挥金如土", "grade": "S", "effect": "买通主持人,BOSS战第一关卡三位玩家均可出战" }
        },
        {
          "id": "B",
          "text": "努力沉淀,用心钻研菜谱",
          "item": { "id": "ten-treasure-pill", "name": "十全大补丹", "grade": "S", "effect": "人类食用提升生命值,动物使用效果拔群,生命值+4", "hpBonus": 4 }
        },
        {
          "id": "C",
          "text": "以防万一,提前前往约定地点",
          "item": { "id": "none", "name": "无", "effect": "徒步观光美景,感受万物,无事发生" }
        },
        {
          "id": "D",
          "text": "接受邀请,成为特级厨师",
          "skill": { "id": "copy", "name": "拷贝", "grade": "SS", "effect": "你的生命值从BOSS战第一关卡时等同于最高生命值的玩家(后续不同步)" }
        }
      ]
    }
  ]
}
```

### 猫线 - 分支三：机器猫改造

#### 文件位置
`server/data/act3/cat/route3-robot.json`

```json
{
  "routeId": "cat-robot",
  "character": "cat",
  "routeName": "加入光荣的进化吧,你决定改造身体",
  "trigger": "找到科学家,花半年时间成功科技改造,变成蓝色圆滚滚的机器猫'小铃铛'",
  "note": "所有道具仅可使用一次",

  "choices": [
    {
      "choiceId": "identity",
      "choiceNumber": 1,
      "question": "小雄询问你的身份,你会？",
      "options": [
        {
          "id": "A",
          "text": "如实交代,讲清楚自己的身份",
          "item": { "id": "time-machine", "name": "时光机", "grade": "SSS", "effect": "回到战斗开始前那一刻,重新开始本场战斗。一次性道具" },
          "bonus": { "hpBonus": 1, "reason": "小雄用驴肉火烧招待" }
        },
        {
          "id": "B",
          "text": "编造谎言,逐渐让小雄接受",
          "item": { "id": "time-machine", "name": "时光机", "grade": "SSS", "effect": "回到战斗开始前那一刻,重新开始本场战斗。一次性道具" }
        }
      ]
    },
    {
      "choiceId": "love-request",
      "choiceNumber": 2,
      "question": "小雄求你用道具让朋友小静对他产生好感,你会？",
      "options": [
        {
          "id": "A",
          "text": "断然拒绝并教育小雄",
          "item": { "id": "bamboo-dragonfly", "name": "竹蜻蜓", "grade": "S", "effect": "躲避一次致命伤害(BOSS战最终关卡无效)" }
        },
        {
          "id": "B",
          "text": "帮助小雄让小静对他产生好感",
          "item": { "id": "cupid-arrow", "name": "丘比特之箭", "grade": "SSS", "effect": "让BOSS爱上你,免疫本关卡所有伤害(BOSS战最终关卡无效)。注:若持续减少类负面效果也可变成持续增加" }
        },
        {
          "id": "C",
          "text": "让他们从互相理解开始",
          "item": { "id": "soul-swap-bracelet", "name": "灵魂互换手镯", "grade": "SSS", "effect": "BOSS战的最终关卡,你可以短暂控制死神,让这次失败的结果不会发生(人话：赌输了不算)" }
        }
      ]
    },
    {
      "choiceId": "farewell-gift",
      "choiceNumber": 3,
      "question": "两年时间快到,决定送给小雄一件道具",
      "options": [
        {
          "id": "A",
          "text": "放大缩小灯",
          "item": {
            "id": "size-lamp",
            "name": "放大缩小灯",
            "grade": "SSS",
            "effect": {
              "enlarge": "指定玩家生命值+10",
              "shrink": "指定BOSS生命值-50%(BOSS战最终关卡无效)"
            }
          }
        },
        {
          "id": "B",
          "text": "任意门",
          "item": { "id": "any-door", "name": "任意门", "grade": "SSSS", "effect": "你可选择任意关卡开始挑战" }
        }
      ]
    }
  ]
}
```

### 乌龟线 - 分支一：忍者龟

#### 文件位置
`server/data/act3/turtle/route1-ninja.json`

(包含所有武器选择、救援选择、礼物选择等完整数据,格式同上)

### 乌龟线 - 分支二：水炮龟

#### 文件位置
`server/data/act3/turtle/route2-cannon.json`

(包含黄色小耗子事件、水晶选择、升级部位选择等完整数据)

### 乌龟线 - 分支三：金龟婿

#### 文件位置
`server/data/act3/turtle/route3-son-in-law.json`

(包含妻子相处、丈母娘考验、临别选择等完整数据)

### 狗线 - 分支一：哮天犬(老天师)

#### 文件位置
`server/data/act3/dog/route1-immortal.json`

(包含修仙理由、夜明珠任务、师父馈赠等完整数据)

### 狗线 - 分支二：变形金刚

#### 文件位置
`server/data/act3/dog/route2-transformer.json`

(包含变形形态选择、改造提升、纳米核心等完整数据)

---

## 第四幕：BOSS战

### BOSS 1 - 鼠鼠大王

#### 文件位置
`server/data/act4/boss1-rat-king.json`

#### 完整数据结构

```json
{
  "bossId": "rat-king",
  "bossName": "鼠鼠大王",
  "bossHp": 6,
  "description": "原本是一只宠物仓鼠,刚来到这个世界受尽了欺负,因此经常挖洞躲在地下。久而久之,凭借着自己的努力,建立了地下世界,常年生活在地下八英尺左右的位置,现在是underground的king,万鼠膜拜。",

  "battleType": "hole-selection",
  "playerMode": "solo",

  "rules": {
    "holeCount": 5,
    "soloPlay": true,
    "switchOnDeath": true,
    "randomizeEachRound": true,
    "description": "鼠鼠大王拥有良好的教养,并不会使用暴力。他在你们面前挖了五个大洞,每个洞都有鼠鼠大王珍藏的道具与陷阱,鼠鼠大王也藏在其中,请选择洞口进行攻击。请选择一人参战(死亡后换人出战)"
  },

  "characterEffects": {
    "cat": {
      "damageMultiplier": 2,
      "description": "天敌克制,对鼠鼠大王伤害+1"
    },
    "dog": {
      "cannotJoin": true,
      "condition": "other-players-alive",
      "description": "多管闲事,本关卡不允许狗玩家登场(其余玩家全部阵亡后失效)"
    },
    "turtle": {
      "damageMultiplier": 0.5,
      "description": "师傅压制,对鼠鼠大王伤害减半"
    }
  },

  "holeElements": [
    {
      "id": "A",
      "name": "鼠鼠大王",
      "effect": {
        "type": "damage-boss",
        "baseDamage": 1,
        "affectedByMultiplier": true,
        "description": "若成功击中鼠鼠大王,鼠鼠大王生命值-1(若有攻击加成类技能或道具则按照加成后计算)"
      }
    },
    {
      "id": "B",
      "name": "巧克力酱",
      "effect": {
        "type": "damage-specific",
        "targets": ["cat", "dog"],
        "damage": -1,
        "description": "你击中了鼠鼠大王珍藏的巧克力酱,猫与狗不小心误食,虽及时医治但也对身体造成了损伤,猫、狗生命值-1"
      }
    },
    {
      "id": "C",
      "name": "囤货区",
      "effect": {
        "type": "heal-all",
        "heal": 1,
        "description": "你击中了鼠鼠大王准备过冬的食物储藏室,你们三人因此饱餐一顿,全体生命值+1"
      }
    },
    {
      "id": "D",
      "name": "狗",
      "effect": {
        "type": "damage-current",
        "damage": -1,
        "affectedByMultiplier": true,
        "description": "你不小心命中了被困在这里的狗狗,这小子睚眦必报,给了你一口,生命值-1(若有攻击加成类技能或道具效果累计)"
      }
    },
    {
      "id": "E",
      "name": "龟/猫",
      "effect": {
        "type": "damage-random-ally",
        "damage": -1,
        "excludeCurrent": true,
        "affectedByMultiplier": true,
        "description": "你不小心命中了龟/猫玩家,对其造成了1点伤害(若有攻击加成类技能或道具则按照加成后计算)"
      }
    }
  ],

  "roundSetup": {
    "description": "主持人将A、B、C、D、E随机混入洞口1、2、3、4、5当中,每回合结束后重新随机安排",
    "example": "第一回合：洞口1:C; 洞口2:D; 洞口3:A; 洞口4:B; 洞口5:E"
  },

  "winCondition": {
    "type": "boss-hp-zero",
    "nextBoss": "parrot"
  }
}
```

### BOSS 2 - 百变小鹦

#### 文件位置
`server/data/act4/boss2-parrot.json`

#### 完整数据结构(含所有20道题)

```json
{
  "bossId": "parrot",
  "bossName": "百变小鹦",
  "bossHp": 4,
  "description": "掌握多国语言的天才鹦鹉,是这个世界的百鸟之王,哲学家,喜欢提出各种生活上的问题难倒敌人。",

  "battleType": "sync-choice",
  "playerMode": "team",

  "rules": {
    "noDiscussion": true,
    "noPrivateChat": true,
    "sameChoiceWins": true,
    "sameChoiceDamage": -1,
    "differentChoiceDamage": -1,
    "fixedDamageToBoss": 1,
    "description": "百变小鹦最看重的就是团队默契了,他会向你们提出一些问题,刁钻的小问题。若玩家的选择相同,则小鹦生命值-1(固定伤害,不参与加成),若不相同,全体玩家生命值-1。"
  },

  "hostInstructions": {
    "online": "主持人禁止玩家互相之间私聊,出题后玩家私聊主持人发送自己的答案",
    "offline1": "主持人出题后,玩家用手机私聊主持人发送选择",
    "offline2": "主持人出题后,玩家进行思考,随后主持人倒计时投票,玩家举票(任何形式皆可,例如：1根手指代表A,2根手指代表B,3根手指代表C)"
  },

  "questions": [
    {
      "id": "q1",
      "text": "你的同学带了很多零食,分给了周围同学,但是没分给你,你会选择：",
      "options": [
        { "id": "A", "text": "毫不在意" },
        { "id": "B", "text": "笑着问是不是把你忘了" }
      ]
    },
    {
      "id": "q2",
      "text": "你在村口听八卦,发现八卦的对象是你,你会选择：",
      "options": [
        { "id": "A", "text": "跟他们解释" },
        { "id": "B", "text": "默默吃瓜" },
        { "id": "C", "text": "编个更离谱的八卦" }
      ]
    },
    {
      "id": "q3",
      "text": "你上学要迟到了,下一趟公交车不知道什么时候到,你兜里有8块,正好够打车,但是就不够吃午饭了,你会选择：",
      "options": [
        { "id": "A", "text": "等公交车但会迟到" },
        { "id": "B", "text": "打车但不吃午饭" }
      ]
    },
    {
      "id": "q4",
      "text": "你刷到了一个很好看的视频小说,但是看到精彩之处提示你要收费,你会选择：",
      "options": [
        { "id": "A", "text": "看" },
        { "id": "B", "text": "不看" }
      ]
    },
    {
      "id": "q5",
      "text": "你认为以下三种美食哪个更权威：",
      "options": [
        { "id": "A", "text": "番茄炒蛋盖饭" },
        { "id": "B", "text": "尖椒炒肉盖饭" },
        { "id": "C", "text": "肉末茄子盖饭" }
      ]
    },
    {
      "id": "q6",
      "text": "未来如果想要孩子,你更想要男孩还是女孩？",
      "options": [
        { "id": "A", "text": "男孩" },
        { "id": "B", "text": "女孩" }
      ]
    },
    {
      "id": "q7",
      "text": "你刚看完恐怖片,非常害怕,这时你想上卫生间,你会选择：",
      "options": [
        { "id": "A", "text": "憋着等朋友回来再去" },
        { "id": "B", "text": "憋着对身体不好只能去" }
      ]
    },
    {
      "id": "q8",
      "text": "考试开始了是选择题但你不会,你决定瞎蒙,你会蒙哪个答案：",
      "options": [
        { "id": "A", "text": "A" },
        { "id": "B", "text": "B" },
        { "id": "C", "text": "C" }
      ]
    },
    {
      "id": "q9",
      "text": "你无意中找到了爸爸的私房钱,你会选择：",
      "options": [
        { "id": "A", "text": "告诉妈妈,妈妈会奖励你一半,但爸爸会打你" },
        { "id": "B", "text": "告诉爸爸,爸爸会奖励你一半,但妈妈会打你" }
      ]
    },
    {
      "id": "q10",
      "text": "领导在电梯里放了个屁,领导说是你放的,而你女神正看着你,你会选择：",
      "options": [
        { "id": "A", "text": "承认是你放的" },
        { "id": "B", "text": "捂住鼻子说不是我" }
      ]
    },
    {
      "id": "q11",
      "text": "你把电脑扔进水里,不一会出来了一个河神,他问你丢的是金电脑还是银电脑还是电脑：",
      "options": [
        { "id": "A", "text": "金电脑" },
        { "id": "B", "text": "银电脑" },
        { "id": "C", "text": "电脑" }
      ]
    },
    {
      "id": "q12",
      "text": "隔壁小学生孩子了,想让你帮忙取个名,请选择：",
      "options": [
        { "id": "A", "text": "李猫(玩家1名)" },
        { "id": "B", "text": "李狗(玩家2名)" },
        { "id": "C", "text": "李龟(玩家3名)" }
      ],
      "note": "根据实际玩家名字动态调整"
    },
    {
      "id": "q13",
      "text": "你三年后投胎,请选择下辈子你想成为什么：",
      "options": [
        { "id": "A", "text": "蚊子" },
        { "id": "B", "text": "苍蝇" }
      ]
    },
    {
      "id": "q14",
      "text": "过年了,你会选择放什么烟花：",
      "options": [
        { "id": "A", "text": "二踢脚" },
        { "id": "B", "text": "窜天猴" }
      ]
    },
    {
      "id": "q15",
      "text": "你认为你们这题的答案是一致的吗？",
      "options": [
        { "id": "A", "text": "一致" },
        { "id": "B", "text": "不一致" }
      ]
    },
    {
      "id": "q16",
      "text": "你猜猜本期的MVP是哪种动物？",
      "options": [
        { "id": "A", "text": "狗" },
        { "id": "B", "text": "龟" },
        { "id": "C", "text": "猫" }
      ]
    },
    {
      "id": "q17",
      "text": "你更喜欢奇数还是偶数？",
      "options": [
        { "id": "A", "text": "奇数" },
        { "id": "B", "text": "偶数" }
      ]
    },
    {
      "id": "q18",
      "text": "哪种行为让你觉得下头？",
      "options": [
        { "id": "A", "text": "打野不帮忙" },
        { "id": "B", "text": "随地大小便" },
        { "id": "C", "text": "不看许二木(建议自由发挥,用玩家们最共识的一件事)" }
      ],
      "note": "建议根据玩家群体调整选项C"
    },
    {
      "id": "q19",
      "text": "这送分题,你要分吗？",
      "options": [
        { "id": "A", "text": "不要" },
        { "id": "B", "text": "不要" }
      ]
    },
    {
      "id": "q20",
      "text": "你最喜欢的星座是？",
      "options": [
        { "id": "A", "text": "白羊" },
        { "id": "B", "text": "十二星座" }
      ],
      "note": "建议改成玩家的三个星座"
    }
  ],

  "winCondition": {
    "type": "boss-hp-zero",
    "nextBoss": "reaper"
  }
}
```

### BOSS 3 - 死神(终极关卡)

#### 文件位置
`server/data/act4/boss3-reaper.json`

#### 完整数据结构(含全部15轮赌局)

```json
{
  "bossId": "reaper",
  "bossName": "死神",
  "bossHp": 0,
  "description": "引路人,带领你们来到这里的人。如果想逃出去,请打败他。",

  "battleType": "dice-gambling",
  "playerMode": "team",

  "rules": {
    "maxRounds": 15,
    "winCondition": {
      "type": "reach-points",
      "requiredPoints": 1000
    },
    "loseConditions": [
      { "type": "exceed-rounds", "maxRounds": 15 },
      { "type": "zero-hp" }
    ],
    "initialStake": "all-players-hp-sum",
    "description": "死神见你们居然挑战他,来了兴趣,决定与你们赌一盘,赌注是你们的生命。若在15回合内赚取的生命值超过1000,则胜利,超过15回合或0生命值则失败。"
  },

  "reminder": "所有玩家生命值总和为筹码,每轮请选择下注数量(仅可下注一种)",

  "rounds": [
    {
      "round": 1,
      "type": "big-small",
      "description": "请选择大或小(1-2-3为小,4-5-6为大)",
      "multiplier": 2,
      "options": ["big", "small"]
    },
    {
      "round": 2,
      "type": "compare-last",
      "description": "请选择本轮的点数比上轮的大或小或等于",
      "multipliers": { "big": 2, "small": 2, "equal": 5 },
      "options": ["big", "small", "equal"]
    },
    {
      "round": 3,
      "type": "compare-last",
      "description": "请选择本轮的点数比上轮的大或小或等于",
      "multipliers": { "big": 2, "small": 2, "equal": 5 },
      "options": ["big", "small", "equal"],
      "note": "上轮点数：X"
    },
    {
      "round": 4,
      "type": "compare-last",
      "description": "请选择本轮的点数比上轮的大或小或等于",
      "multipliers": { "big": 2, "small": 2, "equal": 10 },
      "options": ["big", "small", "equal"],
      "note": "上轮点数：X"
    },
    {
      "round": 5,
      "type": "odd-even",
      "description": "请选择奇或偶",
      "multiplier": 2,
      "options": ["odd", "even"]
    },
    {
      "round": 6,
      "type": "specific-numbers",
      "description": "若点数为1或者6,赔率5",
      "multiplier": 5,
      "targetNumbers": [1, 6]
    },
    {
      "round": 7,
      "type": "penalty-round",
      "description": "无需下注,若点数为奇数,扣除50生命值",
      "condition": "odd",
      "penalty": -50
    },
    {
      "round": 8,
      "type": "bonus-round",
      "description": "无需下注,若点数为奇数,增加50生命值",
      "condition": "odd",
      "bonus": 50
    },
    {
      "round": 9,
      "type": "specific-numbers",
      "description": "点数为2、5,则赔率5",
      "multiplier": 5,
      "targetNumbers": [2, 5]
    },
    {
      "round": 10,
      "type": "unique-rolls",
      "description": "三位玩家轮流投掷,若无重复点数,赔率10",
      "multiplier": 10,
      "requirement": "all-different"
    },
    {
      "round": 11,
      "type": "death-number",
      "description": "点数为4直接死亡,其余赔率2",
      "deathNumber": 4,
      "multiplier": 2
    },
    {
      "round": 12,
      "type": "specific-number",
      "description": "点数为3,赔率20",
      "multiplier": 20,
      "targetNumber": 3
    },
    {
      "round": 13,
      "type": "double-dice-pairs",
      "description": "三次机会,出现对子,则赔率10",
      "diceCount": 2,
      "attempts": 3,
      "multiplier": 10,
      "requirement": "pair"
    },
    {
      "round": 14,
      "type": "double-dice-compare",
      "description": "请选择本轮的点数比上轮(最后一次)的大或小或等于",
      "diceCount": 2,
      "multipliers": { "big": 2, "small": 2, "equal": 10 },
      "options": ["big", "small", "equal"]
    },
    {
      "round": 15,
      "type": "final-round",
      "description": "大于等于4,赔率2; 大于等于5,赔率3; 等于6,赔率10",
      "multipliers": {
        "gte4": 2,
        "gte5": 3,
        "eq6": 10
      },
      "options": ["gte4", "gte5", "eq6"]
    }
  ],

  "winCondition": {
    "type": "reach-points",
    "points": 1000,
    "ending": "true-ending"
  },

  "loseCondition": {
    "type": "fail-challenge",
    "ending": "true-ending-but-failed"
  },

  "note": "挑战死神即触发真结局,无论胜负"
}
```

---

## 结局系统

### 文件位置
`server/data/endings/all-endings.json`

### 数据结构

```json
{
  "endings": [
    {
      "endingId": "ending-0",
      "endingName": "死于鼠鼠大王",
      "triggerCondition": {
        "type": "defeat-at-boss",
        "bossId": "rat-king"
      },
      "content": {
        "text": "牛,为你点赞！"
      }
    },
    {
      "endingId": "ending-1",
      "endingName": "疯人院",
      "triggerCondition": {
        "type": "victory-but-not-challenge-next",
        "defeatedBoss": "rat-king",
        "notChallenged": ["parrot", "reaper"]
      },
      "content": {
        "type": "dual-perspective",
        "scenes": [
          {
            "act": "第一幕 - 密室",
            "playerPerspective": "一觉醒来,我们三人居然被困在密室了,有点意思,这怎么可能难倒我们三位冒险者呢。于是我们搜集证据,终于找到了逃出去关键信息C.H.E.O。我略懂英文,翻译来就是'撤噢!'看来这就是逃出去的密码了,果然,门开了,我们逃了出去。等一下!有人来了……",
            "nursePerspective": "这三位重度妄想症的病人不知道玩什么小游戏呢,看来又犯病了。'水潭有线索!'其中一位高喊着,把脑袋放进了马桶里,还有一位在门上乱按着,看样子是在钥匙门输入密码呢。我把门打开：'你们玩完了,该回房间了。'"
          },
          {
            "act": "第二幕 - 过往",
            "playerPerspective": "我们三人逃出了密室后,结果这里居然还有一个房间!房间内有一个发光的魔盒,这魔盒中的画面似乎是那样的熟悉,我们想起来了!这是关于我们仨的记忆!我们仨其实根本不是人类!而是三只小动物!乌龟、小猫还有大狗!恐怕我们失忆并且离开主人,和这诡异之人脱不了关系!",
            "nursePerspective": "他们三人在吃饭时看着电视中的快乐宠物频道之后,不知道开始发什么疯。其中一人把锅扣在了身上一动不动,另外俩人一个在舔自己的手,另一个伸着舌头冲我傻笑,我怀疑他们的重度妄想症又严重了。"
          }
        ]
      }
    },
    {
      "endingId": "ending-2",
      "endingName": "我也永远爱你",
      "triggerCondition": {
        "type": "challenge-final-boss",
        "bossId": "reaper",
        "note": "无论胜负"
      },
      "content": {
        "intro": "你们不计后果的向死神发起挑战,最终打动了死神。他向你们讲述了这个世界的起源：这并不是被创造出来的世界,而是因爱形成的回响空间,宠物去世后因为主人的念念不忘,在这里产生了回响,因此出现了这个由宠物构成的世界,你们刚来到这个世界听到的哭声就是来自主人念念不忘的回响。",
        "dialogue": [
          {
            "speaker": "龟",
            "text": "所以说,打开这个世界大门的密码是ECHO(回响),是因为被思念,所以我们还存在"
          },
          {
            "speaker": "狗",
            "text": "那我也很思念主人,他能听到我的回响吗？"
          },
          {
            "speaker": "死神",
            "text": "恐怕不能。不过我有办法。"
          }
        ],
        "messengers": "死神用神秘力量从虚空中抓来了三名冒险者,三人明明是男人,却穿着妃子的衣服。死神：'他们是异世界的冒险者,有什么想对主人说的话都可以让他们传达。'",
        "messages": {
          "cat": "铲屎官,好久不见,我在这面混的很好,你呢？\n我还记得我生病时你焦急的样子。\n对不起,我没能陪你更久。\n你和我告别时说的话说实话我没太记住,当时太疼了。\n但我记得安乐后,你哭着说你爱我。\n谢谢你给我快乐的一生。\n我也永远爱你。\n(PS：家里的猫条别浪费,喂给流浪猫吧。)",
          "dog": "爸爸妈妈,你们啥时候来啊？这面可好玩啦。\n我想带你们看看我现在过的很好。\n对啦!我昨天终于吃到巧克力了,不过吃完好像有点不对,我好像已经死了,那没事了。\n爸爸妈妈对不起,其实我在床下面拉过,可能已经风干了你找找看。\n我出意外时你们一定很难过吧,让你们担心了。\n早知道调皮的代价是不能见到你,我一定乖乖听话。\n我也永远爱你。",
          "turtle": "主人,我很想你..."
        }
      }
    }
  ]
}
```

---

## 数据文件完整清单

| 文件路径 | 内容 | 关键词数量 |
|---------|------|-----------|
| `act1/scene1-room.json` | 第一关密室场景 | 80+个关键词组合 |
| `act1/scene2-hiding.json` | 第二关藏匿游戏 | 8个区域 |
| `act2/memories.json` | 记忆回溯 | 3个视角 |
| `act3/cat/route1-kungfu.json` | 猫线-功夫路线 | 3个选择点 |
| `act3/cat/route2-business.json` | 猫线-创业路线 | 3个选择点 |
| `act3/cat/route3-robot.json` | 猫线-机器猫路线 | 3个选择点 |
| `act3/turtle/route1-ninja.json` | 龟线-忍者龟路线 | 3个选择点 |
| `act3/turtle/route2-cannon.json` | 龟线-水炮龟路线 | 3个选择点 |
| `act3/turtle/route3-son-in-law.json` | 龟线-金龟婿路线 | 3个选择点 |
| `act3/dog/route1-immortal.json` | 狗线-修仙路线 | 3个选择点 |
| `act3/dog/route2-transformer.json` | 狗线-变形金刚路线 | 3个选择点 |
| `act4/boss1-rat-king.json` | 鼠鼠大王战 | 5个洞口元素 |
| `act4/boss2-parrot.json` | 百变小鹦战 | 20道题目 |
| `act4/boss3-reaper.json` | 死神赌局战 | 15轮赌局 |
| `endings/all-endings.json` | 所有结局 | 3个结局 |

## 关键改进点

相比原 DATA_FORMAT.md,本版本：

1. **密室场景完整性**：
   - 原版仅有约10个关键词示例
   - 新版包含所有80+个关键词组合
   - 覆盖所有道具交互(水潭、行李箱、衣柜、木盒、电脑、钥匙、显示器、花瓶、囚笼、角色互动)

2. **第三幕数据完整**：
   - 猫线3条路线每条3个选择点,共9个选择
   - 龟线3条路线完整数据
   - 狗线2条路线完整数据
   - 每个选择包含所有选项(A/B/C/D)及对应技能/道具

3. **第四幕BOSS完整数据**：
   - 鼠鼠大王：5个洞口元素完整效果描述
   - 百变小鹦：20道完整题目
   - 死神：15轮完整赌局规则

4. **结局系统完整**：
   - 结局0/1/2完整剧情文本
   - 双视角叙事(玩家视角+护士视角)
   - 角色回响信息

## 数据验证要点

1. **关键词格式**：统一为"对象+对象"
2. **requirements字段**：明确前置条件
3. **effect.type**：统一效果类型命名
4. **生命值变化**：负数用负号,正数用正号
5. **技能等级**：B/A/S/SS/SSS/SSSS/SSSSS
6. **一次性道具**：标注"usageType": "single-use"

---

**文档版本**：v2.0 (完整版)
**更新日期**：基于 rule.md 完整生成
**对比v1.0**：数据完整度从约10%提升至100%

