/**
 * Safety Escape Room
 * Logic-based puzzles to escape a hazardous room
 */

const EscapeRoom = {
    isActive: false,
    puzzlesSolved: 0,
    solvedIds: new Set(),
    totalPuzzles: 3,
    completed: false,

    start() {
        this.isActive = true;
        this.puzzlesSolved = 0;
        this.solvedIds = new Set();
        this.completed = false;
        this.renderUI();

        if (typeof DialogueTour !== 'undefined') {
            DialogueTour.startTour('escapeRoom');
        }
    },

    renderUI() {
        const overlay = document.createElement('div');
        overlay.id = 'escapeOverlay';
        overlay.className = 'game-overlay';
        overlay.innerHTML = `
            <div class="escape-container">
                <div class="escape-header" style="display: flex; align-items: center; gap: 15px;">
                    <button class="btn btn-secondary btn-back" onclick="EscapeRoom.goBack()" style="font-size: 0.9rem;">
                        <span class="btn-icon">→</span>
                        <span>رجوع</span>
                    </button>
                    <h2 style="margin: 0; flex: 1;">🚪 غرفة الهروب: تحدي السلامة</h2>
                    <div class="puzzle-progress">الألغاز المحلولة: <span id="puzzleCount">0</span>/${this.totalPuzzles}</div>
                </div>
                <div class="escape-body" id="escapeBody">
                    <div class="room-view">
                        <div class="interactive-object" id="puzz1" onclick="EscapeRoom.showPuzzle(1)">🔌</div>
                        <div class="interactive-object" id="puzz2" onclick="EscapeRoom.showPuzzle(2)">🧯</div>
                        <div class="interactive-object" id="puzz3" onclick="EscapeRoom.showPuzzle(3)">📦</div>
                        <div class="exit-door locked" id="exitDoor" onclick="EscapeRoom.tryExit()">🚪</div>
                    </div>
                    <p class="instruction">ابحث في الغرفة عن المخاطر وحل الألغاز لفتح مخرج الطوارئ!</p>
                </div>
                <div class="puzzle-modal" id="puzzleModal" style="display:none;">
                    <div class="modal-content">
                        <h3 id="puzzleTitle"></h3>
                        <p id="puzzleQuestion"></p>
                        <div id="puzzleOptions"></div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    },

    showPuzzle(id) {
        if (this.solvedIds.has(id)) {
            alert('لقد قمت بحل هذا اللغز بالفعل!');
            return;
        }

        const modal = document.getElementById('puzzleModal');
        const title = document.getElementById('puzzleTitle');
        const question = document.getElementById('puzzleQuestion');
        const options = document.getElementById('puzzleOptions');

        modal.style.display = 'flex';

        if (id === 1) {
            title.textContent = 'لغز الكهرباء';
            question.textContent = 'هناك حمل زائد على هذا المأخذ. ماذا تفعل؟';
            this.renderOptions(id, options, ['فصل الأجهزة غير الضرورية', 'توصيل مشترك آخر', 'تجاهل الأمر'], 0);
        } else if (id === 2) {
            title.textContent = 'لغز الحريق';
            question.textContent = 'ما هو الترتيب الصحيح لاستخدام طفاية الحريق (PASS)؟';
            this.renderOptions(id, options, ['اسحب، وجه، اضغط، حرك', 'اضغط، اسحب، وجه، حرك', 'وجه، اسحب، اضغط، حرك'], 0);
        } else if (id === 3) {
            title.textContent = 'لغز الممرات';
            question.textContent = 'هذه الصناديق تسد طريق المخرج. ما هو الإجراء الصحيح؟';
            this.renderOptions(id, options, ['القفز فوقها', 'نقلها إلى مكان تخزين آمن', 'تركها كما هي'], 1);
        }
    },

    renderOptions(id, container, opts, correct) {
        container.innerHTML = opts.map((opt, i) => `
            <button class="option-btn" onclick="EscapeRoom.solvePuzzle(${i === correct}, ${id})">${opt}</button>
        `).join('');
    },

    solvePuzzle(isCorrect, id) {
        const modal = document.getElementById('puzzleModal');
        if (isCorrect) {
            if (typeof SoundEffects !== 'undefined') SoundEffects.correct();

            if (!this.solvedIds.has(id)) {
                this.solvedIds.add(id);
                this.puzzlesSolved++;
                document.getElementById('puzzleCount').textContent = this.puzzlesSolved;

                const obj = document.getElementById(`puzz${id}`);
                if (obj) obj.style.opacity = '0.3';
            }

            modal.style.display = 'none';
            alert('أحسنت! لغز آخر تم حله.');

            if (this.puzzlesSolved === this.totalPuzzles) {
                document.getElementById('exitDoor').classList.remove('locked');
                document.getElementById('exitDoor').classList.add('unlocked');
            }
        } else {
            if (typeof SoundEffects !== 'undefined') SoundEffects.wrong();
            alert('إجابة خاطئة! الموقف قد يصبح أخطر.');
        }
    },

    tryExit() {
        if (this.puzzlesSolved === this.totalPuzzles) {
            this.complete();
        } else {
            alert('الباب مقفل! يجب حل جميع الألغاز أولاً.');
        }
    },

    complete() {
        this.completed = true;
        const body = document.getElementById('escapeBody');
        body.innerHTML = `
            <div class="completion-screen">
                <div class="success-icon">🔓</div>
                <h2>لقد خرجت بأمان!</h2>
                <p>لقد أثبتت وعيك بمخاطر مكان العمل وكيفية التعامل معها.</p>
                <button class="btn btn-primary" onclick="EscapeRoom.close()">العودة للدرس ✅</button>
            </div>
        `;
        if (typeof SoundEffects !== 'undefined') SoundEffects.success();
        if (typeof Confetti !== 'undefined') Confetti.celebrate();
    },

    goBack() {
        if (confirm('هل تريد الخروج من غرفة الهروب؟ سيتم فقدان تقدمك.')) {
            this.close();
        }
    },

    close() {
        const overlay = document.getElementById('escapeOverlay');
        if (overlay) overlay.remove();
        this.isActive = false;
    }
};
