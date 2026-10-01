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
    ├── docs/             # 📚 个人文档中心与多格式知识库
    │   ├── index.html    # 文档中心主结构（多选项卡展示、前3行摘要预览、多格式阅读器、GitHub同步）
    │   └── content/      # 存放各格式文档的指定仓库路径
    │       ├── manifest.json                  # 文档元数据清单（标题、分类、路径、标签、格式类型）
    │       ├── 01-welcome-to-docs.md           # 欢迎与使用说明
    │       ├── 02-zero-build-architecture.md   # Zero-Build 纯静态架构规范
    │       ├── 03-touch-controller-api.md      # 触屏控制器 API
    │       ├── 04-color-picker-guide.md        # 独立调色盘与拾色器指南
    │       ├── 05-game-balance-and-physics.md  # 游戏物理引擎平衡性调优备忘录
    │       ├── 06-cloudflare-deployment.md     # Cloudflare Pages 自动化部署与域名绑定
    │       ├── 07-markdown-syntax-reference.md # Markdown 常用语法速查
    │       ├── 08-project-roadmap.md           # 个人工作台未来路线图
    │       ├── 09-system-architecture-notes.txt# 纯文本架构与日常运维笔记
    │       ├── 10-project-specification.docx  # Word 格式工程规范说明书
    │       ├── 11-game-arcade-matrix.xlsx     # Excel 格式游戏配置与性能参数矩阵
    │       ├── 12-developer-handbook.pdf      # PDF 格式工程技术手册
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

### 3.4 个人文档中心与多格式知识库 (`dist/docs/index.html`)
- **设计初衷**：在导航与小游戏合集之外，开辟独立的高性能多格式文档展示页面，全面支持 Markdown、纯文本 TXT、Word (.docx)、PDF 及 Excel (.xlsx / .csv) 的在线深度解析预览与直接下载。
- **数据来源规范**：
  - 支持扩展名：`.md`, `.markdown`, `.txt`, `.docx`, `.doc`, `.pdf`, `.xlsx`, `.xls`, `.csv`，存放于指定路径 `dist/docs/content/`。
  - 双通道获取：本地/相对路径 0ms 秒开读取，以及通过 GitHub API / GitHub Raw 动态拉取远程仓库提交的各种格式文档。
  - 支持在 UI 中自由配置 GitHub 仓库源（`owner/repo`、分支、目标路径）。
- **多选项卡与前 3 行预览展示规则**：
  - 页面顶部提供自适应卡片式选项卡阵列（Tabs Gallery），按格式提供专属荧光徽章（`WORD` / `PDF` / `EXCEL` / `TXT` / `DOC` 等）。
  - **文本类文档 (MD / TXT)**：自动过滤空白行与分隔线，精准提取前 3 行有效内容，带代码行号高亮展示在选项卡内。
  - **二进制类文档 (Word / PDF / Excel)**：自动生成格式类型、文件名及交互指引卡片预览，无需首屏全量预加载庞大二进制文件。
  - 选项卡支持即时模糊搜索过滤（标题、文件名、预览行）、分类标签切换（全部格式、Word、PDF、表格、文本等），以及活动项高光反馈。
- **多格式具体文档深度阅读器 (Universal Preview Dispatcher)**：
  - **Markdown (.md)**：内置零依赖轻量 Markdown 引擎实时渲染，支持标题、表格、任务清单、引用块与代码语法高亮。
  - **纯文本 (.txt)**：定制带有微行号（Line Numbers）的深色赛博代码风格视口，横向滚动与等宽字体排版。
  - **Word 文档 (.docx)**：集成前端轻量解析库 `Mammoth.js`（v1.6.0），将 Word 排版、标题、列表及复杂数据表直接转换为语义化语义 HTML，并配以专属纸张卡片容器。
  - **Excel 表格 (.xlsx / .xls / .csv)**：集成 `SheetJS`（`xlsx.full.min.js` v0.18.5），自动提取工作簿所有 Sheet 生成顶部选项卡，将单元格解析渲染为带行列标头（A, B, C... / 1, 2, 3...）的赛博深色数据网格。
  - **PDF 电子文档 (.pdf)**：利用现代浏览器原生高性能 PDF 视口嵌入 `<iframe>`，支持原生缩放、翻页、搜索，并配有「↗ 全屏/新窗口查看 PDF」直达锚点。
  - **文档固定数字编号与地址栏纯数字路由 (Numeric Doc Routing & Fixed Indexing)**：
    - **编号铁律**：严禁修改文档实际文件名，在网页及 manifest 层面静默为每个文档分配唯一且稳定的固定数字编号（`docNo: 1, 2, 3...`）。新增加文件时，编号自动自增变大（`maxDocNo + 1`）。
    - **地址栏规则**：点击或打开文档时，上方浏览器地址栏绝对**不显示文档文件名**，而是仅显示数字编号（如 `?doc=1`、`?doc=13`）。
    - **双向兼容定位**：外部访问直接输入或分享带 `?doc=<编号>` 的 URL，页面秒级定位对应文档；若输入旧式带文件名链接访问，页面自动解析并即刻静默替换地址栏为对应纯数字编号。
    - 完整支持浏览器前进/后退（`popstate` / `hashchange`）导航与一键复制纯数字直达链接。
  - **仓库源通用一键下载引擎 (Universal Repo File Downloader)**：
    - 阅读器顶部工具栏提供醒目的「📥 一键下载文档」按钮，每个选项卡卡片底部亦标配「📥 下载」快捷入口。
    - 统一采用二进制与文本自适应 `Blob / ObjectURL` 机制，针对各格式精准注入 MIME 类型（如 `application/vnd.openxmlformats-officedocument...`、`application/pdf` 等），彻底解决 GitHub Raw 跨域 `download` 属性失效及二进制文件乱码问题。

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

## 4. 网站代码全流程工作流 (Full-Lifecycle Website Engineering Workflow)

所有参与本项目网站代码编写的 AI 代理与人类开发者，必须严格遵守以下六阶段标准化全生命周期工作流：

```mermaid
flowchart LR
    A["Stage 1<br/>需求拆解与架构设计"] --> B["Stage 2<br/>样式系统与视觉规范"]
    B --> C["Stage 3<br/>高质量原生代码编写"]
    C --> D["Stage 4<br/>全端适配与交互复用"]
    D --> E["Stage 5<br/>语法自检与本地验证"]
    E --> F["Stage 6<br/>文档同步与双分支推送"]
```

### 4.1 阶段一：需求拆解与技术预研 (Stage 1: Intent & Pre-flight Checklist)
1. **意图精准定位**：明确需求属于「导航主站 (`dist/index.html`)」、「多格式文档中心 (`dist/docs/`)」还是「独立小游戏 (`dist/games/`)」，避免跨模块无序修改。
2. **Zero-Build 合规自检**：
   - 严禁引入 Webpack/Vite/Rollup 等构建工具或脚手架；
   - 若需第三方能力（如 Word 解析、Excel 处理、3D 渲染），优先评估轻量纯前端单文件版本（通过可靠 CDN 引入 `mammoth.browser.min.js`、`xlsx.full.min.js`、`three.min.js r128`），并确保支持离线或优雅降级。
3. **状态拓扑与路由规范**：
   - 确定数据持久化方案，LocalStorage 键名统一前缀（如 `cyber_nav_*`, `minigame_*`）；
   - URL 参数必须遵循解耦设计（如文档中心强制使用纯数字编号 `?doc=1`，绝不泄露文档原始物理文件名）。

### 4.2 阶段二：UI/UX 规范与样式系统 (Stage 2: Design Tokens & CSS Architecture)
1. **赛博高对比度设计语言 (Cyber Dark Theme)**：
   - 严格继承并复用根样式变量：`--primary: #00c8ff`, `--accent: #f43f5e`, `--neon-green: #00ff9d`, `--bg-dark: #07090e`, `--bg-panel: #0d111a`, `--border-color: #1a2336`。
   - 面板几何质感：优先采用纯 CSS `clip-path: polygon(...)` 构造科技感切角多边形，杜绝生硬平铺。
2. **现代 CSS 原生能力最大化**：
   - 布局首选 Flexbox 与 CSS Grid，严禁使用陈旧的浮动布局（Float）；
   - 广泛运用 CSS 变量、`:has()` 伪类、`backdrop-filter: blur(...)` 营造高通透毛玻璃质感。
3. **60 FPS 流畅动效基准**：
   - 动画与过度仅操作 `transform` 与 `opacity`，避免引发全局 Reflow 重排；
   - 背景 Canvas 网络粒子密度自适应视口面积计算，保证极低 CPU/GPU 占用。

### 4.3 阶段三：高质量原生编码规范 (Stage 3: Idiomatic Frontend Engineering)
1. **语义化与无障碍 HTML**：
   - 使用 `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>` 构建语义化层级；
   - 关键操作按钮具备清晰的 `title` 或 `aria-label`。
2. **纯粹、清晰的 JavaScript (ES6+) 架构**：
   - **关注点分离**：纯函数置于边缘（数据格式化、数值计算、URL 解析、Markdown 解析），副作用与 DOM 操作集中控制；
   - **错误即值与防御性编程**：
     - 所有异步 `fetch`、`JSON.parse`、`localStorage` 操作必须包裹 `try...catch`；
     - 网络断开或第三方 CDN 加载失败时，必须提供可视化的优雅降级（Fallback Banner/一键下载按钮），严禁静默白屏；
   - **性能与内存管理**：
     - 高频事件（如 `input`, `resize`, `scroll`）必须加入防抖（Debounce）或节流（Throttle）；
     - 生成临时对象 URL（`URL.createObjectURL`）后必须在下载完成或销毁时主动调用 `URL.revokeObjectURL` 释放内存。

### 4.4 阶段四：全端适配与模块交互复用 (Stage 4: Responsive & Component Reuse)
1. **移动端第一与触控友好**：
   - 触摸交互目标尺寸严格 $\ge 44 \times 44\text{px}$；
   - 触摸区域注入 `touch-action: none` 或 `touch-action: manipulation` 防止双击缩放或页面误滑动。
2. **组件与公共库强制复用铁律**：
   - **触屏控制器**：小游戏必须统一接入 `dist/games/shared/touch-controller.js`，通过 `TouchController.init(...)` 初始化，禁止在各个游戏单独重复编写虚拟按键 CSS。
   - **色彩挑选器**：调色场景统一接入 `dist/games/shared/color-picker.js`，通过 `ColorPicker.attach(...)` 调用。
   - **音效合成机制**：所有小游戏音效必须使用 Web Audio API 原生纯代码动态合成（振荡器与增益节点），禁止引入外部体积臃肿的 mp3/wav 静态资源。
   - **双向导航返回链**：所有独立游戏及文档子页面，必须标配双向导航（`← 游戏大厅`、`⌂ 导航中枢`）。

### 4.5 阶段五：严密自检与本地验证 (Stage 5: Quality Assurance & Verification)
1. **静态服务与多视口验证**：
   - 任选方案启动：`npm start` / `npx serve dist` / `python -m http.server 8080 -d dist`；
   - 检查控制台（Console）输出：**零报错、零未捕获异常、零 404 资源丢失**。
2. **语法无死角校验**：
   - 任何涉及 HTML 内联 `<script>` 或独立 `.js` 的改动，必须使用 Node.js (`node -c` 或 AST/Function 语法提取) 预先运行语法无错自检。
3. **多格式文档深度预览与下载闭环**：
   - 验证 Markdown (.md)、纯文本 (.txt)、Word (.docx)、Excel (.xlsx)、PDF (.pdf) 五大格式的在线解析渲染是否正常；
   - 验证「一键下载文档」针对各格式能否通过二进制 `Blob` 正确触发本地文件下载且内容完好无损。
4. **数字路由自检**：
   - 验证打开文档时上方地址栏是否保持纯数字编号（`?doc=1`），确认地址栏绝无泄露文档文件名。

### 4.6 阶段六：文档同步与双分支推送 (Stage 6: Docs Sync & Dual-Branch Git Sync)
1. **同步更新 AGENTS.md**：
   - 功能新增、配置变更或数据结构调整后，必须同步修改更新本文件对应章节。
2. **自动化元数据同步**：
   - 涉及文档增删改时，运行 `node scripts/sync-docs.js` 自动刷新 `manifest.json` 与数字编号。
3. **Git 规范双分支推送**：
   - 执行 `git status` 确认工作区变更；
   - 执行 `git add .`；
   - 编写遵循 Conventional Commits 的规范 commit 消息（如 `feat: ...`, `fix: ...`, `docs: ...`）；
   - **核心铁律**：同时推送到 `origin master` 与 `origin main` 保持双分支 100% 绝对一致。

---

## 5. 运行与验证指令 (Run & Verification)

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

## 6. 开发者与 AI 代理规范 (Agent Development Guidelines)

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
5. **多格式文档发现与自动双分支推送铁律 (Mandatory Multi-Format Docs Sync & Dual-Branch Push Rule)**：
   - **核心指令**：以后只要在 `dist/docs/content/` 路径下发现新增或修改了文档（涵盖 `.md`, `.markdown`, `.txt`, `.docx`, `.pdf`, `.xlsx`, `.xls`, `.csv`），一律同步索引并推送到 GitHub 的 `master` 和 `main` 分支。
   - **自动化工具**：
     - `npm run sync-docs`：扫描 `dist/docs/content/` 并自动刷新 `manifest.json`。
     - `npm run push-docs`：刷新多格式索引并立即双推至 `origin master` 和 `origin main`。
     - `npm run watch-docs`（或双击 `scripts/watch-docs.bat`）：后台守护监听，检测到新文档文件时 1.5 秒防抖自动双分支推送。
   - **代理执行要求**：AI 代理只要检测到 `dist/docs/content/` 有文件变动，必须执行全流程（索引更新 + git commit + push master + push main）。
6. **文档固定数字编号与无文件名地址栏铁律**：
   - 严禁在页面打开文档时将文档真实文件名写入地址栏；
   - 统一使用 `docNo` 纯数字路由（`?doc=1`），外部链接访问带文件名必须自动静默重写规范化为纯数字编号。
