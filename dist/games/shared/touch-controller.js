/**
 * TouchController - 通用小游戏触屏控制器 API
 * 
 * 特性：
 * - 纯原生 JavaScript，零第三方依赖，自包含 CSS 样式注入。
 * - 自动派发键盘事件 (keydown / keyup)，所有小游戏的既有键盘监听无需改造即可直接使用。
 * - 支持多种预设：dpad (四向十字键)、lr-action (左右移动+动作键)、dpad-action、swipe (滑动手势)、joystick (虚拟摇杆)、buttons。
 * - 智能检测触屏设备，非触屏设备提供右上角 🎮 快速切换开关。
 * - 触感震动反馈 (Vibration API) 与半透明按键光效。
 */

(function (global) {
    'use strict';

    let activeController = null;

    const DEFAULT_STYLES = `
        .touch-controller-root {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 9999;
            user-select: none;
            -webkit-user-select: none;
            touch-action: none;
            font-family: 'Rajdhani', -apple-system, sans-serif;
        }
        .touch-controller-root * {
            box-sizing: border-box;
            user-select: none;
            -webkit-user-select: none;
            -webkit-touch-callout: none;
        }
        /* 桌面端切换开关 */
        .tc-toggle-btn {
            position: fixed;
            right: 14px;
            top: 14px;
            z-index: 10000;
            width: 36px;
            height: 36px;
            border-radius: 8px;
            background: rgba(18, 18, 24, 0.85);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #00c8ff;
            font-size: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            pointer-events: auto;
            backdrop-filter: blur(8px);
            transition: all 0.2s ease;
        }
        .tc-toggle-btn:hover {
            background: #00c8ff;
            color: #08080c;
            border-color: #00c8ff;
        }
        .tc-toggle-btn.active {
            border-color: #00ff9d;
            color: #00ff9d;
        }
        /* 左侧方向区域 */
        .tc-left-zone {
            position: absolute;
            bottom: 24px;
            left: 20px;
            pointer-events: auto;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        /* 右侧动作区域 */
        .tc-right-zone {
            position: absolute;
            bottom: 24px;
            right: 20px;
            pointer-events: auto;
            display: flex;
            gap: 14px;
            align-items: flex-end;
        }
        /* D-Pad 十字键 */
        .tc-dpad {
            display: grid;
            grid-template-columns: repeat(3, 52px);
            grid-template-rows: repeat(3, 52px);
            gap: 6px;
        }
        .tc-dpad-btn {
            background: rgba(24, 24, 32, 0.75);
            border: 1.5px solid rgba(0, 200, 255, 0.4);
            color: #00c8ff;
            font-size: 22px;
            font-weight: bold;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            backdrop-filter: blur(6px);
            transition: transform 0.05s, background 0.1s, border-color 0.1s;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }
        .tc-dpad-btn:active, .tc-dpad-btn.pressed {
            background: rgba(0, 200, 255, 0.35);
            border-color: #00c8ff;
            color: #ffffff;
            transform: scale(0.92);
            box-shadow: 0 0 16px rgba(0, 200, 255, 0.5);
        }
        /* 左右按键 (Horizontal Pad) */
        .tc-hpad {
            display: flex;
            gap: 12px;
        }
        .tc-hpad-btn {
            width: 58px;
            height: 54px;
            background: rgba(24, 24, 32, 0.75);
            border: 1.5px solid rgba(0, 200, 255, 0.4);
            color: #00c8ff;
            font-size: 24px;
            font-weight: bold;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            backdrop-filter: blur(6px);
            transition: transform 0.05s, background 0.1s;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        }
        .tc-hpad-btn:active, .tc-hpad-btn.pressed {
            background: rgba(0, 200, 255, 0.4);
            border-color: #00c8ff;
            color: #fff;
            transform: scale(0.92);
        }
        /* 圆形动作按键 */
        .tc-action-btn {
            width: 58px;
            height: 58px;
            border-radius: 50%;
            background: rgba(24, 24, 32, 0.8);
            border: 2px solid rgba(0, 255, 157, 0.5);
            color: #00ff9d;
            font-size: 15px;
            font-weight: 700;
            letter-spacing: 0.5px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            backdrop-filter: blur(6px);
            transition: transform 0.05s, background 0.1s, border-color 0.1s;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.45);
        }
        .tc-action-btn.accent {
            border-color: rgba(232, 101, 43, 0.6);
            color: #e8652b;
        }
        .tc-action-btn.secondary {
            border-color: rgba(176, 91, 248, 0.6);
            color: #b05bf8;
            width: 50px;
            height: 50px;
            font-size: 13px;
        }
        .tc-action-btn:active, .tc-action-btn.pressed {
            background: rgba(0, 255, 157, 0.35);
            color: #fff;
            transform: scale(0.92);
            box-shadow: 0 0 18px rgba(0, 255, 157, 0.6);
        }
        .tc-action-btn.accent:active, .tc-action-btn.accent.pressed {
            background: rgba(232, 101, 43, 0.4);
            box-shadow: 0 0 18px rgba(232, 101, 43, 0.6);
        }
        /* 虚拟摇杆 */
        .tc-joystick-base {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: rgba(24, 24, 32, 0.5);
            border: 2px solid rgba(0, 200, 255, 0.3);
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            touch-action: none;
            box-shadow: inset 0 0 20px rgba(0, 200, 255, 0.1);
        }
        .tc-joystick-thumb {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: rgba(0, 200, 255, 0.6);
            border: 2px solid #00c8ff;
            position: absolute;
            box-shadow: 0 0 15px rgba(0, 200, 255, 0.5);
            pointer-events: none;
            transition: transform 0.05s ease-out;
        }
        /* 滑动手势提示层 */
        .tc-swipe-indicator {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: rgba(255, 255, 255, 0.25);
            font-size: 13px;
            text-align: center;
            pointer-events: none;
            letter-spacing: 1px;
        }
        /* 紧凑小屏幕适配 */
        @media (max-height: 500px) {
            .tc-left-zone, .tc-right-zone { bottom: 12px; }
            .tc-dpad { grid-template-columns: repeat(3, 42px); grid-template-rows: repeat(3, 42px); }
            .tc-action-btn { width: 48px; height: 48px; font-size: 13px; }
            .tc-joystick-base { width: 100px; height: 100px; }
            .tc-joystick-thumb { width: 40px; height: 40px; }
        }
    `;

    class TouchControllerInstance {
        constructor(options = {}) {
            this.options = Object.assign({
                preset: 'dpad-action', // 'dpad', 'lr-action', 'dpad-action', 'swipe', 'joystick', 'buttons'
                buttons: [],           // 自定义动作按钮列表 [{ id, label, key, code, color, class }]
                showToggle: true,      // 是否显示右上角控制器开关
                forceShow: false,      // 是否强制在非触屏设备显示
                vibrate: true,         // 是否启用微震动
                onAction: null         // 回调 (actionName, isPressed, payload)
            }, options);

            this.activeKeys = new Set();
            this.vector = { x: 0, y: 0, angle: 0, intensity: 0 };
            this.container = null;
            this.toggleBtn = null;
            this.visible = false;

            this.init();
        }

        init() {
            this.injectStyles();
            this.createDOM();
            this.bindEvents();

            const isTouchDevice = ('ontouchstart' in window) || 
                                  (navigator.maxTouchPoints > 0) || 
                                  window.matchMedia('(pointer: coarse)').matches ||
                                  window.innerWidth <= 900;

            if (isTouchDevice || this.options.forceShow) {
                this.setVisible(true);
            } else {
                this.setVisible(false);
            }
        }

        injectStyles() {
            if (!document.getElementById('touch-controller-styles')) {
                const style = document.createElement('style');
                style.id = 'touch-controller-styles';
                style.textContent = DEFAULT_STYLES;
                document.head.appendChild(style);
            }
        }

        createDOM() {
            // 根容器
            this.container = document.createElement('div');
            this.container.className = 'touch-controller-root';
            this.container.style.display = 'none';

            // 桌面测试开关
            if (this.options.showToggle) {
                this.toggleBtn = document.createElement('button');
                this.toggleBtn.className = 'tc-toggle-btn';
                this.toggleBtn.title = '切换虚拟触控控制器';
                this.toggleBtn.innerHTML = '🎮';
                this.toggleBtn.addEventListener('click', () => {
                    this.setVisible(!this.visible);
                });
                document.body.appendChild(this.toggleBtn);
            }

            const preset = this.options.preset;

            // 左侧控制区
            if (preset === 'dpad' || preset === 'dpad-action') {
                const leftZone = document.createElement('div');
                leftZone.className = 'tc-left-zone';
                leftZone.innerHTML = `
                    <div class="tc-dpad">
                        <div></div>
                        <div class="tc-dpad-btn" data-key="ArrowUp" data-code="ArrowUp">▲</div>
                        <div></div>
                        <div class="tc-dpad-btn" data-key="ArrowLeft" data-code="ArrowLeft">◀</div>
                        <div></div>
                        <div class="tc-dpad-btn" data-key="ArrowRight" data-code="ArrowRight">▶</div>
                        <div></div>
                        <div class="tc-dpad-btn" data-key="ArrowDown" data-code="ArrowDown">▼</div>
                        <div></div>
                    </div>
                `;
                this.container.appendChild(leftZone);
            } else if (preset === 'lr-action') {
                const leftZone = document.createElement('div');
                leftZone.className = 'tc-left-zone';
                leftZone.innerHTML = `
                    <div class="tc-hpad">
                        <div class="tc-hpad-btn" data-key="ArrowLeft" data-code="ArrowLeft">◀</div>
                        <div class="tc-hpad-btn" data-key="ArrowRight" data-code="ArrowRight">▶</div>
                    </div>
                `;
                this.container.appendChild(leftZone);
            } else if (preset === 'joystick') {
                const leftZone = document.createElement('div');
                leftZone.className = 'tc-left-zone';
                leftZone.innerHTML = `
                    <div class="tc-joystick-base" id="tcJoystickBase">
                        <div class="tc-joystick-thumb" id="tcJoystickThumb"></div>
                    </div>
                `;
                this.container.appendChild(leftZone);
            }

            // 右侧动作按钮区
            const rightZone = document.createElement('div');
            rightZone.className = 'tc-right-zone';

            let buttons = this.options.buttons || [];
            // 如果使用预设且未提供自定义按键，配置默认常见按钮
            if (buttons.length === 0) {
                if (preset === 'dpad-action' || preset === 'lr-action') {
                    buttons = [
                        { id: 'jump', label: '动作', key: ' ', code: 'Space', class: 'accent' }
                    ];
                }
            }

            buttons.forEach(btn => {
                const b = document.createElement('div');
                b.className = `tc-action-btn ${btn.class || ''}`;
                b.dataset.key = btn.key || ' ';
                b.dataset.code = btn.code || 'Space';
                b.dataset.action = btn.id || 'action';
                b.innerHTML = btn.label || 'A';
                rightZone.appendChild(b);
            });

            if (buttons.length > 0 || rightZone.children.length > 0) {
                this.container.appendChild(rightZone);
            }

            // 滑动手势层提示（若仅有 swipe 预设）
            if (preset === 'swipe') {
                const tip = document.createElement('div');
                tip.className = 'tc-swipe-indicator';
                tip.textContent = '⟵ 滑动控制 ⟶';
                this.container.appendChild(tip);
            }

            document.body.appendChild(this.container);
        }

        bindEvents() {
            // 绑定虚拟按键（D-Pad、H-Pad、Action Buttons）
            const attachTouchEvents = (element) => {
                const key = element.dataset.key;
                const code = element.dataset.code || key;
                const action = element.dataset.action;

                const press = (e) => {
                    if (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    element.classList.add('pressed');
                    this.pressKey(key, code);
                    this.hapticFeedback();
                    if (this.options.onAction && action) {
                        this.options.onAction(action, true);
                    }
                };

                const release = (e) => {
                    if (e) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                    element.classList.remove('pressed');
                    this.releaseKey(key, code);
                    if (this.options.onAction && action) {
                        this.options.onAction(action, false);
                    }
                };

                element.addEventListener('touchstart', press, { passive: false });
                element.addEventListener('touchend', release, { passive: false });
                element.addEventListener('touchcancel', release, { passive: false });
                element.addEventListener('mousedown', press);
                element.addEventListener('mouseup', release);
                element.addEventListener('mouseleave', release);
            };

            this.container.querySelectorAll('[data-key]').forEach(attachTouchEvents);

            // 摇杆逻辑
            if (this.options.preset === 'joystick') {
                this.setupJoystick();
            }

            // 全局滑动手势监听
            if (this.options.preset === 'swipe' || this.options.enableSwipe) {
                this.setupSwipe();
            }
        }

        setupJoystick() {
            const base = document.getElementById('tcJoystickBase');
            const thumb = document.getElementById('tcJoystickThumb');
            if (!base || !thumb) return;

            const radius = 40;
            let touchId = null;
            let center = { x: 0, y: 0 };

            const handleStart = (e) => {
                const touch = e.changedTouches ? e.changedTouches[0] : e;
                if (touchId !== null && e.changedTouches) return;
                touchId = touch.identifier !== undefined ? touch.identifier : 'mouse';

                const rect = base.getBoundingClientRect();
                center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
                handleMove(e);
            };

            const handleMove = (e) => {
                let touch = null;
                if (e.changedTouches) {
                    for (let i = 0; i < e.changedTouches.length; i++) {
                        if (e.changedTouches[i].identifier === touchId) {
                            touch = e.changedTouches[i];
                            break;
                        }
                    }
                } else if (touchId === 'mouse') {
                    touch = e;
                }
                if (!touch) return;
                if (e.cancelable) e.preventDefault();

                const dx = touch.clientX - center.x;
                const dy = touch.clientY - center.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const angle = Math.atan2(dy, dx);
                const cappedDist = Math.min(dist, radius);

                const tx = Math.cos(angle) * cappedDist;
                const ty = Math.sin(angle) * cappedDist;

                thumb.style.transform = `translate(${tx}px, ${ty}px)`;

                this.vector.x = tx / radius;
                this.vector.y = ty / radius;
                this.vector.angle = angle;
                this.vector.intensity = cappedDist / radius;

                // 映射为上下左右按键触发
                const threshold = 0.35;
                if (this.vector.x < -threshold) this.pressKey('ArrowLeft', 'ArrowLeft');
                else this.releaseKey('ArrowLeft', 'ArrowLeft');

                if (this.vector.x > threshold) this.pressKey('ArrowRight', 'ArrowRight');
                else this.releaseKey('ArrowRight', 'ArrowRight');

                if (this.vector.y < -threshold) this.pressKey('ArrowUp', 'ArrowUp');
                else this.releaseKey('ArrowUp', 'ArrowUp');

                if (this.vector.y > threshold) this.pressKey('ArrowDown', 'ArrowDown');
                else this.releaseKey('ArrowDown', 'ArrowDown');

                if (this.options.onAction) {
                    this.options.onAction('joystick', true, this.vector);
                }
            };

            const handleEnd = (e) => {
                let ended = false;
                if (e.changedTouches) {
                    for (let i = 0; i < e.changedTouches.length; i++) {
                        if (e.changedTouches[i].identifier === touchId) {
                            ended = true;
                            break;
                        }
                    }
                } else if (touchId === 'mouse') {
                    ended = true;
                }
                if (!ended) return;

                touchId = null;
                thumb.style.transform = 'translate(0px, 0px)';
                this.vector = { x: 0, y: 0, angle: 0, intensity: 0 };
                this.releaseKey('ArrowLeft', 'ArrowLeft');
                this.releaseKey('ArrowRight', 'ArrowRight');
                this.releaseKey('ArrowUp', 'ArrowUp');
                this.releaseKey('ArrowDown', 'ArrowDown');
            };

            base.addEventListener('touchstart', handleStart, { passive: false });
            window.addEventListener('touchmove', handleMove, { passive: false });
            window.addEventListener('touchend', handleEnd, { passive: false });
            window.addEventListener('touchcancel', handleEnd, { passive: false });
        }

        setupSwipe() {
            let startX = 0, startY = 0;
            const threshold = 35; // 最小滑动位移

            window.addEventListener('touchstart', (e) => {
                if (e.touches.length === 1) {
                    startX = e.touches[0].clientX;
                    startY = e.touches[0].clientY;
                }
            }, { passive: true });

            window.addEventListener('touchend', (e) => {
                if (e.changedTouches.length === 1) {
                    const dx = e.changedTouches[0].clientX - startX;
                    const dy = e.changedTouches[0].clientY - startY;
                    const absX = Math.abs(dx);
                    const absY = Math.abs(dy);

                    if (Math.max(absX, absY) > threshold) {
                        this.hapticFeedback();
                        if (absX > absY) {
                            if (dx > 0) this.pulseKey('ArrowRight', 'ArrowRight');
                            else this.pulseKey('ArrowLeft', 'ArrowLeft');
                        } else {
                            if (dy > 0) this.pulseKey('ArrowDown', 'ArrowDown');
                            else this.pulseKey('ArrowUp', 'ArrowUp');
                        }
                    }
                }
            }, { passive: true });
        }

        pulseKey(key, code) {
            this.pressKey(key, code);
            setTimeout(() => this.releaseKey(key, code), 60);
        }

        pressKey(key, code) {
            if (this.activeKeys.has(key)) return;
            this.activeKeys.add(key);

            const ev = new KeyboardEvent('keydown', {
                key,
                code: code || key,
                bubbles: true,
                cancelable: true
            });
            window.dispatchEvent(ev);
            document.dispatchEvent(ev);
        }

        releaseKey(key, code) {
            if (!this.activeKeys.has(key)) return;
            this.activeKeys.delete(key);

            const ev = new KeyboardEvent('keyup', {
                key,
                code: code || key,
                bubbles: true,
                cancelable: true
            });
            window.dispatchEvent(ev);
            document.dispatchEvent(ev);
        }

        hapticFeedback() {
            if (this.options.vibrate && navigator.vibrate) {
                try { navigator.vibrate(12); } catch (e) {}
            }
        }

        setVisible(visible) {
            this.visible = visible;
            if (this.container) {
                this.container.style.display = visible ? 'block' : 'none';
            }
            if (this.toggleBtn) {
                this.toggleBtn.classList.toggle('active', visible);
            }
        }

        isDown(key) {
            return this.activeKeys.has(key);
        }

        getVector() {
            return Object.assign({}, this.vector);
        }

        destroy() {
            if (this.container && this.container.parentNode) {
                this.container.parentNode.removeChild(this.container);
            }
            if (this.toggleBtn && this.toggleBtn.parentNode) {
                this.toggleBtn.parentNode.removeChild(this.toggleBtn);
            }
            this.activeKeys.clear();
        }
    }

    // 全局导出与单例快捷方式
    global.TouchController = {
        init: function (options) {
            if (activeController) {
                activeController.destroy();
            }
            activeController = new TouchControllerInstance(options);
            return activeController;
        },
        get: function () {
            return activeController;
        },
        isDown: function (key) {
            return activeController ? activeController.isDown(key) : false;
        },
        getVector: function () {
            return activeController ? activeController.getVector() : { x: 0, y: 0, angle: 0, intensity: 0 };
        },
        destroy: function () {
            if (activeController) {
                activeController.destroy();
                activeController = null;
            }
        }
    };

})(typeof window !== 'undefined' ? window : this);
