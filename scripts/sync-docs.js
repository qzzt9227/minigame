/**
 * 文档自动化索引与双分支推送脚本
 * 运行方式:
 *   node scripts/sync-docs.js         # 仅同步更新 manifest.json
 *   node scripts/sync-docs.js --push  # 同步 manifest 并自动推送到 master 与 main 分支
 *   node scripts/sync-docs.js --watch # 实时监听 content 目录，新增/修改时自动同步并双推
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CONTENT_DIR = path.join(__dirname, '..', 'dist', 'docs', 'content');
const MANIFEST_PATH = path.join(CONTENT_DIR, 'manifest.json');
const ROOT_DIR = path.join(__dirname, '..');

function getTodayString() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function extractDocMeta(filename, content) {
    let title = filename.replace(/\.md$/i, '');
    let category = '文档';
    let badge = 'DOC';

    const lines = content.split('\n');
    for (const line of lines) {
        const trimmed = line.trim();
        const h1Match = trimmed.match(/^#\s+(.+)$/);
        if (h1Match) {
            title = h1Match[1].trim();
            break;
        }
        const essayTitleMatch = trimmed.match(/^(?:题目|标题)[：:]\s*(.+)$/);
        if (essayTitleMatch) {
            title = essayTitleMatch[1].trim();
            break;
        }
    }

    if (filename.includes('征文') || content.includes('征文') || content.includes('科技馆')) {
        category = '征文';
        badge = 'ESSAY';
    } else if (filename.includes('guide') || filename.includes('welcome') || filename.includes('说明')) {
        category = '指南';
        badge = 'START';
    } else if (filename.includes('architecture') || filename.includes('架构')) {
        category = '架构';
        badge = 'ARCH';
    } else if (filename.includes('api') || filename.includes('controller') || filename.includes('picker')) {
        category = '开发';
        badge = 'API';
    } else if (filename.includes('game') || filename.includes('physics')) {
        category = '游戏';
        badge = 'GAME';
    } else if (filename.includes('deploy') || filename.includes('cloudflare')) {
        category = '运维';
        badge = 'OPS';
    } else if (filename.includes('roadmap') || filename.includes('规划')) {
        category = '规划';
        badge = 'PLAN';
    }

    return { title, category, badge };
}

function syncDocs(shouldPush = false) {
    if (!fs.existsSync(CONTENT_DIR)) {
        console.error(`[Error] 目录不存在: ${CONTENT_DIR}`);
        return false;
    }

    let manifest = [];
    if (fs.existsSync(MANIFEST_PATH)) {
        try {
            manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
        } catch (e) {
            console.warn('[Warn] manifest.json 解析异常，初始化为空列表');
            manifest = [];
        }
    }

    const files = fs.readdirSync(CONTENT_DIR);
    const mdFiles = files.filter(f => f.toLowerCase().endsWith('.md'));
    let changesMade = false;
    let newFilesList = [];

    for (const file of mdFiles) {
        const filePath = path.join(CONTENT_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const meta = extractDocMeta(file, content);
        const existingIdx = manifest.findIndex(item => item.filename === file);

        if (existingIdx === -1) {
            const safeId = Buffer.from(file).toString('hex').slice(0, 10);
            manifest.push({
                id: safeId,
                filename: file,
                title: meta.title,
                category: meta.category,
                badge: meta.badge,
                date: getTodayString(),
                path: `content/${file}`
            });
            changesMade = true;
            newFilesList.push(file);
            console.log(`[+] 发现新文档并加入索引: ${file} ("${meta.title}")`);
        } else {
            if (manifest[existingIdx].title !== meta.title) {
                manifest[existingIdx].title = meta.title;
                changesMade = true;
                console.log(`[*] 更新文档标题: ${file} -> "${meta.title}"`);
            }
        }
    }

    const currentFilenames = new Set(mdFiles);
    const prevCount = manifest.length;
    manifest = manifest.filter(item => currentFilenames.has(item.filename));
    if (manifest.length !== prevCount) {
        changesMade = true;
        console.log(`[-] 移除了已不存在的文档记录`);
    }

    if (changesMade) {
        fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n', 'utf-8');
        console.log(`[OK] manifest.json 已更新，当前共 ${manifest.length} 篇文档。`);
    } else {
        console.log(`[Info] 文档清单无变动，共 ${manifest.length} 篇。`);
    }

    if (shouldPush) {
        pushToGit(newFilesList);
    }

    return changesMade;
}

function pushToGit(newFiles = []) {
    try {
        console.log('[Git] 检查工作区状态...');
        const status = execSync('git status --porcelain', { cwd: ROOT_DIR }).toString().trim();
        if (!status) {
            console.log('[Git] 工作区无任何未提交更改，无需推送。');
            return;
        }

        console.log('[Git] 暂存所有更改 (git add .)...');
        execSync('git add .', { cwd: ROOT_DIR });

        let commitMsg = 'docs: auto-sync markdown documents';
        if (newFiles.length > 0) {
            commitMsg = `docs: 新增文档同步 [${newFiles.join(', ')}]`;
        }
        console.log(`[Git] 提交更改: "${commitMsg}"...`);
        execSync(`git commit -m "${commitMsg}"`, { cwd: ROOT_DIR });

        console.log('[Git] 推送到 origin master 分支...');
        execSync('git push origin master', { cwd: ROOT_DIR, stdio: 'inherit' });

        console.log('[Git] 同步推送到 origin main 分支...');
        execSync('git push origin master:main', { cwd: ROOT_DIR, stdio: 'inherit' });

        console.log('🚀 [Git] 成功推送到 master 和 main 两大分支！');
    } catch (err) {
        console.error('[Error] Git 提交或推送失败:', err.message);
    }
}

const args = process.argv.slice(2);
const isPush = args.includes('--push');
const isWatch = args.includes('--watch');

if (isWatch) {
    console.log(`👀 [Watch] 正在监听目录: ${CONTENT_DIR}`);
    console.log(`⚡ 一旦检测到 .md 文档变动，将自动同步 manifest 并推送到 master 和 main 分支...`);
    syncDocs(true);

    let debounceTimer = null;
    fs.watch(CONTENT_DIR, (eventType, filename) => {
        if (!filename || !filename.toLowerCase().endsWith('.md')) return;
        console.log(`[Event] 检测到文件事件: ${eventType} -> ${filename}`);
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            console.log(`\n🔄 正在触发自动化同步与推送流程...`);
            syncDocs(true);
        }, 1500);
    });
} else {
    syncDocs(isPush);
}
