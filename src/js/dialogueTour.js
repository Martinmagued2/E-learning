/**
 * Interactive Dialogue Tutorial System
 * Two characters guide the user through the app with natural conversations
 */

const DialogueTour = {
    isActive: false,
    currentScene: null,
    currentDialogueIndex: 0,
    characters: {},

    // Storage key for tracking completed tours
    STORAGE_KEY: 'completedTours',

    /**
     * Character definitions with visual properties
     */
    characterData: {
        salem: {
            name: 'سالم',
            nameEn: 'Salem',
            role: 'خبير السلامة',
            roleEn: 'Safety Expert',
            color: '#3742fa',
            emoji: '👨‍🏫',
            position: 'left',
            personality: 'wise',
            // Visual properties
            headColor: '#FFD1A3',
            bodyColor: '#3742fa',
            hatColor: '#FFD700',
            expression: {
                happy: '😊',
                thinking: '🤔',
                excited: '😃',
                explaining: '👨‍🏫'
            }
        },
        nour: {
            name: 'نور',
            nameEn: 'Nour',
            role: 'المتعلمة الفضولية',
            roleEn: 'Curious Learner',
            color: '#ff6b81',
            emoji: '👧',
            position: 'right',
            personality: 'curious',
            // Visual properties
            headColor: '#FFD1A3',
            bodyColor: '#ff6b81',
            hairColor: '#4A2C2A',
            expression: {
                happy: '😊',
                curious: '🤔',
                excited: '🤩',
                confused: '😕'
            }
        }
    },

    /**
     * Tutorial dialogues organized by screen/feature
     */
    dialogues: {
        welcome: [
            {
                character: 'salem',
                expression: 'happy',
                text: 'مرحباً بك يا صديقي في تطبيق سلامتك! أنا سالم، خبير السلامة.',
                speech: 'مرحباً بك يا صديقي في تطبيق سلامتك! أنا سالم، خبير السلامة.'
            },
            {
                character: 'nour',
                expression: 'excited',
                text: 'وأنا نور! سنكون معك في رحلة ممتعة لتعلم أساسيات السلامة.',
                speech: 'وأنا نور! سنكون معك في رحلة ممتعة لتعلم أساسيات السلامة.'
            },
            {
                character: 'salem',
                expression: 'explaining',
                text: 'هنا يمكنك البدء برحلتك التعليمية. أدخل اسمك لنبدأ معاً!',
                speech: 'هنا يمكنك البدء برحلتك التعليمية. أدخل اسمك لنبدأ معاً!',
                highlight: '#studentName'
            },
            {
                character: 'nour',
                expression: 'happy',
                text: 'لا تنسى الضغط على زر "ابدأ الرحلة" بعد كتابة اسمك! 🚀',
                speech: 'لا تنسى الضغط على زر ابدأ الرحلة بعد كتابة اسمك!',
                highlight: '#startBtn'
            }
        ],

        dashboard: [
            {
                character: 'salem',
                expression: 'happy',
                text: 'أهلاً بك في لوحة التحكم الخاصة بك. هنا ستجد جميع الدورات المتاحة.',
                speech: 'أهلاً بك في لوحة التحكم الخاصة بك. هنا ستجد جميع الدورات المتاحة.'
            },
            {
                character: 'nour',
                expression: 'curious',
                text: 'انظر يا سالم! هناك شريط للتقدم في الأعلى. هل هذا يوضح كم تعلمت؟',
                speech: 'انظر يا سالم! هناك شريط للتقدم في الأعلى. هل هذا يوضح كم تعلمت؟',
                highlight: '.progress-section'
            },
            {
                character: 'salem',
                expression: 'explaining',
                text: 'بالضبط يا نور. وكلما أكملت دورة، ستفتح لك الدورة التالية تلقائياً.',
                speech: 'بالضبط يا نور. وكلما أكملت دورة، ستفتح لك الدورة التالية تلقائياً.',
                highlight: '#coursesGrid'
            },
            {
                character: 'nour',
                expression: 'excited',
                text: 'وهناك أوسمة أيضاً! أريد الحصول عليها جميعاً! 🏆',
                speech: 'وهناك أوسمة أيضاً! أريد الحصول عليها جميعاً!',
                highlight: '#achievementsSection'
            }
        ],

        course: [
            {
                character: 'salem',
                expression: 'explaining',
                text: 'هذه هي صفحة الدورة. هنا ستتعلم كل شيء عن موضوع السلامة المختار.',
                speech: 'هذه هي صفحة الدورة. هنا ستتعلم كل شيء عن موضوع السلامة المختار.',
                highlight: '#courseTitle'
            },
            {
                character: 'nour',
                expression: 'excited',
                text: 'شكل الدرس ممتع! سأشاهد الفيديوهات وأقرأ المحتوى بعناية.',
                speech: 'شكل الدرس ممتع! سأشاهد الفيديوهات وأقرأ المحتوى بعناية.',
                highlight: '#lessonContainer'
            },
            {
                character: 'salem',
                expression: 'happy',
                text: 'ممتاز. يمكنك التنقل بين الدروس باستخدام هذه الأزرار في الأسفل.',
                speech: 'ممتاز. يمكنك التنقل بين الدروس باستخدام هذه الأزرار في الأسفل.',
                highlight: '.lesson-navigation'
            },
            {
                character: 'nour',
                expression: 'curious',
                text: 'وماذا يحدث عندما ننتهي من جميع الدروس؟',
                speech: 'وماذا يحدث عندما ننتهي من جميع الدروس؟'
            },
            {
                character: 'salem',
                expression: 'explaining',
                text: 'سيكون هناك اختبار نهائي وتطبيق عملي للحصول على الشهادة!',
                speech: 'سيكون هناك اختبار نهائي وتطبيق عملي للحصول على الشهادة!'
            }
        ],

        tools: [
            {
                character: 'nour',
                expression: 'excited',
                text: 'أخبرني عن الألعاب! 🎮',
                speech: 'أخبرني عن الألعاب'
            },
            {
                character: 'salem',
                expression: 'happy',
                text: 'لدينا ثلاثة ألعاب: اكتشف الخطر، المطابقة، والفرز!',
                speech: 'لدينا ثلاثة ألعاب'
            },
            {
                character: 'nour',
                expression: 'curious',
                text: 'وماذا عن البطاقات التعليمية؟ 🃏',
                speech: 'وماذا عن البطاقات التعليمية'
            },
            {
                character: 'salem',
                expression: 'explaining',
                text: 'البطاقات تساعدك على المراجعة السريعة. اقلبها لتري الإجابة!',
                speech: 'البطاقات تساعدك على المراجعة السريعة'
            },
            {
                character: 'nour',
                expression: 'happy',
                text: 'وهناك قاموس للمصطلحات أيضاً! 📖',
                speech: 'وهناك قاموس للمصطلحات'
            },
            {
                character: 'salem',
                expression: 'happy',
                text: 'صحيح! يحتوي على جميع مصطلحات السلامة بالعربية',
                speech: 'صحيح! يحتوي على جميع مصطلحات السلامة'
            }
        ],

        features: [
            {
                character: 'nour',
                expression: 'curious',
                text: 'ما هذه الأزرار على الجانب؟',
                speech: 'ما هذه الأزرار على الجانب',
                highlight: '.accessibility-controls'
            },
            {
                character: 'salem',
                expression: 'explaining',
                text: 'هذا زر تغيير المظهر ☀️🌙 - يمكنك التبديل بين الوضع الليلي والنهاري',
                speech: 'هذا زر تغيير المظهر'
            },
            {
                character: 'nour',
                expression: 'excited',
                text: 'رائع! وماذا عن الزر الآخر؟',
                speech: 'رائع! وماذا عن الزر الآخر'
            },
            {
                character: 'salem',
                expression: 'happy',
                text: 'هذا لتكبير أو تصغير الخط حسب راحتك',
                speech: 'هذا لتكبير أو تصغير الخط'
            },
            {
                character: 'nour',
                expression: 'happy',
                text: 'مفيد جداً! وماذا عن هذا الشخص اللطيف في الزاوية؟ 👋',
                speech: 'مفيد جداً! وماذا عن هذا الشخص',
                highlight: '#mascotContainer'
            },
            {
                character: 'salem',
                expression: 'happy',
                text: 'هذا صديقنا سالم الآخر! يمكنك الضغط عليه ليعطيك نصائح',
                speech: 'هذا صديقنا سالم'
            }
        ],

        achievements: [
            {
                character: 'nour',
                expression: 'excited',
                text: 'أنا أحب الأوسمة! 🏆',
                speech: 'أنا أحب الأوسمة',
                highlight: '.achievements-grid'
            },
            {
                character: 'salem',
                expression: 'explaining',
                text: 'مع كل إنجاز، ستحصلين على وسام! هناك برونزية وفضية وذهبية',
                speech: 'مع كل إنجاز، ستحصلين على وسام'
            },
            {
                character: 'nour',
                expression: 'curious',
                text: 'وكيف أحصل عليها؟',
                speech: 'وكيف أحصل عليها'
            },
            {
                character: 'salem',
                expression: 'happy',
                text: 'بإكمال الدروس، إتقان الاختبارات، واللعب بالألعاب!',
                speech: 'بإكمال الدروس وإتقان الاختبارات'
            },
            {
                character: 'nour',
                expression: 'excited',
                text: 'لنبدأ إذن! 💪',
                speech: 'لنبدأ إذن'
            }
        ],

        lesson: [
            {
                character: 'salem',
                expression: 'happy',
                text: 'أهلاً بك في الدرس! 📚',
                speech: 'أهلاً بك في الدرس'
            },
            {
                character: 'nour',
                expression: 'excited',
                text: 'سنتعلم أشياء جديدة ومفيدة اليوم! ✨',
                speech: 'سنتعلم أشياء جديدة ومفيدة اليوم'
            },
            {
                character: 'salem',
                expression: 'explaining',
                text: 'يمكنك مشاهدة الفيديو التعليمي هنا 🎥',
                speech: 'يمكنك مشاهدة الفيديو التعليمي هنا',
                highlight: 'video'
            },
            {
                character: 'nour',
                expression: 'happy',
                text: 'واقرأ المحتوى المكتوب بعناية لفهم الدرس جيداً 📖',
                speech: 'واقرأ المحتوى المكتوب بعناية لفهم الدرس جيداً',
                highlight: '.lesson-content'
            },
            {
                character: 'salem',
                expression: 'happy',
                text: 'عندما تنتهي، اضغط هنا للانتقال للدرس التالي ⬅️',
                speech: 'عندما تنتهي، اضغط هنا للانتقال للدرس التالي',
                highlight: '.lesson-navigation button:last-child'
            }
        ],

        scenarios: [
            {
                character: 'salem',
                expression: 'explaining',
                text: 'الآن وقت التطبيق العملي! 🛠️',
                speech: 'الآن وقت التطبيق العملي'
            },
            {
                character: 'nour',
                expression: 'curious',
                text: 'كيف نلعب هذه اللعبة يا سالم؟ 🤔',
                speech: 'كيف نلعب هذه اللعبة يا سالم'
            },
            {
                character: 'salem',
                expression: 'happy',
                text: 'اقرأ الموقف جيداً، ثم اختر التصرف الصحيح من الخيارات 👇',
                speech: 'اقرأ الموقف جيداً، ثم اختر التصرف الصحيح من الخيارات',
                highlight: '.scenario-options'
            },
            {
                character: 'nour',
                expression: 'excited',
                text: 'سأركز جيداً لأحصل على النتيجة الكاملة! ⭐',
                speech: 'سأركز جيداً لأحصل على النتيجة الكاملة'
            }
        ],

        quiz: [
            {
                character: 'salem',
                expression: 'happy',
                text: 'وصلنا للاختبار النهائي! هل أنت مستعد؟ 📝',
                speech: 'وصلنا للاختبار النهائي! هل أنت مستعد'
            },
            {
                character: 'nour',
                expression: 'excited',
                text: 'نعم! ولكن انتبه للوقت! ⏱️',
                speech: 'نعم! ولكن انتبه للوقت'
            },
            {
                character: 'salem',
                expression: 'explaining',
                text: 'صحيح! لديك 15 ثانية فقط لكل سؤال. العداد هنا ⏳',
                speech: 'صحيح! لديك خمسة عشر ثانية فقط لكل سؤال. العداد هنا',
                highlight: '.timer-container'
            },
            {
                character: 'nour',
                expression: 'happy',
                text: 'اقرأ السؤال واختر الإجابة بسرعة ودقة! بالتوفيق! 🚀',
                speech: 'اقرأ السؤال واختر الإجابة بسرعة ودقة! بالتوفيق'
            }
        ],

        dragdrop: [
            {
                character: 'salem',
                expression: 'explaining',
                text: 'هذه اللعبة مختلفة! سنستخدم السحب والإفلات 👋',
                speech: 'هذه اللعبة مختلفة! سنستخدم السحب والإفلات'
            },
            {
                character: 'nour',
                expression: 'curious',
                text: 'ماذا علينا أن نفعل؟ 🤔',
                speech: 'ماذا علينا أن نفعل'
            },
            {
                character: 'salem',
                expression: 'happy',
                text: 'اسحبي الأداة المناسبة وضعيها على المكان الصحيح في الصورة! 🖱️',
                speech: 'اسحبي الأداة المناسبة وضعيها على المكان الصحيح في الصورة'
            },
            {
                character: 'nour',
                expression: 'excited',
                text: 'فهمت! سأختار الأداة الصحيحة لإطفاء الحريق! 🔥❌',
                speech: 'فهمت! سأختار الأداة الصحيحة لإطفاء الحريق'
            }
        ],

        emergencySimulator: [
            {
                character: 'salem',
                expression: 'explaining',
                text: 'في حالات الطوارئ، كل ثانية تفرق! هذا المحاكي سيساعدك على التدرب.',
                speech: 'في حالات الطوارئ، كل ثانية تفرق! هذا المحاكي سيساعدك على التدرب.'
            },
            {
                character: 'nour',
                expression: 'curious',
                text: 'هل يجب علي الاتصال برقم معين؟ 🤔',
                speech: 'هل يجب علي الاتصال برقم معين؟'
            },
            {
                character: 'salem',
                expression: 'happy',
                text: 'نعم، اتصلي بالرقم الصحيح وأخبريهم بالمعلومات المطلوبة بسرعة!',
                speech: 'نعم، اتصلي بالرقم الصحيح وأخبريهم بالمعلومات المطلوبة بسرعة!'
            },
            {
                character: 'nour',
                expression: 'excited',
                text: 'سأكون سريعة ومنظمة، تماماً كأبطال الإطفاء! 💪',
                speech: 'سأكون سريعة ومنظمة، تماماً كأبطال الإطفاء!'
            }
        ],

        ppeGame: [
            {
                character: 'salem',
                expression: 'explaining',
                text: 'ارتداء ملابس الوقاية الشخصية هو أول خطوة للحفاظ على سلامتك.',
                speech: 'ارتداء ملابس الوقاية الشخصية هو أول خطوة للحفاظ على سلامتك.'
            },
            {
                character: 'nour',
                expression: 'curious',
                text: 'هناك الكثير من الأدوات! ماذا أختار لموقع البناء؟ 👷‍♀️',
                speech: 'هناك الكثير من الأدوات! ماذا أختار لموقع البناء؟'
            },
            {
                character: 'salem',
                expression: 'happy',
                text: 'اسحبي الخوذة والسترة والقفازات المناسبة للشخصية.',
                speech: 'اسحبي الخوذة والسترة والقفازات المناسبة للشخصية.'
            },
            {
                character: 'nour',
                expression: 'excited',
                text: 'فهمت! السلامة تبدأ بقرار صحيح في اختيار المعدات!',
                speech: 'فهمت! السلامة تبدأ بقرار صحيح في اختيار المعدات!'
            }
        ],

        escapeRoom: [
            {
                character: 'salem',
                expression: 'explaining',
                text: 'تخيلي أنك في غرفة ويجب عليك الخروج بأمان باتباع تعليمات السلامة.',
                speech: 'تخيلي أنك في غرفة ويجب عليك الخروج بأمان باتباع تعليمات السلامة.'
            },
            {
                character: 'nour',
                expression: 'curious',
                text: 'هل يجب علي البحث عن مفاتيح؟ 🔑',
                speech: 'هل يجب علي البحث عن مفاتيح؟'
            },
            {
                character: 'salem',
                expression: 'happy',
                text: 'المفاتيح هي معرفتك! ابحثي عن المخاطر وحلي الألغاز لتفتحي الباب.',
                speech: 'المفاتيح هي معرفتك! ابحثي عن المخاطر وحلي الألغاز لتفتحي الباب.'
            },
            {
                character: 'nour',
                expression: 'excited',
                text: 'تحدي رائع! سأستخدم ذكائي ومعلوماتي لأخرج بسلام! ✨',
                speech: 'تحدي رائع! سأستخدم ذكائي ومعلوماتي لأخرج بسلام!'
            }
        ],

        spotDifference: [
            {
                character: 'salem',
                expression: 'explaining',
                text: 'انظري جيداً لهاتين الصورتين. إحداهما بها أخطاء تهدد السلامة.',
                speech: 'انظري جيداً لهاتين الصورتين. إحداهما بها أخطاء تهدد السلامة.'
            },
            {
                character: 'nour',
                expression: 'curious',
                text: 'هل يجب أن أجد جميع المخاطر المخفية؟ 🔍',
                speech: 'هل يجب أن أجد جميع المخاطر المخفية؟'
            },
            {
                character: 'salem',
                expression: 'happy',
                text: 'نعم، اضغطي على أماكن الخطر في الصورة التي على اليسار.',
                speech: 'نعم، اضغطي على أماكن الخطر في الصورة التي على اليسار.'
            },
            {
                character: 'nour',
                expression: 'excited',
                text: 'عيني قوية جداً! سأجد كل ما يهدد السلامة في ثوانٍ! 👀',
                speech: 'عيني قوية جداً! سأجد كل ما يهدد السلامة في ثوانٍ!'
            }
        ],

        hazardMap: [
            {
                character: 'salem',
                expression: 'explaining',
                text: 'هذه خريطة للموقع. هناك عدة نقاط تحتاج لفحصك.',
                speech: 'هذه خريطة للموقع. هناك عدة نقاط تحتاج لفحصك.'
            },
            {
                character: 'nour',
                expression: 'curious',
                text: 'كيف أتحرك في الخريطة؟ 🗺️',
                speech: 'كيف أتحرك في الخريطة؟'
            },
            {
                character: 'salem',
                expression: 'happy',
                text: 'اضغطي على الأيقونات الحمراء، واقرئي الموقف، ثم حلي المشكلة.',
                speech: 'اضغطي على الأيقونات الحمراء، واقرئي الموقف، ثم حلي المشكلة.'
            },
            {
                character: 'nour',
                expression: 'excited',
                text: 'سأجعل هذا الموقع مكاناً آمناً للجميع! 🛡️',
                speech: 'سأجعل هذا الموقع مكاناً آمناً للجميع!'
            }
        ],

        safetyArcade: [
            {
                character: 'salem',
                expression: 'explaining',
                text: 'مرحباً بك في أركيد السلامة! لنتعلم من خلال اللعب السريع.',
                speech: 'مرحباً بك في أركيد السلامة! لنتعلم من خلال اللعب السريع.'
            },
            {
                character: 'nour',
                expression: 'curious',
                text: 'ما هي قواعد اللعبة؟ 🎮',
                speech: 'ما هي قواعد اللعبة؟'
            },
            {
                character: 'salem',
                expression: 'happy',
                text: 'التقطي أدوات السلامة وتجنبي المخاطر المتساقطة باستخدام الأسهم.',
                speech: 'التقطي أدوات السلامة وتجنبي المخاطر المتساقطة باستخدام الأسهم.'
            },
            {
                character: 'nour',
                expression: 'excited',
                text: 'هيا بنا! سأحطم الرقم القياسي في السلامة! 🚀',
                speech: 'هيا بنا! سأحطم الرقم القياسي في السلامة!'
            }
        ],

        certificate: [
            {
                character: 'salem',
                expression: 'happy',
                text: 'مبروك! لقد حصلت على شهادتك. هذا دليل على تفوقك في السلامة.',
                speech: 'مبروك! لقد حصلت على شهادتك. هذا دليل على تفوقك في السلامة.',
                highlight: '.certificate-paper'
            },
            {
                character: 'nour',
                expression: 'excited',
                text: 'يا لها من شهادة جميلة! هل يمكنني الاحتفاظ بها؟ 📜',
                speech: 'يا لها من شهادة جميلة! هل يمكنني الاحتفاظ بها؟'
            },
            {
                character: 'salem',
                expression: 'explaining',
                text: 'بالتأكيد! يمكنك الضغط على زر التحميل لحفظها كملف PDF.',
                speech: 'بالتأكيد! يمكنك الضغط على زر التحميل لحفظها كملف PDF.',
                highlight: '#printCertificate'
            },
            {
                character: 'nour',
                expression: 'happy',
                text: 'رائع! سأعرضها على أصدقائي وعائلتي! ✨',
                speech: 'رائع! سأعرضها على أصدقائي وعائلتي!'
            }
        ]
    },

    /**
     * Check if a tour has been completed
     */
    hasCompletedTour(tourName) {
        try {
            const completed = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
            return completed[tourName] === true;
        } catch (e) {
            return false;
        }
    },

    /**
     * Mark a tour as completed
     */
    markTourCompleted(tourName) {
        try {
            const completed = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
            completed[tourName] = true;
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(completed));
        } catch (e) {
            console.warn('Could not save tour completion:', e);
        }
    },

    /**
     * Reset all tour completions (for testing)
     */
    resetAllTours() {
        localStorage.removeItem(this.STORAGE_KEY);
        console.log('All tours reset - will show again on next visit');
    },

    /**
     * Initialize the dialogue system
     */
    init() {
        if (document.getElementById('dialogueOverlay')) {
            return; // Already initialized
        }

        this.createDialogueUI();

        // Add tour to help menu after a short delay
        setTimeout(() => {
            this.addTourToHelpMenu();
        }, 1000);
    },

    /**
     * Create canvas for character rendering
     */
    createDialogueUI() {
        const overlay = document.createElement('div');
        overlay.id = 'dialogueOverlay';
        overlay.className = 'dialogue-overlay';
        overlay.innerHTML = `
            <!-- Characters -->
            <div class="character-wrapper salem" id="salemContainer">
                <img src="assets/salem.png" alt="Salem" class="character-image">
                <video id="salemVideo" class="character-video" playsinline webkit-playsinline></video>
            </div>
            <div class="character-wrapper nour" id="nourContainer">
                <img src="assets/nour.png" alt="Nour" class="character-image">
                <video id="nourVideo" class="character-video" playsinline webkit-playsinline></video>
            </div>

            <!-- Salem's Speech Bubble (Left) -->
            <div class="character-speech-bubble left" id="salemBubble">
                <div class="bubble-content">
                    <div class="bubble-header">
                        <span class="bubble-name">سالم</span>
                        <span class="bubble-emoji">👨‍🏫</span>
                    </div>
                    <p class="bubble-text" id="salemText">مرحباً!</p>
                </div>
            </div>

            <!-- Nour's Speech Bubble (Right) -->
            <div class="character-speech-bubble right" id="nourBubble">
                <div class="bubble-content">
                    <div class="bubble-header">
                        <span class="bubble-name">نور</span>
                        <span class="bubble-emoji">👧</span>
                    </div>
                    <p class="bubble-text" id="nourText">أهلاً!</p>
                </div>
            </div>

            <!-- Control Bar at Bottom -->
            <div class="dialogue-controls-bar">
                <button class="btn btn-secondary" id="skipTour">تخطي الشرح</button>
                <div class="dialogue-progress" id="dialogueProgress">
                    <span id="totalSteps">5</span> / <span id="currentStep">1</span>
                </div>
                <button class="btn btn-primary tour-btn-next" id="nextDialogue">
                    <span>التالي</span>
                    <span class="btn-icon">→</span>
                </button>
            </div>

            <!-- Full Screen Video Player -->
            <div class="fullscreen-video-overlay" id="fullscreenVideoOverlay">
                <button class="fullscreen-video-close" id="closeVideoTour">×</button>
                <div class="video-loader" id="videoLoader"></div>
                <video id="fullscreenVideo" controls playsinline webkit-playsinline preload="auto"></video>
            </div>
        `;
        document.body.appendChild(overlay);

        // Event listeners
        document.getElementById('nextDialogue').addEventListener('click', () => this.nextDialogue());
        document.getElementById('skipTour').addEventListener('click', () => this.endTour());
        // Video tour listeners
        document.getElementById('closeVideoTour').addEventListener('click', () => this.endVideoTour());
    },

    /**
     * Start a specific tour (checks if already completed unless forced)
     * @param {string} tourName - Name of the tour to start
     * @param {boolean} force - Force show even if already completed
     */
    startTour(tourName, force = false) {
        if (!this.dialogues[tourName]) {
            console.warn(`Tour "${tourName}" not found`);
            return;
        }

        // Skip if already completed (unless forced, e.g., from help menu)
        if (!force && this.hasCompletedTour(tourName)) {
            console.log(`Tour "${tourName}" already completed, skipping`);
            return;
        }

        // Video tours are disabled in favor of two-character dialogues
        /*
        if (tourName === 'welcome') {
            this.startVideoTour('assets/videos/welcome_full_tour.mp4');
            return;
        }
        if (tourName === 'dashboard') {
            this.startVideoTour('assets/videos/dashboard_full_tour.mp4');
            return;
        }
        if (tourName === 'course') {
            this.startVideoTour('assets/videos/course_full_tour.mp4');
            return;
        }
        */

        this.isActive = true;
        this.currentScene = tourName;
        this.currentDialogueIndex = 0;

        // Show overlay
        document.getElementById('dialogueOverlay').classList.add('active');

        // Show characters
        setTimeout(() => {
            document.querySelectorAll('.character-wrapper').forEach(el => el.classList.add('active'));
        }, 100);

        // Aggressively preload ALL audio for this tour
        const dialogueSteps = this.dialogues[tourName];
        if (typeof TextToSpeech !== 'undefined' && dialogueSteps) {
            dialogueSteps.forEach((step, index) => {
                // Preload everything, prioritizing the immediate next few steps for better flow
                // We assume startTour is called when user is ready, so firing these off is fine.
                const text = step.speech || step.text;
                if (text) {
                    // Small stagger to not choke the network immediately if there are many
                    setTimeout(() => {
                        TextToSpeech.preload(text, step.character);
                    }, index * 100);
                }
            });
        }

        // Show first dialogue
        this.showDialogue(0);
        // Show first dialogue
        this.showDialogue(0);
    },

    /**
     * Show a specific dialogue
     */
    showDialogue(index) {
        const dialogues = this.dialogues[this.currentScene];
        if (index >= dialogues.length) {
            this.endTour();
            return;
        }

        const dialogue = dialogues[index];
        const character = this.characterData[dialogue.character];

        // Hide both bubbles first
        document.getElementById('salemBubble').classList.remove('active');
        document.getElementById('nourBubble').classList.remove('active');

        // Stop any playing videos first
        this.stopVideos();

        // Show the speaking character's bubble
        if (dialogue.character === 'salem') {
            const bubble = document.getElementById('salemBubble');
            document.getElementById('salemText').textContent = dialogue.text;
            bubble.classList.add('active');
        } else if (dialogue.character === 'nour') {
            const bubble = document.getElementById('nourBubble');
            document.getElementById('nourText').textContent = dialogue.text;
            bubble.classList.add('active');
        }

        // Handle Video or TTS
        const characterContainer = document.getElementById(`${dialogue.character}Container`);

        if (dialogue.video && characterContainer) {
            // mode: VIDEO
            characterContainer.classList.add('has-video');
            const videoEl = characterContainer.querySelector('video');

            if (videoEl) {
                videoEl.src = `assets/videos/${dialogue.video}`;
                videoEl.onended = () => {
                    // Auto-advance or show next button when video ends
                    // converting to user preference: auto-advance might be too fast if they are reading?
                    // User said "instead of dialogue" so video IS the content. 
                    // Let's show next button prominent or auto-advance if it's a short clip.
                    // For now, let's just enable the next button
                    const nextBtn = document.getElementById('nextDialogue');
                    if (nextBtn) nextBtn.classList.add('pulse'); // Visual cue
                };

                videoEl.play().catch(e => {
                    console.warn('Video play failed, falling back to TTS:', e);
                    // Fallback to TTS if video fails
                    characterContainer.classList.remove('has-video');
                    if ((dialogue.speech || dialogue.text) && typeof TextToSpeech !== 'undefined') {
                        TextToSpeech.speak(dialogue.speech || dialogue.text, {
                            character: dialogue.character
                        });
                    }
                });

                // Handle video load error (e.g. file not found)
                videoEl.onerror = () => {
                    console.warn(`Video file not found: ${dialogue.video}`);
                    characterContainer.classList.remove('has-video');
                    // Fallback to TTS
                    if ((dialogue.speech || dialogue.text) && typeof TextToSpeech !== 'undefined') {
                        TextToSpeech.speak(dialogue.speech || dialogue.text, {
                            character: dialogue.character
                        });
                    }
                };
            }

        } else {
            // mode: IMAGE + TTS (Existing Logic)
            characterContainer.classList.remove('has-video');

            // Speak text
            if ((dialogue.speech || dialogue.text) && typeof TextToSpeech !== 'undefined') {
                TextToSpeech.speak(dialogue.speech || dialogue.text, {
                    character: dialogue.character
                });
            }
        }

        // Update progress
        document.getElementById('currentStep').textContent = index + 1;
        document.getElementById('totalSteps').textContent = dialogues.length;

        // Highlight element if specified
        if (dialogue.highlight) {
            this.highlightElement(dialogue.highlight);
        } else {
            this.removeHighlight();
        }

        // (Logic moved above to handle video/TTS fork)

        // Play sound
        if (typeof SoundEffects !== 'undefined') {
            SoundEffects.notification();
        }

        // Update character expressions
        this.updateCharacterExpression(dialogue.character, dialogue.expression);
    },

    /**
     * Next dialogue
     */
    nextDialogue() {
        this.currentDialogueIndex++;
        this.showDialogue(this.currentDialogueIndex);
    },

    /**
     * Update character expression
     */
    updateCharacterExpression(characterName, expression) {
        // Reset speaking state
        document.querySelectorAll('.character-wrapper').forEach(el => el.classList.remove('speaking'));

        // Add speaking state to active character
        const container = document.getElementById(`${characterName}Container`);
        if (container) {
            container.classList.add('speaking');
        }
    },

    /**
     * Highlight an element
     */
    highlightElement(selector) {
        this.removeHighlight();

        const element = document.querySelector(selector);
        if (!element) return;

        element.classList.add('dialogue-highlight');
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    },

    /**
     * Remove highlight
     */
    removeHighlight() {
        document.querySelectorAll('.dialogue-highlight').forEach(el => {
            el.classList.remove('dialogue-highlight');
        });
    },

    /**
     * Stop all character videos
     */
    stopVideos() {
        document.querySelectorAll('.character-video').forEach(video => {
            video.pause();
            video.currentTime = 0;
            video.src = ''; // Release resource
        });
        document.querySelectorAll('.character-wrapper').forEach(el => el.classList.remove('has-video'));
    },

    /**
     * End tour and mark as completed
     */
    /**
     * Stop all character videos
     */
    stopVideos() {
        document.querySelectorAll('.character-video').forEach(video => {
            video.pause();
            video.currentTime = 0;
            video.src = ''; // Release resource
        });
        document.querySelectorAll('.character-wrapper').forEach(el => el.classList.remove('has-video'));
    },

    /**
     * End tour and mark as completed
     */
    endTour() {
        // Mark tour as completed so it won't show again
        if (this.currentScene) {
            this.markTourCompleted(this.currentScene);
        }

        this.isActive = false;

        // Hide overlay
        document.getElementById('dialogueOverlay').classList.remove('active');

        // Hide characters
        document.querySelectorAll('.character-wrapper').forEach(el => {
            el.classList.remove('active');
            el.classList.remove('has-video');
        });

        this.stopVideos();
        this.removeHighlight();

        // Stop audio if any
        if (typeof TextToSpeech !== 'undefined') {
            TextToSpeech.stop();
        }

        // Play completion sound
        if (this.currentDialogueIndex > 0 && typeof SoundEffects !== 'undefined') {
            SoundEffects.success();
        }
    },

    /**
     * Start a full-screen video tour
     */
    startVideoTour(videoSrc) {
        // Mark as active so we don't start other tours
        this.isActive = true;
        this.currentScene = 'welcome'; // Track scene for completion marking

        const overlay = document.getElementById('fullscreenVideoOverlay');
        const video = document.getElementById('fullscreenVideo');
        const loader = document.getElementById('videoLoader');

        if (overlay && video) {
            // Optimization: Hide main content to reduce lag
            document.body.classList.add('video-tour-active');

            overlay.classList.add('active');
            document.getElementById('dialogueOverlay').classList.add('active');

            video.src = videoSrc;

            // Show loader while waiting
            if (loader) loader.classList.add('active');

            video.onwaiting = () => {
                if (loader) loader.classList.add('active');
            };

            video.onplaying = () => {
                if (loader) loader.classList.remove('active');
            };

            video.onended = () => {
                this.endVideoTour();
            };

            video.play().catch(e => {
                console.warn('Full screen video play failed:', e);
                this.endVideoTour(); // Close if play fails
            });

            video.onerror = () => {
                console.warn('Full screen video load failed');
                this.endVideoTour(); // Close if load fails
            };
        }
    },

    /**
     * End full-screen video tour
     */
    endVideoTour() {
        const overlay = document.getElementById('fullscreenVideoOverlay');
        const video = document.getElementById('fullscreenVideo');
        const loader = document.getElementById('videoLoader');

        // Restore main content visibility
        document.body.classList.remove('video-tour-active');

        if (overlay && video) {
            video.pause();
            video.currentTime = 0;
            video.src = '';

            // Clear listeners
            video.onwaiting = null;
            video.onplaying = null;
            video.onerror = null;

            overlay.classList.remove('active');
            if (loader) loader.classList.remove('active');
        }

        // Standard cleanup and marking
        this.endTour();
    },

    /**
     * Start tour for current screen (only if first time)
     */
    startTourForCurrentScreen() {
        // Detect which screen is active
        const dashboardScreen = document.getElementById('dashboardScreen');
        const courseScreen = document.getElementById('courseScreen');

        if (dashboardScreen && dashboardScreen.classList.contains('active')) {
            // Only show dashboard tour if not completed
            if (!this.hasCompletedTour('dashboard')) {
                this.startTour('dashboard');
            }
        } else if (courseScreen && courseScreen.classList.contains('active')) {
            if (!this.hasCompletedTour('course')) {
                this.startTour('course');
            }
        } else {
            if (!this.hasCompletedTour('welcome')) {
                this.startTour('welcome');
            }
        }
    },

    /**
     * Add tour button to help menu
     */
    addTourToHelpMenu() {
        // Look for existing help button
        const helpBtn = document.getElementById('helpBtn');
        if (!helpBtn) return;

        // Override help button to show tour menu
        // Remove any existing listeners first by cloning and replacing
        const newHelpBtn = helpBtn.cloneNode(true);
        helpBtn.parentNode.replaceChild(newHelpBtn, helpBtn);

        newHelpBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showTourMenu();
        });
    },

    /**
     * Show tour selection menu
     */
    showTourMenu() {
        const menu = document.createElement('div');
        menu.className = 'tour-menu-overlay';
        menu.innerHTML = `
            <div class="tour-menu">
                <h3>🎓 جولات تعليمية</h3>
                <p style="color: var(--text-secondary); margin-bottom: 20px;">اختر الشرح المناسب لك:</p>
                
                <button class="tour-menu-btn" onclick="DialogueTour.startTour('welcome', true); this.closest('.tour-menu-overlay').remove();">
                    <span>👋</span>
                    <div>
                        <strong>جولة المبتدئين</strong>
                        <small>ابدأ من الصفر</small>
                    </div>
                </button>
                
                <button class="tour-menu-btn" onclick="DialogueTour.startTour('dashboard', true); this.closest('.tour-menu-overlay').remove();">
                    <span>🏠</span>
                    <div>
                        <strong>شرح لوحة التحكم</strong>
                        <small>الدورات والتقدم</small>
                    </div>
                </button>
                
                <button class="tour-menu-btn" onclick="DialogueTour.startTour('tools', true); this.closest('.tour-menu-overlay').remove();">
                    <span>🧰</span>
                    <div>
                        <strong>شرح الأدوات التعليمية</strong>
                        <small>ألعاب وبطاقات وأكثر</small>
                    </div>
                </button>
                
                <button class="tour-menu-btn" onclick="DialogueTour.startTour('features', true); this.closest('.tour-menu-overlay').remove();">
                    <span>✨</span>
                    <div>
                        <strong>شرح المزايا الخاصة</strong>
                        <small>الوضع الليلي والأوسمة</small>
                    </div>
                </button>
                
                <button class="tour-menu-btn" onclick="DialogueTour.startTour('achievements', true); this.closest('.tour-menu-overlay').remove();">
                    <span>🏆</span>
                    <div>
                        <strong>شرح الأوسمة</strong>
                        <small>كيف تحصل عليها</small>
                    </div>
                </button>
                
                <button class="btn btn-secondary" onclick="this.closest('.tour-menu-overlay').remove();" style="margin-top: 20px;">
                    إغلاق
                </button>
            </div>
        `;
        document.body.appendChild(menu);

        // Close on outside click
        menu.addEventListener('click', (e) => {
            if (e.target === menu) {
                menu.remove();
            }
        });
    }
};

// Initialize when DOM is ready
// Now handled by App.js to avoid double initialization
/*
document.addEventListener('DOMContentLoaded', () => {
    DialogueTour.init();

    // Add tour to help menu after a short delay
    setTimeout(() => {
        DialogueTour.addTourToHelpMenu();
    }, 1000);
});
*/
