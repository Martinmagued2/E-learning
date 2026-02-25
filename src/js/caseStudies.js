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


/**
 * Safety Posters - Printable PDFs
 */
const SafetyPosters = {
    posters: [
        {
            id: 'fire-evacuation',
            title: 'خطة الإخلاء من الحريق',
            icon: '🚪',
            description: 'ملصق يوضح خطوات الإخلاء الآمن',
            category: 'fire'
        },
        {
            id: 'extinguisher-types',
            title: 'أنواع طفايات الحريق',
            icon: '🧯',
            description: 'دليل مرئي لاختيار طفاية الحريق المناسبة',
            category: 'fire'
        },
        {
            id: 'electrical-safety',
            title: 'قواعد السلامة الكهربائية',
            icon: '⚡',
            description: 'نصائح للتعامل الآمن مع الكهرباء',
            category: 'electric'
        },
        {
            id: 'ppe-guide',
            title: 'دليل معدات الحماية الشخصية',
            icon: '🦺',
            description: 'معدات الحماية اللازمة لكل نوع عمل',
            category: 'general'
        },
        {
            id: 'first-aid',
            title: 'الإسعافات الأولية الأساسية',
            icon: '🩹',
            description: 'خطوات الإسعافات الأولية للحالات الشائعة',
            category: 'general'
        },
        {
            id: 'emergency-numbers',
            title: 'أرقام الطوارئ',
            icon: '📞',
            description: 'أرقام الاتصال في حالات الطوارئ',
            category: 'general'
        }
    ],

    open() {
        const container = this.createUI();
        container.classList.add('show');
    },

    createUI() {
        const existing = document.getElementById('postersContainer');
        if (existing) existing.remove();

        const container = document.createElement('div');
        container.id = 'postersContainer';
        container.className = 'posters-container';
        container.innerHTML = `
            <div class="posters-header">
                <button class="btn btn-back posters-close" id="closePosters">✕</button>
                <h2 class="posters-title">🖼️ ملصقات السلامة للطباعة</h2>
            </div>
            <div class="posters-content">
                <p class="posters-intro">قم بتحميل وطباعة ملصقات السلامة لعرضها في المنزل أو المدرسة:</p>
                <div class="posters-grid">
                    ${this.posters.map(p => `
                        <div class="poster-card">
                            <span class="poster-icon">${p.icon}</span>
                            <h3>${p.title}</h3>
                            <p>${p.description}</p>
                            <button class="btn btn-primary poster-download" data-poster="${p.id}">
                                تحميل 📥
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        document.body.appendChild(container);
        document.getElementById('closePosters').addEventListener('click', () => this.close());

        container.querySelectorAll('.poster-download').forEach(btn => {
            btn.addEventListener('click', () => {
                this.generatePoster(btn.dataset.poster);
            });
        });

        return container;
    },

    generatePoster(posterId) {
        const poster = this.posters.find(p => p.id === posterId);
        if (!poster) return;

        // Create a printable poster HTML
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html dir="rtl" lang="ar">
            <head>
                <title>${poster.title}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: 'Cairo', Arial, sans-serif; 
                        padding: 40px;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        min-height: 100vh;
                    }
                    .poster {
                        background: white;
                        border-radius: 20px;
                        padding: 40px;
                        max-width: 600px;
                        margin: 0 auto;
                        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    }
                    .poster-header {
                        text-align: center;
                        margin-bottom: 30px;
                        padding-bottom: 20px;
                        border-bottom: 3px solid #667eea;
                    }
                    .poster-icon { font-size: 80px; }
                    .poster-title { font-size: 28px; color: #1a1a2e; margin-top: 15px; }
                    .poster-content { font-size: 18px; line-height: 2; }
                    .poster-content ul { padding-right: 25px; }
                    .poster-content li { margin-bottom: 15px; }
                    .poster-footer {
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 2px solid #eee;
                        text-align: center;
                        color: #666;
                        font-size: 14px;
                    }
                    @media print {
                        body { background: white; padding: 0; }
                        .poster { box-shadow: none; }
                    }
                </style>
            </head>
            <body>
                <div class="poster">
                    <div class="poster-header">
                        <span class="poster-icon">${poster.icon}</span>
                        <h1 class="poster-title">${poster.title}</h1>
                    </div>
                    <div class="poster-content">
                        ${this.getPosterContent(posterId)}
                    </div>
                    <div class="poster-footer">
                        <p>🛡️ تطبيق تعليم السلامة - أكاديمية السلامة المصرية</p>
                        <p>اطبع هذا الملصق وعلقه في مكان واضح</p>
                    </div>
                </div>
                <script>window.print();</script>
            </body>
            </html>
        `);
    },

    getPosterContent(posterId) {
        const contents = {
            'fire-evacuation': `
                <h3>خطوات الإخلاء الآمن من الحريق:</h3>
                <ul>
                    <li>🚨 عند سماع الإنذار، ابقَ هادئاً</li>
                    <li>🚶 توجه فوراً لأقرب مخرج طوارئ</li>
                    <li>🪜 استخدم السلالم، لا المصعد</li>
                    <li>🚪 اختبر الباب قبل فتحه</li>
                    <li>💨 إذا كان هناك دخان، انحنِ للأسفل</li>
                    <li>🏃 لا تعد للمبنى أبداً</li>
                    <li>📍 توجه لنقطة التجمع</li>
                </ul>
            `,
            'extinguisher-types': `
                <h3>اختر طفاية الحريق المناسبة:</h3>
                <ul>
                    <li>💧 <strong>ماء (A):</strong> خشب، ورق، قماش</li>
                    <li>🫧 <strong>رغوة (A,B):</strong> سوائل قابلة للاشتعال</li>
                    <li>❄️ <strong>CO2 (B,C):</strong> كهرباء وسوائل</li>
                    <li>💨 <strong>بودرة (A,B,C):</strong> متعددة الاستخدام</li>
                </ul>
                <h3>طريقة الاستخدام - PASS:</h3>
                <ul>
                    <li>P - Pull: اسحب المسمار</li>
                    <li>A - Aim: صوّب للقاعدة</li>
                    <li>S - Squeeze: اضغط على المقبض</li>
                    <li>S - Sweep: امسح يميناً ويساراً</li>
                </ul>
            `,
            'electrical-safety': `
                <h3>قواعد السلامة الكهربائية:</h3>
                <ul>
                    <li>💧 لا تلمس الكهرباء بأيدٍ مبللة</li>
                    <li>🔌 لا تحمّل المقابس أكثر من طاقتها</li>
                    <li>🔧 لا تصلح الأعطال بنفسك</li>
                    <li>⚠️ استبدل الأسلاك التالفة فوراً</li>
                    <li>👶 ركّب سدادات حماية الأطفال</li>
                    <li>🔌 افصل الأجهزة غير المستخدمة</li>
                    <li>📞 اتصل بفني مختص عند الحاجة</li>
                </ul>
            `,
            'ppe-guide': `
                <h3>معدات الحماية الشخصية:</h3>
                <ul>
                    <li>⛑️ <strong>خوذة:</strong> حماية الرأس</li>
                    <li>👓 <strong>نظارات:</strong> حماية العين</li>
                    <li>👂 <strong>سدادات الأذن:</strong> حماية السمع</li>
                    <li>😷 <strong>كمامة:</strong> حماية التنفس</li>
                    <li>🧤 <strong>قفازات:</strong> حماية اليدين</li>
                    <li>🦺 <strong>سترة:</strong> الرؤية العالية</li>
                    <li>👢 <strong>حذاء:</strong> حماية القدمين</li>
                </ul>
            `,
            'first-aid': `
                <h3>خطوات الإسعافات الأولية:</h3>
                <ul>
                    <li>🔍 <strong>تحقق:</strong> هل المكان آمن؟</li>
                    <li>📞 <strong>اتصل:</strong> بالطوارئ (123)</li>
                    <li>🫁 <strong>تنفس:</strong> تحقق من التنفس</li>
                    <li>❤️ <strong>قلب:</strong> CPR إذا لزم</li>
                    <li>🩹 <strong>نزيف:</strong> اضغط على الجرح</li>
                    <li>🧊 <strong>حروق:</strong> ماء بارد 10 دقائق</li>
                    <li>🛏️ <strong>انتظر:</strong> لا تحرك المصاب</li>
                </ul>
            `,
            'emergency-numbers': `
                <h3>أرقام الطوارئ في مصر:</h3>
                <ul>
                    <li>🚑 <strong>123:</strong> الإسعاف والطوارئ</li>
                    <li>🚒 <strong>180:</strong> الإطفاء والحماية المدنية</li>
                    <li>👮 <strong>122:</strong> الشرطة</li>
                    <li>🚗 <strong>128:</strong> نجدة المرور</li>
                    <li>💨 <strong>129:</strong> أعطال الغاز</li>
                    <li>💡 <strong>121:</strong> أعطال الكهرباء</li>
                    <li>☎️ <strong>16000:</strong> الخط الساخن العام</li>
                </ul>
            `
        };
        return contents[posterId] || '<p>محتوى قيد الإنشاء</p>';
    },

    close() {
        const container = document.getElementById('postersContainer');
        if (container) {
            container.classList.remove('show');
            setTimeout(() => container.remove(), 300);
        }
    }
};
