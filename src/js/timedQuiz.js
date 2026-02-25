/**
 * Timed Quiz Mode
 * Adds countdown timer functionality to quizzes
 */

const TimedQuiz = {
    isEnabled: false,
    timePerQuestion: 15, // seconds
    totalTime: 0,
    remainingTime: 0,
    timerInterval: null,
    timerElement: null,
    onTimeUp: null,

    /**
     * Initialize timed quiz mode
     * @param {Object} options - Configuration options
     */
    init(options = {}) {
        this.timePerQuestion = options.timePerQuestion || 30;
        this.onTimeUp = options.onTimeUp || null;
        this.isEnabled = true;
    },

    /**
     * Create timer display element
     */
    createTimerElement() {
        // Remove existing timer if any
        const existing = document.querySelector('.quiz-timer');
        if (existing) existing.remove();

        const timer = document.createElement('div');
        timer.className = 'quiz-timer';
        timer.innerHTML = `
            <span class="quiz-timer-icon">⏱️</span>
            <span class="quiz-timer-value" id="timerValue">00:30</span>
        `;

        // Insert into quiz header
        const quizHeader = document.querySelector('.quiz-header');
        if (quizHeader) {
            quizHeader.appendChild(timer);
        }

        this.timerElement = document.getElementById('timerValue');
        return timer;
    },

    /**
     * Start the timer for a question
     * @param {number} seconds - Time limit in seconds
     */
    start(seconds = null) {
        if (!this.isEnabled) return;

        this.remainingTime = seconds || this.timePerQuestion;
        this.totalTime = this.remainingTime;

        this.createTimerElement();
        this.updateDisplay();

        // Clear any existing interval
        this.stop();

        // Start countdown
        this.timerInterval = setInterval(() => {
            this.remainingTime--;
            this.updateDisplay();

            // Warning at 10 seconds
            if (this.remainingTime === 10) {
                this.showWarning();
                if (typeof SoundEffects !== 'undefined') {
                    SoundEffects.timeWarning();
                }
            }

            // Countdown beeps in last 5 seconds
            if (this.remainingTime <= 5 && this.remainingTime > 0) {
                if (typeof SoundEffects !== 'undefined') {
                    SoundEffects.countdown();
                }
            }

            // Time's up
            if (this.remainingTime <= 0) {
                this.timeUp();
            }
        }, 1000);
    },

    /**
     * Stop the timer
     */
    stop() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    },

    /**
     * Pause the timer
     */
    pause() {
        this.stop();
    },

    /**
     * Resume the timer
     */
    resume() {
        if (this.isEnabled && this.remainingTime > 0) {
            this.timerInterval = setInterval(() => {
                this.remainingTime--;
                this.updateDisplay();
                if (this.remainingTime <= 0) {
                    this.timeUp();
                }
            }, 1000);
        }
    },

    /**
     * Update the timer display
     */
    updateDisplay() {
        if (!this.timerElement) return;

        const minutes = Math.floor(this.remainingTime / 60);
        const seconds = this.remainingTime % 60;
        this.timerElement.textContent =
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    },

    /**
     * Show warning state
     */
    showWarning() {
        const timer = document.querySelector('.quiz-timer');
        if (timer) {
            timer.classList.add('warning');
        }
    },

    /**
     * Handle time up
     */
    timeUp() {
        this.stop();

        if (typeof SoundEffects !== 'undefined') {
            SoundEffects.gameOver();
        }

        // Show time up message
        this.showTimeUpMessage();

        // Call callback if provided
        if (this.onTimeUp && typeof this.onTimeUp === 'function') {
            setTimeout(() => this.onTimeUp(), 1500);
        }
    },

    /**
     * Show time up message
     */
    showTimeUpMessage() {
        const overlay = document.createElement('div');
        overlay.className = 'time-up-overlay';
        overlay.innerHTML = `
            <div class="time-up-content">
                <span class="time-up-icon">⏰</span>
                <h2>انتهى الوقت!</h2>
                <p>حاول أن تجيب أسرع في المرة القادمة</p>
            </div>
        `;
        document.body.appendChild(overlay);

        requestAnimationFrame(() => overlay.classList.add('show'));

        setTimeout(() => {
            overlay.classList.remove('show');
            setTimeout(() => overlay.remove(), 500);
        }, 2000);
    },

    /**
     * Get time bonus points based on remaining time
     */
    getTimeBonus() {
        if (!this.isEnabled) return 0;
        const percentLeft = this.remainingTime / this.totalTime;
        return Math.floor(percentLeft * 50); // Up to 50 bonus points
    },

    /**
     * Reset timer for next question
     */
    reset() {
        this.stop();
        this.remainingTime = this.timePerQuestion;
        const timer = document.querySelector('.quiz-timer');
        if (timer) timer.classList.remove('warning');
    },

    /**
     * Disable timed mode
     */
    disable() {
        this.isEnabled = false;
        this.stop();
        const timer = document.querySelector('.quiz-timer');
        if (timer) timer.remove();
    }
};

/**
 * Lives System (Duolingo-style hearts)
 */
const LivesSystem = {
    maxLives: 5,
    currentLives: 5,
    isEnabled: false,
    livesElement: null,
    onGameOver: null,

    /**
     * Initialize lives system
     */
    init(options = {}) {
        this.maxLives = options.maxLives || 5;
        this.currentLives = this.maxLives;
        this.onGameOver = options.onGameOver || null;
        this.isEnabled = true;
        this.loadLives();
        this.createDisplay();
    },

    /**
     * Create lives display
     */
    createDisplay() {
        // Remove existing display if any
        const existing = document.querySelector('.lives-display');
        if (existing) existing.remove();

        const container = document.createElement('div');
        container.className = 'lives-display';
        container.id = 'livesDisplay';

        for (let i = 0; i < this.maxLives; i++) {
            const heart = document.createElement('span');
            heart.className = 'life-heart';
            heart.textContent = '❤️';
            heart.dataset.index = i;
            container.appendChild(heart);
        }

        // Insert into quiz header
        const quizHeader = document.querySelector('.quiz-header');
        if (quizHeader) {
            quizHeader.insertBefore(container, quizHeader.firstChild);
        }

        this.livesElement = container;
        this.updateDisplay();
    },

    /**
     * Update lives display
     */
    updateDisplay() {
        if (!this.livesElement) return;

        const hearts = this.livesElement.querySelectorAll('.life-heart');
        hearts.forEach((heart, index) => {
            if (index < this.currentLives) {
                heart.classList.remove('lost');
                heart.textContent = '❤️';
            } else {
                heart.classList.add('lost');
                heart.textContent = '🖤';
            }
        });
    },

    /**
     * Lose a life
     */
    loseLife() {
        if (!this.isEnabled || this.currentLives <= 0) return;

        this.currentLives--;

        // Animate the lost heart
        const hearts = this.livesElement?.querySelectorAll('.life-heart');
        if (hearts && hearts[this.currentLives]) {
            const heart = hearts[this.currentLives];
            heart.classList.add('losing');
            setTimeout(() => {
                heart.classList.remove('losing');
                this.updateDisplay();
            }, 500);
        }

        this.saveLives();

        // Check for game over
        if (this.currentLives <= 0) {
            this.gameOver();
        }

        return this.currentLives;
    },

    /**
     * Gain a life (e.g., from watching an ad or waiting)
     */
    gainLife() {
        if (this.currentLives < this.maxLives) {
            this.currentLives++;
            this.updateDisplay();
            this.saveLives();
        }
        return this.currentLives;
    },

    /**
     * Handle game over (no lives left)
     */
    gameOver() {
        if (typeof SoundEffects !== 'undefined') {
            SoundEffects.gameOver();
        }

        this.showGameOverMessage();

        if (this.onGameOver && typeof this.onGameOver === 'function') {
            setTimeout(() => this.onGameOver(), 2500);
        }
    },

    /**
     * Show game over message
     */
    showGameOverMessage() {
        const overlay = document.createElement('div');
        overlay.className = 'game-over-overlay';
        overlay.innerHTML = `
            <div class="game-over-content">
                <span class="game-over-icon">💔</span>
                <h2>انتهت المحاولات!</h2>
                <p>لقد استخدمت كل القلوب</p>
                <p class="game-over-tip">💡 سترجع القلوب بعد فترة</p>
            </div>
        `;
        document.body.appendChild(overlay);

        requestAnimationFrame(() => overlay.classList.add('show'));

        setTimeout(() => {
            overlay.classList.remove('show');
            setTimeout(() => overlay.remove(), 500);
        }, 3000);
    },

    /**
     * Reset lives to max
     */
    reset() {
        this.currentLives = this.maxLives;
        this.updateDisplay();
        this.saveLives();
    },

    /**
     * Save lives to storage
     */
    saveLives() {
        try {
            localStorage.setItem('livesData', JSON.stringify({
                currentLives: this.currentLives,
                lastUpdated: Date.now()
            }));
        } catch (e) {
            console.warn('Could not save lives:', e);
        }
    },

    /**
     * Load lives from storage
     */
    loadLives() {
        try {
            const saved = localStorage.getItem('livesData');
            if (saved) {
                const data = JSON.parse(saved);
                this.currentLives = data.currentLives;

                // Regenerate lives over time (1 life per 30 minutes)
                const timePassed = Date.now() - data.lastUpdated;
                const livesToRestore = Math.floor(timePassed / (30 * 60 * 1000));
                if (livesToRestore > 0) {
                    this.currentLives = Math.min(this.maxLives, this.currentLives + livesToRestore);
                    this.saveLives();
                }
            }
        } catch (e) {
            this.currentLives = this.maxLives;
        }
    },

    /**
     * Get remaining lives
     */
    getLives() {
        return this.currentLives;
    },

    /**
     * Check if player has lives
     */
    hasLives() {
        return this.currentLives > 0;
    },

    /**
     * Disable lives system
     */
    disable() {
        this.isEnabled = false;
        const display = document.querySelector('.lives-display');
        if (display) display.remove();
    }
};
