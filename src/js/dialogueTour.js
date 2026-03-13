/**
 * Interactive Dialogue Tutorial System
 * Two characters guide the user through the app with natural conversations
 */

const DialogueTour = {
    isActive: false,
    currentScene: null,
    currentDialogueIndex: 0,
    characters: {},
    currentAudio: null,
    currentAudioSrc: null,

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

        danger: [
            {
                character: 'salem',
                expression: 'explaining',
                text: 'انظري جيداً لهاتين الصورتين. إحداهما بها أخطاء تهدد السلامة.',
                speech: 'انظري جيداً لهاتين الصورتين. إحداهما بها أخطاء تهدد السلامة.',
                audio: 'assets/audio/dialogue/Dangers_0.mp3'
            },
            {
                character: 'nour',
                expression: 'curious',
                text: 'هل يجب أن أجد جميع المخاطر المخفية؟ 🔍',
                speech: 'هل يجب أن أجد جميع المخاطر المخفية؟',
                audio: 'assets/audio/dialogue/Dangers_1.mp3'
            },
            {
                character: 'salem',
                expression: 'happy',
                text: 'نعم، اضغطي على أماكن الخطر في الصورة التي على اليسار.',
                speech: 'نعم، اضغطي على أماكن الخطر في الصورة التي على اليسار.',
                audio: 'assets/audio/dialogue/Dangers_2.mp3'
            },
            {
                character: 'nour',
                expression: 'excited',
                text: 'عيني قوية جداً! سأجد كل ما يهدد السلامة في ثوانٍ! 👀',
                speech: 'عيني قوية جداً! سأجد كل ما يهدد السلامة في ثوانٍ!',
                audio: 'assets/audio/dialogue/Dangers_3.mp3'
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
                speech: 'أخبرني عن الألعاب',
                highlight: '.tools-section'
            },
            {
                character: 'salem',
                expression: 'happy',
                text: 'لديناألعاب كثيرة و مثيرة. بعض منهم في الدروس و هناك المزيد هنا!',
                speech: 'لدينا ألعاب كثيرة',
                highlight: '#openMiniGames'
            },
            {
                character: 'nour',
                expression: 'curious',
                text: 'وماذا عن البطاقات التعليمية؟ 🃏',
                speech: 'وماذا عن البطاقات التعليمية',
                highlight: '#openFlashcards'
            },
            {
                character: 'salem',
                expression: 'explaining',
                text: 'البطاقات تساعدك على المراجعة السريعة. اقلبها لتري الإجابة!',
                speech: 'البطاقات تساعدك على المراجعة السريعة',
                highlight: '#openFlashcards'
            },
            {
                character: 'nour',
                expression: 'happy',
                text: 'وهناك قاموس للمصطلحات أيضاً! 📖',
                speech: 'وهناك قاموس للمصطلحات',
                highlight: '#openGlossary'
            },
            {
                character: 'salem',
                expression: 'happy',
                text: 'صحيح! يحتوي على جميع مصطلحات السلامة بالعربية',
                speech: 'صحيح! يحتوي على جميع مصطلحات السلامة',
                highlight: '#openGlossary'
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



        scenarios: [
            {
                character: 'salem',
                expression: 'explaining',
                text: 'الآن وقت التطبيق العملي! 🛠️',
                speech: 'الآن وقت التطبيق العملي',
                audio: 'assets/audio/dialogue/Fire-Practical_0.mp3'
            },
            {
                character: 'nour',
                expression: 'curious',
                text: 'كيف نلعب هذه اللعبة يا سالم؟ 🤔',
                speech: 'كيف نلعب هذه اللعبة يا سالم',
                audio: 'assets/audio/dialogue/Fire-Practical_1.mp3'
            },
            {
                character: 'salem',
                expression: 'happy',
                text: 'اقرأ الموقف جيداً، ثم اختر التصرف الصحيح من الخيارات 👇',
                speech: 'اقرأ الموقف جيداً، ثم اختر التصرف الصحيح من الخيارات',
                highlight: '.scenario-options',
                audio: 'assets/audio/dialogue/Fire-Practical_2.mp3'
            },
            {
                character: 'nour',
                expression: 'excited',
                text: 'سأركز جيداً لأحصل على النتيجة الكاملة! ⭐',
                speech: 'سأركز جيداً لأحصل على النتيجة الكاملة',
                audio: 'assets/audio/dialogue/Fire-Practical_3.mp3'
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
                text: 'صحيح! لديك 45 ثانية لكل سؤال. العداد هنا ⏳',
                speech: 'صحيح! لديك خمسة وأربعين ثانية لكل سؤال. العداد هنا',
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
                speech: 'هذه اللعبة مختلفة! سنستخدم السحب والإفلات',
                audio: 'assets/audio/dialogue/Drag&Drop_0.mp3'
            },
            {
                character: 'nour',
                expression: 'curious',
                text: 'ماذا علينا أن نفعل؟ 🤔',
                speech: 'ماذا علينا أن نفعل',
                audio: 'assets/audio/dialogue/Drag&Drop_1.mp3'
            },
            {
                character: 'salem',
                expression: 'happy',
                text: 'اسحبي الأداة المناسبة وضعيها على المكان الصحيح في الصورة! 🖱️',
                speech: 'اسحبي الأداة المناسبة وضعيها على المكان الصحيح في الصورة',
                audio: 'assets/audio/dialogue/Drag&Drop_2.mp3'
            },
            {
                character: 'nour',
                expression: 'excited',
                text: 'فهمت! سأختار الأداة الصحيحة لإطفاء الحريق! 🔥❌',
                speech: 'فهمت! سأختار الأداة الصحيحة لإطفاء الحريق',
                audio: 'assets/audio/dialogue/Drag&Drop_3.mp3'
            }
        ],

        emergencySimulator: [
            {
                character: 'salem',
                expression: 'explaining',
                text: 'في حالات الطوارئ الكهربائية، كل ثانية تفرق! هذا المحاكي سيساعدك على التدرب.',
                speech: 'في حالات الطوارئ الكهربائية، كل ثانية تفرق! هذا المحاكي سيساعدك على التدرب.',
                audio: 'assets/audio/dialogue/Ambulance-call_0.mp3'
            },
            {
                character: 'nour',
                expression: 'curious',
                text: 'هل يجب علي الاتصال برقم معين؟ 🤔',
                speech: 'هل يجب علي الاتصال برقم معين؟',
                audio: 'assets/audio/dialogue/Ambulance-call_1.mp3'
            },
            {
                character: 'salem',
                expression: 'happy',
                text: 'نعم، اتصلي برقم الإسعاف الصحيح وتعلمي كيف تتصرفي مع الصدمة الكهربائية!',
                speech: 'نعم، اتصلي برقم الإسعاف الصحيح وتعلمي كيف تتصرفي مع الصدمة الكهربائية!',
                audio: 'assets/audio/dialogue/Ambulance-call_2.mp3'
            },
            {
                character: 'nour',
                expression: 'excited',
                text: 'سأكون سريعة ومنظمة! أهم شيء فصل الكهرباء أولاً! 💪',
                speech: 'سأكون سريعة ومنظمة! أهم شيء فصل الكهرباء أولاً!',
                audio: 'assets/audio/dialogue/Ambulance-call_3.mp3'
            }
        ],

        ppeGame: [
            {
                character: 'salem',
                expression: 'explaining',
                text: 'ارتداء ملابس الوقاية الشخصية هو أول خطوة للحفاظ على سلامتك.',
                speech: 'ارتداء ملابس الوقاية الشخصية هو أول خطوة للحفاظ على سلامتك.',
                audio: 'assets/audio/dialogue/Safety_0.mp3'
            },
            {
                character: 'nour',
                expression: 'curious',
                text: 'هناك الكثير من الأدوات! ماذا أختار لموقع البناء؟ 👷‍♀️',
                speech: 'هناك الكثير من الأدوات! ماذا أختار لموقع البناء؟',
                audio: 'assets/audio/dialogue/Safety_1.mp3'
            },
            {
                character: 'salem',
                expression: 'happy',
                text: 'اسحبي الخوذة والسترة والقفازات المناسبة للشخصية.',
                speech: 'اسحبي الخوذة والسترة والقفازات المناسبة للشخصية.',
                audio: 'assets/audio/dialogue/Safety_2.mp3'
            },
            {
                character: 'nour',
                expression: 'excited',
                text: 'فهمت! السلامة تبدأ بقرار صحيح في اختيار المعدات!',
                speech: 'فهمت! السلامة تبدأ بقرار صحيح في اختيار المعدات!',
                audio: 'assets/audio/dialogue/Safety_3.mp3'
            }
        ],

        escapeRoom: [
            {
                character: 'salem',
                expression: 'explaining',
                text: 'تخيلي أنك في غرفة ويجب عليك الخروج بأمان باتباع تعليمات السلامة.',
                speech: 'تخيلي أنك في غرفة ويجب عليك الخروج بأمان باتباع تعليمات السلامة.',
                audio: 'assets/audio/dialogue/Escape_0.mp3'
            },
            {
                character: 'nour',
                expression: 'curious',
                text: 'هل يجب علي البحث عن مفاتيح؟ 🔑',
                speech: 'هل يجب علي البحث عن مفاتيح؟',
                audio: 'assets/audio/dialogue/Escape_1.mp3'
            },
            {
                character: 'salem',
                expression: 'happy',
                text: 'المفاتيح هي معرفتك! ابحثي عن المخاطر وحلي الألغاز لتفتحي الباب.',
                speech: 'المفاتيح هي معرفتك! ابحثي عن المخاطر وحلي الألغاز لتفتحي الباب.',
                audio: 'assets/audio/dialogue/Escape_2.mp3'
            },
            {
                character: 'nour',
                expression: 'excited',
                text: 'تحدي رائع! سأستخدم ذكائي ومعلوماتي لأخرج بسلام! ✨',
                speech: 'تحدي رائع! سأستخدم ذكائي ومعلوماتي لأخرج بسلام!',
                audio: 'assets/audio/dialogue/Escape_3.mp3'
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
                speech: 'هذه خريطة للموقع. هناك عدة نقاط تحتاج لفحصك.',
                audio: 'assets/audio/dialogue/Map_0.mp3'
            },
            {
                character: 'nour',
                expression: 'curious',
                text: 'كيف أتحرك في الخريطة؟ 🗺️',
                speech: 'كيف أتحرك في الخريطة؟',
                audio: 'assets/audio/dialogue/Map_1.mp3'
            },
            {
                character: 'salem',
                expression: 'happy',
                text: 'اضغطي على الأيقونات الحمراء، واقرئي الموقف، ثم حلي المشكلة.',
                speech: 'اضغطي على الأيقونات الحمراء، واقرئي الموقف، ثم حلي المشكلة.',
                audio: 'assets/audio/dialogue/Map_2.mp3'
            },
            {
                character: 'nour',
                expression: 'excited',
                text: 'سأجعل هذا الموقع مكاناً آمناً للجميع! 🛡️',
                speech: 'سأجعل هذا الموقع مكاناً آمناً للجميع!',
                audio: 'assets/audio/dialogue/Map_3.mp3'
            }
        ],

        safetyArcade: [
            {
                character: 'salem',
                expression: 'explaining',
                text: 'مرحباً بك في تحدي إشارات المرور! هيا نختبر معرفتك بقواعد الطريق.',
                speech: 'مرحباً بك في تحدي إشارات المرور! هيا نختبر معرفتك بقواعد الطريق.',
                audio: 'assets/audio/dialogue/Traffic-Light_0.mp3'
            },
            {
                character: 'nour',
                expression: 'curious',
                text: 'ما هي قواعد اللعبة؟ 🚦',
                speech: 'ما هي قواعد اللعبة؟',
                audio: 'assets/audio/dialogue/Traffic-Light_1.mp3'
            },
            {
                character: 'salem',
                expression: 'happy',
                text: 'ستظهر لك إشارات مرور وأسئلة عن السلامة في الشارع. اختاري الإجابة الصحيحة!',
                speech: 'ستظهر لك إشارات مرور وأسئلة عن السلامة في الشارع. اختاري الإجابة الصحيحة!',
                audio: 'assets/audio/dialogue/Traffic-Light_2.mp3'
            },
            {
                character: 'nour',
                expression: 'excited',
                text: 'هيا بنا! سأثبت أنني خبيرة مرور! 🚀',
                speech: 'هيا بنا! سأثبت أنني خبيرة مرور!',
                audio: 'assets/audio/dialogue/Traffic-Light_3.mp3'
            }
        ],

        spotHazard: [
            {
                character: 'salem',
                expression: 'explaining',
                text: 'في هذه اللعبة، يجب أن تكون قوة ملاحظتك عالية لاكتشاف الأخطار! 👀',
                speech: 'في هذه اللعبة، يجب أن تكون قوة ملاحظتك عالية لاكتشاف الأخطار!'
            },
            {
                character: 'nour',
                expression: 'curious',
                text: 'كيف ألعب؟ وما المطلوب مني؟ 🤔',
                speech: 'كيف ألعب؟ وما المطلوب مني؟'
            },
            {
                character: 'salem',
                expression: 'happy',
                text: 'ابحث في الصورة واضغط على أي شيء تعتقد أنه يشكل خطراً! ⚠️',
                speech: 'ابحث في الصورة واضغط على أي شيء تعتقد أنه يشكل خطراً!'
            },
            {
                character: 'nour',
                expression: 'excited',
                text: 'حسناً! لن يفوتني أي خطأ! 🔍',
                speech: 'حسناً! لن يفوتني أي خطأ!'
            }
        ],

        matching: [
            {
                character: 'salem',
                expression: 'explaining',
                text: 'لعبة المطابقة تختبر ذاكرتك ومعرفتك بأدوات السلامة! 🃏',
                speech: 'لعبة المطابقة تختبر ذاكرتك ومعرفتك بأدوات السلامة!'
            },
            {
                character: 'nour',
                expression: 'curious',
                text: 'كيف يمكنني الفوز؟ 🏆',
                speech: 'كيف يمكنني الفوز؟'
            },
            {
                character: 'salem',
                expression: 'happy',
                text: 'اقلب البطاقات وحاول إيجاد كل زوج متشابه بأسرع وقت! ✨',
                speech: 'اقلب البطاقات وحاول إيجاد كل زوج متشابه بأسرع وقت!'
            },
            {
                character: 'nour',
                expression: 'excited',
                text: 'ذاكرتي قوية جداً! سأجمعهم كلهم! 🧠',
                speech: 'ذاكرتي قوية جداً! سأجمعهم كلهم!'
            }
        ],

        sorting: [
            {
                character: 'salem',
                expression: 'explaining',
                text: 'في لعبة فرز السلامة، يجب أن تكون سريعاً ومنظماً! 📦',
                speech: 'في لعبة فرز السلامة، يجب أن تكون سريعاً ومنظماً!'
            },
            {
                character: 'nour',
                expression: 'curious',
                text: 'ما الذي يجب علي ترتيبه؟ 🤔',
                speech: 'ما الذي يجب علي ترتيبه؟'
            },
            {
                character: 'salem',
                expression: 'happy',
                text: 'اسحب كل عنصر وضعه في الصندوق أو الفئة الصحيحة الخاصة به! 🖱️',
                speech: 'اسحب كل عنصر وضعه في الصندوق أو الفئة الصحيحة الخاصة به!'
            },
            {
                character: 'nour',
                expression: 'excited',
                text: 'جميل! الترتيب الصحيح يمنع الحوادث! هيا بنا! 🚀',
                speech: 'جميل! الترتيب الصحيح يمنع الحوادث! هيا بنا!'
            }
        ],

        certificate: [
            {
                character: 'salem',
                expression: 'happy',
                text: 'مبروك! لقد حصلت على شهادتك. هذا دليل على تفوقك في السلامة.',
                speech: 'مبروك! لقد حصلت على شهادتك. هذا دليل على تفوقك في السلامة.',
                highlight: '.certificate-paper',
                audio: 'assets/audio/dialogue/Fire-Certificate_0.mp3'
            },
            {
                character: 'nour',
                expression: 'excited',
                text: 'يا لها من شهادة جميلة! هل يمكنني الاحتفاظ بها؟ 📜',
                speech: 'يا لها من شهادة جميلة! هل يمكنني الاحتفاظ بها؟',
                audio: 'assets/audio/dialogue/Fire-Certificate_1.mp3'
            },
            {
                character: 'salem',
                expression: 'explaining',
                text: 'بالتأكيد! يمكنك الضغط على زر التحميل لحفظها كملف PDF.',
                speech: 'بالتأكيد! يمكنك الضغط على زر التحميل لحفظها كملف PDF.',
                highlight: '#printCertificate',
                audio: 'assets/audio/dialogue/Fire-Certificate_2.mp3'
            },
            {
                character: 'nour',
                expression: 'happy',
                text: 'رائع! سأعرضها على أصدقائي وعائلتي! ✨',
                speech: 'رائع! سأعرضها على أصدقائي وعائلتي!',
                audio: 'assets/audio/dialogue/Fire-Certificate_3.mp3'
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
                <button class="btn btn-secondary" id="skipTour" style="display: none;">تخطي الشرح</button>
                <div class="dialogue-progress" id="dialogueProgress">
                    <span id="totalSteps">5</span> / <span id="currentStep">1</span>
                </div>
                <button class="btn btn-primary tour-btn-next" id="nextDialogue" style="display: none;">
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

        // Preload audio files for this tour
        const dialogueSteps = this.dialogues[tourName];
        if (dialogueSteps) {
            dialogueSteps.forEach((step, index) => {
                const audioSrc = step.audio || `assets/audio/dialogue/${tourName}_${index}.m4a`;
                const audio = new Audio();
                audio.src = audioSrc;
            });
        }

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
                    // Fallback to Audio if video fails
                    characterContainer.classList.remove('has-video');
                    const audioSrc = dialogue.audio || `assets/audio/dialogue/${this.currentScene}_${index}.m4a`;
                    this.playAudio(audioSrc);
                });

                // Handle video load error (e.g. file not found)
                videoEl.onerror = () => {
                    console.warn(`Video file not found: ${dialogue.video}`);
                    characterContainer.classList.remove('has-video');
                    // Fallback to Audio
                    const audioSrc = dialogue.audio || `assets/audio/dialogue/${this.currentScene}_${index}.m4a`;
                    this.playAudio(audioSrc);
                };
            }

        } else {
            // mode: IMAGE + TTS (Existing Logic)
            characterContainer.classList.remove('has-video');

            // Play audio
            const audioSrc = dialogue.audio || `assets/audio/dialogue/${this.currentScene}_${index}.m4a`;
            this.playAudio(audioSrc, true);
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
     * Play recorded audio file for dialogue
     */
    playAudio(src, autoAdvance = false) {
        if (this.currentAudioSrc === src && this.currentAudio && !this.currentAudio.paused) {
            // Already playing this exact audio, don't restart it
            return;
        }

        this.stopAudio();

        this.currentAudioSrc = src;
        this.currentAudio = new Audio(src);

        if (autoAdvance) {
            this.currentAudio.onended = () => {
                this.nextDialogue();
            };
        }

        this.currentAudio.play().catch(e => {
            console.warn(`Audio file not found or play failed for ${src}:`, e);
            // If audio fails to play, still auto-advance after a delay so the tour doesn't get stuck
            if (autoAdvance) {
                setTimeout(() => this.nextDialogue(), 3000); // Wait 3 seconds then advance
            }
        });
    },

    /**
     * Stop current playing audio
     */
    stopAudio() {
        if (this.currentAudio) {
            this.currentAudio.onended = null; // Prevent auto-advance from triggering on stop
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.currentAudio = null;
            this.currentAudioSrc = null;
        }
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
        this.stopAudio();

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
                <h3>� جولات الشرح الصوتي</h3>
                <p style="color: var(--text-secondary); margin-bottom: 20px;">اختر الشرح المناسب لك:</p>
                
                <div class="tour-menu-scroll" style="max-height: 450px; overflow-y: auto; padding-right: 10px;">
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

                    <button class="tour-menu-btn" onclick="DialogueTour.startTour('course', true); this.closest('.tour-menu-overlay').remove();">
                        <span>📚</span>
                        <div>
                            <strong>شرح صفحة الدورة</strong>
                            <small>كيفية تصفح الدورات</small>
                        </div>
                    </button>



                    <button class="tour-menu-btn" onclick="DialogueTour.startTour('scenarios', true); this.closest('.tour-menu-overlay').remove();">
                        <span>🛠️</span>
                        <div>
                            <strong>التطبيق العملي</strong>
                            <small>كيفية حل السيناريوهات</small>
                        </div>
                    </button>

                    <button class="tour-menu-btn" onclick="DialogueTour.startTour('quiz', true); this.closest('.tour-menu-overlay').remove();">
                        <span>📝</span>
                        <div>
                            <strong>الاختبار النهائي</strong>
                            <small>شرح طريقة الاختبار</small>
                        </div>
                    </button>
                    
                    <button class="tour-menu-btn" onclick="DialogueTour.startTour('tools', true); this.closest('.tour-menu-overlay').remove();">
                        <span>🧰</span>
                        <div>
                            <strong>شرح الأدوات التعليمية</strong>
                            <small>ألعاب وبطاقات وأكثر</small>
                        </div>
                    </button>

                    <button class="tour-menu-btn" onclick="DialogueTour.startTour('dragdrop', true); this.closest('.tour-menu-overlay').remove();">
                        <span>🖱️</span>
                        <div>
                            <strong>لعبة السحب والإفلات</strong>
                            <small>شرح طريقة اللعب</small>
                        </div>
                    </button>

                    <button class="tour-menu-btn" onclick="DialogueTour.startTour('spotHazard', true); this.closest('.tour-menu-overlay').remove();">
                        <span>🔍</span>
                        <div>
                            <strong>لعبة اكتشف الخطر</strong>
                            <small>شرح طريقة اللعب</small>
                        </div>
                    </button>

                    <button class="tour-menu-btn" onclick="DialogueTour.startTour('matching', true); this.closest('.tour-menu-overlay').remove();">
                        <span>🃏</span>
                        <div>
                            <strong>لعبة المطابقة</strong>
                            <small>شرح طريقة اللعب</small>
                        </div>
                    </button>

                    <button class="tour-menu-btn" onclick="DialogueTour.startTour('sorting', true); this.closest('.tour-menu-overlay').remove();">
                        <span>📦</span>
                        <div>
                            <strong>لعبة فرز السلامة</strong>
                            <small>شرح طريقة اللعب</small>
                        </div>
                    </button>

                    <button class="tour-menu-btn" onclick="DialogueTour.startTour('emergencySimulator', true); this.closest('.tour-menu-overlay').remove();">
                        <span>🚑</span>
                        <div>
                            <strong>محاكي الطوارئ</strong>
                            <small>كيف تتصرف في الخطر</small>
                        </div>
                    </button>

                    <button class="tour-menu-btn" onclick="DialogueTour.startTour('ppeGame', true); this.closest('.tour-menu-overlay').remove();">
                        <span>👷‍♀️</span>
                        <div>
                            <strong>لعبة معدات الوقاية</strong>
                            <small>شرح طريقة اللعب</small>
                        </div>
                    </button>

                    <button class="tour-menu-btn" onclick="DialogueTour.startTour('escapeRoom', true); this.closest('.tour-menu-overlay').remove();">
                        <span>🔑</span>
                        <div>
                            <strong>غرفة الهروب</strong>
                            <small>كيف تحل الألغاز</small>
                        </div>
                    </button>

                    <button class="tour-menu-btn" onclick="DialogueTour.startTour('spotDifference', true); this.closest('.tour-menu-overlay').remove();">
                        <span>🔍</span>
                        <div>
                            <strong>لعبة اكتشف الخطأ</strong>
                            <small>شرح طريقة اللعب</small>
                        </div>
                    </button>

                    <button class="tour-menu-btn" onclick="DialogueTour.startTour('hazardMap', true); this.closest('.tour-menu-overlay').remove();">
                        <span>🗺️</span>
                        <div>
                            <strong>خريطة المخاطر</strong>
                            <small>شرح طريقة اللعب</small>
                        </div>
                    </button>

                    <button class="tour-menu-btn" onclick="DialogueTour.startTour('safetyArcade', true); this.closest('.tour-menu-overlay').remove();">
                        <span>🚦</span>
                        <div>
                            <strong>تحدي إشارات المرور</strong>
                            <small>شرح طريقة اللعب</small>
                        </div>
                    </button>
                    
                    <button class="tour-menu-btn" onclick="DialogueTour.startTour('features', true); this.closest('.tour-menu-overlay').remove();">
                        <span>✨</span>
                        <div>
                            <strong>شرح المزايا الخاصة</strong>
                            <small>الوضع الليلي وأخرى</small>
                        </div>
                    </button>
                    
                    <button class="tour-menu-btn" onclick="DialogueTour.startTour('achievements', true); this.closest('.tour-menu-overlay').remove();">
                        <span>🏆</span>
                        <div>
                            <strong>شرح الأوسمة</strong>
                            <small>كيف تحصل عليها</small>
                        </div>
                    </button>

                    <button class="tour-menu-btn" onclick="DialogueTour.startTour('certificate', true); this.closest('.tour-menu-overlay').remove();">
                        <span>📜</span>
                        <div>
                            <strong>شرح الشهادة</strong>
                            <small>كيف تستخرجها</small>
                        </div>
                    </button>
                </div>
                
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
