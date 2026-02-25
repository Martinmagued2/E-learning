/**
 * Storage Module
 * Handles localStorage operations for student progress tracking
 */

const Storage = {
    // Keys
    KEYS: {
        STUDENT_NAME: 'studentName',
        COMPLETED_LESSONS: 'completedLessons',
        COMPLETED_COURSES: 'completedCourses',
        QUIZ_SCORES: 'quizScores',
        ACHIEVEMENTS: 'achievements',
        CONSECUTIVE_FAILURES: 'consecutiveFailures'
    },

    /**
     * Save student name
     */
    saveStudentName(name) {
        try {
            sessionStorage.setItem(this.KEYS.STUDENT_NAME, name);
            return true;
        } catch (error) {
            console.error('Error saving student name:', error);
            return false;
        }
    },

    /**
     * Get student name
     */
    getStudentName() {
        return sessionStorage.getItem(this.KEYS.STUDENT_NAME) || 'الطالب';
    },

    /**
     * Mark lesson as completed
     */
    markLessonCompleted(courseId, lessonId) {
        try {
            const completed = this.getCompletedLessons();
            const key = `${courseId}-${lessonId}`;

            if (!completed.includes(key)) {
                completed.push(key);
                localStorage.setItem(this.KEYS.COMPLETED_LESSONS, JSON.stringify(completed));
            }

            return true;
        } catch (error) {
            console.error('Error marking lesson completed:', error);
            return false;
        }
    },

    /**
     * Get all completed lessons
     */
    getCompletedLessons() {
        try {
            const data = localStorage.getItem(this.KEYS.COMPLETED_LESSONS);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error getting completed lessons:', error);
            return [];
        }
    },

    /**
     * Check if lesson is completed
     */
    isLessonCompleted(courseId, lessonId) {
        const completed = this.getCompletedLessons();
        return completed.includes(`${courseId}-${lessonId}`);
    },

    /**
     * Mark course as completed
     */
    markCourseCompleted(courseId) {
        try {
            const completed = this.getCompletedCourses();

            if (!completed.includes(courseId)) {
                completed.push(courseId);
                localStorage.setItem(this.KEYS.COMPLETED_COURSES, JSON.stringify(completed));
            }

            return true;
        } catch (error) {
            console.error('Error marking course completed:', error);
            return false;
        }
    },

    /**
     * Get all completed courses
     */
    getCompletedCourses() {
        try {
            const data = localStorage.getItem(this.KEYS.COMPLETED_COURSES);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error getting completed courses:', error);
            return [];
        }
    },

    /**
     * Check if course is completed
     */
    isCourseCompleted(courseId) {
        const completed = this.getCompletedCourses();
        return completed.includes(courseId);
    },

    /**
     * Check if all courses are completed
     */
    checkAllCoursesCompleted(totalCoursesCount) {
        const completed = this.getCompletedCourses();
        return completed.length >= totalCoursesCount && totalCoursesCount > 0;
    },

    /**
     * Save quiz score
     */
    saveQuizScore(courseId, score, totalQuestions) {
        try {
            const scores = this.getQuizScores();
            scores[courseId] = {
                score,
                totalQuestions,
                percentage: Math.round((score / totalQuestions) * 100),
                date: new Date().toISOString()
            };

            localStorage.setItem(this.KEYS.QUIZ_SCORES, JSON.stringify(scores));
            return true;
        } catch (error) {
            console.error('Error saving quiz score:', error);
            return false;
        }
    },

    /**
     * Get all quiz scores
     */
    getQuizScores() {
        try {
            const data = localStorage.getItem(this.KEYS.QUIZ_SCORES);
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.error('Error getting quiz scores:', error);
            return {};
        }
    },

    /**
     * Get quiz score for specific course
     */
    getCourseQuizScore(courseId) {
        const scores = this.getQuizScores();
        return scores[courseId] || null;
    },

    /**
     * Get consecutive failures for a course
     */
    getConsecutiveFailures(courseId) {
        try {
            const data = localStorage.getItem(this.KEYS.CONSECUTIVE_FAILURES);
            const failures = data ? JSON.parse(data) : {};
            return failures[courseId] || 0;
        } catch (error) {
            console.error('Error getting consecutive failures:', error);
            return 0;
        }
    },

    /**
     * Increment consecutive failures for a course
     */
    incrementConsecutiveFailures(courseId) {
        try {
            const data = localStorage.getItem(this.KEYS.CONSECUTIVE_FAILURES);
            const failures = data ? JSON.parse(data) : {};
            failures[courseId] = (failures[courseId] || 0) + 1;
            localStorage.setItem(this.KEYS.CONSECUTIVE_FAILURES, JSON.stringify(failures));
            return failures[courseId];
        } catch (error) {
            console.error('Error incrementing consecutive failures:', error);
            return 0;
        }
    },

    /**
     * Reset consecutive failures for a course
     */
    resetConsecutiveFailures(courseId) {
        try {
            const data = localStorage.getItem(this.KEYS.CONSECUTIVE_FAILURES);
            const failures = data ? JSON.parse(data) : {};
            failures[courseId] = 0;
            localStorage.setItem(this.KEYS.CONSECUTIVE_FAILURES, JSON.stringify(failures));
            return true;
        } catch (error) {
            console.error('Error resetting consecutive failures:', error);
            return false;
        }
    },

    /**
     * Calculate overall progress percentage
     */
    calculateProgress(totalLessons) {
        const completedLessons = this.getCompletedLessons().length;
        return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    },

    /**
     * Add achievement
     */
    addAchievement(achievementId) {
        try {
            const achievements = this.getAchievements();

            if (!achievements.includes(achievementId)) {
                achievements.push(achievementId);
                localStorage.setItem(this.KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
            }

            return true;
        } catch (error) {
            console.error('Error adding achievement:', error);
            return false;
        }
    },

    /**
     * Get all achievements
     */
    getAchievements() {
        try {
            const data = localStorage.getItem(this.KEYS.ACHIEVEMENTS);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error getting achievements:', error);
            return [];
        }
    },

    /**
     * Clear all data (for testing/reset)
     */
    clearAll() {
        if (confirm('هل أنت متأكد من حذف جميع البيانات؟')) {
            localStorage.clear();
            sessionStorage.clear();

            // Clear the name input field before reload to prevent browser form restoration
            const nameInput = document.getElementById('studentName');
            if (nameInput) {
                nameInput.value = '';
                nameInput.setAttribute('autocomplete', 'off');
            }

            // Reset welcome screen text to default
            const welcomeTitle = document.querySelector('.welcome-card h2');
            if (welcomeTitle) welcomeTitle.textContent = 'مرحباً بك في تطبيق السلامة! 👋';

            const startBtnSpan = document.querySelector('#startBtn span');
            if (startBtnSpan) startBtnSpan.textContent = 'ابدأ التعلم';

            location.reload();
        }
    },

    /**
     * Save scenario score
     */
    saveScenarioScore(courseId, score, total) {
        try {
            const scores = this.getScenarioScores();
            scores[courseId] = {
                score,
                total,
                percentage: Math.round((score / total) * 100),
                date: new Date().toISOString()
            };
            localStorage.setItem('scenarioScores', JSON.stringify(scores));
            return true;
        } catch (error) {
            console.error('Error saving scenario score:', error);
            return false;
        }
    },

    /**
     * Get all scenario scores
     */
    getScenarioScores() {
        try {
            const data = localStorage.getItem('scenarioScores');
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.error('Error getting scenario scores:', error);
            return {};
        }
    },

    /**
     * Mark game as completed
     */
    markGameCompleted(gameId, score) {
        try {
            const games = this.getCompletedGames();
            // Track total completions
            if (!games[gameId]) games[gameId] = 0;
            games[gameId]++;

            localStorage.setItem('completedGames', JSON.stringify(games));
            return true;
        } catch (error) {
            console.error('Error marking game completed:', error);
            return false;
        }
    },

    /**
     * Get completed games stats
     */
    getCompletedGames() {
        try {
            const data = localStorage.getItem('completedGames');
            return data ? JSON.parse(data) : {};
        } catch (error) {
            return {};
        }
    },

    /**
     * Get comprehensive student progress
     * Used by Achievements system
     */
    getProgress() {
        const completedLessons = this.getCompletedLessons();
        const completedCourses = this.getCompletedCourses();
        const quizScores = this.getQuizScores();
        const completedGames = this.getCompletedGames();

        let perfectQuizzes = 0;
        let quizzesCompleted = 0;
        let fastestQuizTime = Infinity; // Placeholder

        Object.values(quizScores).forEach(score => {
            quizzesCompleted++;
            if (score.percentage >= 100) perfectQuizzes++;
        });

        // Calculate total game completions
        const totalGamesPlayed = Object.values(completedGames).reduce((a, b) => a + b, 0);

        return {
            lessonsCompleted: completedLessons.length,
            completedCourses: completedCourses,
            quizzesCompleted: quizzesCompleted,
            perfectQuizzes: perfectQuizzes,
            fastestQuizTime: fastestQuizTime, // Needs quiz timer implementation
            longestStreak: 0, // Needs streak implementation
            daysSinceLastVisit: 0, // Needs visit tracking
            gamesPlayed: totalGamesPlayed,
            gameStats: completedGames
        };
    }
};
