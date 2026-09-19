# Markdown 常用排版语法与 GitHub 特性速查
本速查手册包含常用的 Markdown 格式、GFM 扩展表格、任务列表与行内代码排版范例。
规范的文档排版能够让知识库阅读体验更加舒适，以下是常用语法及其渲染效果。

---

## 一、基础格式

- **粗体**: `**重要内容**` 渲染为 **重要内容**
- *斜体*: `*斜体强调*` 渲染为 *斜体强调*
- ~~删除线~~: `~~废弃废弃~~` 渲染为 ~~废弃内容~~
- 行内代码: `` `const x = 42;` `` 渲染为 `const x = 42;`

---

## 二、代码块 (Fenced Code Blocks)

```javascript
// 示例 JavaScript 代码
function calculateScore(streak, base) {
    const multiplier = Math.min(4.0, 1.0 + streak * 0.25);
    return Math.round(base * multiplier);
}
```

---

## 三、引用块与列表

> 保持简单，保持轻量。真正优雅的架构不需要庞大的构建工具来证明其价值。

- [x] 原生 ES6+ 语法
- [x] 响应式移动端适配
- [x] 零构建开箱即用
- [ ] 离线 PWA 支持 (规划中)
