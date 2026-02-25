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
        }
    },


    /**
     * Start Spot the Hazard game
     */
    startSpotHazard() {
        // Realistic scenarios with invisible hitboxes
        const scenarios = [
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
            },
            {
                id: 'living-room-real',
                title: 'غرفة المعيشة',
                image: 'assets/images/living_room_hazard_scene.png',
                hazards: [
                    // Tangled cords (Under rug/center)
                    { x: 45, y: 65, width: 20, height: 15, name: 'أسلاك متشابكة', found: false },
                    // Lego/Toys (Stairs/Left)
                    { x: 15, y: 40, width: 15, height: 20, name: 'ألعاب على الدرج', found: false },
                    // Fireplace (Center/Back)
                    { x: 45, y: 35, width: 12, height: 15, name: 'مدفأة بدون حاجز', found: false },
                    // Window blind cord (Right window)
                    { x: 80, y: 20, width: 10, height: 40, name: 'حبل ستارة طويل', found: false }
                ]
            },
            {
                id: 'bathroom-real',
                title: 'الحمام',
                image: 'assets/images/bathroom_hazard_scene.png',
                hazards: [
                    // Hair dryer (Near tub/Right)
                    { x: 45, y: 50, width: 12, height: 15, name: 'مجزف شعر قرب الماء', found: false },
                    // Medicine bottle (Counter/Left)
                    { x: 25, y: 25, width: 12, height: 12, name: 'أدوية مفتوحة', found: false },
                    // Water spill (Floor/Left)
                    { x: 20, y: 80, width: 25, height: 15, name: 'أرضية مبللة', found: false },
                    // Razor (Tub edge/Right)
                    { x: 65, y: 30, width: 10, height: 10, name: 'شفرة حلاقة مكشوفة', found: false }
                ]
            },
            {
                id: 'playground-real',
                title: 'الشارع والملعب',
                image: 'assets/images/playground_hazard_scene.png',
                hazards: [
                    // Broken swing (Left)
                    { x: 15, y: 40, width: 10, height: 25, name: 'أرجوحة مكسورة', found: false },
                    // Ball in street (Bottom/Right)
                    { x: 35, y: 75, width: 10, height: 10, name: 'كرة في الشارع', found: false },
                    // Broken glass (Center/Ground)
                    { x: 45, y: 55, width: 12, height: 10, name: 'زجاج مكسور', found: false },
                    // Bike blocking path (Right/Top)
                    { x: 75, y: 25, width: 20, height: 15, name: 'دراجة في الطريق', found: false }
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
