/**
 * Accessibility Features
 * Dark/Light mode, Font size, Keyboard navigation
 */

const Accessibility = {
    settings: {
        theme: 'dark',
        fontSize: 'normal',
        reducedMotion: false,
        highContrast: false
    },

    fontSizes: {
        small: { label: 'صغير', size: '14px', multiplier: 0.875 },
        normal: { label: 'عادي', size: '16px', multiplier: 1 },
        large: { label: 'كبير', size: '18px', multiplier: 1.125 },
        xlarge: { label: 'كبير جداً', size: '20px', multiplier: 1.25 }
    },

    /**
     * Initialize accessibility features
     */
    init() {
        this.loadSettings();
        this.applySettings();
        this.createToggleButtons();
        this.initKeyboardNavigation();

        // Check for system preferences
        this.checkSystemPreferences();
    },

    /**
     * Load saved settings
     */
    loadSettings() {
        try {
            const saved = localStorage.getItem('accessibilitySettings');
            if (saved) {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.warn('Could not load accessibility settings:', e);
        }
    },

    /**
     * Save settings
     */
    saveSettings() {
        try {
            localStorage.setItem('accessibilitySettings', JSON.stringify(this.settings));
        } catch (e) {
            console.warn('Could not save accessibility settings:', e);
        }
    },

    /**
     * Apply current settings to the page
     */
    applySettings() {
        // Apply theme
        document.documentElement.setAttribute('data-theme', this.settings.theme);
        document.body.classList.toggle('light-theme', this.settings.theme === 'light');

        // Apply font size
        const fontSize = this.fontSizes[this.settings.fontSize];
        document.documentElement.style.fontSize = fontSize.size;

        // Apply reduced motion
        document.body.classList.toggle('reduced-motion', this.settings.reducedMotion);

        // Apply high contrast
        document.body.classList.toggle('high-contrast', this.settings.highContrast);
    },

    /**
     * Check system preferences
     */
    checkSystemPreferences() {
        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.settings.reducedMotion = true;
        }

        // Check for color scheme preference
        if (window.matchMedia('(prefers-color-scheme: light)').matches) {
            // Only apply if user hasn't set a preference
            const saved = localStorage.getItem('accessibilitySettings');
            if (!saved) {
                this.settings.theme = 'light';
            }
        }

        this.applySettings();
    },

    /**
     * Create accessibility toggle buttons
     */
    createToggleButtons() {
        // Theme toggle button
        const themeBtn = document.createElement('button');
        themeBtn.id = 'themeToggle';
        themeBtn.className = 'accessibility-btn theme-toggle';
        themeBtn.innerHTML = this.settings.theme === 'dark' ? '☀️' : '🌙';
        themeBtn.title = 'تغيير المظهر';
        themeBtn.setAttribute('aria-label', 'تغيير بين الوضع الليلي والنهاري');
        themeBtn.addEventListener('click', () => this.toggleTheme());

        // Font size button
        const fontBtn = document.createElement('button');
        fontBtn.id = 'fontSizeToggle';
        fontBtn.className = 'accessibility-btn font-toggle';
        fontBtn.innerHTML = 'أ';
        fontBtn.title = 'تغيير حجم الخط';
        fontBtn.setAttribute('aria-label', 'تغيير حجم الخط');
        fontBtn.addEventListener('click', () => this.cycleFontSize());

        // Create container
        const container = document.createElement('div');
        container.className = 'accessibility-controls';
        container.appendChild(themeBtn);
        container.appendChild(fontBtn);

        document.body.appendChild(container);
    },

    /**
     * Toggle between dark and light theme
     */
    toggleTheme() {
        this.settings.theme = this.settings.theme === 'dark' ? 'light' : 'dark';
        this.applySettings();
        this.saveSettings();

        // Update button icon
        const btn = document.getElementById('themeToggle');
        if (btn) {
            btn.innerHTML = this.settings.theme === 'dark' ? '☀️' : '🌙';
        }

        // Play sound
        if (typeof SoundEffects !== 'undefined') {
            SoundEffects.click();
        }

        // Show notification
        this.showNotification(
            this.settings.theme === 'dark' ? '🌙 الوضع الليلي' : '☀️ الوضع النهاري'
        );
    },

    /**
     * Cycle through font sizes
     */
    cycleFontSize() {
        const sizes = Object.keys(this.fontSizes);
        const currentIndex = sizes.indexOf(this.settings.fontSize);
        const nextIndex = (currentIndex + 1) % sizes.length;
        this.settings.fontSize = sizes[nextIndex];

        this.applySettings();
        this.saveSettings();

        if (typeof SoundEffects !== 'undefined') {
            SoundEffects.click();
        }

        this.showNotification(`حجم الخط: ${this.fontSizes[this.settings.fontSize].label}`);
    },

    /**
     * Set specific font size
     */
    setFontSize(size) {
        if (this.fontSizes[size]) {
            this.settings.fontSize = size;
            this.applySettings();
            this.saveSettings();
        }
    },

    /**
     * Toggle reduced motion
     */
    toggleReducedMotion() {
        this.settings.reducedMotion = !this.settings.reducedMotion;
        this.applySettings();
        this.saveSettings();
    },

    /**
     * Toggle high contrast
     */
    toggleHighContrast() {
        this.settings.highContrast = !this.settings.highContrast;
        this.applySettings();
        this.saveSettings();
    },

    /**
     * Show notification
     */
    showNotification(message) {
        const existing = document.querySelector('.accessibility-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = 'accessibility-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        requestAnimationFrame(() => notification.classList.add('show'));

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    },

    /**
     * Initialize keyboard navigation
     */
    initKeyboardNavigation() {
        // Add focus styles
        document.addEventListener('keydown', (e) => {
            // Show focus outlines when using keyboard
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Skip if user is typing in an input
            if (e.target.matches('input, textarea, select')) return;

            // Alt + T = Toggle theme
            if (e.altKey && e.key === 't') {
                e.preventDefault();
                this.toggleTheme();
            }

            // Alt + F = Cycle font size
            if (e.altKey && e.key === 'f') {
                e.preventDefault();
                this.cycleFontSize();
            }

            // Escape = Close any open modal/overlay
            if (e.key === 'Escape') {
                this.closeAllModals();
            }

            // Arrow keys for navigation in certain contexts
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                this.handleArrowNavigation(e);
            }
        });

        // Add ARIA labels to interactive elements
        this.addAriaLabels();
    },

    /**
     * Handle arrow key navigation
     */
    handleArrowNavigation(e) {
        // Quiz options navigation
        const quizOptions = document.querySelectorAll('.quiz-option');
        if (quizOptions.length > 0) {
            const focused = document.activeElement;
            const currentIndex = Array.from(quizOptions).indexOf(focused);

            if (currentIndex !== -1) {
                e.preventDefault();
                let nextIndex;

                if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    nextIndex = (currentIndex + 1) % quizOptions.length;
                } else {
                    nextIndex = (currentIndex - 1 + quizOptions.length) % quizOptions.length;
                }

                quizOptions[nextIndex].focus();
            }
        }

        // Course cards navigation
        const courseCards = document.querySelectorAll('.course-card:not(.locked)');
        if (courseCards.length > 0) {
            const focused = document.activeElement;
            const currentIndex = Array.from(courseCards).indexOf(focused);

            if (currentIndex !== -1) {
                e.preventDefault();
                let nextIndex;

                if (e.key === 'ArrowRight') {
                    nextIndex = (currentIndex + 1) % courseCards.length;
                } else {
                    nextIndex = (currentIndex - 1 + courseCards.length) % courseCards.length;
                }

                courseCards[nextIndex].focus();
            }
        }
    },

    /**
     * Add ARIA labels to elements
     */
    addAriaLabels() {
        // Add tabindex to important elements
        document.querySelectorAll('.course-card, .quiz-option, .btn').forEach(el => {
            if (!el.hasAttribute('tabindex')) {
                el.setAttribute('tabindex', '0');
            }
        });

        // Add role to course cards
        document.querySelectorAll('.course-card').forEach(el => {
            el.setAttribute('role', 'button');
        });

        // Add aria-label to buttons without text
        document.querySelectorAll('button').forEach(btn => {
            if (!btn.textContent.trim() && !btn.getAttribute('aria-label')) {
                const icon = btn.querySelector('.btn-icon');
                if (icon) {
                    btn.setAttribute('aria-label', icon.textContent);
                }
            }
        });
    },

    /**
     * Close all open modals
     */
    closeAllModals() {
        // Close various modal types
        const modals = [
            '#flashcardsContainer',
            '#glossaryContainer',
            '#caseStudyContainer',
            '#postersContainer',
            '#miniGameContainer',
            '.tour-overlay'
        ];

        modals.forEach(selector => {
            const el = document.querySelector(selector);
            if (el) {
                el.classList.remove('show');
            }
        });
    },

    /**
     * Open accessibility settings panel
     */
    openSettingsPanel() {
        const existing = document.getElementById('accessibilityPanel');
        if (existing) existing.remove();

        const panel = document.createElement('div');
        panel.id = 'accessibilityPanel';
        panel.className = 'accessibility-panel';
        panel.innerHTML = `
            <div class="accessibility-panel-content">
                <button class="btn btn-back panel-close" id="closeAccessibility">✕</button>
                <h2>⚙️ إعدادات إمكانية الوصول</h2>
                
                <div class="setting-group">
                    <h3>🎨 المظهر</h3>
                    <div class="theme-options">
                        <button class="theme-option ${this.settings.theme === 'dark' ? 'active' : ''}" data-theme="dark">
                            🌙 ليلي
                        </button>
                        <button class="theme-option ${this.settings.theme === 'light' ? 'active' : ''}" data-theme="light">
                            ☀️ نهاري
                        </button>
                    </div>
                </div>

                <div class="setting-group">
                    <h3>📝 حجم الخط</h3>
                    <div class="font-options">
                        ${Object.entries(this.fontSizes).map(([key, val]) => `
                            <button class="font-option ${this.settings.fontSize === key ? 'active' : ''}" data-size="${key}">
                                ${val.label}
                            </button>
                        `).join('')}
                    </div>
                </div>

                <div class="setting-group">
                    <h3>✨ تأثيرات</h3>
                    <label class="toggle-setting">
                        <input type="checkbox" ${this.settings.reducedMotion ? 'checked' : ''} id="reducedMotionToggle">
                        <span>تقليل الحركة</span>
                    </label>
                    <label class="toggle-setting">
                        <input type="checkbox" ${this.settings.highContrast ? 'checked' : ''} id="highContrastToggle">
                        <span>تباين عالي</span>
                    </label>
                </div>

                <div class="setting-group">
                    <h3>⌨️ اختصارات لوحة المفاتيح</h3>
                    <ul class="shortcuts-list">
                        <li><kbd>Alt</kbd> + <kbd>T</kbd> = تغيير المظهر</li>
                        <li><kbd>Alt</kbd> + <kbd>F</kbd> = تغيير حجم الخط</li>
                        <li><kbd>Esc</kbd> = إغلاق النوافذ</li>
                        <li><kbd>Tab</kbd> = التنقل بين العناصر</li>
                    </ul>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // Event listeners
        document.getElementById('closeAccessibility').addEventListener('click', () => {
            panel.classList.remove('show');
            setTimeout(() => panel.remove(), 300);
        });

        panel.querySelectorAll('.theme-option').forEach(btn => {
            btn.addEventListener('click', () => {
                this.settings.theme = btn.dataset.theme;
                this.applySettings();
                this.saveSettings();
                panel.querySelectorAll('.theme-option').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        panel.querySelectorAll('.font-option').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setFontSize(btn.dataset.size);
                panel.querySelectorAll('.font-option').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        document.getElementById('reducedMotionToggle').addEventListener('change', (e) => {
            this.settings.reducedMotion = e.target.checked;
            this.applySettings();
            this.saveSettings();
        });

        document.getElementById('highContrastToggle').addEventListener('change', (e) => {
            this.settings.highContrast = e.target.checked;
            this.applySettings();
            this.saveSettings();
        });

        requestAnimationFrame(() => panel.classList.add('show'));
    }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Accessibility.init();
});
