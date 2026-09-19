/**
 * CYBER NAV // 个人导航中枢核心逻辑
 * - 纯原生 ES6+ 零构建架构
 * - 动态 Canvas 交互网络背景
 * - 多引擎全网搜索 & 实时卡片模糊过滤
 * - 本地存储自定义书签 CRUD
 * - 赛博便签 (Scratchpad) 实时持久化
 * - 主题切换、数据导入/导出、全局快捷键
 */

(function () {
    'use strict';

    // ==========================================
    // 1. 内置精品导航数据 (Preset Bookmarks)
    // ==========================================
    const DEFAULT_BOOKMARKS = [
        // AI 智能中枢
        { id: 'p1', title: 'ChatGPT', url: 'https://chatgpt.com', desc: 'OpenAI 旗舰语言模型与对话系统', cat: 'ai', badge: 'LLM', icon: 'GPT', clicks: 0 },
        { id: 'p2', title: 'Claude', url: 'https://claude.ai', desc: 'Anthropic 出品，高智力长上下文与代码推理', cat: 'ai', badge: 'PRO', icon: 'CL', clicks: 0 },
        { id: 'p3', title: 'DeepSeek', url: 'https://chat.deepseek.com', desc: '高性价比与强逻辑开源顶尖模型', cat: 'ai', badge: 'R1', icon: 'DS', clicks: 0 },
        { id: 'p4', title: 'Google Gemini', url: 'https://gemini.google.com', desc: '谷歌多模态大模型与跨应用生态集成', cat: 'ai', badge: 'AI', icon: 'GM', clicks: 0 },
        { id: 'p5', title: 'Cursor', url: 'https://www.cursor.com', desc: '新一代 AI 优先代码编辑器与智能补全', cat: 'ai', badge: 'IDE', icon: 'CR', clicks: 0 },
        { id: 'p6', title: 'v0.dev', url: 'https://v0.dev', desc: 'Vercel 出品的前端 Generative UI 生成引擎', cat: 'ai', badge: 'UI', icon: 'V0', clicks: 0 },
        { id: 'p7', title: 'Hugging Face', url: 'https://huggingface.co', desc: '开源机器学习模型、数据集与 Spaces 社区', cat: 'ai', badge: 'HUB', icon: 'HF', clicks: 0 },
        { id: 'p8', title: 'Midjourney', url: 'https://www.midjourney.com', desc: '极致视觉表现力的前沿 AI 图像生成工具', cat: 'ai', badge: 'ART', icon: 'MJ', clicks: 0 },

        // 开发者生态
        { id: 'p9', title: 'GitHub', url: 'https://github.com', desc: '全球最大的开源代码托管平台与协作中枢', cat: 'dev', badge: 'GIT', icon: 'GH', clicks: 0 },
        { id: 'p10', title: 'Vercel', url: 'https://vercel.com', desc: '全球极速前端与全栈云原生构建与部署平台', cat: 'dev', badge: 'OPS', icon: 'VC', clicks: 0 },
        { id: 'p11', title: 'Stack Overflow', url: 'https://stackoverflow.com', desc: '全球开发者权威疑难技术问答交流社区', cat: 'dev', badge: 'Q&A', icon: 'SO', clicks: 0 },
        { id: 'p12', title: 'MDN Web Docs', url: 'https://developer.mozilla.org', desc: '权威完整的 Web 标准、HTML、CSS、JS 参考', cat: 'dev', badge: 'DOC', icon: 'MD', clicks: 0 },
        { id: 'p13', title: 'NPM Registry', url: 'https://www.npmjs.com', desc: 'JavaScript 与 Node.js 官方软件依赖包仓库', cat: 'dev', badge: 'PKG', icon: 'NP', clicks: 0 },
        { id: 'p14', title: 'Docker Hub', url: 'https://hub.docker.com', desc: '容器化镜像官方发现、分发与管理中枢', cat: 'dev', badge: 'SYS', icon: 'DK', clicks: 0 },
        { id: 'p15', title: 'Can I Use', url: 'https://caniuse.com', desc: '前端特性、现代 Web API 浏览器兼容性查询', cat: 'dev', badge: 'WEB', icon: 'CU', clicks: 0 },
        { id: 'p16', title: 'Linux 命令手册', url: 'https://wangchujiang.com/linux-command', desc: '简洁易查的 Linux 常用命令全集与用法示例', cat: 'dev', badge: 'CLI', icon: 'LX', clicks: 0 },

        // 设计与视效
        { id: 'p17', title: 'Figma', url: 'https://www.figma.com', desc: '行业标准协作式 UI/UX 设计与原型绘制工具', cat: 'design', badge: 'UI', icon: 'FG', clicks: 0 },
        { id: 'p18', title: 'Dribbble', url: 'https://dribbble.com', desc: '全球顶尖数字产品设计师灵感与作品展示', cat: 'design', badge: 'INS', icon: 'DB', clicks: 0 },
        { id: 'p19', title: 'Unsplash', url: 'https://unsplash.com', desc: '高分辨率无版权免费商业摄影与视觉素材库', cat: 'design', badge: 'IMG', icon: 'UN', clicks: 0 },
        { id: 'p20', title: 'Iconfont', url: 'https://www.iconfont.cn', desc: '阿里巴巴矢量图标库与 SVG 资产管理平台', cat: 'design', badge: 'ICO', icon: 'IF', clicks: 0 },
        { id: 'p21', title: 'Coolors', url: 'https://coolors.co', desc: '快速生成超高质感现代配色方案利器', cat: 'design', badge: 'CLR', icon: 'CO', clicks: 0 },
        { id: 'p22', title: 'Mobbin', url: 'https://mobbin.com', desc: '全球真实优秀移动端与 Web 界面设计参考', cat: 'design', badge: 'REF', icon: 'MB', clicks: 0 },

        // 效率工具
        { id: 'p23', title: 'Notion', url: 'https://www.notion.so', desc: '全合一知识库、笔记管理与项目协作空间', cat: 'tools', badge: 'NOTE', icon: 'NT', clicks: 0 },
        { id: 'p24', title: '飞书 / Lark', url: 'https://www.feishu.cn', desc: '先进企业级高效文档、多维表格与协同工作套件', cat: 'tools', badge: 'WORK', icon: 'FS', clicks: 0 },
        { id: 'p25', title: 'DeepL 翻译', url: 'https://www.deepl.com/translator', desc: '基于神经网络的高精准度多语言学术商务翻译', cat: 'tools', badge: 'TR', icon: 'DL', clicks: 0 },
        { id: 'p26', title: 'Regex101', url: 'https://regex101.com', desc: '实时正则表达式在线调试、测试与逻辑拆解分析', cat: 'tools', badge: 'REG', icon: 'RE', clicks: 0 },
        { id: 'p27', title: 'JSON Crack', url: 'https://jsoncrack.com', desc: '直观可视化 JSON 数据图表与数据流编辑器', cat: 'tools', badge: 'JSON', icon: 'JC', clicks: 0 },
        { id: 'p28', title: 'Speedtest', url: 'https://www.speedtest.net', desc: '全球专业宽带网速、延迟与丢包率测试基准', cat: 'tools', badge: 'NET', icon: 'ST', clicks: 0 },
        { id: 'p29', title: 'TinyPNG', url: 'https://tinypng.com', desc: '智能 WebP / PNG / JPEG 图片无损压缩优化', cat: 'tools', badge: 'OPT', icon: 'TP', clicks: 0 },

        // 社区与媒体
        { id: 'p30', title: 'Bilibili', url: 'https://www.bilibili.com', desc: '中国领先的年轻人文化社区与知识视频网站', cat: 'media', badge: 'VID', icon: 'BILI', clicks: 0 },
        { id: 'p31', title: 'YouTube', url: 'https://www.youtube.com', desc: '全球最庞大的视频与高阶知识流媒体平台', cat: 'media', badge: 'VID', icon: 'YT', clicks: 0 },
        { id: 'p32', title: 'V2EX', url: 'https://www.v2ex.com', desc: '一个关于创意、技术与交流的分享社区', cat: 'media', badge: 'COM', icon: 'V2', clicks: 0 },
        { id: 'p33', title: '掘金', url: 'https://juejin.cn', desc: '中文技术沉淀与经验交流平台', cat: 'media', badge: 'DEV', icon: 'JJ', clicks: 0 },
        { id: 'p34', title: '知乎', url: 'https://www.zhihu.com', desc: '中文问答社区与各领域经验见解', cat: 'media', badge: 'Q&A', icon: 'ZH', clicks: 0 },
        { id: 'p35', title: 'GitHub Trending', url: 'https://github.com/trending', desc: '查看近期热门开源项目榜单', cat: 'media', badge: 'TOP', icon: 'HOT', clicks: 0 },

        // 小游戏
        { id: 'g1', title: '3D 赛车', url: 'games/racing/index.html', desc: '环形赛道竞速，包含碰撞、漂移和计时赛', cat: 'games', badge: '3D', icon: '🏎️', clicks: 0 },
        { id: 'g2', title: '太空战机', url: 'games/shooter/index.html', desc: '经典竖版弹幕射击，武器升级与全屏炸弹', cat: 'games', badge: '射击', icon: '🚀', clicks: 0 },
        { id: 'g3', title: '弹珠打砖块', url: 'games/breakout/index.html', desc: '经典打砖块，包含多球分身与连击奖励', cat: 'games', badge: '弹球', icon: '⚡', clicks: 0 },
        { id: 'g4', title: '贪吃蛇', url: 'games/snake/index.html', desc: '经典贪吃蛇玩法，吃掉能量点获得加速与积分', cat: 'games', badge: '休闲', icon: '🐍', clicks: 0 }
    ];

    const CATEGORIES = [
        { key: 'all', name: '全部', badge: 'ALL' },
        { key: 'ai', name: 'AI 工具', badge: 'AI' },
        { key: 'dev', name: '开发者生态', badge: 'DEV' },
        { key: 'design', name: '设计与视效', badge: 'DESIGN' },
        { key: 'tools', name: '效率工具', badge: 'TOOLS' },
        { key: 'media', name: '社区资讯', badge: 'MEDIA' },
        { key: 'games', name: '🎮 小游戏', badge: 'GAMES' },
        { key: 'custom', name: '我的收藏', badge: 'CUSTOM' }
    ];

    const SEARCH_ENGINES = {
        google: { name: 'Google', url: 'https://www.google.com/search?q=', placeholder: '在 Google 中探索世界...' },
        bing: { name: 'Bing', url: 'https://www.bing.com/search?q=', placeholder: '在必应中精准搜索...' },
        github: { name: 'GitHub', url: 'https://github.com/search?q=', placeholder: '检索开源仓库、代码、开发者...' },
        baidu: { name: '百度', url: 'https://www.baidu.com/s?wd=', placeholder: '在百度中检索中文信息...' },
        bilibili: { name: 'Bilibili', url: 'https://search.bilibili.com/all?keyword=', placeholder: '搜索 B 站海量视频、UP 主...' },
        devv: { name: 'Devv.ai', url: 'https://devv.ai/search?q=', placeholder: '面向开发者的 AI 智能代码检索...' }
    };

    // ==========================================
    // 2. 状态管理 (State Management)
    // ==========================================
    let currentEngine = localStorage.getItem('cyber_nav_engine') || 'google';
    let currentTheme = localStorage.getItem('cyber_nav_theme') || 'cyan';
    let activeCategory = 'all';
    let customBookmarks = [];

    try {
        const savedCustom = localStorage.getItem('cyber_nav_custom_bookmarks');
        if (savedCustom) {
            customBookmarks = JSON.parse(savedCustom);
        }
    } catch (e) {
        console.error('Failed to parse custom bookmarks:', e);
        customBookmarks = [];
    }

    // ==========================================
    // 3. Canvas 赛博网络背景 (Interactive Mesh)
    // ==========================================
    function initCanvasBackground() {
        const canvas = document.getElementById('canvasBackground');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const nodes = [];
        const NODE_COUNT = Math.min(Math.floor((width * height) / 16000), 75);
        const MAX_DIST = 130;
        let mouse = { x: -9999, y: -9999 };

        for (let i = 0; i < NODE_COUNT; i++) {
            nodes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.45,
                vy: (Math.random() - 0.5) * 0.45,
                radius: Math.random() * 1.5 + 1
            });
        }

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = -9999;
            mouse.y = -9999;
        });

        function renderMesh() {
            ctx.clearRect(0, 0, width, height);

            // 获取当前主题色彩
            const style = getComputedStyle(document.body);
            const primaryColor = style.getPropertyValue('--primary').trim() || '#00c8ff';

            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i];
                node.x += node.vx;
                node.y += node.vy;

                if (node.x < 0) node.x = width;
                else if (node.x > width) node.x = 0;
                if (node.y < 0) node.y = height;
                else if (node.y > height) node.y = 0;

                // 节点绘制
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                ctx.fillStyle = primaryColor;
                ctx.globalAlpha = 0.4;
                ctx.fill();

                // 节点与鼠标连线
                const mouseDx = node.x - mouse.x;
                const mouseDy = node.y - mouse.y;
                const mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
                if (mouseDist < 160) {
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = primaryColor;
                    ctx.globalAlpha = (1 - mouseDist / 160) * 0.35;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }

                // 节点间互连
                for (let j = i + 1; j < nodes.length; j++) {
                    const other = nodes[j];
                    const dx = node.x - other.x;
                    const dy = node.y - other.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < MAX_DIST) {
                        ctx.beginPath();
                        ctx.moveTo(node.x, node.y);
                        ctx.lineTo(other.x, other.y);
                        ctx.strokeStyle = primaryColor;
                        ctx.globalAlpha = (1 - dist / MAX_DIST) * 0.18;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            }

            ctx.globalAlpha = 1.0;
            requestAnimationFrame(renderMesh);
        }

        renderMesh();
    }

    // ==========================================
    // 4. HUD 遥测与时钟 (Clock & Telemetry)
    // ==========================================
    function initHUD() {
        const timeEl = document.getElementById('hudTime');
        const dateEl = document.getElementById('hudDate');
        const pingEl = document.getElementById('hudPing');

        function updateClock() {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
            const weekday = weekdays[now.getDay()];

            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');

            if (dateEl) dateEl.textContent = `${year}.${month}.${day} ${weekday}`;
            if (timeEl) timeEl.textContent = `${hours}:${minutes}:${seconds}`;
        }

        updateClock();
        setInterval(updateClock, 1000);

        // 模拟网络延迟测试与在线状态检测
        function updateNetworkPing() {
            if (!pingEl) return;
            if (!navigator.onLine) {
                pingEl.textContent = 'OFFLINE';
                pingEl.style.color = '#ff4757';
                return;
            }
            const simulatedPing = Math.floor(10 + Math.random() * 15);
            pingEl.textContent = `${simulatedPing}ms`;
            pingEl.style.color = '';
        }

        updateNetworkPing();
        setInterval(updateNetworkPing, 8000);
        window.addEventListener('online', updateNetworkPing);
        window.addEventListener('offline', updateNetworkPing);
    }

    // ==========================================
    // 5. 搜索引擎与卡片过滤 (Search Engine & Fuzzy Filter)
    // ==========================================
    function initSearch() {
        const input = document.getElementById('searchInput');
        const submitBtn = document.getElementById('searchSubmitBtn');
        const engineTabsContainer = document.getElementById('engineSelector');
        const filterStatusEl = document.getElementById('filterStatus');

        if (!input) return;

        // 渲染引擎标签
        function renderEngineTabs() {
            if (!engineTabsContainer) return;
            engineTabsContainer.innerHTML = '';
            Object.keys(SEARCH_ENGINES).forEach(key => {
                const engine = SEARCH_ENGINES[key];
                const btn = document.createElement('button');
                btn.className = `engine-tab ${key === currentEngine ? 'active' : ''}`;
                btn.textContent = engine.name;
                btn.type = 'button';
                btn.addEventListener('click', () => {
                    setEngine(key);
                });
                engineTabsContainer.appendChild(btn);
            });
        }

        function setEngine(key) {
            if (!SEARCH_ENGINES[key]) return;
            currentEngine = key;
            localStorage.setItem('cyber_nav_engine', key);
            input.placeholder = SEARCH_ENGINES[key].placeholder;
            renderEngineTabs();
        }

        function performSearch() {
            const query = input.value.trim();
            if (!query) {
                input.focus();
                return;
            }
            const engine = SEARCH_ENGINES[currentEngine] || SEARCH_ENGINES.google;
            const searchUrl = engine.url + encodeURIComponent(query);
            window.open(searchUrl, '_blank', 'noopener,noreferrer');
        }

        // 实时卡片模糊过滤
        function handleFuzzyFilter() {
            const query = input.value.trim().toLowerCase();
            const cards = document.querySelectorAll('.nav-card');
            const sections = document.querySelectorAll('.category-section');
            let matchCount = 0;

            if (!query) {
                cards.forEach(card => card.classList.remove('hidden'));
                sections.forEach(sec => sec.classList.remove('hidden'));
                if (filterStatusEl) filterStatusEl.classList.remove('active');
                return;
            }

            cards.forEach(card => {
                const title = (card.dataset.title || '').toLowerCase();
                const desc = (card.dataset.desc || '').toLowerCase();
                const host = (card.dataset.host || '').toLowerCase();

                const isMatch = title.includes(query) || desc.includes(query) || host.includes(query);
                if (isMatch) {
                    card.classList.remove('hidden');
                    matchCount++;
                } else {
                    card.classList.add('hidden');
                }
            });

            // 隐藏没有匹配项的分类区
            sections.forEach(sec => {
                const visibleCards = sec.querySelectorAll('.nav-card:not(.hidden)');
                if (visibleCards.length === 0) {
                    sec.classList.add('hidden');
                } else {
                    sec.classList.remove('hidden');
                }
            });

            if (filterStatusEl) {
                filterStatusEl.textContent = `找到 ${matchCount} 个相关网址 [按 Enter 调用 ${SEARCH_ENGINES[currentEngine].name} 搜索]`;
                filterStatusEl.classList.add('active');
            }
        }

        input.addEventListener('input', handleFuzzyFilter);

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            } else if (e.key === 'Escape') {
                input.value = '';
                handleFuzzyFilter();
                input.blur();
            }
        });

        if (submitBtn) {
            submitBtn.addEventListener('click', performSearch);
        }

        setEngine(currentEngine);
    }

    // ==========================================
    // 6. 书签渲染系统 (Bookmarks Rendering)
    // ==========================================
    function getDomainHost(url) {
        try {
            const u = new URL(url);
            return u.hostname.replace(/^www\./, '');
        } catch {
            return url;
        }
    }

    function renderAllBookmarks() {
        const mainContainer = document.getElementById('bookmarksContainer');
        const categoryNavContainer = document.getElementById('categoryTags');
        if (!mainContainer) return;

        mainContainer.innerHTML = '';

        // 合并默认书签与用户自定义书签
        const allList = [...DEFAULT_BOOKMARKS, ...customBookmarks];

        // 渲染分类导航条
        if (categoryNavContainer) {
            categoryNavContainer.innerHTML = '';
            CATEGORIES.forEach(cat => {
                const count = cat.key === 'all' 
                    ? allList.length 
                    : allList.filter(b => b.cat === cat.key).length;
                
                const btn = document.createElement('a');
                btn.className = `cat-pill ${cat.key === activeCategory ? 'active' : ''}`;
                btn.href = `#sec-${cat.key}`;
                btn.innerHTML = `${cat.name} <span class="count">${count}</span>`;
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    filterCategory(cat.key);
                });
                categoryNavContainer.appendChild(btn);
            });
        }

        // 逐个分类渲染 Section
        CATEGORIES.forEach(cat => {
            if (cat.key === 'all') return;

            const items = allList.filter(b => b.cat === cat.key);
            if (items.length === 0 && cat.key !== 'custom') return;

            const section = document.createElement('section');
            section.className = 'category-section';
            section.id = `sec-${cat.key}`;
            section.dataset.cat = cat.key;

            section.innerHTML = `
                <div class="category-header">
                    <h2 class="category-title">
                        <span>${cat.name}</span>
                        <span class="category-badge">${cat.badge}</span>
                    </h2>
                    <span style="font-size:12px; font-family:var(--font-code); color:var(--text-dim);">COUNT: ${items.length}</span>
                </div>
                <div class="card-grid"></div>
            `;

            const grid = section.querySelector('.card-grid');

            if (cat.key === 'games') {
                const banner = document.createElement('div');
                banner.className = 'games-hero-banner';
                banner.innerHTML = `
                    <div class="banner-left">
                        <div class="banner-tag">休闲小憩</div>
                        <h3 class="banner-title">小游戏大厅</h3>
                        <p class="banner-desc">内置几款即开即玩的网页小游戏（3D 赛车、太空射击、弹珠打砖块、贪吃蛇），支持键盘与手机触控游玩。</p>
                    </div>
                    <a href="games/index.html" class="cyber-btn primary banner-btn" target="_blank" rel="noopener noreferrer">
                        <span>🎮</span> <span>打开游戏大厅</span> <span>→</span>
                    </a>
                `;
                section.insertBefore(banner, grid);
            }

            if (items.length === 0 && cat.key === 'custom') {
                grid.innerHTML = `
                    <div style="grid-column: 1/-1; padding: 28px; border: 1px dashed var(--border-bright); text-align: center; color: var(--text-dim); font-family: var(--font-code);">
                        // 暂无自定义收藏。点击右上角“+ 新增网址”即可添加。
                    </div>
                `;
            } else {
                items.forEach(item => {
                    const card = createCardElement(item);
                    grid.appendChild(card);
                });
            }

            mainContainer.appendChild(section);
        });

        // 重新执行一次当前过滤状态
        if (activeCategory !== 'all') {
            filterCategory(activeCategory);
        }
    }

    function createCardElement(item) {
        const card = document.createElement('a');
        card.className = 'nav-card';
        card.href = item.url;
        card.target = '_blank';
        card.rel = 'noopener noreferrer';
        card.dataset.id = item.id;
        card.dataset.title = item.title;
        card.dataset.desc = item.desc;
        card.dataset.host = getDomainHost(item.url);
        card.dataset.cat = item.cat;

        const isCustom = String(item.id).startsWith('c_');
        const badgeHtml = item.badge ? `<span class="card-badge">${item.badge}</span>` : '';
        const host = getDomainHost(item.url);

        card.innerHTML = `
            <div>
                <div class="card-top">
                    <div class="card-icon">${item.icon || item.title.slice(0, 2).toUpperCase()}</div>
                    <div class="card-meta">
                        <div class="card-title-row">
                            <span class="card-title" title="${item.title}">${item.title}</span>
                            ${badgeHtml}
                        </div>
                        <p class="card-desc" title="${item.desc}">${item.desc}</p>
                    </div>
                </div>
            </div>
            <div class="card-bottom">
                <span class="card-host">${host}</span>
                <div class="card-actions">
                    ${isCustom ? `<button class="card-action-btn delete" title="删除书签" data-del="${item.id}">✕</button>` : ''}
                </div>
            </div>
        `;

        // 点击增加点击计数
        card.addEventListener('click', (e) => {
            if (e.target.closest('.card-action-btn')) {
                e.preventDefault();
                return;
            }
            item.clicks = (item.clicks || 0) + 1;
            saveCustomBookmarks();
        });

        // 删除自定义书签
        if (isCustom) {
            const delBtn = card.querySelector('.card-action-btn.delete');
            if (delBtn) {
                delBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    deleteCustomBookmark(item.id);
                });
            }
        }

        return card;
    }

    function filterCategory(catKey) {
        activeCategory = catKey;
        const pills = document.querySelectorAll('.cat-pill');
        pills.forEach(p => {
            const href = p.getAttribute('href') || '';
            if (href === `#sec-${catKey}` || (catKey === 'all' && href === '#sec-all')) {
                p.classList.add('active');
            } else {
                p.classList.remove('active');
            }
        });

        const sections = document.querySelectorAll('.category-section');
        sections.forEach(sec => {
            if (catKey === 'all' || sec.dataset.cat === catKey) {
                sec.classList.remove('hidden');
            } else {
                sec.classList.add('hidden');
            }
        });
    }

    // ==========================================
    // 7. 自定义书签 CRUD
    // ==========================================
    function saveCustomBookmarks() {
        localStorage.setItem('cyber_nav_custom_bookmarks', JSON.stringify(customBookmarks));
    }

    function addCustomBookmark(title, url, cat, desc, badge) {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        const newBookmark = {
            id: 'c_' + Date.now(),
            title: title.trim(),
            url: url.trim(),
            cat: cat || 'custom',
            desc: desc.trim() || '自定义网址',
            badge: badge.trim().toUpperCase() || 'CUSTOM',
            icon: title.trim().slice(0, 2).toUpperCase(),
            clicks: 0
        };

        customBookmarks.unshift(newBookmark);
        saveCustomBookmarks();
        renderAllBookmarks();
        showToast(`已添加: ${newBookmark.title}`);
    }

    function deleteCustomBookmark(id) {
        if (!confirm('确定要删除此网址吗？')) return;
        customBookmarks = customBookmarks.filter(b => b.id !== id);
        saveCustomBookmarks();
        renderAllBookmarks();
        showToast('网址已删除');
    }

    // ==========================================
    // 8. 赛博便签 (Scratchpad)
    // ==========================================
    function initScratchpad() {
        const textarea = document.getElementById('scratchpadText');
        const drawer = document.getElementById('scratchpadDrawer');
        const backdrop = document.getElementById('drawerBackdrop');
        const toggleBtn = document.getElementById('toggleScratchpadBtn');
        const closeBtn = document.getElementById('closeScratchpadBtn');
        const charCountEl = document.getElementById('scratchpadCharCount');
        const copyBtn = document.getElementById('copyScratchpadBtn');
        const clearBtn = document.getElementById('clearScratchpadBtn');

        if (!textarea || !drawer) return;

        // 加载历史笔记
        const savedNote = localStorage.getItem('cyber_nav_scratchpad') || '';
        textarea.value = savedNote;
        updateCharCount();

        function updateCharCount() {
            if (charCountEl) {
                charCountEl.textContent = `${textarea.value.length} 字符`;
            }
        }

        // 自动保存
        textarea.addEventListener('input', () => {
            localStorage.setItem('cyber_nav_scratchpad', textarea.value);
            updateCharCount();
        });

        function openDrawer() {
            drawer.classList.add('open');
            if (backdrop) backdrop.classList.add('active');
            textarea.focus();
        }

        function closeDrawer() {
            drawer.classList.remove('open');
            if (backdrop) backdrop.classList.remove('active');
        }

        if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
        if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
        if (backdrop) backdrop.addEventListener('click', closeDrawer);

        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                if (!textarea.value) {
                    showToast('便签为空，无需复制');
                    return;
                }
                navigator.clipboard.writeText(textarea.value).then(() => {
                    showToast('已复制便签内容到剪贴板');
                }).catch(() => {
                    showToast('复制失败，请手动选取');
                });
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (!textarea.value) return;
                if (confirm('确认清空所有便签草稿吗？')) {
                    textarea.value = '';
                    localStorage.removeItem('cyber_nav_scratchpad');
                    updateCharCount();
                    showToast('便签已清空');
                }
            });
        }
    }

    // ==========================================
    // 9. 弹窗交互 (Modals)
    // ==========================================
    function initModals() {
        // 新增书签弹窗
        const addModal = document.getElementById('addBookmarkModal');
        const openAddBtn = document.getElementById('openAddModalBtn');
        const closeAddBtn = document.getElementById('closeAddModalBtn');
        const cancelAddBtn = document.getElementById('cancelAddModalBtn');
        const addForm = document.getElementById('addBookmarkForm');

        function openAddModal() {
            if (addModal) {
                addModal.classList.add('active');
                const titleInput = document.getElementById('bmTitle');
                if (titleInput) titleInput.focus();
            }
        }

        function closeAddModal() {
            if (addModal) {
                addModal.classList.remove('active');
                if (addForm) addForm.reset();
            }
        }

        if (openAddBtn) openAddBtn.addEventListener('click', openAddModal);
        if (closeAddBtn) closeAddBtn.addEventListener('click', closeAddModal);
        if (cancelAddBtn) cancelAddBtn.addEventListener('click', closeAddModal);

        if (addForm) {
            addForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const title = document.getElementById('bmTitle').value;
                const url = document.getElementById('bmUrl').value;
                const cat = document.getElementById('bmCat').value;
                const desc = document.getElementById('bmDesc').value;
                const badge = document.getElementById('bmBadge').value;

                if (!title || !url) {
                    alert('请输入完整的网站名称与链接');
                    return;
                }

                addCustomBookmark(title, url, cat, desc, badge);
                closeAddModal();
            });
        }

        // 快捷键指南弹窗
        const shortcutModal = document.getElementById('shortcutsModal');
        const openShortcutBtn = document.getElementById('openShortcutsBtn');
        const closeShortcutBtn = document.getElementById('closeShortcutsBtn');

        if (openShortcutBtn && shortcutModal) {
            openShortcutBtn.addEventListener('click', () => shortcutModal.classList.add('active'));
        }
        if (closeShortcutBtn && shortcutModal) {
            closeShortcutBtn.addEventListener('click', () => shortcutModal.classList.remove('active'));
        }

        // 数据备份/管理弹窗
        const dataModal = document.getElementById('dataModal');
        const openDataBtn = document.getElementById('openDataBtn');
        const closeDataBtn = document.getElementById('closeDataBtn');
        const exportBtn = document.getElementById('exportJsonBtn');
        const importInput = document.getElementById('importJsonInput');
        const resetBtn = document.getElementById('resetDataBtn');

        if (openDataBtn && dataModal) {
            openDataBtn.addEventListener('click', () => dataModal.classList.add('active'));
        }
        if (closeDataBtn && dataModal) {
            closeDataBtn.addEventListener('click', () => dataModal.classList.remove('active'));
        }

        // 导出配置
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                const backupData = {
                    version: '2.0.0',
                    timestamp: Date.now(),
                    theme: currentTheme,
                    engine: currentEngine,
                    customBookmarks: customBookmarks,
                    scratchpad: localStorage.getItem('cyber_nav_scratchpad') || ''
                };
                const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `cyber-nav-backup-${new Date().toISOString().slice(0, 10)}.json`;
                a.click();
                URL.revokeObjectURL(url);
                showToast('配置文件已成功导出');
            });
        }

        // 导入配置
        if (importInput) {
            importInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const parsed = JSON.parse(event.target.result);
                        if (Array.isArray(parsed.customBookmarks)) {
                            customBookmarks = parsed.customBookmarks;
                            saveCustomBookmarks();
                        }
                        if (parsed.theme) applyTheme(parsed.theme);
                        if (parsed.engine && SEARCH_ENGINES[parsed.engine]) {
                            currentEngine = parsed.engine;
                            localStorage.setItem('cyber_nav_engine', parsed.engine);
                        }
                        if (parsed.scratchpad !== undefined) {
                            localStorage.setItem('cyber_nav_scratchpad', parsed.scratchpad);
                            const t = document.getElementById('scratchpadText');
                            if (t) t.value = parsed.scratchpad;
                        }
                        renderAllBookmarks();
                        if (dataModal) dataModal.classList.remove('active');
                        showToast('配置数据恢复成功');
                    } catch (err) {
                        alert('导入失败：无效的 JSON 配置文件');
                    }
                };
                reader.readAsText(file);
                importInput.value = '';
            });
        }

        // 重置出厂设置
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (confirm('警告：此操作将清空所有自定义书签和便签草稿，恢复为初始预设。是否继续？')) {
                    localStorage.removeItem('cyber_nav_custom_bookmarks');
                    localStorage.removeItem('cyber_nav_scratchpad');
                    customBookmarks = [];
                    renderAllBookmarks();
                    const t = document.getElementById('scratchpadText');
                    if (t) t.value = '';
                    if (dataModal) dataModal.classList.remove('active');
                    showToast('已恢复默认设置');
                }
            });
        }

        // 点击遮罩外部关闭
        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.classList.remove('active');
                }
            });
        });
    }

    // ==========================================
    // 10. 主题切换系统 (Theme Accents)
    // ==========================================
    function applyTheme(themeName) {
        currentTheme = themeName;
        document.body.setAttribute('data-theme', themeName);
        localStorage.setItem('cyber_nav_theme', themeName);
    }

    function initTheme() {
        applyTheme(currentTheme);
        const themeBtn = document.getElementById('themeCycleBtn');
        if (!themeBtn) return;

        const themes = ['cyan', 'orange', 'green', 'purple'];
        themeBtn.addEventListener('click', () => {
            const nextIdx = (themes.indexOf(currentTheme) + 1) % themes.length;
            applyTheme(themes[nextIdx]);
            showToast('已切换主题: ' + themes[nextIdx]);
        });
    }

    // ==========================================
    // 11. 全局快捷键绑定 (Global Hotkeys)
    // ==========================================
    function initShortcuts() {
        window.addEventListener('keydown', (e) => {
            // 如果正在输入文本，忽略全局快捷键（除 Esc 外）
            const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);

            if (e.key === 'Escape') {
                document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
                const drawer = document.getElementById('scratchpadDrawer');
                const backdrop = document.getElementById('drawerBackdrop');
                if (drawer) drawer.classList.remove('open');
                if (backdrop) backdrop.classList.remove('active');
                return;
            }

            if (isTyping) return;

            // '/' 或 'Ctrl+K' 聚焦搜索
            if (e.key === '/' || (e.ctrlKey && e.key.toLowerCase() === 'k')) {
                e.preventDefault();
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.focus();
                    searchInput.select();
                }
            }

            // Alt+N 打开新增书签弹窗
            if (e.altKey && e.key.toLowerCase() === 'n') {
                e.preventDefault();
                const addModal = document.getElementById('addBookmarkModal');
                if (addModal) addModal.classList.add('active');
            }

            // Alt+S 打开/关闭便签
            if (e.altKey && e.key.toLowerCase() === 's') {
                e.preventDefault();
                const drawer = document.getElementById('scratchpadDrawer');
                const backdrop = document.getElementById('drawerBackdrop');
                if (drawer) {
                    drawer.classList.toggle('open');
                    if (backdrop) backdrop.classList.toggle('active');
                }
            }
        });
    }

    // ==========================================
    // 12. 轻量 Toast 提示系统
    // ==========================================
    function showToast(message) {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = 'cyber-toast';
        toast.textContent = message;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 2400);
    }

    // ==========================================
    // 初始化应用
    // ==========================================
    document.addEventListener('DOMContentLoaded', () => {
        initTheme();
        initCanvasBackground();
        initHUD();
        initSearch();
        renderAllBookmarks();
        initScratchpad();
        initModals();
        initShortcuts();
    });

})();
