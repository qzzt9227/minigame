/**
 * ColorPicker - 通用前端调色盘 API
 * 
 * 特性：
 * - 纯原生 JavaScript，零第三方依赖，自包含暗色 HUD 样式。
 * - 提供精选高饱和度预设色块、色相滑动条与十六进制实时预览。
 * - 无需用户手动填写 HTML 代码，点击或滑动即可挑选心仪色彩。
 * - 支持以弹窗形式呼出 (ColorPicker.open) 或与指定 DOM 元素绑定 (ColorPicker.attach)。
 */

(function (global) {
    'use strict';

    const DEFAULT_PRESETS = [
        '#00c8ff', '#00ff9d', '#e8652b', '#ef4444',
        '#b05bf8', '#f59e0b', '#38bdf8', '#fb7171',
        '#4ade80', '#eab308', '#ec4899', '#ffffff',
        '#64748b', '#06b6d4', '#84cc16', '#a855f7'
    ];

    const STYLES = `
        .cp-modal-mask {
            position: fixed;
            top: 0; left: 0;
            width: 100vw; height: 100vh;
            background: rgba(8, 8, 12, 0.75);
            backdrop-filter: blur(6px);
            z-index: 100000;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px;
            font-family: 'Rajdhani', -apple-system, sans-serif;
            user-select: none;
            -webkit-user-select: none;
        }
        .cp-dialog {
            background: #111420;
            border: 2px solid #28324a;
            border-radius: 12px;
            box-shadow: 0 16px 40px rgba(0, 0, 0, 0.7), 0 0 25px rgba(0, 200, 255, 0.15);
            width: 320px;
            max-width: 95vw;
            padding: 20px;
            color: #fff;
            display: flex;
            flex-direction: column;
            gap: 16px;
            animation: cpFadeIn 0.15s ease-out;
        }
        @keyframes cpFadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .cp-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #20273a;
            padding-bottom: 10px;
        }
        .cp-title {
            font-size: 17px;
            font-weight: 700;
            letter-spacing: 1px;
            color: #fff;
        }
        .cp-close-btn {
            background: transparent;
            border: none;
            color: #888;
            font-size: 20px;
            cursor: pointer;
            padding: 0 4px;
        }
        .cp-close-btn:hover { color: #fff; }

        .cp-preview-bar {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .cp-preview-box {
            width: 52px;
            height: 38px;
            border-radius: 6px;
            border: 2px solid #fff;
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
            flex-shrink: 0;
        }
        .cp-hex-display {
            flex: 1;
            background: #090b12;
            border: 1px solid #242c40;
            border-radius: 6px;
            padding: 7px 12px;
            font-size: 15px;
            font-family: monospace;
            font-weight: 700;
            color: #00c8ff;
            text-align: center;
        }

        .cp-hue-slider-wrap {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }
        .cp-label {
            font-size: 12px;
            color: #889;
            letter-spacing: 0.5px;
        }
        .cp-hue-slider {
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            height: 16px;
            border-radius: 8px;
            outline: none;
            cursor: pointer;
            background: linear-gradient(to right, 
                #ff0000 0%, #ffff00 17%, #00ff00 33%, 
                #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%);
        }
        .cp-hue-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background: #fff;
            border: 2px solid #111;
            box-shadow: 0 0 6px rgba(0,0,0,0.6);
            cursor: pointer;
        }

        .cp-swatches-grid {
            display: grid;
            grid-template-columns: repeat(8, 1fr);
            gap: 8px;
        }
        .cp-swatch {
            width: 100%;
            aspect-ratio: 1;
            border-radius: 6px;
            cursor: pointer;
            border: 2px solid transparent;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            transition: transform 0.1s, border-color 0.1s;
        }
        .cp-swatch:hover {
            transform: scale(1.15);
            border-color: #fff;
            z-index: 2;
        }
        .cp-swatch.active {
            border-color: #fff;
            box-shadow: 0 0 10px #fff;
        }

        .cp-actions {
            display: flex;
            gap: 10px;
            margin-top: 4px;
        }
        .cp-btn {
            flex: 1;
            padding: 9px 0;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            text-align: center;
            border: none;
            transition: all 0.15s;
        }
        .cp-btn-confirm {
            background: #00c8ff;
            color: #08080c;
        }
        .cp-btn-confirm:hover {
            background: #00ff9d;
            box-shadow: 0 0 12px rgba(0, 255, 157, 0.4);
        }
        .cp-btn-cancel {
            background: #202638;
            color: #bbb;
        }
        .cp-btn-cancel:hover {
            background: #2b334a;
            color: #fff;
        }
    `;

    function injectStyles() {
        if (!document.getElementById('color-picker-styles')) {
            const style = document.createElement('style');
            style.id = 'color-picker-styles';
            style.textContent = STYLES;
            document.head.appendChild(style);
        }
    }

    function hslToHex(h, s, l) {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }

    class ColorPickerModal {
        constructor(options = {}) {
            injectStyles();
            this.options = Object.assign({
                title: '选择颜色',
                color: '#00c8ff',
                presetColors: DEFAULT_PRESETS,
                onSelect: null,
                onCancel: null
            }, options);

            this.currentColor = this.options.color;
            this.modalEl = null;
            this.createDOM();
        }

        createDOM() {
            this.modalEl = document.createElement('div');
            this.modalEl.className = 'cp-modal-mask';

            const swatchesHtml = this.options.presetColors.map(c => `
                <div class="cp-swatch ${c.toLowerCase() === this.currentColor.toLowerCase() ? 'active' : ''}" 
                     style="background: ${c};" 
                     data-color="${c}"></div>
            `).join('');

            this.modalEl.innerHTML = `
                <div class="cp-dialog">
                    <div class="cp-header">
                        <span class="cp-title">${this.options.title}</span>
                        <button class="cp-close-btn" id="cpClose">✕</button>
                    </div>

                    <div class="cp-preview-bar">
                        <div class="cp-preview-box" id="cpPreview" style="background:${this.currentColor};"></div>
                        <div class="cp-hex-display" id="cpHex">${this.currentColor.toUpperCase()}</div>
                    </div>

                    <div class="cp-hue-slider-wrap">
                        <div class="cp-label">色相滑动调节</div>
                        <input type="range" min="0" max="360" value="190" class="cp-hue-slider" id="cpHueSlider">
                    </div>

                    <div class="cp-hue-slider-wrap">
                        <div class="cp-label">精选预设色板</div>
                        <div class="cp-swatches-grid" id="cpSwatches">
                            ${swatchesHtml}
                        </div>
                    </div>

                    <div class="cp-actions">
                        <button class="cp-btn cp-btn-cancel" id="cpCancel">取消</button>
                        <button class="cp-btn cp-btn-confirm" id="cpConfirm">确定</button>
                    </div>
                </div>
            `;

            document.body.appendChild(this.modalEl);
            this.bindEvents();
        }

        bindEvents() {
            const preview = this.modalEl.querySelector('#cpPreview');
            const hexText = this.modalEl.querySelector('#cpHex');
            const slider = this.modalEl.querySelector('#cpHueSlider');
            const swatches = this.modalEl.querySelectorAll('.cp-swatch');

            const setColor = (c) => {
                this.currentColor = c;
                preview.style.background = c;
                hexText.textContent = c.toUpperCase();
                swatches.forEach(s => {
                    s.classList.toggle('active', s.dataset.color.toLowerCase() === c.toLowerCase());
                });
            };

            // 色相滑动
            slider.addEventListener('input', (e) => {
                const h = parseInt(e.target.value, 10);
                const hex = hslToHex(h, 95, 55);
                setColor(hex);
            });

            // 色板点击
            swatches.forEach(s => {
                s.addEventListener('click', () => {
                    setColor(s.dataset.color);
                });
            });

            // 确定与取消
            this.modalEl.querySelector('#cpConfirm').addEventListener('click', () => {
                if (this.options.onSelect) this.options.onSelect(this.currentColor);
                this.close();
            });

            const handleCancel = () => {
                if (this.options.onCancel) this.options.onCancel();
                this.close();
            };

            this.modalEl.querySelector('#cpCancel').addEventListener('click', handleCancel);
            this.modalEl.querySelector('#cpClose').addEventListener('click', handleCancel);
            this.modalEl.addEventListener('click', (e) => {
                if (e.target === this.modalEl) handleCancel();
            });
        }

        close() {
            if (this.modalEl && this.modalEl.parentNode) {
                this.modalEl.parentNode.removeChild(this.modalEl);
                this.modalEl = null;
            }
        }
    }

    global.ColorPicker = {
        open: function (options) {
            return new ColorPickerModal(options);
        },
        attach: function (triggerEl, options = {}, maybeDefaultColor, maybeTitle) {
            if (typeof triggerEl === 'string') {
                triggerEl = document.querySelector(triggerEl);
            }
            if (!triggerEl) return;

            let opts = {};
            if (typeof options === 'function') {
                opts = {
                    onChange: options,
                    defaultColor: maybeDefaultColor || '#00c8ff',
                    title: maybeTitle || '选择颜色'
                };
            } else {
                opts = options || {};
            }

            let curColor = opts.defaultColor || '#00c8ff';
            triggerEl.style.backgroundColor = curColor;

            triggerEl.addEventListener('click', () => {
                new ColorPickerModal({
                    title: opts.title || '选择颜色',
                    color: curColor,
                    presetColors: opts.presetColors || DEFAULT_PRESETS,
                    onSelect: (newColor) => {
                        curColor = newColor;
                        triggerEl.style.backgroundColor = newColor;
                        if (opts.onChange) opts.onChange(newColor);
                    }
                });
            });
        }
    };

})(typeof window !== 'undefined' ? window : this);
