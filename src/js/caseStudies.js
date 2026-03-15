/**
 * Case Studies & Safety Posters
 * Real-life safety scenarios and printable materials
 */

const CaseStudies = {
    /**
     * Real-life safety case studies
     */
    cases: [
        {
            id: 'factory-fire',
            title: 'حريق مصنع الملابس',
            icon: '🏭',
            category: 'fire',
            location: 'بنغلاديش',
            year: 2012,
            summary: 'حريق في مصنع أدى إلى مقتل أكثر من 100 عامل بسبب غياب مخارج الطوارئ.',
            details: `
                <h4>ما حدث:</h4>
                <p>اندلع حريق في مصنع للملابس في ساعات المساء. كان أكثر من 1000 عامل داخل المبنى.</p>
                
                <h4>أسباب الكارثة:</h4>
                <ul>
                    <li>🚪 مخارج الطوارئ كانت مغلقة</li>
                    <li>🪜 لا توجد سلالم هروب كافية</li>
                    <li>🧯 طفايات الحريق غير كافية أو معطلة</li>
                    <li>📢 لا يوجد نظام إنذار فعال</li>
                    <li>👨‍🏫 لم يتلق العمال تدريباً على الإخلاء</li>
                </ul>
                
                <h4>الدروس المستفادة:</h4>
                <ul>
                    <li>✅ يجب أن تكون مخارج الطوارئ مفتوحة دائماً</li>
                    <li>✅ تدريب دوري على الإخلاء للجميع</li>
                    <li>✅ فحص معدات الإطفاء بانتظام</li>
                    <li>✅ تركيب أنظمة إنذار وإطفاء آلية</li>
                </ul>
            `,
            quiz: [
                { q: 'ما السبب الرئيسي لكثرة الضحايا؟', a: 'إغلاق مخارج الطوارئ' },
                { q: 'ما أهم درس من هذه الحادثة؟', a: 'التدريب والاستعداد للطوارئ' }
            ]
        },
        {
            id: 'electrical-accident',
            title: 'حادث الصعقة الكهربائية في المنزل',
            icon: '🏠',
            category: 'electric',
            location: 'مصر',
            year: 2020,
            summary: 'طفل تعرض لصعقة كهربائية من مأخذ كهرباء تالف.',
            details: `
                <h4>ما حدث:</h4>
                <p>طفل عمره 5 سنوات لمس مأخذ كهرباء مكسور في غرفة المعيشة أثناء اللعب.</p>
                
                <h4>أسباب الحادث:</h4>
                <ul>
                    <li>🔌 غطاء المأخذ الكهربائي مكسور</li>
                    <li>👶 لم يتم تركيب سدادات حماية الأطفال</li>
                    <li>⚡ لم يكن هناك قاطع حماية من التسرب (RCD)</li>
                    <li>👀 غياب الرقابة المناسبة</li>
                </ul>
                
                <h4>الدروس المستفادة:</h4>
                <ul>
                    <li>✅ تركيب سدادات أمان لجميع المآخذ</li>
                    <li>✅ إصلاح أي تلف في التمديدات فوراً</li>
                    <li>✅ تركيب قواطع الحماية من التسرب الكهربائي</li>
                    <li>✅ تعليم الأطفال خطورة الكهرباء</li>
                </ul>
            `,
            quiz: [
                { q: 'ما الجهاز الذي كان يمكن أن يمنع الحادث؟', a: 'قاطع الحماية من التسرب (RCD)' },
                { q: 'كيف نحمي الأطفال من المآخذ الكهربائية؟', a: 'تركيب سدادات الأمان' }
            ]
        },
        {
            id: 'lab-accident',
            title: 'حادث المختبر الكيميائي',
            icon: '🧪',
            category: 'general',
            location: 'مصر - جامعة',
            year: 2019,
            summary: 'انفجار في مختبر جامعي بسبب خلط مواد كيميائية بشكل خاطئ.',
            details: `
                <h4>ما حدث:</h4>
                <p>طالب قام بخلط مادتين كيميائيتين دون اتباع تعليمات السلامة، مما أدى إلى تفاعل عنيف وانفجار صغير.</p>
                
                <h4>أسباب الحادث:</h4>
                <ul>
                    <li>📚 عدم قراءة تعليمات السلامة</li>
                    <li>👓 عدم ارتداء نظارات الحماية</li>
                    <li>🧤 عدم ارتداء القفازات</li>
                    <li>👨‍🔬 غياب الإشراف المناسب</li>
                    <li>⚗️ عدم معرفة خصائص المواد الكيميائية</li>
                </ul>
                
                <h4>الدروس المستفادة:</h4>
                <ul>
                    <li>✅ قراءة جميع التعليمات قبل البدء</li>
                    <li>✅ ارتداء معدات الحماية الشخصية دائماً</li>
                    <li>✅ عدم العمل بمفردك في المختبر</li>
                    <li>✅ معرفة موقع معدات الطوارئ</li>
                    <li>✅ التعرف على رموز الخطر على المواد</li>
                </ul>
            `,
            quiz: [
                { q: 'ما أول شيء يجب فعله قبل التجربة؟', a: 'قراءة تعليمات السلامة' },
                { q: 'ما معدات الحماية الأساسية في المختبر؟', a: 'نظارات وقفازات ومعطف المختبر' }
            ]
        }
    ],

    /**
     * Create case study viewer
     */
    open(caseId = null) {
        const container = this.createUI();

        if (caseId) {
            this.showCase(caseId);
        } else {
            this.showList();
        }

        container.classList.add('show');
    },

    createUI() {
        const existing = document.getElementById('caseStudyContainer');
        if (existing) existing.remove();

        const container = document.createElement('div');
        container.id = 'caseStudyContainer';
        container.className = 'case-study-container';
        container.innerHTML = `
            <div class="case-study-header">
                <button class="btn btn-back case-close" id="closeCaseStudy">✕</button>
                <h2 class="case-study-title" id="caseTitle">📋 دراسات حالة حقيقية</h2>
            </div>
            <div class="case-study-content" id="caseContent"></div>
        `;

        document.body.appendChild(container);
        document.getElementById('closeCaseStudy').addEventListener('click', () => this.close());

        return container;
    },

    showList() {
        const content = document.getElementById('caseContent');
        content.innerHTML = `
            <div class="cases-list">
                <p class="cases-intro">تعلم من الحوادث الحقيقية لتجنب تكرارها:</p>
                ${this.cases.map(c => `
                    <div class="case-card" data-case="${c.id}">
                        <span class="case-icon">${c.icon}</span>
                        <div class="case-info">
                            <h3>${c.title}</h3>
                            <p class="case-location">📍 ${c.location} - ${c.year}</p>
                            <p class="case-summary">${c.summary}</p>
                        </div>
                        <span class="case-arrow">←</span>
                    </div>
                `).join('')}
            </div>
        `;

        content.querySelectorAll('.case-card').forEach(card => {
            card.addEventListener('click', () => {
                this.showCase(card.dataset.case);
            });
        });
    },

    showCase(caseId) {
        const caseData = this.cases.find(c => c.id === caseId);
        if (!caseData) return;

        document.getElementById('caseTitle').textContent = `${caseData.icon} ${caseData.title}`;

        const content = document.getElementById('caseContent');
        content.innerHTML = `
            <div class="case-detail">
                <button class="btn btn-secondary case-back" id="backToList">
                    → العودة للقائمة
                </button>
                <div class="case-header-info">
                    <span class="case-location">📍 ${caseData.location}</span>
                    <span class="case-year">📅 ${caseData.year}</span>
                </div>
                <div class="case-body">
                    ${caseData.details}
                </div>
                <div class="case-quiz">
                    <h4>❓ اختبر فهمك:</h4>
                    ${caseData.quiz.map((q, i) => `
                        <div class="case-quiz-item">
                            <p class="quiz-question">${i + 1}. ${q.q}</p>
                            <button class="btn btn-secondary show-answer" data-answer="${q.a}">كشف الإجابة</button>
                            <p class="quiz-answer" style="display: none;">✅ ${q.a}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        document.getElementById('backToList').addEventListener('click', () => {
            this.showList();
            document.getElementById('caseTitle').textContent = '📋 دراسات حالة حقيقية';
        });

        content.querySelectorAll('.show-answer').forEach(btn => {
            btn.addEventListener('click', () => {
                btn.style.display = 'none';
                btn.nextElementSibling.style.display = 'block';
            });
        });
    },

    close() {
        const container = document.getElementById('caseStudyContainer');
        if (container) {
            container.classList.remove('show');
            setTimeout(() => container.remove(), 300);
        }
    }
};
