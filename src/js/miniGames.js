/**
 * Mini-Games System
 * Interactive games for learning reinforcement
 */

const MiniGames = {
    currentGame: null,
    score: 0,

    /**
     * Available games
     */
    games: {
        spotHazard: {
            id: 'spot-hazard',
            name: 'اكتشف الخطر',
            nameEn: 'Spot the Hazard',
            icon: '🔍',
            description: 'اضغط على جميع الأخطار في الصورة'
        },
        matching: {
            id: 'matching',
            name: 'لعبة المطابقة',
            nameEn: 'Matching Game',
            icon: '🃏',
            description: 'طابق الصور المتشابهة'
        },
        sorting: {
            id: 'sorting',
            name: 'فرز السلامة',
            nameEn: 'Safety Sorting',
            icon: '📦',
            description: 'صنف الأشياء حسب نوع السلامة'
        },
        ppeDressUp: {
            id: 'ppe-dress-up',
            name: 'تجهيز معدات الوقاية',
            nameEn: 'PPE Dress Up',
            icon: '🦺',
            description: 'اختر المعدات الصحيحة للعمل مع الكهرباء'
        },
        callSimulator: {
            id: 'call-simulator',
            name: 'محاكي الطوارئ',
            nameEn: 'Emergency Call Simulator',
            icon: '📞',
            description: 'تعلم كيف تتصل بالطوارئ في حالة الصدمة الكهربائية'
        }
    },

    /**
     * Spot the Hazard Game Data
     */
    spotHazardScenarios: [
        {
            id: 'kitchen',
            title: 'المطبخ',
            image: 'kitchen',
            sceneEmoji: '🍳',
            hazards: [
                { x: 20, y: 30, width: 12, height: 15, name: 'سكين مكشوف', emoji: '🔪', found: false },
                { x: 60, y: 50, width: 14, height: 12, name: 'موقد مشتعل', emoji: '🔥', found: false },
                { x: 80, y: 70, width: 12, height: 10, name: 'ماء على الأرض', emoji: '💧', found: false },
                { x: 40, y: 20, width: 12, height: 12, name: 'سلك كهربائي تالف', emoji: '⚡', found: false }
            ]
        },
        {
            id: 'workshop',
            title: 'ورشة العمل',
            image: 'workshop',
            sceneEmoji: '🏭',
            hazards: [
                { x: 15, y: 45, width: 14, height: 15, name: 'أدوات حادة', emoji: '🪚', found: false },
                { x: 50, y: 60, width: 15, height: 12, name: 'مواد كيميائية', emoji: '🧪', found: false },
                { x: 75, y: 30, width: 12, height: 14, name: 'معدات بدون حماية', emoji: '⚙️', found: false },
                { x: 30, y: 80, width: 18, height: 10, name: 'ممر مسدود', emoji: '📦', found: false }
            ]
        },
        {
            id: 'office',
            title: 'المكتب',
            image: 'office',
            sceneEmoji: '🏢',
            hazards: [
                { x: 25, y: 70, width: 15, height: 12, name: 'أسلاك متشابكة', emoji: '🔌', found: false },
                { x: 70, y: 40, width: 12, height: 15, name: 'كرسي مكسور', emoji: '🪑', found: false },
                { x: 45, y: 25, width: 14, height: 12, name: 'إضاءة ضعيفة', emoji: '💡', found: false },
                { x: 85, y: 85, width: 12, height: 10, name: 'مخرج طوارئ مسدود', emoji: '🚪', found: false }
            ]
        }
    ],

    /**
     * Matching Game Data
     */
    matchingCards: [
        { id: 1, emoji: '🧯', name: 'طفاية حريق' },
        { id: 2, emoji: '⛑️', name: 'خوذة سلامة' },
        { id: 3, emoji: '🧤', name: 'قفازات واقية' },
        { id: 4, emoji: '👓', name: 'نظارات السلامة' },
        { id: 5, emoji: '🦺', name: 'سترة عاكسة' },
        { id: 6, emoji: '🔌', name: 'مأخذ كهربائي' },
        { id: 7, emoji: '🚨', name: 'إنذار حريق' },
        { id: 8, emoji: '🚪', name: 'مخرج طوارئ' }
    ],

    /**
     * Initialize game container
     */
    createGameContainer() {
        // Remove existing
        const existing = document.getElementById('miniGameContainer');
        if (existing) existing.remove();

        const container = document.createElement('div');
        container.id = 'miniGameContainer';
        container.className = 'mini-game-container';
        container.innerHTML = `
            <div class="mini-game-header">
                <button class="btn btn-back mini-game-back" id="backGame" title="العودة">←</button>
                <button class="btn btn-back mini-game-close" id="closeGame">✕</button>
                <h2 class="mini-game-title" id="gameTitle"></h2>
                <div class="mini-game-score" id="gameScore">النقاط: 0</div>
            </div>
            <div class="mini-game-content" id="gameContent"></div>
            <div class="mini-game-footer" id="gameFooter"></div>
        `;

        document.body.appendChild(container);

        // Close button
        document.getElementById('closeGame').addEventListener('click', () => {
            this.close();
        });

        // Back button
        document.getElementById('backGame').addEventListener('click', () => {
            if (this.currentGame) {
                this.openMenu();
            } else {
                this.close();
            }
        });

        return container;
    },

    /**
     * Open game selection menu
     */
    openMenu() {
        const container = this.createGameContainer();
        document.getElementById('gameTitle').textContent = 'الألعاب التعليمية';

        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <div class="games-menu">
                ${Object.values(this.games).map(game => `
                    <button class="game-menu-item" data-game="${game.id}">
                        <span class="game-icon">${game.icon}</span>
                        <span class="game-name">${game.name}</span>
                        <span class="game-desc">${game.description}</span>
                    </button>
                `).join('')}
            </div>
        `;

        // Add click handlers
        content.querySelectorAll('.game-menu-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const gameId = btn.dataset.game;
                this.startGame(gameId);
            });
        });

        container.classList.add('show');
    },

    /**
     * Start a specific game
     */
    startGame(gameId) {
        this.score = 0;
        this.updateScore();

        switch (gameId) {
            case 'spot-hazard':
                this.startSpotHazard();
                break;
            case 'matching':
                this.startMatching();
                break;
            case 'sorting':
                this.startSorting();
                break;
            case 'ppe-dress-up':
                this.startPPEDressUp();
                break;
            case 'call-simulator':
                this.startCallSimulator();
                break;
        }
    },


    /**
     * Start Spot the Hazard game
     */
    startSpotHazard() {
        // Realistic scenarios with invisible hitboxes
        const scenarios = [
            {
                id: 'street-hazard',
                title: 'الشارع والمشاة',
                image: 'assets/images/mini_games/spot_hazard.png',
                hazards: [
                    { x: 15, y: 65, width: 15, height: 15, name: 'اللعب في الشارع', found: false },
                    { x: 45, y: 75, width: 12, height: 12, name: 'عبور غير آمن', found: false },
                    { x: 75, y: 60, width: 10, height: 15, name: 'دراجة مسرعة', found: false },
                    { x: 40, y: 35, width: 10, height: 10, name: 'سيارة قادمة', found: false }
                ]
            },
            {
                id: 'kitchen-real',
                title: 'المطبخ',
                image: 'assets/images/kitchen_hazard_scene.png',
                hazards: [
                    // Knife on counter (Left side) - Shifted right slightly
                    { x: 22, y: 35, width: 12, height: 12, name: 'سكين خطير', found: false },
                    // Water puddle (Bottom center) - Centered better
                    { x: 38, y: 78, width: 28, height: 12, name: 'ماء على الأرض', found: false },
                    // Fire on stove (Right side) - Adjusted up
                    { x: 67, y: 25, width: 10, height: 18, name: 'نار بدون مراقبة', found: false },
                    // Bad wire/outlet (Center wall) - Shifted down/left
                    { x: 53, y: 58, width: 8, height: 10, name: 'سلك كهرباء تالف', found: false }
                ]
            }
        ];

        // Pick a random scenario from the new set
        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

        document.getElementById('gameTitle').textContent = `🔍 ${this.games.spotHazard.name} - ${scenario.title}`;

        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <div class="spot-hazard-game realistic">
                <p class="game-instruction">اضغط على الأماكن الخطرة في الصورة! (4 أخطار)</p>
                <div class="hazard-scene-real" id="hazardScene">
                    <img src="${scenario.image}" class="scene-image-real" alt="${scenario.title}">
                    
                    ${scenario.hazards.map((h, i) => `
                        <div class="hazard-hitbox" 
                             data-index="${i}"
                             style="left: ${h.x}%; top: ${h.y}%; width: ${h.width}%; height: ${h.height}%;">
                             <div class="hazard-marker"></div>
                        </div>
                    `).join('')}
                </div>
                <div class="found-hazards" id="foundHazards"></div>
            </div>
        `;

        const footer = document.getElementById('gameFooter');
        footer.innerHTML = `
            <div class="hazards-progress">
                تم العثور على: <span id="foundCount">0</span> / ${scenario.hazards.length}
            </div>
        `;

        // Add click handlers to hazard hitboxes
        content.querySelectorAll('.hazard-hitbox').forEach(hitbox => {
            hitbox.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent scene click
                const index = parseInt(hitbox.dataset.index);
                const hazard = scenario.hazards[index];

                if (!hazard.found) {
                    hazard.found = true;
                    hitbox.classList.add('found');
                    this.score += 25;
                    this.updateScore();

                    // Show hazard name
                    const foundList = document.getElementById('foundHazards');
                    foundList.innerHTML += `<span class="found-hazard-tag">✅ ${hazard.name}</span>`;

                    // Update count
                    const foundCount = scenario.hazards.filter(h => h.found).length;
                    document.getElementById('foundCount').textContent = foundCount;

                    if (typeof SoundEffects !== 'undefined') {
                        SoundEffects.correct();
                    }

                    // Check if all found
                    if (foundCount === scenario.hazards.length) {
                        this.gameComplete();
                    }
                }
            });
        });

        // Add miss handler for the scene
        const scene = document.getElementById('hazardScene');
        scene.addEventListener('click', () => {
            if (typeof SoundEffects !== 'undefined') {
                SoundEffects.wrong();
            }
            scene.classList.add('shake');
            setTimeout(() => scene.classList.remove('shake'), 500);
        });
    },

    /**
     * Start Matching game
     */
    startMatching() {
        // Create pairs of cards
        const cards = [...this.matchingCards, ...this.matchingCards]
            .sort(() => Math.random() - 0.5)
            .map((card, index) => ({ ...card, index, flipped: false, matched: false }));

        let flippedCards = [];
        let canFlip = true;
        let matches = 0;

        document.getElementById('gameTitle').textContent = `🃏 ${this.games.matching.name}`;

        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <div class="matching-game">
                <p class="game-instruction">اقلب البطاقات وطابق الأزواج المتشابهة!</p>
                <div class="matching-grid" id="matchingGrid">
                    ${cards.map((card, i) => `
                        <div class="matching-card" data-index="${i}" data-id="${card.id}">
                            <div class="card-inner">
                                <div class="card-front">❓</div>
                                <div class="card-back">${card.emoji}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        const footer = document.getElementById('gameFooter');
        footer.innerHTML = `
            <div class="matching-progress">
                الأزواج: <span id="matchCount">0</span> / ${this.matchingCards.length}
            </div>
        `;

        // Add click handlers
        content.querySelectorAll('.matching-card').forEach(cardEl => {
            cardEl.addEventListener('click', () => {
                if (!canFlip) return;

                const index = parseInt(cardEl.dataset.index);
                const card = cards[index];

                if (card.flipped || card.matched) return;

                // Flip card
                card.flipped = true;
                cardEl.classList.add('flipped');
                flippedCards.push({ card, element: cardEl });

                if (typeof SoundEffects !== 'undefined') {
                    SoundEffects.click();
                }

                // Check for match
                if (flippedCards.length === 2) {
                    canFlip = false;

                    const [first, second] = flippedCards;

                    if (first.card.id === second.card.id) {
                        // Match!
                        first.card.matched = true;
                        second.card.matched = true;
                        first.element.classList.add('matched');
                        second.element.classList.add('matched');
                        matches++;
                        this.score += 50;
                        this.updateScore();
                        document.getElementById('matchCount').textContent = matches;

                        if (typeof SoundEffects !== 'undefined') {
                            SoundEffects.correct();
                        }

                        flippedCards = [];
                        canFlip = true;

                        // Check if complete
                        if (matches === this.matchingCards.length) {
                            this.gameComplete();
                        }
                    } else {
                        // No match - flip back
                        if (typeof SoundEffects !== 'undefined') {
                            SoundEffects.wrong();
                        }

                        setTimeout(() => {
                            first.card.flipped = false;
                            second.card.flipped = false;
                            first.element.classList.remove('flipped');
                            second.element.classList.remove('flipped');
                            flippedCards = [];
                            canFlip = true;
                        }, 1000);
                    }
                }
            });
        });
    },

    /**
     * Start Sorting game
     */
    startSorting() {
        const items = [
            { name: 'طفاية حريق', emoji: '🧯', category: 'fire' },
            { name: 'قفازات عازلة', emoji: '🧤', category: 'electric' },
            { name: 'خوذة سلامة', emoji: '⛑️', category: 'general' },
            { name: 'بطانية حريق', emoji: '🛡️', category: 'fire' },
            { name: 'نظارات واقية', emoji: '👓', category: 'general' },
            { name: 'فاصل كهربائي', emoji: '⚡', category: 'electric' }
        ].sort(() => Math.random() - 0.5);

        const categories = {
            fire: { name: 'السلامة من الحرائق', emoji: '🔥', items: [] },
            electric: { name: 'السلامة الكهربائية', emoji: '⚡', items: [] },
            general: { name: 'السلامة العامة', emoji: '🛡️', items: [] }
        };

        document.getElementById('gameTitle').textContent = `📦 ${this.games.sorting.name}`;

        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <div class="sorting-game">
                <p class="game-instruction">اسحب كل عنصر إلى الفئة الصحيحة!</p>
                
                <div class="sorting-items" id="sortingItems">
                    ${items.map((item, i) => `
                        <div class="sorting-item" draggable="true" data-index="${i}" data-category="${item.category}">
                            <span class="item-emoji">${item.emoji}</span>
                            <span class="item-name">${item.name}</span>
                        </div>
                    `).join('')}
                </div>
                
                <div class="sorting-categories">
                    ${Object.entries(categories).map(([key, cat]) => `
                        <div class="sorting-category" data-category="${key}">
                            <div class="category-header">
                                <span>${cat.emoji}</span>
                                <span>${cat.name}</span>
                            </div>
                            <div class="category-drop-zone" data-category="${key}"></div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        const footer = document.getElementById('gameFooter');
        footer.innerHTML = `
            <div class="sorting-progress">
                تم التصنيف: <span id="sortedCount">0</span> / ${items.length}
            </div>
        `;

        let sortedCount = 0;

        // Drag and drop handlers
        const sortingItems = content.querySelectorAll('.sorting-item');
        const dropZones = content.querySelectorAll('.category-drop-zone');

        sortingItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', item.dataset.index);
                item.classList.add('dragging');
            });

            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
            });
        });

        dropZones.forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.classList.add('drag-over');
            });

            zone.addEventListener('dragleave', () => {
                zone.classList.remove('drag-over');
            });

            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('drag-over');

                const index = e.dataTransfer.getData('text/plain');
                const item = document.querySelector(`.sorting-item[data-index="${index}"]`);
                const itemCategory = item.dataset.category;
                const zoneCategory = zone.dataset.category;

                if (itemCategory === zoneCategory) {
                    // Correct!
                    zone.appendChild(item);
                    item.classList.add('sorted');
                    item.draggable = false;
                    sortedCount++;
                    this.score += 30;
                    this.updateScore();
                    document.getElementById('sortedCount').textContent = sortedCount;

                    if (typeof SoundEffects !== 'undefined') {
                        SoundEffects.correct();
                    }

                    if (sortedCount === items.length) {
                        this.gameComplete();
                    }
                } else {
                    // Wrong category
                    item.classList.add('wrong');
                    setTimeout(() => item.classList.remove('wrong'), 500);

                    if (typeof SoundEffects !== 'undefined') {
                        SoundEffects.wrong();
                    }
                }
            });
        });
    },

    /**
     * Game complete handler
     */
    gameComplete() {
        // Save score and progress
        if (typeof Storage !== 'undefined') {
            Storage.saveScenarioScore(this.currentGame, this.score, 100);
            Storage.markGameCompleted(this.currentGame, this.score);

            // Mark lesson activity as completed if launched from a lesson
            if (typeof App !== 'undefined' && App.currentCourse && App.currentCourse.lessons[App.currentLessonIndex]) {
                const lesson = App.currentCourse.lessons[App.currentLessonIndex];
                Storage.markLessonActivityCompleted(App.currentCourse.id, lesson.id);
                App.updateLessonNavigation();
            }
        }

        // Check for achievements
        if (typeof Achievements !== 'undefined') {
            Achievements.checkAchievements();
        }

        if (typeof SoundEffects !== 'undefined') {
            SoundEffects.levelUp();
        }

        if (typeof Confetti !== 'undefined') {
            Confetti.celebrate('quiz');
        }

        setTimeout(() => {
            const content = document.getElementById('gameContent');
            content.innerHTML = `
                <div class="game-complete">
                    <span class="complete-icon">🎉</span>
                    <h2>أحسنت!</h2>
                    <p class="final-score">النقاط النهائية: ${this.score}</p>
                    <button class="btn btn-primary" id="playAgainBtn">العب مرة أخرى</button>
                    <button class="btn btn-secondary" id="backToMenuBtn">قائمة الألعاب</button>
                </div>
            `;

            document.getElementById('playAgainBtn').addEventListener('click', () => {
                this.startGame(this.currentGame);
            });

            document.getElementById('backToMenuBtn').addEventListener('click', () => {
                this.openMenu();
            });
        }, 1500);
    },

    /**
     * Update score display
     */
    updateScore() {
        const scoreEl = document.getElementById('gameScore');
        if (scoreEl) {
            scoreEl.textContent = `النقاط: ${this.score}`;
        }
    },

    /**
     * Start PPE Dress Up game
     */
    startPPEDressUp() {
        this.currentGame = 'ppe-dress-up';
        document.getElementById('gameTitle').textContent = `🦺 ${this.games.ppeDressUp.name}`;

        const items = [
            { id: 'gloves', name: 'قفازات عازلة', emoji: '🧤', correct: true },
            { id: 'boots', name: 'حذاء مطاطي', emoji: '🥾', correct: true },
            { id: 'helmet', name: 'خوذة بلاستيك', emoji: '⛑️', correct: true },
            { id: 'glasses', name: 'نظارة حماية', emoji: '👓', correct: true },
            { id: 'watch', name: 'ساعة معدنية', emoji: '⌚', correct: false },
            { id: 'ring', name: 'خاتم ذهب', emoji: '💍', correct: false },
            { id: 'flipflops', name: 'شبشب مفتوح', emoji: '🩴', correct: false },
            { id: 'shorts', name: 'بنطلون قصير', emoji: '🩳', correct: false }
        ];

        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <div class="ppe-game">
                <p class="game-instruction">اختر 4 أدوات ضرورية للعمل بأمان مع الكهرباء (تجنب المعادن!):</p>
                <div class="ppe-character-scene" style="position: relative; text-align: center; margin-bottom: 20px;">
                    <img src="assets/images/mini_games/ppe_character.png" style="max-width: 200px;" alt="Salem">
                    <div id="selectedPPE" class="selected-ppe-list" style="margin-top: 15px; display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;"></div>
                </div>
                <div class="ppe-items-grid" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;">
                    ${items.map(item => `
                        <button class="ppe-item-btn btn btn-secondary" data-id="${item.id}" style="display: flex; flex-direction: column; align-items: center; padding: 10px;">
                            <span style="font-size: 2rem;">${item.emoji}</span>
                            <span style="font-size: 0.8rem;">${item.name}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        const footer = document.getElementById('gameFooter');
        footer.innerHTML = `<div class="ppe-progress">تم اختيار: <span id="selectedCount">0</span> / 4</div>`;

        let selected = [];
        const btns = content.querySelectorAll('.ppe-item-btn');

        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const item = items.find(i => i.id === id);

                if (selected.includes(id)) return;

                if (item.correct) {
                    selected.push(id);
                    btn.classList.remove('btn-secondary');
                    btn.classList.add('btn-primary');
                    this.score += 25;
                    this.updateScore();

                    document.getElementById('selectedPPE').innerHTML += `<span class="found-hazard-tag">✅ ${item.name}</span>`;
                    document.getElementById('selectedCount').textContent = selected.length;

                    if (typeof SoundEffects !== 'undefined') SoundEffects.correct();

                    if (selected.length === 4) {
                        setTimeout(() => this.gameComplete(), 1000);
                    }
                } else {
                    btn.classList.add('wrong');
                    setTimeout(() => btn.classList.remove('wrong'), 500);
                    if (typeof SoundEffects !== 'undefined') SoundEffects.wrong();
                    alert(`⚠️ خطأ! ${item.name} غير مناسب للكهرباء (المعادن والملابس المفتوحة خطر).`);
                }
            });
        });
    },

    /**
     * Start Call Simulator game
     */
    startCallSimulator() {
        this.currentGame = 'call-simulator';
        document.getElementById('gameTitle').textContent = `📞 ${this.games.callSimulator.name}`;

        const content = document.getElementById('gameContent');
        content.innerHTML = `
            <div class="call-simulator-game">
                <p class="game-instruction">حدثت صدمة كهربائية! اطلب رقم الإسعاف الصحيح في مصر:</p>
                <div class="phone-dialer" style="max-width: 300px; margin: 0 auto; background: #333; padding: 20px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                    <div id="dialDisplay" style="background: #eee; height: 50px; border-radius: 5px; color: #333; font-size: 2rem; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; font-family: monospace;"></div>
                    <div class="dial-pad" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                        ${[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map(n => `
                            <button class="dial-btn" data-val="${n}" style="height: 60px; border-radius: 50%; border: none; background: #555; color: white; font-size: 1.5rem; cursor: pointer;">${n}</button>
                        `).join('')}
                    </div>
                    <button id="callBtn" style="width: 100%; height: 60px; margin-top: 20px; border-radius: 30px; border: none; background: #26de81; color: white; font-size: 1.5rem; cursor: pointer;">📞 اتصال</button>
                </div>
            </div>
        `;

        let dial = "";
        const display = document.getElementById('dialDisplay');

        content.querySelectorAll('.dial-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (dial.length < 3) {
                    dial += btn.dataset.val;
                    display.textContent = dial;
                    if (typeof SoundEffects !== 'undefined') SoundEffects.click();
                }
            });
        });

        document.getElementById('callBtn').addEventListener('click', () => {
            if (dial === "123") {
                this.score = 100;
                this.updateScore();
                if (typeof SoundEffects !== 'undefined') SoundEffects.correct();
                alert("✅ أحسنت! 123 هو رقم الإسعاف الصحيح في مصر.");
                this.gameComplete();
            } else {
                dial = "";
                display.textContent = "";
                if (typeof SoundEffects !== 'undefined') SoundEffects.wrong();
                alert("❌ رقم خطأ! حاول مرة أخرى. تلميح: رقم الإسعاف مكون من 3 أرقام.");
            }
        });
    },

    /**
     * Close game
     */
    close() {
        const container = document.getElementById('miniGameContainer');
        if (container) {
            container.classList.remove('show');
            setTimeout(() => container.remove(), 300);
        }
    }
};
