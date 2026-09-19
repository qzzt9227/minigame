# TouchController 通用移动端虚拟触控控制器 API
> 跨平台即开即用、零样式侵入的高性能触屏模拟控制库。
在移动端和小屏幕设备上，原生键盘事件无法直接触发。TouchController 提供了标准的合成键盘派发机制。

---

## 一、引入与快速开始

在小游戏的 HTML 文件中直接引入：

```html
<script src="../shared/touch-controller.js"></script>
<script>
  TouchController.init({
    preset: 'dpad-action',
    buttons: [
      { id: 'jump', label: '跳跃', key: ' ', code: 'Space', class: 'accent' }
    ]
  });
</script>
```

---

## 二、支持的预设模式 (Presets)

TouchController 支持以下开箱即用的控制形态：

- `'dpad'`: 经典十字方向键（上下左右）。
- `'lr-action'`: 左右方向键 + 右侧跳跃/动作按键（适用于平台跳跃）。
- `'dpad-action'`: 十字键 + 右侧双动作键（街机动作类）。
- `'joystick'`: 360° 模拟浮动摇杆（赛车与自由移动类）。
- `'swipe'`: 全屏幕手势轻扫侦测（2048、消除类）。
- `'buttons'`: 仅右侧或底部自定义功能按键。

---

## 三、核心 API 方法

| 方法 | 说明 | 返回值 |
| :--- | :--- | :--- |
| `TouchController.init(options)` | 初始化触屏控制器并挂载 DOM | `void` |
| `TouchController.isDown(key)` | 查询当前按键是否正被按压 | `boolean` |
| `TouchController.getVector()` | 获取摇杆二维向量 `{ x, y }` | `object` |
| `TouchController.destroy()` | 销毁所有虚拟控件并移除监听 | `void` |
