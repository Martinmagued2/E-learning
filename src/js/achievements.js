/**
 * Achievement & Badge System
 * Tracks and awards badges for student accomplishments
 */

const Achievements = {
    // All available achievements
    definitions: {
        // Progress Badges
        'first-step': {
            id: 'first-step',
            name: 'الخطوة الأولى',
            nameEn: 'First Step',
            description: 'أكملت أول درس',
            icon: '👣',
            tier: 'bronze',
            points: 10,
            condition: (stats) => stats.lessonsCompleted >= 1
        },
        'curious-learner': {
            id: 'curious-learner',
            name: 'المتعلم الفضولي',
            nameEn: 'Curious Learner',
            description: 'أكملت 5 دروس',
            icon: '🔍',
            tier: 'bronze',
            points: 25,
            condition: (stats) => stats.lessonsCompleted >= 5
        },
        'knowledge-seeker': {
            id: 'knowledge-seeker',
            name: 'طالب المعرفة',
            nameEn: 'Knowledge Seeker',
            description: 'أكملت 10 دروس',
            icon: '📚',
            tier: 'silver',
            points: 50,
            condition: (stats) => stats.lessonsCompleted >= 10
        },
        'master-student': {
            id: 'master-student',
            name: 'الطالب المتميز',
            nameEn: 'Master Student',
            description: 'أكملت جميع الدروس',
            icon: '🎓',
            tier: 'gold',
            points: 100,
            condition: (stats) => stats.lessonsCompleted >= stats.totalLessons
        },

        // Quiz Badges
        'quiz-taker': {
            id: 'quiz-taker',
            name: 'محب الاختبارات',
            nameEn: 'Quiz Taker',
            description: 'أكملت أول اختبار',
            icon: '✏️',
            tier: 'bronze',
            points: 15,
            condition: (stats) => stats.quizzesCompleted >= 1
        },
        'perfect-score': {
            id: 'perfect-score',
            name: 'الدرجة الكاملة',
            nameEn: 'Perfect Score',
            description: 'حصلت على 100% في اختبار',
            icon: '💯',
            tier: 'gold',
            points: 75,
            condition: (stats) => stats.perfectQuizzes >= 1
        },
        'quiz-master': {
            id: 'quiz-master',
            name: 'سيد الاختبارات',
            nameEn: 'Quiz Master',
            description: 'أكملت 5 اختبارات بنجاح',
            icon: '🏆',
            tier: 'gold',
            points: 100,
            condition: (stats) => stats.quizzesCompleted >= 5
        },

        // Course Completion Badges
        'fire-safety-hero': {
            id: 'fire-safety-hero',
            name: 'بطل السلامة من الحرائق',
            nameEn: 'Fire Safety Hero',
            description: 'أكملت دورة السلامة من الحرائق',
            icon: '🧯',
            tier: 'silver',
            points: 50,
            course: 'fire-safety',
            condition: (stats) => stats.coursesCompleted.includes('fire-safety')
        },
        'electric-guardian': {
            id: 'electric-guardian',
            name: 'حارس الكهرباء',
            nameEn: 'Electric Guardian',
            description: 'أكملت دورة السلامة الكهربائية',
            icon: '⚡',
            tier: 'silver',
            points: 50,
            course: 'electrical-safety',
            condition: (stats) => stats.coursesCompleted.includes('electrical-safety')
        },
        'safety-champion': {
            id: 'safety-champion',
            name: 'بطل السلامة',
            nameEn: 'Safety Champion',
            description: 'أكملت دورة السلامة العامة',
            icon: '🛡️',
            tier: 'silver',
            points: 50,
            course: 'general-safety',
            condition: (stats) => stats.coursesCompleted.includes('general-safety')
        },
        'safety-expert': {
            id: 'safety-expert',
            name: 'خبير السلامة',
            nameEn: 'Safety Expert',
            description: 'أكملت جميع الدورات',
            icon: '👨‍🎓',
            tier: 'gold',
            points: 200,
            condition: (stats) => stats.coursesCompleted.length >= 3
        },

        // Speed Badges
        'quick-learner': {
            id: 'quick-learner',
            name: 'سريع التعلم',
            nameEn: 'Quick Learner',
            description: 'أكملت اختبار في أقل من دقيقة',
            icon: '⚡',
            tier: 'silver',
            points: 40,
            condition: (stats) => stats.fastestQuizTime < 60
        },
        'speed-demon': {
            id: 'speed-demon',
            name: 'سريع كالبرق',
            nameEn: 'Speed Demon',
            description: 'أجبت على 10 أسئلة بشكل صحيح متتالي',
            icon: '🚀',
            tier: 'gold',
            points: 60,
            condition: (stats) => stats.longestStreak >= 10
        },

        // Special Badges
        'early-bird': {
            id: 'early-bird',
            name: 'الطائر المبكر',
            nameEn: 'Early Bird',
            description: 'بدأت التعلم قبل الساعة 8 صباحاً',
            icon: '🌅',
            tier: 'bronze',
            points: 20,
            condition: (stats) => stats.earlyBirdLogin
        },
        'night-owl': {
            id: 'night-owl',
            name: 'بومة الليل',
            nameEn: 'Night Owl',
            description: 'تعلمت بعد الساعة 10 مساءً',
            icon: '🦉',
            tier: 'bronze',
            points: 20,
            condition: (stats) => stats.nightOwlLogin
        },
        'comeback-kid': {
            id: 'comeback-kid',
            name: 'العائد بقوة',
            nameEn: 'Comeback Kid',
            description: 'عدت للتعلم بعد غياب',
            icon: '💪',
            tier: 'bronze',
            points: 15,
            condition: (stats) => stats.comebackDays >= 3
        },

        // Game Badges
        'game-player': {
            id: 'game-player',
            name: 'لاعب مبتدئ',
            nameEn: 'Game Player',
            description: 'لعبت أول لعبة تعليمية',
            icon: '🎮',
            tier: 'bronze',
            points: 10,
            condition: (stats) => stats.gamesPlayed >= 1
        },
        'game-champion': {
            id: 'game-champion',
            name: 'بطل الألعاب',
            nameEn: 'Game Champion',
            description: 'لعبت 5 ألعاب تعليمية',
            icon: '🎳',
            tier: 'gold',
            points: 50,
            condition: (stats) => stats.gamesPlayed >= 5
        },
        'hazard-spotter': {
            id: 'hazard-spotter',
            name: 'عين الصقر',
            nameEn: 'Eagle Eye',
            description: 'فزت في لعبة اكتشاف المخاطر',
            icon: '👁️',
            tier: 'silver',
            points: 30,
            condition: (stats) => stats.gameStats && stats.gameStats['spot-hazard'] >= 1
        },
        'memory-master': {
            id: 'memory-master',
            name: 'ذاكرة حديدية',
            nameEn: 'Memory Master',
            description: 'فزت في لعبة المطابقة',
            icon: '🧠',
            tier: 'silver',
            points: 30,
            condition: (stats) => stats.gameStats && stats.gameStats['matching'] >= 1
        },
        'sorting-pro': {
            id: 'sorting-pro',
            name: 'خبير التصنيف',
            nameEn: 'Sorting Pro',
            description: 'فزت في لعبة الفرز',
            icon: '📂',
            tier: 'silver',
            points: 30,
            condition: (stats) => stats.gameStats && stats.gameStats['sorting'] >= 1
        }
    },

    // Tier styling
    tiers: {
        bronze: { color: '#cd7f32', glow: 'rgba(205, 127, 50, 0.5)', emoji: '🥉' },
        silver: { color: '#c0c0c0', glow: 'rgba(192, 192, 192, 0.5)', emoji: '🥈' },
        gold: { color: '#ffd700', glow: 'rgba(255, 215, 0, 0.5)', emoji: '🥇' }
    },

    /**
     * Initialize achievements system
     */
    init() {
        this.loadEarnedBadges();
        this.updateAchievementsDisplay();
    },

    /**
     * Get student statistics for badge evaluation
     */
    getStats() {
        const progress = Storage.getProgress();
        const currentHour = new Date().getHours();

        return {
            lessonsCompleted: progress.lessonsCompleted || 0,
            totalLessons: 15, // Total lessons across all courses
            quizzesCompleted: progress.quizzesCompleted || 0,
            perfectQuizzes: progress.perfectQuizzes || 0,
            coursesCompleted: progress.completedCourses || [],
            fastestQuizTime: progress.fastestQuizTime || Infinity,
            longestStreak: progress.longestStreak || 0,
            earlyBirdLogin: currentHour < 8,
            nightOwlLogin: currentHour >= 22,
            comebackDays: progress.daysSinceLastVisit || 0,
            gamesPlayed: progress.gamesPlayed || 0,
            gameStats: progress.gameStats || {}
        };
    },

    /**
     * Load earned badges from storage
     */
    loadEarnedBadges() {
        try {
            const saved = localStorage.getItem('earnedBadges');
            this.earnedBadges = saved ? JSON.parse(saved) : [];
        } catch (e) {
            this.earnedBadges = [];
        }
    },

    /**
     * Save earned badges to storage
     */
    saveEarnedBadges() {
        try {
            localStorage.setItem('earnedBadges', JSON.stringify(this.earnedBadges));
        } catch (e) {
            console.warn('Could not save badges:', e);
        }
    },

    /**
     * Check for new achievements
     * @returns {Array} Newly earned badges
     */
    checkAchievements() {
        const stats = this.getStats();
        const newBadges = [];

        for (const [id, badge] of Object.entries(this.definitions)) {
            // Skip if already earned
            if (this.earnedBadges.includes(id)) continue;

            // Check condition
            if (badge.condition(stats)) {
                this.earnedBadges.push(id);
                newBadges.push(badge);
            }
        }

        if (newBadges.length > 0) {
            this.saveEarnedBadges();
            this.showNewBadges(newBadges);
        }

        return newBadges;
    },

    /**
     * Show notification for new badges
     */
    showNewBadges(badges) {
        badges.forEach((badge, index) => {
            // Stagger badge notifications with 5 second delay between each
            setTimeout(() => {
                this.showBadgeNotification(badge);

                // Play sound and confetti
                if (typeof SoundEffects !== 'undefined') {
                    SoundEffects.achievement();
                }
                if (typeof Confetti !== 'undefined') {
                    Confetti.celebrate('badge');
                }
            }, index * 5000); // 5 seconds between badges
        });
    },

    /**
     * Create and show badge notification popup
     */
    showBadgeNotification(badge) {
        const tier = this.tiers[badge.tier];

        const notification = document.createElement('div');
        notification.className = 'badge-notification';
        notification.innerHTML = `
            <div class="badge-notification-content" style="--tier-color: ${tier.color}; --tier-glow: ${tier.glow}">
                <div class="badge-icon-large">${badge.icon}</div>
                <div class="badge-info">
                    <span class="badge-tier-emoji">${tier.emoji}</span>
                    <h3 class="badge-name">${badge.name}</h3>
                    <p class="badge-description">${badge.description}</p>
                    <span class="badge-points">+${badge.points} نقطة</span>
                </div>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Remove after animation
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    },

    /**
     * Update achievements display in the UI
     */
    updateAchievementsDisplay() {
        const grid = document.getElementById('achievementsGrid');
        if (!grid) return;

        grid.innerHTML = '';

        // Show earned badges
        this.earnedBadges.forEach(id => {
            const badge = this.definitions[id];
            if (badge) {
                const tier = this.tiers[badge.tier];
                const card = document.createElement('div');
                card.className = 'achievement-card earned';
                card.style.cssText = `--tier-color: ${tier.color}; --tier-glow: ${tier.glow}`;
                card.innerHTML = `
                    <span class="achievement-icon">${badge.icon}</span>
                    <div class="achievement-details">
                        <p class="achievement-name">${badge.name}</p>
                        <span class="achievement-tier">${tier.emoji}</span>
                    </div>
                `;
                grid.appendChild(card);
            }
        });

        // Show locked badges (dimmed)
        for (const [id, badge] of Object.entries(this.definitions)) {
            if (!this.earnedBadges.includes(id)) {
                const card = document.createElement('div');
                card.className = 'achievement-card locked';
                card.innerHTML = `
                    <span class="achievement-icon">🔒</span>
                    <div class="achievement-details">
                        <p class="achievement-name">???</p>
                    </div>
                `;
                card.title = badge.description;
                grid.appendChild(card);
            }
        }
    },

    /**
     * Get total points earned
     */
    getTotalPoints() {
        return this.earnedBadges.reduce((total, id) => {
            const badge = this.definitions[id];
            return total + (badge ? badge.points : 0);
        }, 0);
    },

    /**
     * Get badge count by tier
     */
    getBadgeCount() {
        const counts = { bronze: 0, silver: 0, gold: 0, total: 0 };

        this.earnedBadges.forEach(id => {
            const badge = this.definitions[id];
            if (badge) {
                counts[badge.tier]++;
                counts.total++;
            }
        });

        return counts;
    }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Achievements.init();
});
