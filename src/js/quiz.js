/**
 * Quiz Module
 * Handles quiz rendering, validation, and scoring
 */

const Quiz = {
    currentQuiz: null,
    currentQuestionIndex: 0,
    score: 0,
    answers: [],

    /**
     * Utility: Shuffle array (Fisher-Yates algorithm)
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    /**
     * Start quiz with randomization
     */
    start(quiz, courseId) {
        // Support both old format (questions array) and new format (questionBank array)
        const questions = quiz.questionBank || quiz.questions;

        if (!quiz || !questions) {
            console.error('Invalid quiz data');
            return;
        }

        // Create a deep copy of quiz to avoid mutating original
        this.currentQuiz = JSON.parse(JSON.stringify(quiz));
        this.currentQuiz.courseId = courseId;

        // Determine how many questions to show
        const questionBankSize = questions.length;
        const questionsToShow = quiz.questionsPerAttempt || Math.min(10, questionBankSize);

        // Decide whether to shuffle questions
        const shouldShuffle = quiz.shuffleQuestions !== undefined ? quiz.shuffleQuestions : true;

        // Select and optionally shuffle questions
        let selectedQuestions;
        if (shouldShuffle) {
            const shuffledQuestions = this.shuffleArray(questions);
            selectedQuestions = shuffledQuestions.slice(0, questionsToShow);
        } else {
            selectedQuestions = questions.slice(0, questionsToShow);
        }

        // Shuffle options for each selected question and track correct answer
        this.currentQuiz.questions = selectedQuestions.map(question => {
            const correctAnswer = question.options[question.correctAnswer];
            const shuffledOptions = shouldShuffle ? this.shuffleArray(question.options) : question.options;

            return {
                ...question,
                options: shuffledOptions,
                correctAnswer: shuffledOptions.indexOf(correctAnswer) // Update correct index
            };
        });

        this.currentQuestionIndex = 0;
        this.score = 0;
        this.answers = [];

        // Initialize timed quiz if enabled
        if (quiz.timedMode && typeof TimedQuiz !== 'undefined') {
            TimedQuiz.init({
                timePerQuestion: quiz.timePerQuestion || 15,
                onTimeUp: () => {
                    // Auto-select wrong answer when time runs out
                    const question = this.currentQuiz.questions[this.currentQuestionIndex];
                    const wrongIndex = question.options.findIndex((_, idx) => idx !== question.correctAnswer);
                    this.selectAnswer(wrongIndex, true); // true = time expired
                }
            });
        }

        // Initialize lives system if enabled
        if (quiz.enableLives && typeof LivesSystem !== 'undefined') {
            LivesSystem.init({
                maxLives: quiz.maxLives || 3,
                onGameOver: () => {
                    // Restart quiz when lives run out (no results, no certificate)
                    setTimeout(() => {
                        // Clean up before restart
                        if (typeof TimedQuiz !== 'undefined') {
                            TimedQuiz.disable();
                        }
                        if (typeof LivesSystem !== 'undefined') {
                            LivesSystem.disable();
                        }

                        // Restart quiz from beginning with fresh state
                        this.start(quiz, courseId);
                    }, 2500);
                }
            });
        }

        // Show quiz screen
        App.showScreen('quizScreen');

        // Check if we need to run the tour first
        if (typeof DialogueTour !== 'undefined' && !DialogueTour.hasCompletedTour('quiz')) {
            // Start tour
            setTimeout(() => {
                DialogueTour.startTour('quiz');
            }, 500);

            // Wait for tour to finish before starting quiz
            const checkTour = setInterval(() => {
                if (DialogueTour.hasCompletedTour('quiz')) {
                    clearInterval(checkTour);
                    this.startQuizSession();
                }
            }, 500);
        } else {
            // Start immediately
            this.startQuizSession();
        }
    },

    /**
     * Start the actual quiz session (timer, questions)
     */
    startQuizSession() {
        // Play quiz intro narration
        AudioNarration.playQuizIntro();

        // Render first question
        this.renderQuestion();
    },

    /**
     * Render current question
     */
    renderQuestion() {
        const question = this.currentQuiz.questions[this.currentQuestionIndex];
        const quizMain = document.getElementById('quizMain');

        // Update progress
        document.getElementById('quizQuestionNum').textContent = this.currentQuestionIndex + 1;
        document.getElementById('quizTotalQuestions').textContent = this.currentQuiz.questions.length;

        // Create question card
        const questionCard = document.createElement('div');
        questionCard.className = 'quiz-question-card';

        questionCard.innerHTML = `
            <h2 class="question-text">${question.question}</h2>
            <div class="quiz-options" id="quizOptions">
                ${question.options.map((option, index) => `
                    <button class="quiz-option" data-index="${index}">
                        ${option}
                    </button>
                `).join('')}
            </div>
            <div id="quizFeedback"></div>
            <div class="mt-lg text-center hidden" id="quizNextBtn">
                <button class="btn btn-primary btn-large" onclick="Quiz.nextQuestion()">
                    <span>السؤال التالي</span>
                    <span class="btn-icon">→</span>
                </button>
            </div>
        `;

        quizMain.innerHTML = '';
        quizMain.appendChild(questionCard);

        // Start timer if enabled
        if (this.currentQuiz.timedMode && typeof TimedQuiz !== 'undefined' && TimedQuiz.isEnabled) {
            TimedQuiz.start();
        }

        // Add click handlers to options
        const options = questionCard.querySelectorAll('.quiz-option');
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectAnswer(parseInt(e.currentTarget.dataset.index));
            });
        });
    },

    /**
     * Handle answer selection
     * @param {number} selectedIndex - Index of selected answer
     * @param {boolean} timeExpired - Whether time ran out (auto-wrong answer)
     */
    selectAnswer(selectedIndex, timeExpired = false) {
        // Stop timer if running
        if (this.currentQuiz.timedMode && typeof TimedQuiz !== 'undefined') {
            TimedQuiz.stop();
        }

        const question = this.currentQuiz.questions[this.currentQuestionIndex];
        const isCorrect = selectedIndex === question.correctAnswer;

        // Calculate time bonus if applicable
        let timeBonus = 0;
        if (isCorrect && this.currentQuiz.timedMode && typeof TimedQuiz !== 'undefined') {
            timeBonus = TimedQuiz.getTimeBonus();
        }

        // Store answer
        this.answers.push({
            questionIndex: this.currentQuestionIndex,
            selectedAnswer: selectedIndex,
            isCorrect,
            timeBonus,
            timeExpired
        });

        if (isCorrect) {
            this.score++;
            AudioNarration.playQuizCorrect();
        } else {
            AudioNarration.playQuizIncorrect();
            // Life loss moved to showResults
        }

        // Disable all options
        const options = document.querySelectorAll('.quiz-option');
        options.forEach((option, index) => {
            option.disabled = true;
            option.style.cursor = 'not-allowed';

            if (index === selectedIndex) {
                option.classList.add(isCorrect ? 'correct' : 'incorrect');
            }

            if (index === question.correctAnswer) {
                option.classList.add('correct');
            }
        });

        // Show feedback
        const feedbackDiv = document.getElementById('quizFeedback');
        feedbackDiv.className = `quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}`;

        let feedbackHTML = isCorrect
            ? '✅ إجابة صحيحة! أحسنت!'
            : `❌ إجابة خاطئة. الإجابة الصحيحة: ${question.options[question.correctAnswer]}`;

        if (timeExpired) {
            feedbackHTML = `⏰ انتهى الوقت! ${feedbackHTML}`;
        }

        if (timeBonus > 0) {
            feedbackHTML += ` ⚡ +${timeBonus} نقطة إضافية!`;
        }

        feedbackDiv.innerHTML = feedbackHTML;

        // Show next button
        if (this.currentQuestionIndex < this.currentQuiz.questions.length - 1) {
            document.getElementById('quizNextBtn').classList.remove('hidden');
        } else {
            // Last question - show results
            setTimeout(() => {
                this.showResults();
            }, 2000);
        }
    },

    /**
     * Move to next question
     */
    nextQuestion() {
        this.currentQuestionIndex++;

        // Reset timer for next question
        if (this.currentQuiz.timedMode && typeof TimedQuiz !== 'undefined') {
            TimedQuiz.reset();
        }

        if (this.currentQuestionIndex < this.currentQuiz.questions.length) {
            this.renderQuestion();
        } else {
            this.showResults();
        }
    },

    /**
     * Show quiz results
     */
    showResults() {
        const quizMain = document.getElementById('quizMain');
        const totalQuestions = this.currentQuiz.questions.length;
        const percentage = Math.round((this.score / totalQuestions) * 100);
        const passed = percentage >= 60; // 60% passing grade

        // Save quiz score
        Storage.saveQuizScore(this.currentQuiz.courseId, this.score, totalQuestions);

        // Handle pass/fail logic
        if (passed) {
            Storage.markCourseCompleted(this.currentQuiz.courseId);
            Storage.resetConsecutiveFailures(this.currentQuiz.courseId);
        } else {
            // Lose a life if lives system is enabled
            if (this.currentQuiz.enableLives && typeof LivesSystem !== 'undefined' && LivesSystem.isEnabled) {
                LivesSystem.loseLife();
            }

            // Track consecutive failures
            const consecutiveFailures = Storage.incrementConsecutiveFailures(this.currentQuiz.courseId);

            // If 3 consecutive failures, restart the lesson
            if (consecutiveFailures >= 3) {
                Storage.resetConsecutiveFailures(this.currentQuiz.courseId);
                this.handleLessonRestart();
                return;
            }
        }

        // Check for new achievements
        if (typeof Achievements !== 'undefined') {
            Achievements.checkAchievements();
        }

        // Check if ALL courses are completed - there are 3 courses total in the system
        const totalCoursesInSystem = (App.coursesData && App.coursesData.length) || 3;
        const completedCourses = Storage.getCompletedCourses();
        const allCompleted = passed && completedCourses.length >= totalCoursesInSystem;

        const resultsHTML = `
            <div class="quiz-results">
                <div class="quiz-score">${percentage}%</div>
                <h2>${passed ? '🎉 مبروك! لقد نجحت' : '😔 للأسف، لم تنجح'}</h2>
                <p>لقد أجبت على <strong>${this.score}</strong> من <strong>${totalQuestions}</strong> أسئلة بشكل صحيح</p>
                
                ${passed ? `
                    ${allCompleted ? `
                        <div class="achievement-unlock">
                            <h3>🌟 إنجاز مذهل! 🌟</h3>
                            <p>لقد أكملت جميع الدورات التدريبية بنجاح!</p>
                        </div>
                        <button class="btn btn-primary btn-large gold-btn" onclick="Certificate.showMasterCertificate()">
                            <span class="btn-icon">🏆</span>
                            <span>عرض الشهادة النهائية</span>
                        </button>
                    ` : `
                        <button class="btn btn-primary btn-large" onclick="Certificate.show('${this.currentQuiz.courseId}')">
                            <span class="btn-icon">🏆</span>
                            <span>عرض الشهادة</span>
                        </button>
                    `}
                ` : `
                    <button class="btn btn-secondary btn-large" onclick="Quiz.start(Quiz.currentQuiz, '${this.currentQuiz.courseId}')">
                        <span class="btn-icon">🔄</span>
                        <span>إعادة المحاولة</span>
                    </button>
                `}
                
                <button class="btn btn-secondary mt-lg" onclick="App.showScreen('dashboardScreen'); App.loadDashboard();">
                    <span class="btn-icon">←</span>
                    <span>العودة للوحة التحكم</span>
                </button>
            </div>
        `;

        quizMain.innerHTML = resultsHTML;
    },

    /**
     * Handle lesson restart after 3 failures
     */
    handleLessonRestart() {
        const quizMain = document.getElementById('quizMain');
        const courseId = this.currentQuiz.courseId;

        quizMain.innerHTML = `
            <div class="quiz-results">
                <div class="game-over-icon" style="font-size: 4rem; margin-bottom: 20px;">🔄</div>
                <h2>لقد فشلت 3 مرات متتالية</h2>
                <p>سنبدأ الدرس من البداية لتتمكن من مراجعة المعلومات بشكل أفضل</p>
                <div class="loading-spinner mt-lg"></div>
            </div>
        `;

        // Restore lives for a fresh start if they were empty
        if (typeof LivesSystem !== 'undefined') {
            LivesSystem.reset();
        }

        setTimeout(() => {
            App.openCourse(courseId);
        }, 3000);
    }

};
