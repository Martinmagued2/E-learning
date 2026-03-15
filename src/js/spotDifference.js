/**
 * Spot the Difference
 * Visual hazard identification challenge
 */

const SpotDifference = {
    isActive: false,
    foundCount: 0,
    totalDifferences: 4,
    completed: false,
    wrongClicks: 0,
    maxWrongClicks: 3,
    startTime: null,
    timeBonus: 0,
    hintsUsed: 0,
    
    hazards: [
        {
            title: "🚪 مخرج الطوارئ مسدود",
            description: "تم وضع صناديق ومعدات أمام مخرج الطوارئ (Fire Exit)، مما يمنع الوصول السريع في حالة الحريق.",
            risk: "خطر عالي ⚠️",
            solution: "يجب إبقاء مخارج الطوارئ خالية دائماً ضمن مسافة 1 متر على الأقل. هذا قد يكلف أرواحاً في حالات الطوارئ."
        },
        {
            title: "⚡💧 مخاطر كهربائية وسوائل",
            description: "منطقة عمل فوضوية مع كوب مسكوب قريباً من الأجهزة الكهربائية - خطر صعق كهربائي وحريق.",
            risk: "خطر عالي ⚠️",
            solution: "يجب إبعاد السوائل عن الأجهزة الكهربائية، وتناول المشروبات في الأماكن المخصصة أو باستخدام أكواب محكمة الغلق."
        },
        {
            title: "🗄️ درج مفتوح",
            description: "ترك درج المكتب مفتوحاً في منطقة الحركة - خطر الاصطدام والتعثر.",
            risk: "خطر متوسط ⚠️",
            solution: "يجب إغلاق الأدراج والخزائن فور الانتهاء من استخدامها لمنع حوادث التعثر والاصطدام."
        },
        {
            title: "📄 أوراق متناثرة ومكتب غير منظم",
            description: "تراكم الأوراق بجوار أجهزة الحواسيب والماوس - يعيق العمل المريح وقد يزيد من سرعة انتشار الحريق.",
            risk: "خطر منخفض ⚠️",
            solution: "يجب ترتيب الأوراق في ملفات مخصصة والحفاظ على مكتب نظيف ومنظم لتجنب الفوضى."
        }
    ],

    start() {
        this.isActive = true;
        this.foundCount = 0;
        this.wrongClicks = 0;
        this.hintsUsed = 0;
        this.completed = false;
        this.startTime = null;
        this.renderUI();

        if (typeof DialogueTour !== 'undefined') {
            const isFireCourse = typeof App !== 'undefined' && App.currentCourse && App.currentCourse.id === 'fire-safety';
            if (isFireCourse) {
                setTimeout(() => DialogueTour.startTour('danger', true), 300);
            } else {
                DialogueTour.startTour('spotDifference');
            }
        }
    },

    renderUI() {
        const overlay = document.createElement('div');
        overlay.id = 'spotOverlay';
        overlay.className = 'game-overlay';
        overlay.innerHTML = `
            <div class="spot-container">
                <div class="spot-header">
                    <button class="btn btn-secondary btn-back" onclick="SpotDifference.goBack()">
                        <span class="btn-icon">→</span>
                        <span>رجوع</span>
                    </button>
                    <h2>🔍 أوجد الاختلافات: بيئة عمل آمنة vs خطرة</h2>
                    <div class="spot-stats">
                        <div class="stat-item">
                            <span>⏱️</span>
                            <span id="spotTimer">00:00</span>
                        </div>
                        <div class="stat-item">
                            <span>✅</span>
                            <span id="spotCount">0</span>/${this.totalDifferences}
                        </div>
                        <div class="stat-item">
                            <span>❌</span>
                            <span id="wrongCount">0</span>/${this.maxWrongClicks}
                        </div>
                        <button class="btn-hint" onclick="SpotDifference.useHint()" id="hintBtn">
                            💡 تلميح
                        </button>
                    </div>
                </div>
                <div class="spot-body" id="spotBody">
                    <div class="spot-images">
                        <div class="image-wrapper safe">
                            <h3>آمن ✅</h3>
                            <img src="assets/images/spot_safe.png" onclick="SpotDifference.wrongClick()">
                            <div class="safety-badge">بيئة آمنة ومنظمة</div>
                        </div>
                        <div class="image-wrapper dangerous" id="diffImage">
                            <h3>خطر ❌</h3>
                            <img src="assets/images/spot_hazard.png">
                            <div class="diff-zone" style="top: 46%; left: 26%; width: 14%; height: 18%;" title="صندوق يعيق مسار الخروج" onclick="SpotDifference.found(0, this)"></div>
                            <div class="diff-zone" style="top: 37%; left: 56%; width: 10%; height: 12%;" title="كوب مسكوب على المكتب" onclick="SpotDifference.found(1, this)"></div>
                            <div class="diff-zone" style="top: 55%; left: 61%; width: 14%; height: 18%;" title="درج مفتوح" onclick="SpotDifference.found(2, this)"></div>
                            <div class="diff-zone" style="top: 48%; left: 67%; width: 10%; height: 10%;" title="ورقة بجانب الماوس" onclick="SpotDifference.found(3, this)"></div>
                        </div>
                    </div>
                    <p class="instruction">اضغط على المخاطر في الصورة اليمنى (خطر ❌) فقط. النقر الخاطئ سيخصم منك نقاط!</p>
                    <div id="hazardsList" class="hazards-list"></div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        
        // Delay timer start to allow intro audio to play
        setTimeout(() => {
            if (this.isActive && !this.completed) {
                this.startTime = Date.now();
                this.startTimer();
            }
        }, 12000); // 12 second delay for intro audio
    },

    startTimer() {
        this.timerInterval = setInterval(() => {
            if (!this.isActive || this.completed) {
                clearInterval(this.timerInterval);
                return;
            }
            if (!this.startTime) return; // Don't update timer until started
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const seconds = (elapsed % 60).toString().padStart(2, '0');
            const timerEl = document.getElementById('spotTimer');
            if (timerEl) timerEl.textContent = `${minutes}:${seconds}`;
        }, 1000);
    },

    wrongClick() {
        if (this.completed) return;
        
        this.wrongClicks++;
        document.getElementById('wrongCount').textContent = this.wrongClicks;
        
        if (typeof SoundEffects !== 'undefined') SoundEffects.wrong();
        
        // Show feedback
        this.showFeedback('❌ خطأ! اضغط على المخاطر في الصورة اليمنى فقط', 'error');
        
        if (this.wrongClicks >= this.maxWrongClicks) {
            this.showFeedback('⚠️ لقد استنفذت المحاولات المسموحة. حاول مرة أخرى!', 'error');
            setTimeout(() => this.close(), 2000);
        }
    },

    useHint() {
        if (this.completed) return;
        
        // Find first unfound hazard
        const zones = document.querySelectorAll('.diff-zone:not(.found)');
        if (zones.length === 0) return;
        
        const firstUnfound = zones[0];
        const index = parseInt(firstUnfound.getAttribute('data-index'));
        
        this.hintsUsed++;
        firstUnfound.classList.add('hinted');
        
        this.showFeedback(`💡 تلميح: ${this.hazards[index].title}`, 'hint');
        
        // Disable hint button for a few seconds
        const hintBtn = document.getElementById('hintBtn');
        hintBtn.disabled = true;
        hintBtn.textContent = '⏳ انتظر...';
        setTimeout(() => {
            hintBtn.disabled = false;
            hintBtn.textContent = '💡 تلميح';
        }, 5000);
        
        if (typeof SoundEffects !== 'undefined') SoundEffects.notification();
    },

    showFeedback(message, type = 'info') {
        const existing = document.querySelector('.spot-feedback');
        if (existing) existing.remove();
        
        const feedback = document.createElement('div');
        feedback.className = `spot-feedback ${type}`;
        feedback.textContent = message;
        document.querySelector('.spot-container').appendChild(feedback);
        
        setTimeout(() => feedback.classList.add('show'), 10);
        setTimeout(() => {
            feedback.classList.remove('show');
            setTimeout(() => feedback.remove(), 300);
        }, 3000);
    },

    found(index, el) {
        if (el.classList.contains('found')) return;

        el.classList.add('found');
        el.classList.remove('hinted');
        this.foundCount++;
        document.getElementById('spotCount').textContent = this.foundCount;
        if (typeof SoundEffects !== 'undefined') SoundEffects.correct();

        // Show hazard information
        this.showHazardInfo(index);

        if (this.foundCount === this.totalDifferences) {
            // Give user time to read the last hazard card (4 seconds)
            setTimeout(() => this.complete(), 4000);
        }
    },

    showHazardInfo(index) {
        const hazard = this.hazards[index];
        const list = document.getElementById('hazardsList');
        
        const card = document.createElement('div');
        card.className = 'hazard-card';
        card.innerHTML = `
            <div class="hazard-header">
                <h4>${hazard.title}</h4>
                <span class="risk-badge">${hazard.risk}</span>
            </div>
            <p class="hazard-desc">${hazard.description}</p>
            <div class="hazard-solution">
                <strong>✅ الحل:</strong> ${hazard.solution}
            </div>
        `;
        list.appendChild(card);
        
        setTimeout(() => card.classList.add('show'), 10);
    },

    complete() {
        this.completed = true;
        clearInterval(this.timerInterval);
        
        // Calculate elapsed time (handle case where timer hasn't started)
        const elapsedTime = this.startTime ? Math.floor((Date.now() - this.startTime) / 1000) : 0;
        
        // Calculate score
        let score = 100;
        score -= (this.wrongClicks * 10); // -10 points per wrong click
        score -= (this.hintsUsed * 5);     // -5 points per hint
        
        // Time bonus (if completed under 2 minutes)
        if (elapsedTime < 120) {
            this.timeBonus = Math.floor((120 - elapsedTime) / 10) * 5;
            score += this.timeBonus;
        }
        
        score = Math.max(0, Math.min(100, score)); // Clamp between 0-100
        
        const body = document.getElementById('spotBody');
        body.innerHTML = `
            <div class="completion-screen">
                <div class="success-icon">👀</div>
                <h2>عين خبيرة!</h2>
                <p>لقد اكتشفت جميع المخاطر التي تميز البيئة غير الآمنة.</p>
                
                <div class="score-breakdown">
                    <div class="score-main">
                        <div class="score-circle">
                            <span class="score-value">${score}</span>
                            <span class="score-label">نقطة</span>
                        </div>
                    </div>
                    <div class="score-details">
                        <div class="score-item">
                            <span>⏱️ الوقت:</span>
                            <span>${Math.floor(elapsedTime / 60)}:${(elapsedTime % 60).toString().padStart(2, '0')}</span>
                        </div>
                        ${this.timeBonus > 0 ? `
                        <div class="score-item bonus">
                            <span>⚡ مكافأة السرعة:</span>
                            <span>+${this.timeBonus}</span>
                        </div>` : ''}
                        ${this.wrongClicks > 0 ? `
                        <div class="score-item penalty">
                            <span>❌ أخطاء (${this.wrongClicks}):</span>
                            <span>-${this.wrongClicks * 10}</span>
                        </div>` : ''}
                        ${this.hintsUsed > 0 ? `
                        <div class="score-item penalty">
                            <span>💡 تلميحات (${this.hintsUsed}):</span>
                            <span>-${this.hintsUsed * 5}</span>
                        </div>` : ''}
                    </div>
                    
                    <div class="performance-rating">
                        ${score >= 90 ? '🏆 أداء ممتاز!' : 
                          score >= 75 ? '⭐ أداء جيد جداً!' :
                          score >= 60 ? '👍 أداء جيد!' : '💪 يمكنك التحسين!'}
                    </div>
                </div>
                
                <button class="btn btn-primary" onclick="SpotDifference.close()">العودة للدرس ✅</button>
            </div>
        `;
        if (typeof SoundEffects !== 'undefined') SoundEffects.success();
        if (typeof Confetti !== 'undefined') Confetti.celebrate();
        
        // Save achievement
        if (typeof Achievements !== 'undefined' && score >= 80) {
            Achievements.unlock('eagle_eye');
        }
    },

    goBack() {
        if (confirm('هل تريد الخروج؟ سيتم فقدان تقدمك.')) {
            this.close();
        }
    },

    close() {
        const overlay = document.getElementById('spotOverlay');
        if (overlay) overlay.remove();
        this.isActive = false;
        if (this.timerInterval) clearInterval(this.timerInterval);
    }
};
