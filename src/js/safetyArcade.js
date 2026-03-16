/**
 * Traffic Signs Challenge
 * Interactive game for learning road safety signs and rules
 * Replaces the old Safety Arcade game
 */

const SafetyArcade = {
    isActive: false,
    currentQuestion: 0,
    score: 0,
    totalQuestions: 0,
    questions: [],
    completed: false,

    allQuestions: [
        {
            sign: '🔴',
            signLabel: 'إشارة حمراء',
            question: 'ماذا تعني الإشارة الحمراء للمشاة؟',
            options: ['اعبر بسرعة', 'قف ولا تعبر', 'اركض', 'لا شيء'],
            correct: 1,
            explanation: 'الإشارة الحمراء تعني التوقف التام وعدم العبور حتى تتحول للأخضر.'
        },
        {
            sign: '🟢',
            signLabel: 'إشارة خضراء',
            question: 'ماذا تعني الإشارة الخضراء للمشاة؟',
            options: ['توقف', 'اعبر بحذر بعد التأكد', 'اركض بسرعة', 'ارجع للخلف'],
            correct: 1,
            explanation: 'الإشارة الخضراء تعني يمكنك العبور بحذر بعد التأكد من خلو الطريق.'
        },
        {
            sign: '🟡',
            signLabel: 'إشارة صفراء',
            question: 'ماذا تعني الإشارة الصفراء للسيارات؟',
            options: ['انطلق بسرعة', 'استعد وهدئ السرعة', 'توقف فوراً', 'أعطِ أولوية'],
            correct: 1,
            explanation: 'الإشارة الصفراء تعني الاستعداد وتهدئة السرعة لأن الإشارة ستتحول للأحمر.'
        },
        {
            sign: '🚸',
            signLabel: 'لافتة عبور أطفال',
            question: 'ماذا تعني هذه اللافتة؟',
            options: ['ملعب أطفال', 'منطقة عبور أطفال - انتبه!', 'حديقة عامة', 'مستشفى أطفال'],
            correct: 1,
            explanation: 'هذه اللافتة تحذر السائقين بوجود منطقة عبور أطفال ويجب الانتباه والتهدئة.'
        },
        {
            sign: '⛔',
            signLabel: 'ممنوع الدخول',
            question: 'ماذا تعني علامة ممنوع الدخول؟',
            options: ['ادخل بحذر', 'ممنوع الدخول من هذا الاتجاه', 'قف ثم ادخل', 'طريق سريع'],
            correct: 1,
            explanation: 'علامة ممنوع الدخول تعني أن هذا الطريق مغلق من هذا الاتجاه ولا يمكنك الدخول.'
        },
        {
            sign: '🚶',
            signLabel: 'ممر المشاة',
            question: 'أين يجب أن تعبر الشارع؟',
            options: ['من أي مكان', 'من ممر المشاة (الزيبرا)', 'من بين السيارات', 'من الجسر فقط'],
            correct: 1,
            explanation: 'ممر المشاة (الزيبرا) هو المكان الآمن والصحيح لعبور الشارع.'
        },
        {
            sign: '🚗',
            signLabel: 'ركوب السيارة',
            question: 'أين يجب أن يجلس الأطفال في السيارة؟',
            options: ['المقعد الأمامي', 'المقعد الخلفي مع ربط الحزام', 'في الصندوق', 'حجر السائق'],
            correct: 1,
            explanation: 'المقعد الخلفي مع ربط حزام الأمان هو المكان الأكثر أماناً للأطفال.'
        },
        {
            sign: '👀',
            signLabel: 'النظر قبل العبور',
            question: 'ماذا تفعل قبل عبور الشارع؟',
            options: ['أعبر مباشرة', 'أنظر يساراً ويميناً ثم يساراً', 'أغمض عيني وأجري', 'أنتظر سيارة تقف'],
            correct: 1,
            explanation: 'النظر يساراً ويميناً ثم يساراً مرة أخرى يضمن خلو الطريق قبل العبور.'
        },
        {
            sign: '⚽',
            signLabel: 'اللعب بالكرة',
            question: 'أين المكان الآمن للعب بالكرة؟',
            options: ['في الشارع', 'خلف السيارات', 'في الحديقة أو الملعب', 'على الرصيف'],
            correct: 2,
            explanation: 'الحديقة أو الملعب هي الأماكن الآمنة للعب. الشارع خطير جداً!'
        },
        {
            sign: '🌙',
            signLabel: 'المشي ليلاً',
            question: 'لماذا يجب ارتداء ملابس فاتحة اللون ليلاً؟',
            options: ['لأنها أجمل', 'كي يراك السائقون', 'للتدفئة', 'لا يهم اللون'],
            correct: 1,
            explanation: 'الملابس الفاتحة تجعل السائقين يرونك بوضوح في الظلام مما يحميك.'
        }
    ],

    start() {
        this.isActive = true;
        this.currentQuestion = 0;
        this.score = 0;
        this.completed = false;
        // Shuffle and pick 6 questions
        this.questions = this.shuffleArray([...this.allQuestions]).slice(0, 6);
        this.totalQuestions = this.questions.length;
        this.renderUI();

        if (typeof DialogueTour !== 'undefined') {
            DialogueTour.startTour('safetyArcade', true);
        }
    },

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    },

    renderUI() {
        const overlay = document.createElement('div');
        overlay.id = 'arcadeOverlay';
        overlay.className = 'game-overlay';
        overlay.innerHTML = `
            <div class="arcade-container" style="max-width: 600px; margin: auto; padding: 20px;">
                <div class="arcade-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <button class="btn btn-secondary btn-back" onclick="SafetyArcade.goBack()" style="font-size: 0.9rem;">
                        <span class="btn-icon">→</span>
                        <span>رجوع</span>
                    </button>
                    <h2 style="margin: 0;">🚦 تحدي إشارات المرور</h2>
                    <div class="arcade-score" style="font-size: 1rem;">
                        <span id="arcadeProgress">${this.currentQuestion + 1}</span>/${this.totalQuestions}
                    </div>
                </div>
                <div class="arcade-body" id="arcadeBody">
                    <!-- Question will be rendered here -->
                </div>
                <button class="close-game" onclick="SafetyArcade.goBack()">✕</button>
            </div>
        `;
        document.body.appendChild(overlay);
        this.renderQuestion();
    },

    renderQuestion() {
        const q = this.questions[this.currentQuestion];
        const body = document.getElementById('arcadeBody');
        if (!body) return;

        body.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="font-size: 4rem; margin-bottom: 10px;">${q.sign}</div>
                <p style="font-size: 0.9rem; color: var(--text-muted);">${q.signLabel}</p>
            </div>
            <h3 style="text-align: center; margin-bottom: 20px; font-size: 1.1rem;">${q.question}</h3>
            <div class="option-list" style="display: flex; flex-direction: column; gap: 10px;">
                ${q.options.map((opt, i) => `
                    <button class="option-btn" onclick="SafetyArcade.answer(${i})" 
                            style="padding: 12px 16px; border-radius: 10px; border: 2px solid rgba(255,255,255,0.1); background: var(--dark-card, #2a2a3e); color: var(--text-primary, #fff); cursor: pointer; font-size: 1rem; text-align: right; transition: all 0.3s;">
                        ${opt}
                    </button>
                `).join('')}
            </div>
        `;

        // Update progress
        const prog = document.getElementById('arcadeProgress');
        if (prog) prog.textContent = this.currentQuestion + 1;
    },

    answer(index) {
        const q = this.questions[this.currentQuestion];
        const buttons = document.querySelectorAll('#arcadeBody .option-btn');

        // Disable all buttons
        buttons.forEach(btn => btn.disabled = true);

        if (index === q.correct) {
            this.score++;
            buttons[index].style.background = '#2ecc71';
            buttons[index].style.borderColor = '#27ae60';
            if (typeof SoundEffects !== 'undefined') SoundEffects.correct();
        } else {
            buttons[index].style.background = '#e74c3c';
            buttons[index].style.borderColor = '#c0392b';
            buttons[q.correct].style.background = '#2ecc71';
            buttons[q.correct].style.borderColor = '#27ae60';
            if (typeof SoundEffects !== 'undefined') SoundEffects.wrong();
        }

        // Show explanation
        const body = document.getElementById('arcadeBody');
        const explDiv = document.createElement('div');
        explDiv.style.cssText = 'margin-top: 15px; padding: 12px; border-radius: 10px; background: rgba(46,204,113,0.15); border: 1px solid rgba(46,204,113,0.3); text-align: center;';
        explDiv.innerHTML = `<p style="margin: 0; font-size: 0.95rem;">💡 ${q.explanation}</p>`;
        body.appendChild(explDiv);

        // Next question after delay
        setTimeout(() => {
            this.currentQuestion++;
            if (this.currentQuestion < this.totalQuestions) {
                this.renderQuestion();
            } else {
                this.complete();
            }
        }, 2500);
    },

    complete() {
        this.completed = true;
        const percentage = Math.round((this.score / this.totalQuestions) * 100);
        const passed = percentage >= 60;

        const body = document.getElementById('arcadeBody');
        body.innerHTML = `
            <div class="completion-screen" style="text-align: center; padding: 20px;">
                <div class="success-icon" style="font-size: 4rem; margin-bottom: 15px;">${passed ? '🏆' : '📚'}</div>
                <h2>${passed ? 'أحسنت! أنت خبير مرور!' : 'حاول مرة أخرى!'}</h2>
                <p style="font-size: 1.2rem; margin: 10px 0;">النتيجة: ${this.score}/${this.totalQuestions} (${percentage}%)</p>
                <p style="color: var(--text-muted);">${passed ? 'لقد أظهرت معرفة ممتازة بإشارات المرور وقواعد السلامة في الشارع.' : 'تحتاج لمزيد من التدريب على إشارات المرور. حاول مرة أخرى!'}</p>
                <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: center;">
                    ${!passed ? '<button class="btn btn-secondary" onclick="SafetyArcade.retry()">🔄 إعادة المحاولة</button>' : ''}
                    <button class="btn btn-primary" onclick="SafetyArcade.close()">${passed ? 'العودة للدرس ✅' : 'إغلاق'}</button>
                </div>
            </div>
        `;
        if (passed) {
            if (typeof SoundEffects !== 'undefined') SoundEffects.levelUp();
            if (typeof Confetti !== 'undefined') Confetti.celebrate();
        }
    },

    retry() {
        this.close();
        this.start();
    },

    goBack() {
        if (confirm('هل تريد الخروج من اللعبة؟ سيتم فقدان تقدمك.')) {
            this.close();
        }
    },

    close() {
        const overlay = document.getElementById('arcadeOverlay');
        if (overlay) overlay.remove();
        this.isActive = false;
    }
};
