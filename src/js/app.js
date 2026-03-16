/**
 * Main Application Logic
 * Handles screen navigation, course loading, and sequential unlocking
 */

const App = {
    // DEBUG: Global Error Handler
    setupErrorHandler() {
        window.onerror = function (message, source, lineno, colno, error) {
            alert(`Error: ${message}\nSource: ${source}:${lineno}`);
            return false;
        };
        window.addEventListener('unhandledrejection', function (event) {
            alert(`Unhandled Rejection: ${event.reason}`);
        });
    },

    coursesData: [],
    currentCourse: null,
    currentLessonIndex: 0,

    /**
     * Initialize the application
     */
    async init() {
        console.log('Initializing Safety Education App...');

        // Load courses data
        await this.loadCoursesData();


        // Initialize guided tour (DialogueTour replaced old GuidedTour)
        if (typeof DialogueTour !== 'undefined') {
            DialogueTour.init();
        }

        // Initialize audio narration
        AudioNarration.init();

        // Setup welcome screen
        this.setupWelcomeScreen();

        // Setup navigation buttons
        this.setupNavigationButtons();

        // Check if student name exists
        const studentName = Storage.getStudentName();

        // Show credits screen first
        this.showScreen('creditsScreen');

        const skipCreditsBtn = document.getElementById('skipCreditsBtn');
        let creditsTimeout;

        const proceedToWelcome = () => {
            clearTimeout(creditsTimeout);
            this.showScreen('welcomeScreen');

            if (studentName && studentName !== 'الطالب') {
                // Returning user: Pre-fill name and update UI
                const nameInput = document.getElementById('studentName');
                if (nameInput) nameInput.value = studentName;

                // Update welcome message
                const welcomeTitle = document.querySelector('.welcome-card h2');
                if (welcomeTitle) welcomeTitle.textContent = `مرحباً بعودتك، ${studentName} 👋`;

                // Update button text
                const startBtnSpan = document.querySelector('#startBtn span');
                if (startBtnSpan) startBtnSpan.textContent = 'متابعة التعلم';

                // Allow returning users to see tour if they haven't seen it (or force it for now)
                if (typeof DialogueTour !== 'undefined') {
                    setTimeout(() => DialogueTour.startTour('welcome'), 1000);
                }
            } else {
                // New user / Fresh start - ensure input is cleared
                const nameInput = document.getElementById('studentName');
                if (nameInput) nameInput.value = '';

                AudioNarration.playWelcome();

                // Start welcome tour
                if (typeof DialogueTour !== 'undefined') {
                    setTimeout(() => DialogueTour.startTour('welcome'), 1000);
                }
            }
        };

        if (skipCreditsBtn) {
            skipCreditsBtn.addEventListener('click', proceedToWelcome);
        }

        // Auto-proceed after 4.5 seconds
        creditsTimeout = setTimeout(proceedToWelcome, 10000);
    },

    /**
     * Load courses data from JSON
     */
    async loadCoursesData() {
        try {
            const response = await fetch('data/courses.json');
            const data = await response.json();
            this.coursesData = data.courses;
            console.log('Courses loaded:', this.coursesData.length);
        } catch (error) {
            console.error('Error loading courses data:', error);
            // Fallback to empty array
            this.coursesData = [];
        }
    },

    /**
     * Setup welcome screen
     */
    setupWelcomeScreen() {
        const startBtn = document.getElementById('startBtn');
        const nameInput = document.getElementById('studentName');
        const helpBtn = document.getElementById('helpBtn');

        // Help button to restart tour
        if (helpBtn) {
            helpBtn.addEventListener('click', () => {
                const activeScreen = document.querySelector('.screen.active');
                const screenId = activeScreen?.id;

                let tourName = '';
                if (screenId === 'welcomeScreen') tourName = 'welcome';
                else if (screenId === 'dashboardScreen') tourName = 'dashboard';
                else if (screenId === 'courseScreen') tourName = 'course';
                else if (screenId === 'quizScreen') tourName = 'quiz';
                else if (screenId === 'certificateScreen') tourName = 'certificate';

                if (tourName && typeof DialogueTour !== 'undefined') {
                    // Force start when requested via Help button
                    DialogueTour.startTour(tourName, true);
                }
            });
        }

        if (startBtn && nameInput) {
            startBtn.addEventListener('click', () => {
                const name = nameInput.value.trim();

                if (name === '') {
                    alert('من فضلك، أدخل اسمك للمتابعة');
                    nameInput.focus();
                    return;
                }

                // Save student name
                Storage.saveStudentName(name);

                // Navigate to dashboard
                this.showScreen('dashboardScreen');
                this.loadDashboard();
                AudioNarration.playDashboard();

                // Start dashboard tour if first time
                // Always start the dialogue tour when entering dashboard for the first time in session
                if (typeof DialogueTour !== 'undefined') {
                    setTimeout(() => DialogueTour.startTour('dashboard'), 1000);
                }
            });

            // Allow Enter key to submit
            nameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    startBtn.click();
                }
            });
        }
    },

    /**
     * Setup navigation buttons
     */
    setupNavigationButtons() {
        // Back to dashboard from course
        const backToDashboard = document.getElementById('backToDashboard');
        if (backToDashboard) {
            backToDashboard.addEventListener('click', () => {
                this.showScreen('dashboardScreen');
                this.loadDashboard();
            });
        }

        // Back to course from quiz
        const backToCourse = document.getElementById('backToCourse');
        if (backToCourse) {
            backToCourse.addEventListener('click', () => {
                this.showScreen('courseScreen');
            });
        }

        // Previous lesson
        const prevBtn = document.getElementById('prevLessonBtn');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.navigateLesson(-1);
            });
        }

        // Next lesson
        const nextBtn = document.getElementById('nextLessonBtn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.navigateLesson(1);
            });
        }

        // Reset App Data (Dashboard)
        const resetBtn = document.getElementById('resetAppBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                Storage.clearAll();
            });
        }

        // Reset App Data (Welcome Screen)
        const resetWelcomeBtn = document.getElementById('resetWelcomeBtn');
        if (resetWelcomeBtn) {
            resetWelcomeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                Storage.clearAll();
            });
        }
    },

    /**
     * Show specific screen
     */
    showScreen(screenId) {
        // Show target screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            // Hide all screens
            document.querySelectorAll('.screen').forEach(screen => {
                screen.classList.remove('active');
            });

            targetScreen.classList.add('active');
            // Scroll the screen container to top
            targetScreen.scrollTop = 0;
        }

        AudioNarration.stop();
    },

    /**
     * Load dashboard content
     */
    loadDashboard() {
        // Update user name
        const userName = document.getElementById('userName');
        if (userName) {
            userName.textContent = Storage.getStudentName();
        }

        // Calculate and update progress
        this.updateProgress();

        // Load courses grid
        this.loadCoursesGrid();

        // Check for any new achievements and update display
        if (typeof Achievements !== 'undefined') {
            Achievements.checkAchievements();
            Achievements.updateAchievementsDisplay();
        }

        // Start dashboard tour if appropriate
        // Automatically start the new Dialogue Tour for dashboard
        // We use a small timeout to ensure the UI is fully rendered
        if (typeof DialogueTour !== 'undefined') {
            setTimeout(() => DialogueTour.startTour('dashboard'), 800);
        }

        // Load certificates
        this.loadCertificates();
    },

    /**
     * Load certificates section
     */
    loadCertificates() {
        const grid = document.getElementById('certificatesGrid');
        if (!grid) return;

        const completedCourses = Storage.getCompletedCourses();
        const allCompleted = Storage.checkAllCoursesCompleted(this.coursesData.length);

        let html = '';

        if (completedCourses.length === 0) {
            grid.innerHTML = '<p class="text-muted" style="grid-column: 1/-1;">أكمل الدورات للحصول على شهاداتك هنا.</p>';
            return;
        }

        // Add Master Certificate if qualified
        if (allCompleted) {
            html += `
                <div class="certificate-card master-cert" style="border: 2px solid #ffd700; background: linear-gradient(to bottom right, #fffdf0, #fff); padding: 15px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 2.5rem; margin-bottom: 10px;">🏆</div>
                    <h4 style="color: #b8860b; margin-bottom: 5px;">الشهادة النهائية</h4>
                    <p style="font-size: 0.8rem; color: #666; margin-bottom: 15px;">إتمام البرنامج بالكامل</p>
                    <button class="btn btn-sm gold-btn" onclick="Certificate.showMasterCertificate()">
                        عرض الشهادة
                    </button>
                </div>
            `;
        }

        // Add Course Certificates
        completedCourses.forEach(courseId => {
            const course = this.coursesData.find(c => c.id === courseId);
            if (course) {
                html += `
                    <div class="certificate-card" style="background: var(--dark-card); padding: 15px; border-radius: 10px; text-align: center; border: 1px solid rgba(255,255,255,0.1);">
                        <div style="font-size: 2rem; margin-bottom: 10px;">${course.icon}</div>
                        <h4 style="margin-bottom: 5px;">${course.title}</h4>
                        <p style="font-size: 0.8rem; color: #aaa; margin-bottom: 15px;">تم الإكمال</p>
                        <button class="btn btn-primary btn-sm" onclick="Certificate.show('${course.id}', false)">
                            عرض
                        </button>
                    </div>
                `;
            }
        });

        grid.innerHTML = html;
    },

    /**
     * Update overall progress
     */
    updateProgress() {
        // Count total lessons
        let totalLessons = 0;
        this.coursesData.forEach(course => {
            totalLessons += course.lessons.length;
        });

        const progress = Storage.calculateProgress(totalLessons);

        // Update progress circle
        const progressNumber = document.getElementById('progressNumber');
        const progressFill = document.getElementById('progressFill');

        if (progressNumber) {
            progressNumber.textContent = progress;
        }

        if (progressFill) {
            const circumference = 283; // 2 * PI * radius (45)
            const offset = circumference - (progress / 100) * circumference;
            progressFill.style.strokeDashoffset = offset;
        }
    },

    /**
     * Load courses grid with lock/unlock logic
     */
    loadCoursesGrid() {
        const coursesGrid = document.getElementById('coursesGrid');
        if (!coursesGrid) return;

        coursesGrid.innerHTML = '';

        const completedCourses = Storage.getCompletedCourses();

        this.coursesData.forEach((course, index) => {
            // Check if course should be unlocked
            const isUnlocked = index === 0 || completedCourses.includes(this.coursesData[index - 1].id);
            const isCompleted = Storage.isCourseCompleted(course.id);
            const quizScore = Storage.getCourseQuizScore(course.id);

            const courseCard = document.createElement('div');
            courseCard.className = `course-card ${!isUnlocked ? 'locked' : ''}`;

            courseCard.innerHTML = `
                <div class="course-icon">${course.icon}</div>
                <h3>${course.title}</h3>
                <p class="course-description">${course.description}</p>
                <div class="course-meta">
                    <span>📚 ${course.lessons.length} دروس</span>
                    <span class="course-status ${isCompleted ? 'completed' : isUnlocked ? '' : 'locked'}">
                        ${isCompleted ? '✅ مكتمل' : isUnlocked ? '🔓 متاح' : '🔒 مقفل'}
                    </span>
                </div>
                ${quizScore ? `<div class="course-meta"><span>🎯 النتيجة: ${quizScore.percentage}%</span></div>` : ''}
            `;

            // Add click handler only if unlocked
            if (isUnlocked) {
                courseCard.style.cursor = 'pointer';
                courseCard.addEventListener('click', () => {
                    this.openCourse(course.id);
                });
            } else {
                courseCard.addEventListener('click', () => {
                    alert('🔒 يجب إكمال الدورة السابقة أولاً');
                });
            }

            coursesGrid.appendChild(courseCard);
        });
    },

    /**
     * Open a course
     */
    openCourse(courseId) {
        const course = this.coursesData.find(c => c.id === courseId);

        if (!course) {
            console.error('Course not found:', courseId);
            return;
        }

        this.currentCourse = course;
        this.currentLessonIndex = 0;

        // Show course screen
        this.showScreen('courseScreen');

        // Update course header
        document.getElementById('courseTitle').textContent = course.title;

        // Initialize Objectives Display
        this.initObjectivesGrid(course);

        // Play course intro narration
        AudioNarration.playCourseIntro();
        // Load first lesson
        this.loadLesson(0);

        // Update course progress
        this.updateCourseProgress();

        // Start course tour
        if (typeof DialogueTour !== 'undefined') {
            setTimeout(() => DialogueTour.startTour('course'), 1000);
        }
    },

    /**
     * Initialize the objectives grid for the course
     */
    initObjectivesGrid(course) {
        const objectivesGrid = document.getElementById('objectivesGrid');

        if (!objectivesGrid) return;

        // Default icons for each objective
        const icons = ['🎯', '📚', '✨', '🚀', '💡', '🔍', '⚡', '🎓'];

        // Clear current content
        objectivesGrid.innerHTML = '';

        // Check if course has objectives
        if (!course.objectives || course.objectives.length === 0) {
            objectivesGrid.innerHTML = `
                <div class="objective-chip">
                    <span class="objective-icon">📋</span>
                    <p class="objective-text">محتوى تعليمي شامل ومفيد</p>
                </div>
            `;
            return;
        }

        // Create chip for each objective
        course.objectives.forEach((objective, index) => {
            const chip = document.createElement('div');
            chip.className = 'objective-chip';
            chip.innerHTML = `
                <span class="objective-icon">${icons[index] || '📌'}</span>
                <p class="objective-text">${objective}</p>
            `;

            // Add hover sound
            chip.addEventListener('mouseenter', () => {
                if (typeof SoundEffects !== 'undefined') {
                    SoundEffects.hover();
                }
            });

            objectivesGrid.appendChild(chip);
        });
    },

    /**
     * Load a specific lesson
     */
    loadLesson(lessonIndex) {
        if (!this.currentCourse) return;

        // Scroll course screen to top
        const courseScreen = document.getElementById('courseScreen');
        if (courseScreen) {
            courseScreen.scrollTo({ top: 0, behavior: 'smooth' });
        }

        const lesson = this.currentCourse.lessons[lessonIndex];
        if (!lesson) return;

        this.currentLessonIndex = lessonIndex;

        const lessonContainer = document.getElementById('lessonContainer');

        // Calculate lesson progress
        const totalLessons = this.currentCourse.lessons.length;
        const progressPercent = Math.round(((lessonIndex + 1) / totalLessons) * 100);

        let content = `
            <div class="lesson-progress-header">
                <h2 class="lesson-title">${lesson.title}</h2>
                <div class="lesson-progress-info">
                    <span class="lesson-number">الدرس ${lessonIndex + 1} من ${totalLessons}</span>
                    <div class="mini-progress-bar">
                        <div class="mini-progress-fill" style="width: ${progressPercent}%"></div>
                    </div>
                </div>
            </div>
        `;

        // Add video if available
        if (lesson.videoUrl && lesson.videoUrl !== '') {
            console.log('Loading video:', lesson.videoUrl);
            content += `
                <video class="lesson-video" controls preload="auto" 
                       onerror="console.error('Video error:', this.error)"
                       onloadeddata="console.log('Video loaded successfully')">
                    <source src="${lesson.videoUrl}" type="video/mp4"
                            onerror="console.error('Source error loading:', '${lesson.videoUrl}')">
                    المتصفح لا يدعم تشغيل الفيديو
                </video>
            `;
        }

        // Add content
        content += `<div class="lesson-content">`;

        lesson.content.forEach(item => {
            if (item.type === 'text') {
                content += `<p>${item.value}</p>`;
            } else if (item.type === 'image') {
                content += `<img src="${item.value}" alt="صورة توضيحية" class="lesson-image">`;
            } else if (item.type === 'file') {
                content += `
                    <div style="text-align: center; margin: 20px 0;">
                        <a href="${item.value}" target="_blank" class="btn btn-secondary" style="text-decoration: none; display: inline-flex; align-items: center; gap: 10px;">
                            <span style="font-size: 1.5rem;">📄</span>
                            <span>${item.label || 'تحميل الملف'}</span>
                        </a>
                    </div>
                `;
            } else if (item.type === 'interactive') {
                // Use 'game' or 'value' field
                const gameId = item.game || item.value;
                if (gameId) {
                    // Determine the class/object name: e.g. "escapeRoom" -> "EscapeRoom"
                    const gameObjName = gameId.charAt(0).toUpperCase() + gameId.slice(1);
                    content += `
                        <div style="text-align: center; margin: 20px 0;">
                            <button class="btn btn-primary btn-large" onclick="${gameObjName}.start()">
                                <span style="font-size: 1.5rem;">🎮</span>
                                <span>${item.label || 'ابدأ النشاط التفاعلي'}</span>
                            </button>
                        </div>
                    `;
                }
            }
        });

        content += `</div>`;

        // Add scenarios or quiz button if last lesson
        if (lessonIndex === this.currentCourse.lessons.length - 1) {
            if (this.currentCourse.scenarios && this.currentCourse.scenarios.length > 0) {
                // Show scenarios button
                content += `
                    <div class="mt-lg text-center">
                        <button class="btn btn-primary btn-large" onclick="App.startCourseScenarios('${this.currentCourse.id}')">
                            <span class="btn-icon">🎮</span>
                            <span>تطبيق عملي</span>
                        </button>
                    </div>
                `;
            } else {
                // Show quiz button directly
                content += `
                    <div class="mt-lg text-center">
                        <button class="btn btn-primary btn-large" onclick="App.startCourseQuiz('${this.currentCourse.id}')">
                            <span class="btn-icon">📝</span>
                            <span>ابدأ الاختبار النهائي</span>
                        </button>
                    </div>
                `;
            }
        }

        lessonContainer.innerHTML = content;

        // Play lesson start narration
        AudioNarration.playLessonStart();

        // Update lesson indicator
        document.getElementById('currentLessonNum').textContent = lessonIndex + 1;
        document.getElementById('totalLessons').textContent = this.currentCourse.lessons.length;

        // Update navigation buttons
        this.updateLessonNavigation();

        // Mark lesson as completed only if no interactive game, or defer completion
        const hasGame = this.hasInteractiveGame(lesson);
        if (!hasGame) {
            Storage.markLessonCompleted(this.currentCourse.id, lesson.id);
        }

        // Check for any new achievements (like "First Step")
        if (typeof Achievements !== 'undefined') {
            Achievements.checkAchievements();
        }

        // Update course progress
        this.updateCourseProgress();
    },

    /**
     * Navigate to next/previous lesson
     */
    navigateLesson(direction) {
        // Check if current lesson has a mandatory mini-game that isn't completed
        if (direction > 0 && this.currentCourse) {
            const currentLesson = this.currentCourse.lessons[this.currentLessonIndex];
            const isAlreadyCompleted = Storage.isLessonCompleted(this.currentCourse.id, currentLesson.id);

            if (currentLesson && this.hasInteractiveGame(currentLesson) && !isAlreadyCompleted) {
                if (!this.isGameCompleted(currentLesson)) {
                    alert('⚠️ يجب إكمال النشاط التفاعلي (اللعبة) قبل الانتقال للدرس التالي!');
                    return;
                } else {
                    // Game completed, mark lesson as completed now
                    Storage.markLessonCompleted(this.currentCourse.id, currentLesson.id);
                }
            }
        }

        const newIndex = this.currentLessonIndex + direction;

        if (newIndex >= 0 && newIndex < this.currentCourse.lessons.length) {
            this.loadLesson(newIndex);
        }
    },

    /**
     * Check if a lesson has an interactive game
     */
    hasInteractiveGame(lesson) {
        if (!lesson || !lesson.content) return false;
        return lesson.content.some(item => item.type === 'interactive');
    },

    /**
     * Check if the interactive game in a lesson has been completed
     */
    isGameCompleted(lesson) {
        if (!lesson || !lesson.content) return true;
        const interactiveItem = lesson.content.find(item => item.type === 'interactive');
        if (!interactiveItem) return true;

        const gameId = interactiveItem.game || interactiveItem.value;
        if (!gameId) return true;

        // Map game IDs to their global objects and check completed flag
        const gameMap = {
            'spotDifference': typeof SpotDifference !== 'undefined' ? SpotDifference : null,
            'escapeRoom': typeof EscapeRoom !== 'undefined' ? EscapeRoom : null,
            'safetyArcade': typeof SafetyArcade !== 'undefined' ? SafetyArcade : null,
            'emergencySimulator': typeof EmergencySimulator !== 'undefined' ? EmergencySimulator : null,
            'PPEGame': typeof PPEGame !== 'undefined' ? PPEGame : null,
            'hazardMap': typeof HazardMap !== 'undefined' ? HazardMap : null
        };

        const gameObj = gameMap[gameId];
        if (gameObj && typeof gameObj.completed !== 'undefined') {
            return gameObj.completed === true;
        }

        // Unknown game, allow navigation
        return true;
    },

    /**
     * Update lesson navigation buttons
     */
    updateLessonNavigation() {
        const prevBtn = document.getElementById('prevLessonBtn');
        const nextBtn = document.getElementById('nextLessonBtn');

        if (prevBtn) {
            prevBtn.disabled = this.currentLessonIndex === 0;
            prevBtn.style.opacity = this.currentLessonIndex === 0 ? '0.5' : '1';
        }

        if (nextBtn) {
            const isLastLesson = this.currentLessonIndex === this.currentCourse.lessons.length - 1;
            nextBtn.disabled = isLastLesson;
            nextBtn.style.opacity = isLastLesson ? '0.5' : '1';
        }
    },

    /**
     * Update course progress bar
     */
    updateCourseProgress() {
        if (!this.currentCourse) return;

        let completedLessons = 0;
        this.currentCourse.lessons.forEach(lesson => {
            if (Storage.isLessonCompleted(this.currentCourse.id, lesson.id)) {
                completedLessons++;
            }
        });

        const progress = (completedLessons / this.currentCourse.lessons.length) * 100;
        const progressFill = document.getElementById('courseProgressFill');

        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }

        // Start lesson tour if available
        if (typeof DialogueTour !== 'undefined') {
            setTimeout(() => {
                DialogueTour.startTour('lesson');
            }, 1000);
        }
    },

    /**
     * Start course scenarios
     */
    startCourseScenarios(courseId) {
        const course = this.coursesData.find(c => c.id === courseId);
        if (course && course.scenarios) {
            Scenarios.start(course.scenarios, courseId);
        }
    },

    /**
     * Start course quiz
     */
    startCourseQuiz(courseId) {
        const course = this.coursesData.find(c => c.id === courseId);
        if (course && course.quiz) {
            Quiz.start(course.quiz, courseId);
        }
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
