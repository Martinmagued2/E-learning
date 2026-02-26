/**
 * Safety Arcade Game
 * Fast-paced reaction game for identifying safety items
 */

const SafetyArcade = {
    isActive: false,
    score: 0,
    gameLoop: null,
    items: [],
    basket: { x: 50, width: 20 },

    start() {
        this.isActive = true;
        this.score = 0;
        this.items = [];
        this.basket.x = 50;
        this.renderUI();
        this.startGameLoop();

        if (typeof DialogueTour !== 'undefined') {
            DialogueTour.startTour('safetyArcade');
        }
    },

    renderUI() {
        const overlay = document.createElement('div');
        overlay.id = 'arcadeOverlay';
        overlay.className = 'game-overlay';
        overlay.innerHTML = `
            <div class="arcade-container">
                <div class="arcade-header">
                    <h2>🎮 أركيد السلامة</h2>
                    <div class="arcade-score">النقاط: <span id="arcadeScore">0</span></div>
                </div>
                <div class="arcade-body" id="arcadeBody">
                    <div class="arcade-canvas arcade-bg" id="arcadeCanvas">
                        <div class="arcade-basket" id="arcadeBasket" style="left: 50%;">🛒</div>
                    </div>
                    <p class="instruction">استخدم الأسهم (يمين/يسار) للالتقاط أدوات السلامة وتجنب المخاطر!</p>
                </div>
                <div class="arcade-controls">
                    <button class="control-btn" onclick="SafetyArcade.move(-5)">⬅️</button>
                    <button class="control-btn" onclick="SafetyArcade.move(5)">➡️</button>
                </div>
                <button class="close-game" onclick="SafetyArcade.close()">✕</button>
            </div>
        `;
        document.body.appendChild(overlay);

        // Keyboard support
        window.addEventListener('keydown', this.handleKey);
    },

    handleKey(e) {
        if (!SafetyArcade.isActive) return;
        if (e.key === 'ArrowLeft') SafetyArcade.move(-10);
        if (e.key === 'ArrowRight') SafetyArcade.move(10);
    },

    move(dir) {
        this.basket.x = Math.max(0, Math.min(100 - this.basket.width, this.basket.x + dir));
        const basketEl = document.getElementById('arcadeBasket');
        if (basketEl) basketEl.style.left = this.basket.x + '%';
    },

    startGameLoop() {
        let lastTime = Date.now();
        this.gameLoop = setInterval(() => {
            const now = Date.now();
            if (now - lastTime > 1000) {
                this.spawnItem();
                lastTime = now;
            }
            this.updateItems();
        }, 50);
    },

    spawnItem() {
        const types = [
            { emoji: '⛑️', score: 10, isHazard: false },
            { emoji: '🧯', score: 10, isHazard: false },
            { emoji: '🔥', score: -20, isHazard: true },
            { emoji: '⚡', score: -20, isHazard: true }
        ];
        const type = types[Math.floor(Math.random() * types.length)];
        const item = {
            id: Date.now(),
            x: Math.random() * 90,
            y: 0,
            emoji: type.emoji,
            score: type.score,
            isHazard: type.isHazard
        };
        this.items.push(item);

        const itemEl = document.createElement('div');
        itemEl.id = 'item-' + item.id;
        itemEl.className = 'arcade-item';
        itemEl.style.left = item.x + '%';
        itemEl.style.top = '0%';
        itemEl.textContent = item.emoji;
        document.getElementById('arcadeCanvas').appendChild(itemEl);
    },

    updateItems() {
        this.items.forEach((item, index) => {
            item.y += 2;
            const itemEl = document.getElementById('item-' + item.id);
            if (itemEl) {
                itemEl.style.top = item.y + '%';

                // Collision check
                if (item.y > 85 && item.y < 95) {
                    const basketCenter = this.basket.x + (this.basket.width / 2);
                    if (Math.abs(item.x - basketCenter) < 15) {
                        this.catchItem(item, index);
                    }
                }

                // Remove if off screen
                if (item.y > 100) {
                    itemEl.remove();
                    this.items.splice(index, 1);
                }
            }
        });

        if (this.score >= 100) {
            this.complete();
        }
    },

    catchItem(item, index) {
        this.score += item.score;
        document.getElementById('arcadeScore').textContent = this.score;

        if (item.isHazard) {
            if (typeof SoundEffects !== 'undefined') SoundEffects.wrong();
            document.getElementById('arcadeCanvas').classList.add('shake');
            setTimeout(() => document.getElementById('arcadeCanvas').classList.remove('shake'), 500);
        } else {
            if (typeof SoundEffects !== 'undefined') SoundEffects.correct();
        }

        const itemEl = document.getElementById('item-' + item.id);
        if (itemEl) itemEl.remove();
        this.items.splice(index, 1);
    },

    complete() {
        clearInterval(this.gameLoop);
        const body = document.getElementById('arcadeBody');
        body.innerHTML = `
            <div class="completion-screen">
                <div class="success-icon">🚀</div>
                <h2>رقم قياسي جديد!</h2>
                <p>لقد جمعت نقاطاً كافية وأظهرت سرعة بديهة في السلامة.</p>
                <button class="btn btn-primary" onclick="SafetyArcade.close()">إغلاق</button>
            </div>
        `;
        if (typeof SoundEffects !== 'undefined') SoundEffects.levelUp();
        if (typeof Confetti !== 'undefined') Confetti.celebrate();
    },

    close() {
        clearInterval(this.gameLoop);
        window.removeEventListener('keydown', this.handleKey);
        const overlay = document.getElementById('arcadeOverlay');
        if (overlay) overlay.remove();
        this.isActive = false;
    }
};
