/**
 * PPE Dress-up Game
 * Interactive gear selection for different work environments
 */

const PPEGame = {
    isActive: false,
    score: 0,
    requiredItems: ['helmet', 'vest', 'gloves', 'boots'],
    selectedItems: [],

    start() {
        this.isActive = true;
        this.score = 0;
        this.selectedItems = [];
        this.renderUI();

        if (typeof DialogueTour !== 'undefined') {
            DialogueTour.startTour('ppeGame');
        }
    },

    renderUI() {
        const overlay = document.createElement('div');
        overlay.id = 'ppeOverlay';
        overlay.className = 'game-overlay';
        overlay.innerHTML = `
            <div class="ppe-container">
                <div class="ppe-header">
                    <h2>👷 لعبة تجهيز معدات الوقاية</h2>
                    <button class="close-game" onclick="PPEGame.close()">✕</button>
                </div>
                <div class="ppe-body">
                    <div class="ppe-sidebar">
                        <h3>المعدات المتاحة</h3>
                        <div class="ppe-items">
                            <div class="ppe-item" draggable="true" ondragstart="PPEGame.drag(event)" id="helmet" data-type="helmet">🪖 خوذة</div>
                            <div class="ppe-item" draggable="true" ondragstart="PPEGame.drag(event)" id="vest" data-type="vest">🦺 سترة</div>
                            <div class="ppe-item" draggable="true" ondragstart="PPEGame.drag(event)" id="gloves" data-type="gloves">🧤 قفازات</div>
                            <div class="ppe-item" draggable="true" ondragstart="PPEGame.drag(event)" id="boots" data-type="boots">🥾 حذاء</div>
                            <div class="ppe-item" draggable="true" ondragstart="PPEGame.drag(event)" id="glasses" data-type="glasses">🥽 نظارات</div>
                        </div>
                    </div>
                    <div class="ppe-main">
                        <div class="character-target" ondrop="PPEGame.drop(event)" ondragover="PPEGame.allowDrop(event)">
                            <div class="character-placeholder">👤</div>
                            <div class="applied-items" id="appliedItems"></div>
                        </div>
                        <p class="instruction">اسحب المعدات المناسبة لموقع البناء وضعها على الشخصية</p>
                    </div>
                </div>
                <div class="ppe-footer">
                    <button class="btn btn-primary" onclick="PPEGame.checkResult()">تأكيد التجهيز</button>
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
        const type = item.dataset.type;

        if (!this.selectedItems.includes(type)) {
            this.selectedItems.push(type);
            const applied = document.getElementById('appliedItems');
            const clone = item.cloneNode(true);
            clone.draggable = false;
            applied.appendChild(clone);
            if (typeof SoundEffects !== 'undefined') SoundEffects.click();
        }
    },

    checkResult() {
        const correctCount = this.requiredItems.filter(item => this.selectedItems.includes(item)).length;
        const wrongCount = this.selectedItems.filter(item => !this.requiredItems.includes(item)).length;

        if (correctCount === this.requiredItems.length && wrongCount === 0) {
            this.complete();
        } else {
            if (typeof SoundEffects !== 'undefined') SoundEffects.wrong();
            alert('التجهيز ناقص أو يحتوي على قطع غير ضرورية! حاول مرة أخرى.');
        }
    },

    complete() {
        const body = document.querySelector('.ppe-body');
        body.innerHTML = `
            <div class="completion-screen">
                <div class="success-icon">🏆</div>
                <h2>أنت جاهز تماماً للعمل بأمان!</h2>
                <p>لقد اخترت جميع معدات الوقاية الشخصية الصحيحة.</p>
                <button class="btn btn-primary" onclick="PPEGame.close()">العودة للدورة</button>
            </div>
        `;
        if (typeof SoundEffects !== 'undefined') SoundEffects.levelUp();
        if (typeof Confetti !== 'undefined') Confetti.celebrate();
    },

    close() {
        const overlay = document.getElementById('ppeOverlay');
        if (overlay) overlay.remove();
        this.isActive = false;
    }
};
