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
    ├── docs/             # 📚 个人文档中心与 Markdown 知识库
    │   ├── index.html    # 文档中心主结构（多选项卡展示、前3行摘要预览、深度阅读器、GitHub同步）
    │   └── content/      # 存放具体 MD 文档的指定仓库路径
    │       ├── manifest.json                  # 文档元数据清单（标题、分类、路径、标签）
    │       ├── 01-welcome-to-docs.md           # 欢迎与使用说明
    │       ├── 02-zero-build-architecture.md   # Zero-Build 纯静态架构规范
    │       ├── 03-touch-controller-api.md      # 触屏控制器 API
    │       ├── 04-color-picker-guide.md        # 独立调色盘与拾色器指南
    │       ├── 05-game-balance-and-physics.md  # 游戏物理引擎平衡性调优备忘录
    │       ├── 06-cloudflare-deployment.md     # Cloudflare Pages 自动化部署与域名绑定
    │       ├── 07-markdown-syntax-reference.md # Markdown 常用语法速查
    │       ├── 08-project-roadmap.md           # 个人工作台未来路线图
    │       └── 走进科技馆，放飞科技梦.md       # 高中组科技征文（第一人称散文沉淀）
    └── games/            # 独立小游戏合集目录 (共 16 款)
        ├── index.html    # 游戏大厅 (Arcade Lobby - 分类过滤、即时检索、16 款游戏展示)
        ├── shared/       # 公共模块与工具库
        │   ├── touch-controller.js  # 通用触屏控制器 API (D-Pad、摇杆、按键、手势滑动)
        │   └── color-picker.js      # 通用调色盘拾色器 API (光谱滑块、预设色块、实时取色)
        ├── racing/       # 3D 赛车竞速 (Three.js 真实物理、漂移、AI 对手、计时挑战)
        ├── shooter/      # 太空战机 (Canvas 60FPS 纵版弹幕射击、武器进阶、EMP 核爆)
        ├── breakout/     # 弹珠打砖块 (多球分身道具、连击得分、动态反弹)
        ├── snake/        # 经典贪吃蛇 (网格运动、能量加速、粒子光效)
        ├── tetris/       # 俄罗斯方块 (经典 7 种方块、SRS 旋转、幽灵投影、一键硬降)
        ├── 2048/         # 2048 数字方块 (滑动手势平移合并、数值翻倍特效、最高分存储)
        ├── flappy/       # 像素飞翔鸟 (速度/管道间隙/密度/飞鸟体型/色彩自定义弹窗、更柔和的浮空物理)
        ├── pong/         # 经典乒乓球 (降速平衡、初始球速/板长/AI难度/决胜分自定义、防手忙脚乱)
        ├── minesweeper/  # 经典扫雷 (行列数/地雷数/方格尺寸自定义弹窗、首点安全开局、视口滚动)
        ├── pacman/       # 吃豆人迷宫 (键盘抬起停步、防止无限向上移动 bug、4只幽灵追逐 AI)
        ├── doodle-jump/  # 涂鸦跳跃 (解决下方平台消失陷阱、保留深层缓冲区、平滑下坠动效、平台/冲力设置)
        ├── runner/       # 无尽酷跑 (尖刺/双刺/高墙/激光/无人机/齿轮 6 种障碍、速度/密度/色彩设置)
        ├── match3/       # 宝石消除 (交换缓动、下落重力物理插值、消除爆破粒子与连击浮字动效)
        ├── gomoku/       # 五子棋对弈 (准星落子预览、防误触二次确认、AI 难度与执先后手选择)
        ├── tower-defense/# 微型塔防 (拐点路线规划、三种升级防御塔、波次怪群与金币经济)
        └── memory-flip/  # 记忆翻牌 (3D 翻转质感、翻错抖动 Wobble、配对礼花粒子庆典)
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

### 3.2 通用调色盘拾色器 API (`dist/games/shared/color-picker.js`)
- **设计初衷**：统一解决游戏中所有角色、平台、障碍物、特效颜色的可视化挑选，杜绝繁琐手动输入 HEX。
- **调用规范**：
  ```html
  <script src="../shared/color-picker.js"></script>
  <script>
    // 方案 1: 直接绑定按钮触发器（点击自动弹窗并在选择后回调更新色块背景）
    ColorPicker.attach('#btnPlayerColor', (hexColor) => {
      gameConfig.playerColor = hexColor;
    }, '#00ff9d');

    // 方案 2: 手动命令式唤起
    ColorPicker.open({
      initialColor: '#ff0055',
      title: '挑选障碍物色彩',
      onSelect: (hex) => console.log('Selected:', hex)
    });
  </script>
  ```
- **核心特性**：全光谱彩虹渐变滑块、明暗度精细调整、高对比度荧光预设色卡、实时 HEX 预览、原生纯 CSS 模态弹窗。

### 3.3 游戏深度重构与自定义机制
1. **涂鸦跳跃 (`doodle-jump`)**：
   - 彻底修复“下方平台被立即销毁导致掉落悬空必死”的 bug，维持深达 500px 的向下平台安全缓冲。
   - 移除掉出屏幕即刻闪屏暴毙判定，新增速度线、平滑镜头下坠与落体音效的平滑坠落过场。
   - 新增参数设置弹窗：平台宽度（加宽/标准/狭窄）、弹跳冲量、弹簧概率、横向移动灵敏度、色彩调色盘。
2. **无尽酷跑 (`runner`)**：
   - **障碍物扩展**：地面单尖刺、连环双尖刺、滚动齿轮、低空无人机（需滑铲钻过）、浮空激光雷、高石墙共 6 种挑战。
   - **血条与无敌机制**：实装生命值血条（1/3/5格可调），受击不猝死并进入受伤无敌保护期（0.8s/1.5s/2.5s可调），配有护盾光环、无敌闪烁、受击震屏与火花粒子。
   - **速度节奏调优**：默认起跑基准速度调慢至 4.5（支持 3.5 慢速 / 4.5 适中 / 6.5 极速），平缓加速曲线避免手忙脚乱。
   - **长按跳跃动力学**：长按跳跃键持续获得上升推力并向前滑翔拓展滞空距离（跳得更高、更远），松手立即切断升力实现敏捷小跳，兼顾微操与大跨度避障。
   - **自定义设置弹窗**：血条格数、无敌秒数、速度等级、障碍密度、6种障碍独立开关、4种角色/元素调色盘。
3. **吃豆人迷宫 (`pacman`)**：
   - 彻底修复“幽灵怪物困在老巢不追玩家”的严重 AI 缺陷：重构为全图 BFS 广度优先搜索最短路径寻路，解决死胡同死锁与贪心局部最优卡墙问题。
   - 实装 4 只幽灵不同的战术 AI：Blinky（直扑追杀）、Pinky（预测前沿拦截）、Inky（夹击策应）、Clyde（近退远追巡逻）。
   - 修复键盘释放未监听导致的无限向前冲 bug，改为精准的按键按下移动、松开即止判定。
   - 完善能量豆受惊（速度减缓、向反向逃窜、被吃变眼睛飞回老巢复活出击）的完整状态机。
4. **宝石消除 (`match3`)**：
   - 全面引入平滑缓动系统：交换移动插值、消除缩放动效、12 粒物理重力火花迸发与连击 Combo 浮动提示。
5. **记忆翻牌 (`memory-flip`)**：
   - 引入 3D 透视翻转高光、配对错误 Wobble 剧烈抖动反馈、配对成功彩带粒子礼花庆典。
6. **五子棋对弈 (`gomoku`)**：
   - 增加准星半透明虚影棋子悬浮预览、手机端“点击选点 + 确认落子”双重防误触逻辑、AI 难度切换（简单/普通/大师）与先后手选择。
7. **经典扫雷 (`minesweeper`)**：
   - 新增自定义网格弹窗（自由设定 8~24 行、8~30 列、任意地雷数及 24~36px 方格大小），搭配 `.grid-viewport` 滚动视口支持超大地图。
8. **像素飞鸟 (`flappy`) & 经典乒乓球 (`pong`)**：
   - 降低默认过快速度、扩大穿透空隙与球拍长度，大幅提高反应宽容度；
   - 标配自定义弹窗：自由调控飞行速度/初速度、管道间距与空隙、球拍长短与 AI 难度。

### 3.4 个人文档中心与 Markdown 知识库 (`dist/docs/index.html`)
- **设计初衷**：在导航与小游戏合集之外，开辟独立的 Markdown 文档与知识沉淀展示页面，支持对文档进行结构化多选项卡预览与阅读。
- **数据来源规范**：
  - 文档严格限定为 `.md` 格式，默认存放于 GitHub 仓库指定路径 `dist/docs/content/`。
  - 支持双通道获取：本地/相对路径 0ms 秒开读取，以及通过 GitHub API 动态拉取远程仓库提交的新文档。
  - 支持在 UI 中自由配置 GitHub 仓库源（`owner/repo`、分支、目标路径）。
- **多选项卡与前 3 行预览展示规则**：
  - 页面顶部提供自适应卡片式选项卡阵列（Tabs Gallery）。
  - 核心展示算法自动过滤空行与全分隔线，精准提取每个 `.md` 文档的**前 3 行有效内容**，带代码行号高亮展示在选项卡内。
  - 选项卡支持即时模糊搜索过滤、分类标签切换，以及活动项霓虹高光反馈。
- **具体文档深度阅读器**：
  - 点击任何选项卡即刻激活该文档，主阅读区实时调用内置零依赖 Markdown 引擎渲染完整正文。
  - 支持代码语法高亮块、表格、任务清单、引用块、行数与字数统计。
  - 提供一键复制 Markdown 全文、在 GitHub 仓库查看原文件、以及源码与渲染视图自由切换。
  - **文档深度链接与地址栏动态同步 (Deep Linking & History API)**：
    - 点击或切换文档时，地址栏自动通过 `history.pushState` 无刷新同步为 `?doc=<文件名>`（如 `?doc=走进科技馆，放飞科技梦.md`）。
    - 外部访问直接输入或分享带 `?doc=` 或 `#doc=` 的 URL，页面秒级定位并高亮渲染对应文档。
    - 完整支持浏览器前进/后退（`popstate` / `hashchange`）导航与一键复制直达链接。

### 3.5 视觉层与交互背景
- **Canvas 节点交互网络** (`#canvasBackground`)：
  - 基于 `requestAnimationFrame` 的轻量节点物理运动与碰撞边缘环绕。
  - 动态计算鼠标距离并绘制弱渐变连线（160px 范围反应）。
  - 节点间距自适应连线（130px 阈值），随视口大小动态缩放节点密度，保证 60 FPS 且超低 CPU/GPU 占用。
- **微光视效增强**：
  - 纯 CSS 网格叠加层 (`.grid-overlay`) 与微弱扫描线光栅 (`.scanline`)。
  - 切角几何边框：利用 CSS `clip-path: polygon(...)` 营造精致现代面板质感。

### 3.5 顶部状态栏 (Status Bar & Controls)
- **时钟系统**：实时解析年月日、星期及秒级流动时钟。
- **状态与网络检测**：监听 `online`/`offline` 事件，提供动态延迟与在线反馈。
- **主题配色系统**：支持青蓝、活力橙、薄荷绿、炫紫四色阶一键循环切换，属性挂载于 `body[data-theme]` 并持久化于 LocalStorage。

### 3.6 双模搜索与即时模糊过滤系统 (Search & Fuzzy Filter)
- **多引擎全网检索**：内置 Google, Bing, GitHub, 百度, Bilibili, Devv.ai 六大核心引擎，支持切换并记录用户首选项。
- **页面内实时卡片过滤**：
  - 在搜索框键入内容时，同时对卡片标题（`title`）、描述（`desc`）及域名（`host`）进行无缝模糊检索。
  - 自动高亮并显示匹配数量；无匹配分类区自动收起。
  - 按 `Enter` 直接跳转全网搜索引擎；按 `Esc` 一键清空并还原全部卡片。
- **分类标签与双入口中枢 (Category Navigation & Dual Portal)**：
  - 分类胶囊栏不仅提供全站书签的即时分类筛选（全部/AI/开发/设计/工具/资讯/游戏/收藏），同时在分类标签栏中内置专属高亮「📚 文档库 ↗」直达入口按钮。
  - 维持顶栏 HUD 操作区与分类胶囊栏双重文档库入口并存，方便不同滚动视口下即时直达 Markdown 知识库。

### 3.7 随手便签系统 (Scratchpad)
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
   - 涉及颜色挑选必须统一引入 `dist/games/shared/color-picker.js`。
   - 严禁在每个游戏内部重复写死独立的虚拟十字键或按键 CSS，统一调用 `TouchController.init(...)` 配置。
   - 每个游戏必须提供双向导航返回链（`← 游戏大厅`、`⌂ 导航中枢`）。
   - 音效必须使用 Web Audio API 纯代码实时合成，禁止引入外部大型 mp3/wav 资源。
5. **MD 文档发现与自动双分支推送铁律 (Mandatory Markdown Sync & Dual-Branch Push Rule)**：
   - **核心指令**：以后只要在 `dist/docs/content/` 路径下发现新增或修改了 `.md` 文档，一律同步索引并推送到 GitHub 的 `master` 和 `main` 分支。
   - **自动化工具**：
     - `npm run sync-docs`：扫描 `dist/docs/content/` 并自动刷新 `manifest.json`。
     - `npm run push-docs`：刷新索引并立即双推至 `origin master` 和 `origin main`。
     - `npm run watch-docs`（或双击 `scripts/watch-docs.bat`）：后台守护监听，检测到新 MD 文件时 1.5 秒防抖自动双分支推送。
   - **代理执行要求**：AI 代理只要检测到 `dist/docs/content/` 有文件变动，必须执行全流程（索引更新 + git commit + push master + push main）。
