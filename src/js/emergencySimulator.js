/**
 * Emergency Call Simulator
 * Interactive practice for reporting electrical emergencies correctly
 * Themed for the Electrical Safety module
 */

const EmergencySimulator = {
    isActive: false,
    currentStep: 0,
    startTime: 0,
    timer: null,
    completed: false,

    scenarios: [
        {
            id: 'electrical',
            title: 'صدمة كهربائية',
            description: 'شخص لمس سلكاً كهربائياً مكشوفاً وتعرض لصدمة كهربائية!',
            correctNumber: '123',
            steps: [
                { question: 'ما هو نوع الحالة الطارئة؟', options: ['صدمة كهربائية', 'حريق', 'تسرب غاز'], correct: 0 },
                { question: 'ما أول شيء يجب فعله؟', options: ['لمس الشخص لسحبه', 'فصل مصدر الكهرباء أولاً', 'سكب ماء عليه'], correct: 1 },
                { question: 'هل يمكنك لمس الشخص المصاب مباشرة؟', options: ['نعم، لإنقاذه', 'لا، قد أتعرض للصدمة أيضاً', 'نعم باستخدام يد مبللة'], correct: 1 },
                { question: 'ما الرقم الصحيح للإسعاف في مصر؟', options: ['180', '122', '123'], correct: 2 }
            ]
        }
    ],

    start(scenarioId) {
        const scenario = this.scenarios.find(s => s.id === scenarioId) || this.scenarios[0];
        this.isActive = true;
        this.currentStep = 0;
        this.startTime = Date.now();
        this.completed = false;

        this.renderUI(scenario);

        if (typeof DialogueTour !== 'undefined') {
            DialogueTour.startTour('emergencySimulator', true);
        }
    },

    renderUI(scenario) {
        const overlay = document.createElement('div');
        overlay.id = 'emergencyOverlay';
        overlay.className = 'game-overlay';
        overlay.innerHTML = `
            <div class="emergency-container">
                <div class="emergency-header">
                    <button class="btn btn-secondary btn-back" onclick="EmergencySimulator.goBack()" style="font-size: 0.9rem;">
                        <span class="btn-icon">→</span>
                        <span>رجوع</span>
                    </button>
                    <h2>⚡ محاكي طوارئ كهربائية</h2>
                    <div class="emergency-timer" id="emergencyTimer">00:00</div>
                </div>
                <div class="emergency-body" id="emergencyBody">
                    <p class="scenario-desc">${scenario.description}</p>
                    <div class="phone-dialer">
                        <input type="text" id="dialDisplay" readonly placeholder="ادخل رقم الإسعاف...">
                        <div class="dial-pad">
                            ${[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map(n => `<button onclick="EmergencySimulator.dial('${n}')">${n}</button>`).join('')}
                        </div>
                        <button class="call-btn" onclick="EmergencySimulator.checkNumber('${scenario.correctNumber}')">📞 اتصال</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        this.startTimer();
    },

    dial(num) {
        const display = document.getElementById('dialDisplay');
        if (display) display.value += num;
        if (typeof SoundEffects !== 'undefined') SoundEffects.click();
    },

    checkNumber(correct) {
        const display = document.getElementById('dialDisplay');
        if (display.value === correct) {
            if (typeof SoundEffects !== 'undefined') SoundEffects.success();
            this.showReportingSteps();
        } else {
            if (typeof SoundEffects !== 'undefined') SoundEffects.wrong();
            alert('الرقم خاطئ! رقم الإسعاف في مصر هو 123. حاول مرة أخرى.');
            display.value = '';
        }
    },

    showReportingSteps() {
        const body = document.getElementById('emergencyBody');
        const scenario = this.scenarios[0];
        this.currentStep = 0;
        this.renderStep(body, scenario);
    },

    renderStep(container, scenario) {
        const step = scenario.steps[this.currentStep];
        container.innerHTML = `
            <div class="report-step">
                <h3>${step.question}</h3>
                <div class="option-list">
                    ${step.options.map((opt, i) => `
                        <button class="option-btn" onclick="EmergencySimulator.submitStep(${i})">${opt}</button>
                    `).join('')}
                </div>
            </div>
        `;
    },

    submitStep(index) {
        const scenario = this.scenarios[0];
        if (index === scenario.steps[this.currentStep].correct) {
            if (typeof SoundEffects !== 'undefined') SoundEffects.correct();
            this.currentStep++;
            if (this.currentStep < scenario.steps.length) {
                this.renderStep(document.getElementById('emergencyBody'), scenario);
            } else {
                this.complete();
            }
        } else {
            if (typeof SoundEffects !== 'undefined') SoundEffects.wrong();
            alert('إجابة غير صحيحة! فكر في الخطوة الأهم عند التعامل مع الكهرباء.');
        }
    },

    complete() {
        this.completed = true;
        clearInterval(this.timer);
        const endTime = Date.now();
        const duration = Math.floor((endTime - this.startTime) / 1000);

        const body = document.getElementById('emergencyBody');
        body.innerHTML = `
            <div class="completion-screen">
                <div class="success-icon">✅</div>
                <h2>تم التبليغ بنجاح!</h2>
                <p>الوقت المستغرق: ${duration} ثانية</p>
                <p style="margin-top: 10px; color: var(--text-muted);">تعلمت كيف تتعامل مع حالات الطوارئ الكهربائية بشكل صحيح! تذكر دائماً: افصل الكهرباء أولاً ولا تلمس الشخص المصاب مباشرة.</p>
                <button class="btn btn-primary" onclick="EmergencySimulator.close()">إغلاق ✅</button>
            </div>
        `;

        if (typeof Confetti !== 'undefined') Confetti.celebrate();
    },

    startTimer() {
        this.timer = setInterval(() => {
            const now = Date.now();
            const diff = Math.floor((now - this.startTime) / 1000);
            const mins = Math.floor(diff / 60).toString().padStart(2, '0');
            const secs = (diff % 60).toString().padStart(2, '0');
            const timerEl = document.getElementById('emergencyTimer');
            if (timerEl) timerEl.textContent = `${mins}:${secs}`;
        }, 1000);
    },

    goBack() {
        if (confirm('هل تريد الخروج من المحاكي؟')) {
            this.close();
        }
    },

    close() {
        clearInterval(this.timer);
        const overlay = document.getElementById('emergencyOverlay');
        if (overlay) overlay.remove();
        this.isActive = false;
    }
};
