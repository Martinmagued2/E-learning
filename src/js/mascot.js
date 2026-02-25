/**
 * Animated Mascot System
 * A friendly safety guide character that helps students
 */

const Mascot = {
    element: null,
    speechBubble: null,
    isVisible: true,
    currentMood: 'happy',
    idleTimeout: null,

    // Mascot characters (can switch between them)
    characters: {
        helmet: {
            name: 'سالم',
            nameEn: 'Salem',
            emoji: '⛑️',
            description: 'خوذة السلامة'
        },
        extinguisher: {
            name: 'طفاء',
            nameEn: 'Tafaa',
            emoji: '🧯',
            description: 'طفاية الحريق'
        },
        shield: {
            name: 'حامي',
            nameEn: 'Hami',
            emoji: '🛡️',
            description: 'درع الحماية'
        }
    },

    currentCharacter: 'helmet',

    // Mood expressions
    moods: {
        happy: { eyes: '◠', mouth: '◡', color: '#26de81' },
        excited: { eyes: '★', mouth: 'D', color: '#ffd32a' },
        thinking: { eyes: '•', mouth: '~', color: '#3742fa' },
        surprised: { eyes: 'O', mouth: 'o', color: '#ff4757' },
        celebrating: { eyes: '✧', mouth: '▽', color: '#ffd32a' },
        encouraging: { eyes: '◠', mouth: 'ω', color: '#26de81' },
        worried: { eyes: '•', mouth: '︵', color: '#ff6b81' }
    },

    // Speech phrases for different contexts
    phrases: {
        welcome: [
            'مرحباً! أنا سالم، صديقك في رحلة السلامة! 👋',
            'أهلاً بك! هيا نتعلم السلامة معاً! 🎉',
            'مرحباً صديقي! مستعد للتعلم؟ 📚'
        ],
        lessonStart: [
            'هيا نبدأ الدرس! ركز معي جيداً 👀',
            'درس جديد! استعد للمعرفة 🌟',
            'وقت التعلم! أنا متحمس! 🚀'
        ],
        lessonComplete: [
            'أحسنت! أكملت الدرس بنجاح! 🎉',
            'رائع! أنت مذهل! ⭐',
            'ممتاز! استمر هكذا! 💪'
        ],
        quizStart: [
            'وقت الاختبار! ثق بنفسك! 📝',
            'هيا نختبر ما تعلمناه! 🧠',
            'أنت مستعد! ركز جيداً! 💪'
        ],
        correctAnswer: [
            'صحيح! أحسنت! 🎯',
            'ممتاز! إجابة صحيحة! ✅',
            'رائع! أنت ذكي جداً! 🌟',
            'بالضبط! استمر! 💫'
        ],
        wrongAnswer: [
            'لا بأس! حاول مرة أخرى 💪',
            'قريب! فكر ثانية 🤔',
            'لا تقلق! التعلم من الأخطاء 📚'
        ],
        quizComplete: [
            'أكملت الاختبار! أنت بطل! 🏆',
            'رائع! أنهيت الاختبار! 🎉',
            'مبروك! إنجاز جديد! ⭐'
        ],
        perfectScore: [
            'درجة كاملة! أنت عبقري! 🏆💯',
            'مثالي! لا أخطاء! أنت رائع! 🌟',
            'خارق! 100%! فخور بك! 🎉'
        ],
        courseComplete: [
            'أكملت الدورة! أنت بطل السلامة! 🏅',
            'مبروك! شهادة جديدة لك! 🎓',
            'إنجاز عظيم! أنت خبير الآن! 👨‍🎓'
        ],
        idle: [
            'هل تحتاج مساعدة؟ 🤔',
            'أنا هنا إذا احتجتني! 👋',
            'لا تنسَ أن السلامة أولاً! ⚠️',
            'هيا نكمل التعلم! 📚',
            'أنت تبلي بلاءً حسناً! 💪'
        ],
        encouragement: [
            'لا تستسلم! أنت قادر! 💪',
            'كل محاولة خطوة للأمام! 🚀',
            'أؤمن بك! استمر! ⭐'
        ],
        badge: [
            'واو! وسام جديد! 🏅',
            'إنجاز جديد! أنت نجم! ⭐',
            'مبروك الوسام! 🎉'
        ],
        goodbye: [
            'إلى اللقاء! ابقَ آمناً! 👋',
            'وداعاً! لا تنسَ السلامة! 🛡️',
            'أراك قريباً! 💙'
        ]
    },

    /**
     * Initialize the mascot
     */
    init() {
        this.createMascotElement();
        this.loadPreferences();
        this.startIdleTimer();

        // Show welcome message after a short delay
        setTimeout(() => {
            this.speak('welcome');
        }, 1500);
    },

    /**
     * Create the mascot DOM element
     */
    createMascotElement() {
        // Create container
        const container = document.createElement('div');
        container.id = 'mascotContainer';
        container.className = 'mascot-container';
        container.innerHTML = `
            <div class="mascot-character" id="mascotCharacter">
                <div class="mascot-body">
                    <span class="mascot-emoji">${this.characters[this.currentCharacter].emoji}</span>
                </div>
                <div class="mascot-face">
                    <span class="mascot-eyes">◠◠</span>
                    <span class="mascot-mouth">◡</span>
                </div>
            </div>
            <div class="mascot-speech-bubble" id="mascotSpeech">
                <p class="mascot-text"></p>
                <span class="mascot-name">${this.characters[this.currentCharacter].name}</span>
            </div>
        `;

        document.body.appendChild(container);

        this.element = document.getElementById('mascotCharacter');
        this.speechBubble = document.getElementById('mascotSpeech');

        // Add click handler to toggle speech
        this.element.addEventListener('click', () => {
            this.speak('idle');
            this.bounce();
        });

        // Make draggable
        this.makeDraggable(container);
    },

    /**
     * Make mascot draggable
     */
    makeDraggable(element) {
        let isDragging = false;
        let startX, startY, startLeft, startTop;

        element.addEventListener('mousedown', (e) => {
            if (e.target.closest('.mascot-character')) {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                startLeft = element.offsetLeft;
                startTop = element.offsetTop;
                element.style.cursor = 'grabbing';
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                element.style.left = `${startLeft + deltaX}px`;
                element.style.top = `${startTop + deltaY}px`;
                element.style.right = 'auto';
                element.style.bottom = 'auto';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            element.style.cursor = 'pointer';
        });
    },

    /**
     * Load saved preferences
     */
    loadPreferences() {
        try {
            const prefs = localStorage.getItem('mascotPreferences');
            if (prefs) {
                const parsed = JSON.parse(prefs);
                this.isVisible = parsed.visible !== undefined ? parsed.visible : true;
                this.currentCharacter = parsed.character || 'helmet';
            }
        } catch (e) {
            console.warn('Could not load mascot preferences:', e);
        }

        this.updateVisibility();
    },

    /**
     * Save preferences
     */
    savePreferences() {
        try {
            localStorage.setItem('mascotPreferences', JSON.stringify({
                visible: this.isVisible,
                character: this.currentCharacter
            }));
        } catch (e) {
            console.warn('Could not save mascot preferences:', e);
        }
    },

    /**
     * Update visibility
     */
    updateVisibility() {
        const container = document.getElementById('mascotContainer');
        if (container) {
            container.style.display = this.isVisible ? 'block' : 'none';
        }
    },

    /**
     * Toggle mascot visibility
     */
    toggle() {
        this.isVisible = !this.isVisible;
        this.updateVisibility();
        this.savePreferences();
        return this.isVisible;
    },

    /**
     * Switch character
     */
    switchCharacter(characterId) {
        if (this.characters[characterId]) {
            this.currentCharacter = characterId;
            const char = this.characters[characterId];

            const emoji = document.querySelector('.mascot-emoji');
            const name = document.querySelector('.mascot-name');

            if (emoji) emoji.textContent = char.emoji;
            if (name) name.textContent = char.name;

            this.savePreferences();
            this.bounce();
        }
    },

    /**
     * Set mascot mood
     */
    setMood(moodName) {
        const mood = this.moods[moodName];
        if (!mood) return;

        this.currentMood = moodName;

        const eyes = document.querySelector('.mascot-eyes');
        const mouth = document.querySelector('.mascot-mouth');
        const body = document.querySelector('.mascot-body');

        if (eyes) eyes.textContent = mood.eyes + mood.eyes;
        if (mouth) mouth.textContent = mood.mouth;
        if (body) body.style.boxShadow = `0 0 20px ${mood.color}`;
    },

    /**
     * Speak a phrase
     */
    speak(context, customMessage = null) {
        const text = customMessage || this.getRandomPhrase(context);
        const textElement = this.speechBubble?.querySelector('.mascot-text');

        if (!textElement) return;

        // Update mood based on context
        const moodMap = {
            welcome: 'happy',
            lessonStart: 'excited',
            lessonComplete: 'celebrating',
            quizStart: 'thinking',
            correctAnswer: 'celebrating',
            wrongAnswer: 'encouraging',
            quizComplete: 'excited',
            perfectScore: 'celebrating',
            courseComplete: 'celebrating',
            idle: 'happy',
            encouragement: 'encouraging',
            badge: 'celebrating',
            goodbye: 'happy'
        };

        this.setMood(moodMap[context] || 'happy');

        // Show speech bubble with animation
        textElement.textContent = text;
        this.speechBubble.classList.add('show');
        this.bounce();

        // Hide after delay
        clearTimeout(this.speechTimeout);
        this.speechTimeout = setTimeout(() => {
            this.speechBubble.classList.remove('show');
        }, 4000);

        // Reset idle timer
        this.startIdleTimer();
    },

    /**
     * Get random phrase for context
     */
    getRandomPhrase(context) {
        const phrases = this.phrases[context] || this.phrases.idle;
        return phrases[Math.floor(Math.random() * phrases.length)];
    },

    /**
     * Bounce animation
     */
    bounce() {
        if (this.element) {
            this.element.classList.add('bounce');
            setTimeout(() => {
                this.element.classList.remove('bounce');
            }, 500);
        }
    },

    /**
     * Start idle timer for random messages
     */
    startIdleTimer() {
        clearTimeout(this.idleTimeout);
        this.idleTimeout = setTimeout(() => {
            if (this.isVisible && Math.random() > 0.5) {
                this.speak('idle');
            }
            this.startIdleTimer();
        }, 60000); // Every minute
    },

    // Convenience methods
    welcome() { this.speak('welcome'); },
    lessonStart() { this.speak('lessonStart'); },
    lessonComplete() { this.speak('lessonComplete'); },
    quizStart() { this.speak('quizStart'); },
    correct() { this.speak('correctAnswer'); },
    wrong() { this.speak('wrongAnswer'); },
    quizComplete() { this.speak('quizComplete'); },
    perfectScore() { this.speak('perfectScore'); },
    courseComplete() { this.speak('courseComplete'); },
    encourage() { this.speak('encouragement'); },
    badge() { this.speak('badge'); },
    goodbye() { this.speak('goodbye'); }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Mascot.init();
});
