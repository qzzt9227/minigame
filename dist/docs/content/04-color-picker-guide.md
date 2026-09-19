# ColorPicker 独立调色盘与光谱拾色器指南
*核心模块*: dist/games/shared/color-picker.js
ColorPicker 提供了开箱即用的暗色 Cyber HUD 拾色器弹窗，支持光谱渐变、高饱和预设与实时 HEX 预览。

---

## 一、设计目标与痛点解决

很多前端项目在允许用户自定义角色或界面颜色时，往往简单地使用 `<input type="color">` 或让用户手动输入 HEX 十六进制代码。这在移动端和现代深色沉浸式界面中体验极其割裂。

ColorPicker 具备以下优势：
1. **统一的赛博暗色外观**：完美融入全站 UI，带毛玻璃遮罩与切角边框。
2. **全光谱平滑取色**：支持色相（Hue）滑块与明暗度调节。
3. **荧光色卡一键选中**：提供青蓝、荧光绿、日落橙、霓虹紫等设计师精选配色。
4. **零外部样式依赖**：自包含样式注入机制，无论在哪个子页面引入均能即刻渲染。

---

## 二、接入与调用示例

```javascript
// 方式 1: 直接绑定按钮（点击自动弹窗并在选择后回调）
ColorPicker.attach('#btnPlayerColor', (newHex) => {
    player.color = newHex;
}, '#00c8ff');

// 方式 2: 命令式弹窗
ColorPicker.open({
    title: '挑选障碍物颜色',
    color: '#ff3366',
    onSelect: (hex) => {
        console.log('用户选择了:', hex);
    }
});
```
