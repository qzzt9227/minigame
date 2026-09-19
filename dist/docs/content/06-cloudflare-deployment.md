# Cloudflare Pages 静态自动化部署与自定义域名绑定
**目标仓库**: https://github.com/qzzt9227/minigame.git
每次将代码推送到 GitHub 的 master 或 main 分支时，Cloudflare Pages 将在数秒内自动同步并完成全球边缘分发。

---

## 一、部署配置关键参数

- **框架预设 (Framework Preset)**: `None` (纯静态环境)
- **构建命令 (Build Command)**: 留空 (无构建打包脚本)
- **构建输出目录 (Build Output Directory)**: `dist`
- **生产分支 (Production Branch)**: `master` (同时保持 `main` 同步更新)

---

## 二、双分支同步与推送命令

由于部分持续集成平台默认监听 `main`，而本项目历史主分支为 `master`，我们遵循双分支强制同步推送规范：

```bash
# 一键添加、提交并双分支推送
git add .
git commit -m "feat: 你的功能描述"
git push origin master
git push origin master:main
```

---

## 三、自定义域名 DNS 绑定要点

1. 在 Cloudflare Pages 项目控制台进入 `Custom Domains`（自定义域）。
2. 输入你的专属二级域名或主域名（例如 `nav.yourdomain.com`）。
3. Cloudflare 会自动配置一条指向 Pages 边缘节点的 CNAME 解析记录。
4. SSL/TLS 证书将自动申请并生效，支持 HTTP/2 与 HTTP/3 极速访问。
