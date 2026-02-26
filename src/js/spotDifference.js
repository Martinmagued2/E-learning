/**
 * Spot the Difference
 * Visual hazard identification challenge
 */

const SpotDifference = {
    isActive: false,
    foundCount: 0,
    totalDifferences: 4,

    start() {
        this.isActive = true;
        this.foundCount = 0;
        this.renderUI();

        if (typeof DialogueTour !== 'undefined') {
            DialogueTour.startTour('spotDifference');
        }
    },

    renderUI() {
        const overlay = document.createElement('div');
        overlay.id = 'spotOverlay';
        overlay.className = 'game-overlay';
        overlay.innerHTML = `
            <div class="spot-container">
                <div class="spot-header">
                    <h2>🔍 أوجد الاختلافات: بيئة عمل آمنة vs خطرة</h2>
                    <div class="spot-progress">المخاطر المكتشفة: <span id="spotCount">0</span>/${this.totalDifferences}</div>
                </div>
                <div class="spot-body" id="spotBody">
                    <div class="spot-images">
                        <div class="image-wrapper safe">
                            <h3>آمن ✅</h3>
                            <img src="assets/images/spot_safe.png">
                        </div>
                        <div class="image-wrapper dangerous" id="diffImage">
                            <h3>خطر ❌</h3>
                            <img src="assets/images/spot_hazard.png">
                            <div class="diff-zone" style="top: 35%; left: 22%;" onclick="SpotDifference.found(0, this)"></div>
                            <div class="diff-zone" style="top: 78%; left: 38%; width: 25%;" onclick="SpotDifference.found(1, this)"></div>
                            <div class="diff-zone" style="top: 25%; left: 67%;" onclick="SpotDifference.found(2, this)"></div>
                            <div class="diff-zone" style="top: 58%; left: 53%;" onclick="SpotDifference.found(3, this)"></div>
                        </div>
                    </div>
                    <p class="instruction">اضغط على المخاطر الموجودة في الصورة اليمنى والتي تجعلها مختلفة عن البيئة الآمنة.</p>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    },

    found(index, el) {
        if (el.classList.contains('found')) return;

        el.classList.add('found');
        this.foundCount++;
        document.getElementById('spotCount').textContent = this.foundCount;
        if (typeof SoundEffects !== 'undefined') SoundEffects.correct();

        if (this.foundCount === this.totalDifferences) {
            this.complete();
        }
    },

    complete() {
        const body = document.getElementById('spotBody');
        body.innerHTML = `
            <div class="completion-screen">
                <div class="success-icon">👀</div>
                <h2>عين خبيرة!</h2>
                <p>لقد اكتشفت جميع المخاطر التي تميز البيئة غير الآمنة.</p>
                <button class="btn btn-primary" onclick="SpotDifference.close()">إغلاق</button>
            </div>
        `;
        if (typeof SoundEffects !== 'undefined') SoundEffects.success();
        if (typeof Confetti !== 'undefined') Confetti.celebrate();
    },

    close() {
        const overlay = document.getElementById('spotOverlay');
        if (overlay) overlay.remove();
        this.isActive = false;
    }
};
