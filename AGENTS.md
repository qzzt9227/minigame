# AGENTS.md — NEXUS // Cyber Personal Navigation Station

本文件为 AI 代理（Agents）及协作者开发、维护与持续演进本项目提供核心技术架构、系统模块说明、代码规范及自动化协作指南。

---

## 1. 项目概览 (Project Overview)

- **项目名称**：`NEXUS // HUB` (赛博多功能个人导航中枢)
- **目标定位**：极客、开发者与数字化工作者的高能个人导航与效率仪表盘。
- **技术栈**：原生 HTML5 / 现代 CSS3 (CSS Variables, Flexbox, Grid, Clip-path) / 原生 JavaScript (ES6+)
- **架构范式**：**Zero-Build（零构建）** 纯静态架构，无任何 Webpack/Vite/Babel 编译依赖，支持任何静态托管与浏览器直接打开。
- **目标仓库**：`https://github.com/qzzt9227/minigame.git` (主分支: `master`)

---

## 2. 目录与文件地图 (Directory & File Map)

```text
minigame-master/
├── package.json          # 项目元数据、说明及启动脚本
├── AGENTS.md             # 本架构规范指南（每次功能变化需同步维护更新）
└── dist/                 # 核心运行与静态发布目录
    ├── index.html        # 导航中枢主结构（HUD 状态栏、搜索控制台、卡片容器、便签抽屉、弹窗）
    ├── style.css         # 赛博朋克深色高对比度样式、切角多边形、动态光效、响应式媒体查询
    └── app.js            # 核心业务逻辑（Canvas 网格背景、时钟、多引擎搜索、书签 CRUD、便签持久化）
```

---

## 3. 核心子系统与技术实现 (Core Subsystems)

### 3.1 视觉层与交互背景 (Visual & Canvas Node Mesh)
- **Canvas 节点交互网络** (`#canvasBackground`)：
  - 基于 `requestAnimationFrame` 的轻量节点物理运动与碰撞边缘环绕。
  - 动态计算鼠标距离并绘制弱渐变连线（160px 范围反应）。
  - 节点间距自适应连线（130px 阈值），随视口大小动态缩放节点密度，保证 60 FPS 且超低 CPU/GPU 占用。
- **赛博视效增强**：
  - 纯 CSS 网格叠加层 (`.grid-overlay`) 与微弱扫描线光栅 (`.scanline`)。
  - 切角几何边框：利用 CSS `clip-path: polygon(...)` 营造高精度科幻硬件面板质感。

### 3.2 顶部 HUD 遥测状态栏 (HUD Telemetry & Controls)
- **高精时钟系统**：实时解析年月日、星期及秒级流动时钟。
- **节点状态与网络遥测**：监听 `online`/`offline` 事件，提供动态延迟反馈。
- **主题光谱系统**：支持 Cyan（青蓝）、Orange（赛博橙）、Green（黑客绿）、Purple（霓虹紫）四色阶一键循环切换，属性挂载于 `body[data-theme]` 并持久化于 LocalStorage。

### 3.3 双模搜索与即时模糊过滤系统 (Search & Fuzzy Filter)
- **多引擎全网检索**：内置 Google, Bing, GitHub, 百度, Bilibili, Devv.ai 六大核心引擎，支持切换并记录用户首选项。
- **页面内实时卡片过滤**：
  - 在搜索框键入内容时，同时对卡片标题（`title`）、描述（`desc`）及域名（`host`）进行无缝模糊检索。
  - 自动高亮并显示匹配数量；无匹配分类区自动收起。
  - 按 `Enter` 直接跳转全网搜索引擎；按 `Esc` 一键清空并还原全部卡片。

### 3.4 书签矩阵与用户自定义管理 (Bookmarks & CRUD)
- **分类结构**：
  - `ai`：AI 智能中枢（ChatGPT, Claude, DeepSeek, Gemini, Cursor, v0, Hugging Face 等）
  - `dev`：开发者生态（GitHub, Vercel, Stack Overflow, MDN, NPM, Docker Hub 等）
  - `design`：设计与视效（Figma, Dribbble, Unsplash, Iconfont, Coolors 等）
  - `tools`：生产力工具（Notion, 飞书, DeepL, Regex101, JSON Crack, Speedtest 等）
  - `media`：资讯与社区（Bilibili, YouTube, V2EX, 掘金, 知乎, GitHub Trending 等）
  - `custom`：我的收藏（用户本地自定义新增）
- **本地存储持久化**：
  - 自定义书签保存于 `cyber_nav_custom_bookmarks`。
  - 支持新增、动态生成两字首字母徽章、点击量自增统计与一键删除。

### 3.5 赛博便签系统 (Cyber Scratchpad)
- 右侧滑出式悬浮抽屉 (`#scratchpadDrawer`)。
- 支持代码草稿、API Token、临时文字的高效记事本。
- 内容实时 `input` 事件静默写入 `cyber_nav_scratchpad`，带实时字符统计与一键复制。

### 3.6 数据流动与全局快捷键 (Data Backup & Shortcuts)
- **数据流管理**：
  - **导出**：一键打包导出包含自定义书签、便签草稿、主题配置与搜索引擎选择的 JSON 备份。
  - **导入**：支持读取 JSON 并恢复本地全套配置。
  - **重置**：一键安全抹除自定义数据，回到出厂默认状态。
- **全局键盘驱动**：
  - `/` 或 `Ctrl+K`：全屏任意位置一键聚焦搜索框并全选文本。
  - `Alt+N`：立即打开新增网址弹窗。
  - `Alt+S`：切换便签抽屉展开/折叠。
  - `Esc`：安全退出任意弹窗或清除当前过滤。

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

# 方案 3: 双击在任意浏览器直接打开 dist/index.html
```

---

## 5. 开发者与 AI 代理规范 (Agent Development Guidelines)

后续所有接入该项目的 AI 代理及协作者必须严格遵守以下规则：

1. **版本控制与远程推送铁律**：
   - 目标仓库为 `https://github.com/qzzt9227/minigame.git`。
   - **每一次需求改动完成后，必须主动执行 `git add .`、规范 commit 消息，并推送至 `origin master` 分支**。
2. **文档同步更新原则**：
   - 每次用户需求变更、增删功能模块或调整数据结构后，**必须同步修改更新 `AGENTS.md`**，保持文档与代码 100% 同步。
3. **保持 Zero-Build 架构**：
   - 严禁擅自引入 Webpack/Vite/Rollup 等构建打包复杂依赖，保持开箱即用的原生纯静态 HTML/CSS/JS 架构。
4. **视觉与设计规范一致性**：
   - 严格继承 Cyberpunk / High-Tech 风格：深色暗调（`#0a0a0d` / `#121217`）、高对比度发光色（`#00c8ff`, `#e8652b`, `#00ff9d`）、切角几何遮罩（`clip-path: polygon(...)`）、`Rajdhani` 等宽数字质感。
5. **存储安全与容错**：
   - 所有 `localStorage` 存取逻辑必须外包 `try...catch` 容错，防止在隐私模式或受限沙箱中抛出异常中断脚本。
