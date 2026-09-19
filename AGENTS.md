# AGENTS.md — 个人多功能导航中枢与在线游戏合集

本文件为 AI 代理（Agents）及协作者开发、维护与持续演进本项目提供核心技术架构、系统模块说明、代码规范及自动化协作指南。

---

## 1. 项目概览 (Project Overview)

- **项目名称**：个人导航中枢与游戏大厅
- **目标定位**：面向开发者与数字化工作者的清爽高效个人导航、快捷搜索与轻量即开即玩游戏合集。
- **技术栈**：原生 HTML5 / 现代 CSS3 (CSS Variables, Flexbox, Grid, Clip-path) / 原生 JavaScript (ES6+) / Three.js (r128)
- **架构范式**：**Zero-Build（零构建）** 纯静态架构，无任何 Webpack/Vite/Babel 编译依赖，支持任何静态托管与浏览器直接打开。
- **目标仓库**：`https://github.com/qzzt9227/minigame.git` (主分支: `master`，同步维护 `main`)

---

## 2. 目录与文件地图 (Directory & File Map)

```text
minigame-master/
├── package.json          # 项目元数据、说明及启动脚本
├── AGENTS.md             # 本架构规范指南（每次功能变化需同步维护更新）
└── dist/                 # 核心运行与静态发布目录
    ├── index.html        # 导航中枢主结构（状态栏、搜索控制台、卡片容器、便签抽屉、弹窗）
    ├── style.css         # 深色高对比度样式、切角多边形、动态微光、响应式媒体查询
    ├── app.js            # 核心业务逻辑（Canvas 网格背景、时钟、多引擎搜索、书签 CRUD、便签持久化）
    └── games/            # 独立小游戏合集目录 (共 16 款)
        ├── index.html    # 游戏大厅 (Arcade Lobby - 分类过滤、即时检索、16 款游戏展示)
        ├── shared/       # 公共模块与工具库
        │   └── touch-controller.js  # 通用触屏控制器 API (D-Pad、摇杆、按键、手势滑动)
        ├── racing/       # 3D 赛车竞速 (Three.js 真实物理、漂移、AI 对手、计时挑战)
        ├── shooter/      # 太空战机 (Canvas 60FPS 纵版弹幕射击、武器进阶、EMP 核爆)
        ├── breakout/     # 弹珠打砖块 (多球分身道具、连击得分、动态反弹)
        ├── snake/        # 经典贪吃蛇 (网格运动、能量加速、粒子光效)
        ├── tetris/       # 俄罗斯方块 (经典 7 种方块、SRS 旋转、幽灵投影、一键硬降)
        ├── 2048/         # 2048 数字方块 (滑动手势平移合并、数值翻倍特效、最高分存储)
        ├── flappy/       # 像素飞翔鸟 (重力下坠、跳跃冲量、高低管道矩阵)
        ├── pong/         # 经典乒乓球 (复古矢量对决、智能人机 AI、动量反弹与球速加速)
        ├── minesweeper/  # 经典扫雷 (初级/中级网格、首点安全保证、一键切换挖掘/插旗模式)
        ├── pacman/       # 吃豆人迷宫 (经典迷宫网格、4 只幽灵追逐 AI、能量豆反杀机制)
        ├── doodle-jump/  # 涂鸦跳跃 (无尽纵向攀登、移动台阶、弹簧高跳道具、镜头平滑跟随)
        ├── runner/       # 无尽酷跑 (横版冲刺、跳跃避障、下蹲滑铲躲避飞鸟、速度递增)
        ├── match3/       # 宝石消除 (8x8 宝石棋盘、相邻交换、重力消除填充、限时挑战)
        ├── gomoku/       # 五子棋对弈 (15x15 棋盘、启发式 Minimax AI、悔棋重下功能)
        ├── tower-defense/# 微型塔防 (拐点路线规划、三种升级防御塔、波次怪群与金币经济)
        └── memory-flip/  # 记忆翻牌 (4x4 3D 翻转卡牌、图标配对消除、计步与秒表计时)
```

---

## 3. 核心子系统与技术实现 (Core Subsystems)

### 3.1 通用触屏控制器 API (`dist/games/shared/touch-controller.js`)
- **设计初衷**：彻底解决每个小游戏重复编写触屏交互的问题，提供标准、可插拔、统一维护的移动端控制库。
- **引入方式**：
  ```html
  <script src="../shared/touch-controller.js"></script>
  <script>
    TouchController.init({
      preset: 'dpad-action', // 支持 'dpad', 'lr-action', 'dpad-action', 'joystick', 'swipe', 'buttons'
      buttons: [
        { id: 'jump', label: '跳跃', key: ' ', code: 'Space', class: 'accent' }
      ]
    });
  </script>
  ```
- **核心能力**：
  1. **合成键盘事件分发**：触碰虚拟按键自动向 `window` 派发标准的 `keydown`/`keyup` 事件，游戏现有的键盘控制代码无需修改。
  2. **状态查询与回调**：支持 `TouchController.isDown('ArrowUp')`、`TouchController.getVector()` 实时轮询。
  3. **智能环境感知**：触屏设备自动显示，非触屏设备提供右上角 🎮 悬浮开关方便测试与混合笔记本触屏。
  4. **触觉震动与光效**：调用 `navigator.vibrate` 实现每次按压的微触觉反馈，高透光按键并包含防页面滑动的 `touch-action: none`。

### 3.2 游戏大厅系统 (`dist/games/index.html`)
- **聚合展示**：收录全部 16 款即开即玩小游戏。
- **分类标签过滤**：支持 `全部 (16)`, `街机经典`, `动作敏捷`, `休闲益智`, `棋牌策略` 快速过滤。
- **即时模糊搜索**：输入关键字即时匹配游戏名称、玩法特性与标签。
- **全端适配标志**：每张卡片标配 `📱 触屏适配` 标识，并提供直达启动按钮。

### 3.3 视觉层与交互背景
- **Canvas 节点交互网络** (`#canvasBackground`)：
  - 基于 `requestAnimationFrame` 的轻量节点物理运动与碰撞边缘环绕。
  - 动态计算鼠标距离并绘制弱渐变连线（160px 范围反应）。
  - 节点间距自适应连线（130px 阈值），随视口大小动态缩放节点密度，保证 60 FPS 且超低 CPU/GPU 占用。
- **微光视效增强**：
  - 纯 CSS 网格叠加层 (`.grid-overlay`) 与微弱扫描线光栅 (`.scanline`)。
  - 切角几何边框：利用 CSS `clip-path: polygon(...)` 营造精致现代面板质感。

### 3.4 顶部状态栏 (Status Bar & Controls)
- **时钟系统**：实时解析年月日、星期及秒级流动时钟。
- **状态与网络检测**：监听 `online`/`offline` 事件，提供动态延迟与在线反馈。
- **主题配色系统**：支持青蓝、活力橙、薄荷绿、炫紫四色阶一键循环切换，属性挂载于 `body[data-theme]` 并持久化于 LocalStorage。

### 3.5 双模搜索与即时模糊过滤系统 (Search & Fuzzy Filter)
- **多引擎全网检索**：内置 Google, Bing, GitHub, 百度, Bilibili, Devv.ai 六大核心引擎，支持切换并记录用户首选项。
- **页面内实时卡片过滤**：
  - 在搜索框键入内容时，同时对卡片标题（`title`）、描述（`desc`）及域名（`host`）进行无缝模糊检索。
  - 自动高亮并显示匹配数量；无匹配分类区自动收起。
  - 按 `Enter` 直接跳转全网搜索引擎；按 `Esc` 一键清空并还原全部卡片。

### 3.6 随手便签系统 (Scratchpad)
- 右侧滑出式悬浮抽屉 (`#scratchpadDrawer`)。
- 支持代码草稿、Token、临时文字的高效记事本。
- 内容实时 `input` 事件静默写入 `cyber_nav_scratchpad`，带实时字符统计与一键复制。

---

## 4. 运行与验证指令 (Run & Verification)

纯静态无构建模式，任选以下一种方式即可启动预览：

```bash
# 方案 1: Node.js 启动
npm start
# 或直接
npx serve dist

# 方案 2: Python 内置 HTTP 服务
python -m http.server 8080 -d dist

# 方案 3: 双击在任意浏览器直接打开 dist/index.html 或 dist/games/index.html
```

---

## 5. 开发者与 AI 代理规范 (Agent Development Guidelines)

后续所有接入该项目的 AI 代理及协作者必须严格遵守以下规则：

1. **版本控制与远程推送铁律**：
   - 目标仓库为 `https://github.com/qzzt9227/minigame.git`。
   - **每一次需求改动完成后，必须主动执行 `git add .`、规范 commit 消息，并推送至 `origin master` 分支，同时保持 `origin main` 分支同步更新**，杜绝 Cloudflare Pages 漏触发或缓存错乱。
2. **文档同步更新原则**：
   - 每次用户需求变更、增删功能模块或调整数据结构后，**必须同步修改更新 `AGENTS.md`**，保持文档与代码 100% 同步。
3. **保持 Zero-Build 架构**：
   - 严禁擅自引入 Webpack/Vite/Rollup 等构建打包复杂依赖，保持开箱即用的原生纯静态 HTML/CSS/JS 架构。
4. **游戏与控制器复用铁律**：
   - 新增小游戏必须统一引入 `dist/games/shared/touch-controller.js`。
   - 严禁在每个游戏内部重复写死独立的虚拟十字键或按键 CSS，统一调用 `TouchController.init(...)` 配置。
   - 每个游戏必须提供双向导航返回链（`← 游戏大厅`、`⌂ 导航中枢`）。
   - 音效必须使用 Web Audio API 纯代码实时合成，禁止引入外部大型 mp3/wav 资源。
