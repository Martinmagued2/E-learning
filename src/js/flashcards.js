/**
 * Flashcards Mode
 * Quick review cards for key safety concepts
 */

const Flashcards = {
    currentDeck: [],
    currentIndex: 0,
    isFlipped: false,
    knownCards: [],
    unknownCards: [],

    /**
     * Flashcard decks organized by topic
     */
    decks: {
        'fire-safety': {
            name: 'السلامة من الحرائق',
            icon: '🔥',
            cards: [
                { front: 'ماذا تفعل إذا اشتعل زيت في المقلاة؟', back: 'لا تستخدم الماء أبداً! 🚫\nغطها بغطاء معدني لقطع الأكسجين وأطفئ الموقد.' },
                { front: 'لماذا يعتبر الماء خطيراً على حرائق الزيت؟', back: 'لأن الماء والزيت لا يمتزجان، وسيؤدي ذلك لانتشار النار وانفجارها في وجهك.' },
                { front: 'كيف نتجنب حرائق المطبخ؟', back: 'لا تترك الطعام على النار دون مراقبة 👁️، وأبعد المناشف والزيوت عن الموقد.' },
                { front: 'ما هو مثلث الحريق؟', back: 'حرارة 🔥 + وقود ⛽ + أكسجين 💨 = حريق' },
                { front: 'ماذا يعني PASS؟', back: 'Pull (اسحب) → Aim (صوّب) → Squeeze (اضغط) → Sweep (امسح)' },
                { front: 'ماذا تفعل إذا اشتعلت ملابسك؟', back: 'قف ✋ → ارمِ نفسك على الأرض ⬇️ → تدحرج 🔄' },
                { front: 'أين يجب وضع أجهزة إنذار الدخان؟', back: 'في كل غرفة نوم، وممرات النوم، والمطبخ (كاشف حراري).' }
            ]
        },
        'electrical-safety': {
            name: 'السلامة الكهربائية',
            icon: '⚡',
            cards: [
                { front: 'لماذا الماء خطير جداً مع الكهرباء؟', back: 'الماء موصل جيد للكهرباء 💧⚡\nلمس الأجهزة بأيدٍ مبللة قد يسبب صعقة قاتلة.' },
                { front: 'كيف نحمي الأطفال من الكهرباء؟', back: 'غطي المقابس 🛡️، وتأكد من عدم وجود أسلاك مكشوفة.' },
                { front: 'علامات الخطر في الأسلاك؟', back: 'رائحة احتراق، سخونة، أو أسلاك مقطوعة/مكشوفة.' },
                { front: 'ماذا تفعل لإنقاذ شخص مصعوق؟', back: 'لا تلمسه بيدك! 🚫\nافصل الكهرباء أولاً، أو ادفعه بشيء خشبي جاف.' },
                { front: 'هل نستخدم الأجهزة الكهربائية في الحمام؟', back: 'لا! خطر الصعق كبير جداً بسبب بخار الماء والأرضية المبتلة.' }
            ]
        },
        'home-safety': {
            name: 'السلامة المنزلية',
            icon: '🏠',
            cards: [
                { front: 'ما هو "القاتل الصامت"؟', back: 'غاز أول أكسيد الكربون ☠️\nيسبب الاختناق دون لون أو رائحة.' },
                { front: 'ماذا تفعل عند شم رائحة غاز؟', back: '1. افتح النوافذ فوراً 🪟\n2. لا تشعل أي نار أو كهرباء 🚫💡\n3. غادر المكان' },
                { front: 'كيف نمنع حوادث السقوط؟', back: 'أبعد الأثاث عن الشبابيك 🪟، وجفف أرضيات الحمام والمطبخ دائماً.' },
                { front: 'كيف نحمي الأطفال من التسمم؟', back: 'احفظ المنظفات والأدوية في رفوف عالية ومغلقة 🔒، بعيداً عن متناولهم.' },
                { front: 'خطر السخانات الغازية؟', back: 'قد تسبب اختناقاً إذا لم توجد تهوية جيدة (مدخنة) 💨.' }
            ]
        },
        'road-safety': {
            name: 'السلامة على الطريق',
            icon: '🚦',
            cards: [
                { front: 'كيف تعبر الطريق بأمان؟', back: 'انظر يساراً ويمينًا 👁️، اعبر من ممر المشاة، وتأكد من توقف السيارات.' },
                { front: 'ماذا تعني إشارة المشاة الحمراء؟', back: 'توقف! 🧍\nلا تعبر الشارع الآن.' },
                { front: 'ماذا تعني إشارة المشاة الخضراء؟', back: 'اعبر بحذر 🚶\n(لكن انظر للسيارات أيضاً).' },
                { front: 'أين يجب أن تمشي في الشارع؟', back: 'على الرصيف دائماً. إذا لم يوجد، امشِ في عكس اتجاه السيارات لترها.' },
                { front: 'قواعد ركوب السيارة للأطفال؟', back: 'اجلس في الخلف، اربط حزام الأمان 🎗️، ولا تخرج يدك من النافذة 👋.' },
                { front: 'اللعب في الشارع؟', back: 'خطير جداً! ⚽🚗\nالعب في الحديقة أو النادي فقط.' }
            ]
        }
    },

    /**
     * Create flashcard UI
     */
    createUI() {
        const existing = document.getElementById('flashcardsContainer');
        if (existing) existing.remove();

        const container = document.createElement('div');
        container.id = 'flashcardsContainer';
        container.className = 'flashcards-container';
        container.innerHTML = `
            <div class="flashcards-header">
                <button class="btn btn-back flashcards-close" id="closeFlashcards">✕</button>
                <h2 class="flashcards-title" id="flashcardsTitle">البطاقات التعليمية</h2>
                <div class="flashcards-progress" id="flashcardsProgress">0 / 0</div>
            </div>
            <div class="flashcards-content" id="flashcardsContent"></div>
            <div class="flashcards-controls" id="flashcardsControls"></div>
        `;

        document.body.appendChild(container);

        document.getElementById('closeFlashcards').addEventListener('click', () => {
            this.close();
        });

        return container;
    },

    /**
     * Open deck selection
     */
    openMenu() {
        const container = this.createUI();

        const content = document.getElementById('flashcardsContent');
        content.innerHTML = `
            <div class="decks-menu">
                <h3>اختر مجموعة البطاقات:</h3>
                ${Object.entries(this.decks).map(([id, deck]) => `
                    <button class="deck-item" data-deck="${id}">
                        <span class="deck-icon">${deck.icon}</span>
                        <span class="deck-name">${deck.name}</span>
                        <span class="deck-count">${deck.cards.length} بطاقة</span>
                    </button>
                `).join('')}
            </div>
        `;

        content.querySelectorAll('.deck-item').forEach(btn => {
            btn.addEventListener('click', () => {
                this.startDeck(btn.dataset.deck);
            });
        });

        container.classList.add('show');
    },

    /**
     * Start a deck
     */
    startDeck(deckId) {
        const deck = this.decks[deckId];
        if (!deck) return;

        this.currentDeck = [...deck.cards].sort(() => Math.random() - 0.5);
        this.currentIndex = 0;
        this.isFlipped = false;
        this.knownCards = [];
        this.unknownCards = [];

        document.getElementById('flashcardsTitle').textContent = `${deck.icon} ${deck.name}`;
        this.showCard();
    },

    /**
     * Show current card
     */
    showCard() {
        if (this.currentIndex >= this.currentDeck.length) {
            this.showResults();
            return;
        }

        const card = this.currentDeck[this.currentIndex];
        this.isFlipped = false;

        document.getElementById('flashcardsProgress').textContent =
            `${this.currentIndex + 1} / ${this.currentDeck.length}`;

        const content = document.getElementById('flashcardsContent');
        content.innerHTML = `
            <div class="flashcard ${this.isFlipped ? 'flipped' : ''}" id="flashcard">
                <div class="flashcard-inner">
                    <div class="flashcard-front">
                        <span class="card-label">السؤال</span>
                        <p class="card-text">${card.front}</p>
                        <span class="flip-hint">اضغط لرؤية الإجابة 👆</span>
                    </div>
                    <div class="flashcard-back">
                        <span class="card-label">الإجابة</span>
                        <p class="card-text">${card.back.replace(/\n/g, '<br>')}</p>
                    </div>
                </div>
            </div>
        `;

        const controls = document.getElementById('flashcardsControls');
        controls.innerHTML = `
            <button class="btn btn-secondary" id="dontKnowBtn" style="display: none;">
                <span>لا أعرف 😕</span>
            </button>
            <button class="btn btn-primary" id="flipBtn">
                <span>اقلب البطاقة 🔄</span>
            </button>
            <button class="btn btn-success" id="knowBtn" style="display: none;">
                <span>أعرفها! ✅</span>
            </button>
        `;

        // Flip button
        document.getElementById('flipBtn').addEventListener('click', () => this.flipCard());
        document.getElementById('flashcard').addEventListener('click', () => this.flipCard());

        // Know/Don't know buttons
        document.getElementById('knowBtn').addEventListener('click', () => {
            this.knownCards.push(card);
            this.nextCard();
        });

        document.getElementById('dontKnowBtn').addEventListener('click', () => {
            this.unknownCards.push(card);
            this.nextCard();
        });
    },

    /**
     * Flip the card
     */
    flipCard() {
        if (this.isFlipped) return;

        this.isFlipped = true;
        const flashcard = document.getElementById('flashcard');
        flashcard.classList.add('flipped');

        // Show know/don't know buttons
        document.getElementById('flipBtn').style.display = 'none';
        document.getElementById('knowBtn').style.display = 'flex';
        document.getElementById('dontKnowBtn').style.display = 'flex';

        if (typeof SoundEffects !== 'undefined') {
            SoundEffects.click();
        }
    },

    /**
     * Go to next card
     */
    nextCard() {
        this.currentIndex++;
        this.showCard();

        if (typeof SoundEffects !== 'undefined') {
            SoundEffects.navigate();
        }
    },

    /**
     * Show results
     */
    showResults() {
        const total = this.currentDeck.length;
        const known = this.knownCards.length;
        const percentage = Math.round((known / total) * 100);

        const content = document.getElementById('flashcardsContent');
        content.innerHTML = `
            <div class="flashcards-results">
                <span class="results-icon">${percentage >= 70 ? '🎉' : percentage >= 50 ? '📚' : '💪'}</span>
                <h2>انتهت البطاقات!</h2>
                <div class="results-stats">
                    <div class="stat known">
                        <span class="stat-value">${known}</span>
                        <span class="stat-label">تعرفها ✅</span>
                    </div>
                    <div class="stat unknown">
                        <span class="stat-value">${this.unknownCards.length}</span>
                        <span class="stat-label">تحتاج مراجعة 📖</span>
                    </div>
                </div>
                <div class="results-percentage">${percentage}%</div>
                <p>${percentage >= 70 ? 'ممتاز! أنت متمكن من المادة!' : 'استمر في المراجعة!'}</p>
            </div>
        `;

        const controls = document.getElementById('flashcardsControls');
        controls.innerHTML = `
            ${this.unknownCards.length > 0 ? `
                <button class="btn btn-secondary" id="reviewUnknownBtn">
                    <span>مراجعة غير المعروفة (${this.unknownCards.length})</span>
                </button>
            ` : ''}
            <button class="btn btn-primary" id="restartDeckBtn">
                <span>إعادة الكل 🔄</span>
            </button>
            <button class="btn btn-secondary" id="backToDecksBtn">
                <span>مجموعات أخرى</span>
            </button>
        `;

        if (this.unknownCards.length > 0) {
            document.getElementById('reviewUnknownBtn').addEventListener('click', () => {
                this.currentDeck = [...this.unknownCards];
                this.currentIndex = 0;
                this.unknownCards = [];
                this.knownCards = [];
                this.showCard();
            });
        }

        document.getElementById('restartDeckBtn').addEventListener('click', () => {
            this.currentDeck = this.currentDeck.sort(() => Math.random() - 0.5);
            this.currentIndex = 0;
            this.unknownCards = [];
            this.knownCards = [];
            this.showCard();
        });

        document.getElementById('backToDecksBtn').addEventListener('click', () => {
            this.openMenu();
        });

        if (typeof Confetti !== 'undefined' && percentage >= 70) {
            Confetti.celebrate('quiz');
        }
    },

    /**
     * Close flashcards
     */
    close() {
        const container = document.getElementById('flashcardsContainer');
        if (container) {
            container.classList.remove('show');
            setTimeout(() => container.remove(), 300);
        }
    }
};


/**
 * Glossary System
 * Arabic safety terms dictionary
 */

const Glossary = {
    terms: [
        // Fire Safety Terms
        { term: 'طفاية حريق', definition: 'جهاز يستخدم لإطفاء الحرائق الصغيرة', category: 'fire', english: 'Fire Extinguisher' },
        { term: 'مثلث الحريق', definition: 'العناصر الثلاثة اللازمة للحريق: حرارة، وقود، أكسجين', category: 'fire', english: 'Fire Triangle' },
        { term: 'جهاز إنذار الدخان', definition: 'جهاز يكشف الدخان وينبه عند وجود حريق', category: 'fire', english: 'Smoke Detector' },
        { term: 'مخرج الطوارئ', definition: 'باب أو ممر مخصص للخروج في حالات الطوارئ', category: 'fire', english: 'Emergency Exit' },
        { term: 'نقطة التجمع', definition: 'مكان آمن يتجمع فيه الأشخاص بعد الإخلاء', category: 'fire', english: 'Assembly Point' },
        { term: 'بطانية الحريق', definition: 'قطعة قماش مقاومة للحريق تُستخدم لإخماد اللهب', category: 'fire', english: 'Fire Blanket' },

        // Electrical Safety Terms
        { term: 'صعقة كهربائية', definition: 'إصابة ناتجة عن مرور تيار كهربائي عبر الجسم', category: 'electric', english: 'Electric Shock' },
        { term: 'قاطع الدائرة', definition: 'جهاز يقطع التيار تلقائياً عند زيادة الحمل', category: 'electric', english: 'Circuit Breaker' },
        { term: 'فيوز', definition: 'قطعة معدنية تنصهر لقطع التيار عند زيادته', category: 'electric', english: 'Fuse' },
        { term: 'تأريض', definition: 'توصيل الأجهزة بالأرض لتفريغ الشحنات الزائدة', category: 'electric', english: 'Grounding' },
        { term: 'عازل كهربائي', definition: 'مادة لا تسمح بمرور التيار الكهربائي', category: 'electric', english: 'Electrical Insulator' },
        { term: 'دائرة كهربائية قصيرة', definition: 'اتصال مباشر بين قطبين يسبب تدفق تيار عالي', category: 'electric', english: 'Short Circuit' },

        // Home Safety Terms (New)
        { term: 'أول أكسيد الكربون', definition: 'غاز سام عديم اللون والرائحة ينتج عن الاحتراق غير الكامل (القاتل الصامت)', category: 'home', english: 'Carbon Monoxide' },
        { term: 'تسرب الغاز', definition: 'خروج الغاز من الأنابيب بشكل غير مسيطر عليه', category: 'home', english: 'Gas Leak' },
        { term: 'تهوية', definition: 'تجديد الهواء في المكان لمنع تراكم الغازات السامة', category: 'home', english: 'Ventilation' },
        { term: 'تسمم', definition: 'دخول مادة ضارة للجسم (مثل المنظفات أو الأدوية الخاطئة)', category: 'home', english: 'Poisoning' },
        { term: 'مانع الانزلاق', definition: 'فرش يوضع على الأرضيات لمنع السقوط', category: 'home', english: 'Anti-slip Mat' },

        // Road Safety Terms (New)
        { term: 'ممر المشاة', definition: 'منطقة مخططة مخصصة لعبور المشاة بأمان', category: 'road', english: 'Pedestrian Crossing' },
        { term: 'إشارة المرور', definition: 'جهاز ينظم حركة المرور باستخدام الأضواء الملونة', category: 'road', english: 'Traffic Light' },
        { term: 'حزام الأمان', definition: 'حزام يحمي الراكب من الاندفاع للأمام عند التوقف المفاجئ', category: 'road', english: 'Seatbelt' },
        { term: 'الرصيف', definition: 'المكان المخصص لسير المشاة بجانب الطريق', category: 'road', english: 'Sidewalk/Pavement' },
        { term: 'نقطة عمياء', definition: 'منطقة لا يستطيع السائق رؤيتها في المرايا', category: 'road', english: 'Blind Spot' },

        // General Safety Terms
        { term: 'معدات الحماية الشخصية', definition: 'ملابس وأدوات لحماية العامل من المخاطر', category: 'general', english: 'PPE' },
        { term: 'إسعافات أولية', definition: 'المساعدة الطبية الفورية قبل وصول المتخصصين', category: 'general', english: 'First Aid' },
        { term: 'تقييم المخاطر', definition: 'تحديد وتحليل المخاطر المحتملة في مكان العمل', category: 'general', english: 'Risk Assessment' },
        { term: 'إنعاش قلبي رئوي', definition: 'إجراء إسعافي لاستعادة التنفس ونبض القلب', category: 'general', english: 'CPR' },
        { term: 'بيئة العمل الآمنة', definition: 'تصميم مكان العمل ليناسب قدرات العاملين', category: 'general', english: 'Ergonomics' },
        { term: 'حادث قريب', definition: 'حادث كاد أن يتسبب في إصابة ولكنه لم يحدث', category: 'general', english: 'Near Miss' },
        { term: 'مادة خطرة', definition: 'مادة قد تسبب ضرراً للصحة أو البيئة', category: 'general', english: 'Hazardous Material' },
        { term: 'لوحة السلامة', definition: 'لافتة تحتوي على رموز وتعليمات السلامة', category: 'general', english: 'Safety Sign' }
    ],

    categories: {
        fire: { name: 'السلامة من الحرائق', icon: '🔥' },
        electric: { name: 'السلامة الكهربائية', icon: '⚡' },
        home: { name: 'السلامة المنزلية', icon: '🏠' },
        road: { name: 'السلامة على الطريق', icon: '🚦' },
        general: { name: 'السلامة العامة', icon: '🛡️' }
    },

    /**
     * Create glossary UI
     */
    createUI() {
        const existing = document.getElementById('glossaryContainer');
        if (existing) existing.remove();

        const container = document.createElement('div');
        container.id = 'glossaryContainer';
        container.className = 'glossary-container';
        container.innerHTML = `
            <div class="glossary-header">
                <button class="btn btn-back glossary-close" id="closeGlossary">✕</button>
                <h2 class="glossary-title">📖 قاموس مصطلحات السلامة</h2>
                <div class="glossary-search">
                    <input type="text" id="glossarySearch" placeholder="ابحث عن مصطلح...">
                </div>
            </div>
            <div class="glossary-filters" id="glossaryFilters">
                <button class="filter-btn active" data-filter="all">الكل</button>
                ${Object.entries(this.categories).map(([id, cat]) => `
                    <button class="filter-btn" data-filter="${id}">${cat.icon} ${cat.name}</button>
                `).join('')}
            </div>
            <div class="glossary-content" id="glossaryContent"></div>
        `;

        document.body.appendChild(container);

        // Event listeners
        document.getElementById('closeGlossary').addEventListener('click', () => this.close());
        document.getElementById('glossarySearch').addEventListener('input', (e) => this.filter(e.target.value));

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filterByCategory(btn.dataset.filter);
            });
        });

        return container;
    },

    /**
     * Open glossary
     */
    open() {
        const container = this.createUI();
        this.renderTerms(this.terms);
        container.classList.add('show');
    },

    /**
     * Render terms list
     */
    renderTerms(terms) {
        const content = document.getElementById('glossaryContent');

        if (terms.length === 0) {
            content.innerHTML = `<p class="no-results">لا توجد نتائج 🔍</p>`;
            return;
        }

        content.innerHTML = `
            <div class="glossary-list">
                ${terms.map(t => `
                    <div class="glossary-term" data-category="${t.category}">
                        <div class="term-header">
                            <span class="term-icon">${this.categories[t.category].icon}</span>
                            <h3 class="term-name">${t.term}</h3>
                            <span class="term-english">${t.english}</span>
                        </div>
                        <p class="term-definition">${t.definition}</p>
                    </div>
                `).join('')}
            </div>
        `;
    },

    /**
     * Filter terms by search
     */
    filter(query) {
        const filtered = this.terms.filter(t =>
            t.term.includes(query) ||
            t.definition.includes(query) ||
            t.english.toLowerCase().includes(query.toLowerCase())
        );
        this.renderTerms(filtered);
    },

    /**
     * Filter by category
     */
    filterByCategory(category) {
        const filtered = category === 'all'
            ? this.terms
            : this.terms.filter(t => t.category === category);
        this.renderTerms(filtered);
    },

    /**
     * Close glossary
     */
    close() {
        const container = document.getElementById('glossaryContainer');
        if (container) {
            container.classList.remove('show');
            setTimeout(() => container.remove(), 300);
        }
    }
};
