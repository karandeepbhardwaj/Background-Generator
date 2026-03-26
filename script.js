// ============================================
// GRADIENT STUDIO - Main Script
// ============================================

(function () {
    'use strict';

    // ---- State ----
    const state = {
        type: 'linear',
        angle: 90,
        colors: [
            { color: '#6366f1', position: 0 },
            { color: '#ec4899', position: 100 }
        ],
        animated: false,
        animationSpeed: 5
    };

    // ---- Preset Palettes ----
    const presets = [
        { name: 'Indigo Rose', colors: ['#6366f1', '#ec4899'] },
        { name: 'Ocean', colors: ['#0ea5e9', '#6366f1'] },
        { name: 'Sunset', colors: ['#f97316', '#ec4899', '#8b5cf6'] },
        { name: 'Aurora', colors: ['#06b6d4', '#8b5cf6', '#ec4899'] },
        { name: 'Forest', colors: ['#059669', '#06b6d4'] },
        { name: 'Ember', colors: ['#dc2626', '#f97316', '#fbbf24'] },
        { name: 'Midnight', colors: ['#1e1b4b', '#312e81', '#6366f1'] },
        { name: 'Peach', colors: ['#fb923c', '#f472b6'] },
        { name: 'Arctic', colors: ['#e0f2fe', '#7dd3fc', '#0ea5e9'] },
        { name: 'Lavender', colors: ['#c084fc', '#f0abfc'] },
        { name: 'Neon', colors: ['#22d3ee', '#a3e635'] },
        { name: 'Dusk', colors: ['#1e293b', '#7c3aed', '#f43f5e'] },
        { name: 'Coral', colors: ['#fda4af', '#fcd34d'] },
        { name: 'Nebula', colors: ['#7c3aed', '#2563eb', '#06b6d4'] },
        { name: 'Cherry', colors: ['#881337', '#e11d48'] },
        { name: 'Mint', colors: ['#d1fae5', '#6ee7b7', '#34d399'] }
    ];

    // ---- DOM References ----
    const dom = {
        preview: document.getElementById('gradient-preview'),
        cssOutput: document.getElementById('css-output'),
        angleSlider: document.getElementById('angle-slider'),
        angleValue: document.getElementById('angle-value'),
        angleDial: document.getElementById('angle-dial'),
        angleIndicator: document.getElementById('angle-indicator'),
        angleCard: document.getElementById('angle-card'),
        colorStops: document.getElementById('color-stops'),
        presetsGrid: document.getElementById('presets-grid'),
        toggleAnimate: document.getElementById('toggle-animate'),
        speedSlider: document.getElementById('speed-slider'),
        speedValue: document.getElementById('speed-value'),
        speedContainer: document.getElementById('animation-speed-container'),
        fullscreen: document.getElementById('fullscreen-preview'),
        toast: document.getElementById('toast'),
        toastMessage: document.getElementById('toast-message'),
        logoIcon: document.getElementById('logo-icon'),
        canvas: document.getElementById('export-canvas')
    };

    // ---- Gradient Builder ----
    function buildGradientCSS() {
        const stops = state.colors
            .map(s => `${s.color} ${s.position}%`)
            .join(', ');

        switch (state.type) {
            case 'linear':
                return `linear-gradient(${state.angle}deg, ${stops})`;
            case 'radial':
                return `radial-gradient(circle, ${stops})`;
            case 'conic':
                return `conic-gradient(from ${state.angle}deg, ${stops})`;
            default:
                return `linear-gradient(${state.angle}deg, ${stops})`;
        }
    }

    function buildFullCSS() {
        const gradient = buildGradientCSS();
        let css = `background: ${state.colors[0].color};\n`;
        css += `background: ${gradient};`;
        if (state.animated) {
            css += `\nanimation: gradientShift ${state.animationSpeed}s linear infinite;`;
            css += `\n\n@keyframes gradientShift {\n  0% { filter: hue-rotate(0deg); }\n  100% { filter: hue-rotate(360deg); }\n}`;
        }
        return css;
    }

    // ---- Render Functions ----
    function updatePreview() {
        const gradient = buildGradientCSS();
        dom.preview.style.background = gradient;
        dom.fullscreen.style.background = gradient;
        dom.logoIcon.style.background = gradient;

        // Animation
        if (state.animated) {
            dom.preview.classList.add('gradient-animated');
            dom.fullscreen.classList.add('gradient-animated');
            dom.preview.style.setProperty('--animation-speed', state.animationSpeed + 's');
            dom.fullscreen.style.setProperty('--animation-speed', state.animationSpeed + 's');
        } else {
            dom.preview.classList.remove('gradient-animated');
            dom.fullscreen.classList.remove('gradient-animated');
        }

        // CSS output
        dom.cssOutput.textContent = buildFullCSS();
    }

    function renderColorStops() {
        dom.colorStops.innerHTML = '';

        state.colors.forEach((stop, index) => {
            const el = document.createElement('div');
            el.className = 'color-stop';
            el.innerHTML = `
                <input type="color" class="color-stop-input" value="${stop.color}" data-index="${index}">
                <input type="text" class="color-stop-hex" value="${stop.color}" data-index="${index}" maxlength="7">
                <input type="range" class="color-stop-position slider" min="0" max="100" value="${stop.position}" data-index="${index}">
                <span class="color-stop-pos-label">${stop.position}%</span>
                ${state.colors.length > 2 ? `
                    <button class="btn-icon-only" data-remove="${index}" title="Remove">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                ` : ''}
            `;
            dom.colorStops.appendChild(el);
        });

        // Bind events
        dom.colorStops.querySelectorAll('.color-stop-input').forEach(input => {
            input.addEventListener('input', (e) => {
                const i = parseInt(e.target.dataset.index);
                state.colors[i].color = e.target.value;
                e.target.closest('.color-stop').querySelector('.color-stop-hex').value = e.target.value;
                updatePreview();
            });
        });

        dom.colorStops.querySelectorAll('.color-stop-hex').forEach(input => {
            input.addEventListener('input', (e) => {
                const i = parseInt(e.target.dataset.index);
                let val = e.target.value;
                if (val.length === 7 && /^#[0-9a-fA-F]{6}$/.test(val)) {
                    state.colors[i].color = val;
                    e.target.closest('.color-stop').querySelector('.color-stop-input').value = val;
                    updatePreview();
                }
            });
        });

        dom.colorStops.querySelectorAll('.color-stop-position').forEach(input => {
            input.addEventListener('input', (e) => {
                const i = parseInt(e.target.dataset.index);
                state.colors[i].position = parseInt(e.target.value);
                e.target.closest('.color-stop').querySelector('.color-stop-pos-label').textContent = e.target.value + '%';
                updatePreview();
            });
        });

        dom.colorStops.querySelectorAll('[data-remove]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const i = parseInt(e.currentTarget.dataset.remove);
                state.colors.splice(i, 1);
                renderColorStops();
                updatePreview();
            });
        });
    }

    function renderPresets() {
        dom.presetsGrid.innerHTML = '';
        presets.forEach((preset, index) => {
            const swatch = document.createElement('button');
            swatch.className = 'preset-swatch';
            swatch.title = preset.name;
            const stops = preset.colors.map((c, i) =>
                `${c} ${Math.round(i / (preset.colors.length - 1) * 100)}%`
            ).join(', ');
            swatch.style.background = `linear-gradient(135deg, ${stops})`;

            swatch.addEventListener('click', () => {
                state.colors = preset.colors.map((c, i) => ({
                    color: c,
                    position: Math.round(i / (preset.colors.length - 1) * 100)
                }));
                renderColorStops();
                updatePreview();
            });

            dom.presetsGrid.appendChild(swatch);
        });
    }

    function updateAngleDial() {
        dom.angleIndicator.style.transform =
            `translate(-50%, -100%) rotate(${state.angle}deg)`;
    }

    // ---- Event Handlers ----

    // Gradient type buttons
    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.type = btn.dataset.type;

            // Show/hide angle control for radial
            dom.angleCard.style.display = state.type === 'radial' ? 'none' : '';

            updatePreview();
        });
    });

    // Angle slider
    dom.angleSlider.addEventListener('input', () => {
        state.angle = parseInt(dom.angleSlider.value);
        dom.angleValue.textContent = state.angle + '°';
        updateAngleDial();
        updatePreview();
    });

    // Angle dial drag
    function handleDialInteraction(e) {
        const rect = dom.angleDial.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        let angle = Math.atan2(clientX - cx, -(clientY - cy)) * (180 / Math.PI);
        if (angle < 0) angle += 360;
        state.angle = Math.round(angle);
        dom.angleSlider.value = state.angle;
        dom.angleValue.textContent = state.angle + '°';
        updateAngleDial();
        updatePreview();
    }

    let dialDragging = false;
    dom.angleDial.addEventListener('mousedown', (e) => {
        dialDragging = true;
        handleDialInteraction(e);
    });
    dom.angleDial.addEventListener('touchstart', (e) => {
        dialDragging = true;
        handleDialInteraction(e);
        e.preventDefault();
    }, { passive: false });
    document.addEventListener('mousemove', (e) => { if (dialDragging) handleDialInteraction(e); });
    document.addEventListener('touchmove', (e) => { if (dialDragging) handleDialInteraction(e); }, { passive: false });
    document.addEventListener('mouseup', () => { dialDragging = false; });
    document.addEventListener('touchend', () => { dialDragging = false; });

    // Add color stop
    document.getElementById('btn-add-color').addEventListener('click', () => {
        if (state.colors.length >= 5) {
            showToast('Maximum 5 color stops');
            return;
        }
        const lastColor = state.colors[state.colors.length - 1];
        state.colors.push({
            color: randomColor(),
            position: Math.min(lastColor.position + 20, 100)
        });
        // Re-distribute positions evenly
        state.colors.forEach((c, i) => {
            c.position = Math.round(i / (state.colors.length - 1) * 100);
        });
        renderColorStops();
        updatePreview();
    });

    // Animation toggle
    dom.toggleAnimate.addEventListener('change', () => {
        state.animated = dom.toggleAnimate.checked;
        dom.speedContainer.classList.toggle('hidden', !state.animated);
        updatePreview();
    });

    // Animation speed
    dom.speedSlider.addEventListener('input', () => {
        state.animationSpeed = parseInt(dom.speedSlider.value);
        dom.speedValue.textContent = state.animationSpeed + 's';
        updatePreview();
    });

    // Random gradient
    document.getElementById('btn-random').addEventListener('click', randomGradient);

    // Copy CSS
    document.getElementById('btn-copy').addEventListener('click', copyCSS);
    document.getElementById('btn-copy-css').addEventListener('click', copyCSS);

    // Fullscreen
    document.getElementById('btn-fullscreen').addEventListener('click', () => {
        dom.fullscreen.classList.remove('hidden');
    });
    document.getElementById('exit-fullscreen').addEventListener('click', () => {
        dom.fullscreen.classList.add('hidden');
    });

    // Export PNG
    document.getElementById('btn-export-png').addEventListener('click', exportPNG);

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT') return;
        switch (e.key.toLowerCase()) {
            case 'r': randomGradient(); break;
            case 'f':
                dom.fullscreen.classList.toggle('hidden');
                break;
            case 'c': copyCSS(); break;
            case 'escape':
                dom.fullscreen.classList.add('hidden');
                break;
        }
    });

    // ---- Utility Functions ----
    function randomColor() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    }

    function randomGradient() {
        const numColors = 2 + Math.floor(Math.random() * 2); // 2-3 colors
        state.colors = [];
        for (let i = 0; i < numColors; i++) {
            state.colors.push({
                color: randomColor(),
                position: Math.round(i / (numColors - 1) * 100)
            });
        }
        state.angle = Math.floor(Math.random() * 360);
        dom.angleSlider.value = state.angle;
        dom.angleValue.textContent = state.angle + '°';
        updateAngleDial();
        renderColorStops();
        updatePreview();
    }

    function copyCSS() {
        navigator.clipboard.writeText(buildFullCSS()).then(() => {
            showToast('CSS copied to clipboard!');
        }).catch(() => {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = buildFullCSS();
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showToast('CSS copied to clipboard!');
        });
    }

    function showToast(message) {
        dom.toastMessage.textContent = message;
        dom.toast.classList.remove('hidden');
        clearTimeout(showToast._timer);
        showToast._timer = setTimeout(() => {
            dom.toast.classList.add('hidden');
        }, 2200);
    }

    function exportPNG() {
        const canvas = dom.canvas;
        const ctx = canvas.getContext('2d');

        // Create gradient on canvas
        let gradient;
        if (state.type === 'linear') {
            const rad = (state.angle - 90) * Math.PI / 180;
            const cx = canvas.width / 2;
            const cy = canvas.height / 2;
            const len = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height) / 2;
            gradient = ctx.createLinearGradient(
                cx - Math.cos(rad) * len,
                cy - Math.sin(rad) * len,
                cx + Math.cos(rad) * len,
                cy + Math.sin(rad) * len
            );
        } else if (state.type === 'radial') {
            gradient = ctx.createRadialGradient(
                canvas.width / 2, canvas.height / 2, 0,
                canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
            );
        } else {
            // Conic gradient via ConicGradient (canvas supports it in modern browsers)
            gradient = ctx.createConicGradient(
                (state.angle - 90) * Math.PI / 180,
                canvas.width / 2,
                canvas.height / 2
            );
        }

        state.colors.forEach(stop => {
            gradient.addColorStop(stop.position / 100, stop.color);
        });

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const link = document.createElement('a');
        link.download = 'gradient-' + Date.now() + '.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        showToast('PNG exported!');
    }

    // ---- Initialize ----
    renderColorStops();
    renderPresets();
    updateAngleDial();
    updatePreview();
})();
