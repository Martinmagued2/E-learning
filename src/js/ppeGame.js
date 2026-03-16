/**
 * PPE Dress-up Game
 * Interactive gear selection for different work environments
 * With clear correct/incorrect validation
 */

const PPEGame = {
    isActive: false,
    score: 0,
    completed: false,
    // The required items for the construction site scenario
    requiredItems: ['helmet', 'vest', 'gloves', 'boots'],
    // Items that should NOT be selected (distractors)
    wrongItems: ['glasses'],
    selectedItems: [],

    start() {
        this.isActive = true;
        this.score = 0;
        this.selectedItems = [];
        this.completed = false;
        this.renderUI();

        if (typeof DialogueTour !== 'undefined') {
            DialogueTour.startTour('ppeGame', true);
        }
    },

    renderUI() {
        const overlay = document.createElement('div');
        overlay.id = 'ppeOverlay';
        overlay.className = 'game-overlay';
        overlay.innerHTML = `
            <div class="ppe-container">
                <div class="ppe-header" style="display: flex; align-items: center; gap: 15px;">
                    <button class="btn btn-secondary btn-back" onclick="PPEGame.goBack()" style="font-size: 0.9rem;">
                        <span class="btn-icon">→</span>
                        <span>رجوع</span>
                    </button>
                    <h2 style="margin: 0; flex: 1;">👷 لعبة تجهيز معدات الوقاية</h2>
                    <button class="close-game" onclick="PPEGame.goBack()">✕</button>
                </div>
                <div class="ppe-body">
                    <div class="ppe-sidebar">
                        <h3>المعدات المتاحة</h3>
                        <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 10px;">
                            اختر المعدات المناسبة لموقع البناء فقط
                        </p>
                        <div class="ppe-items">
                            <div class="ppe-item" draggable="true" ondragstart="PPEGame.drag(event)" id="helmet" data-type="helmet">🪖 خوذة سلامة</div>
                            <div class="ppe-item" draggable="true" ondragstart="PPEGame.drag(event)" id="vest" data-type="vest">🦺 سترة عاكسة</div>
                            <div class="ppe-item" draggable="true" ondragstart="PPEGame.drag(event)" id="gloves" data-type="gloves">🧤 قفازات واقية</div>
                            <div class="ppe-item" draggable="true" ondragstart="PPEGame.drag(event)" id="boots" data-type="boots">🥾 حذاء سلامة</div>
                            <div class="ppe-item" draggable="true" ondragstart="PPEGame.drag(event)" id="glasses" data-type="glasses">🥽 نظارات سباحة</div>
                        </div>
                        <div class="ppe-hint" style="margin-top: 15px; padding: 10px; border-radius: 8px; background: rgba(255,193,7,0.1); border: 1px solid rgba(255,193,7,0.3);">
                            <p style="margin: 0; font-size: 0.85rem;">💡 <strong>تلميح:</strong> عامل البناء يحتاج 4 قطع أساسية: حماية الرأس، الجسم، اليدين، والقدمين.</p>
                        </div>
                    </div>
                    <div class="ppe-main">
                        <div class="character-target" ondrop="PPEGame.drop(event)" ondragover="PPEGame.allowDrop(event)">
                            <img src="assets/images/ppe_character.png" class="base-character">
                            <div class="applied-items" id="appliedItems"></div>
                        </div>
                        <p class="instruction">اسحب المعدات المناسبة لموقع البناء وضعها على الشخصية</p>
                        <div id="ppeValidation" style="margin-top: 10px; min-height: 24px;"></div>
                    </div>
                </div>
                <div class="ppe-footer" style="display: flex; gap: 10px; justify-content: center;">
                    <button class="btn btn-secondary" onclick="PPEGame.resetSelection()">🔄 إعادة التحديد</button>
                    <button class="btn btn-primary" onclick="PPEGame.checkResult()">تأكيد التجهيز ✅</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    },

    allowDrop(ev) {
        ev.preventDefault();
    },

    drag(ev) {
        ev.dataTransfer.setData("text", ev.target.id);
    },

    drop(ev) {
        ev.preventDefault();
        const data = ev.dataTransfer.getData("text");
        const item = document.getElementById(data);
        if (!item) return;
        const type = item.dataset.type;

        if (!this.selectedItems.includes(type)) {
            this.selectedItems.push(type);
            const applied = document.getElementById('appliedItems');
            const clone = item.cloneNode(true);
            clone.draggable = false;
            clone.style.cursor = 'pointer';
            clone.setAttribute('data-type', type);
            clone.onclick = () => this.removeItem(type, clone);
            applied.appendChild(clone);
            item.style.opacity = '0.4';
            if (typeof SoundEffects !== 'undefined') SoundEffects.click();
            this.updateValidation();
        }
    },

    removeItem(type, element) {
        this.selectedItems = this.selectedItems.filter(t => t !== type);
        element.remove();
        const originalItem = document.getElementById(type);
        if (originalItem) originalItem.style.opacity = '1';
        if (typeof SoundEffects !== 'undefined') SoundEffects.click();
        this.updateValidation();
    },

    resetSelection() {
        this.selectedItems = [];
        const applied = document.getElementById('appliedItems');
        if (applied) applied.innerHTML = '';
        // Reset opacity
        ['helmet', 'vest', 'gloves', 'boots', 'glasses'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.opacity = '1';
        });
        this.updateValidation();
    },

    updateValidation() {
        const validationEl = document.getElementById('ppeValidation');
        if (!validationEl) return;

        const selectedCount = this.selectedItems.length;
        const correctCount = this.requiredItems.filter(item => this.selectedItems.includes(item)).length;
        const wrongCount = this.selectedItems.filter(item => !this.requiredItems.includes(item)).length;

        if (selectedCount === 0) {
            validationEl.innerHTML = '';
            return;
        }

        let msg = `<span style="font-size: 0.85rem;">تم اختيار ${selectedCount} قطع | `;
        if (wrongCount > 0) {
            msg += `⚠️ ${wrongCount} قطعة غير مناسبة`;
        } else {
            msg += `✅ ${correctCount}/${this.requiredItems.length} قطع صحيحة`;
        }
        msg += '</span>';
        validationEl.innerHTML = msg;
    },

    checkResult() {
        const correctCount = this.requiredItems.filter(item => this.selectedItems.includes(item)).length;
        const wrongCount = this.selectedItems.filter(item => !this.requiredItems.includes(item)).length;

        if (correctCount === this.requiredItems.length && wrongCount === 0) {
            this.complete();
        } else {
            if (typeof SoundEffects !== 'undefined') SoundEffects.wrong();
            let feedback = '';
            if (wrongCount > 0) {
                feedback = '⚠️ يوجد قطع غير مناسبة لموقع البناء! نظارات السباحة ليست من معدات البناء.';
            } else if (correctCount < this.requiredItems.length) {
                const missing = this.requiredItems.length - correctCount;
                feedback = `📋 ينقصك ${missing} قطعة. عامل البناء يحتاج: خوذة، سترة عاكسة، قفازات، وحذاء سلامة.`;
            }
            alert(feedback + '\n\nحاول مرة أخرى!');
        }
    },

    complete() {
        this.completed = true;
        const body = document.querySelector('.ppe-body');
        body.innerHTML = `
            <div class="completion-screen" style="text-align: center; padding: 30px;">
                <div class="success-icon" style="font-size: 4rem;">🏆</div>
                <h2>أنت جاهز تماماً للعمل بأمان!</h2>
                <p>لقد اخترت جميع معدات الوقاية الشخصية الصحيحة:</p>
                <div style="display: flex; justify-content: center; gap: 15px; margin: 15px 0; font-size: 1.5rem;">
                    <span title="خوذة سلامة">🪖</span>
                    <span title="سترة عاكسة">🦺</span>
                    <span title="قفازات واقية">🧤</span>
                    <span title="حذاء سلامة">🥾</span>
                </div>
                <p style="color: var(--text-muted);">هذه المعدات الأربعة ضرورية لحماية الرأس والجسم واليدين والقدمين في موقع البناء.</p>
                <button class="btn btn-primary" onclick="PPEGame.close()" style="margin-top: 15px;">العودة للدورة ✅</button>
            </div>
        `;
        if (typeof SoundEffects !== 'undefined') SoundEffects.levelUp();
        if (typeof Confetti !== 'undefined') Confetti.celebrate();
    },

    goBack() {
        if (confirm('هل تريد الخروج من اللعبة؟')) {
            this.close();
        }
    },

    close() {
        const overlay = document.getElementById('ppeOverlay');
        if (overlay) overlay.remove();
        this.isActive = false;
    }
};
