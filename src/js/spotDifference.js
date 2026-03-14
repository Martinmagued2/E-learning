/**
 * Spot the Difference
 * Visual hazard identification challenge
 */

const SpotDifference = {
    isActive: false,
    foundCount: 0,
    totalDifferences: 4,
    completed: false,

    start() {
        this.isActive = true;
        this.foundCount = 0;
        this.completed = false;
        this.renderUI();

        if (typeof DialogueTour !== 'undefined') {
            const isFireCourse = typeof App !== 'undefined' && App.currentCourse && App.currentCourse.id === 'fire-safety';
            if (isFireCourse) {
                setTimeout(() => DialogueTour.startTour('danger', true), 300);
            } else {
                DialogueTour.startTour('spotDifference');
            }
        }
    },

    renderUI() {
        const overlay = document.createElement('div');
        overlay.id = 'spotOverlay';
        overlay.className = 'game-overlay';
        overlay.innerHTML = `
            <div class="spot-container">
                <div class="spot-header" style="display: flex; align-items: center; gap: 15px;">
                    <button class="btn btn-secondary btn-back" onclick="SpotDifference.goBack()" style="font-size: 0.9rem;">
                        <span class="btn-icon">→</span>
                        <span>رجوع</span>
                    </button>
                    <h2 style="margin: 0; flex: 1;">🔍 أوجد الاختلافات: بيئة عمل آمنة vs خطرة</h2>
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
                            <div class="diff-zone" style="top: 46%; left: 26%; width: 14%; height: 18%;" title="صندوق يعيق مسار الخروج" onclick="SpotDifference.found(0, this)"></div>
                            <div class="diff-zone" style="top: 37%; left: 56%; width: 10%; height: 12%;" title="كوب مسكوب على المكتب" onclick="SpotDifference.found(1, this)"></div>
                            <div class="diff-zone" style="top: 55%; left: 61%; width: 14%; height: 18%;" title="درج مفتوح" onclick="SpotDifference.found(2, this)"></div>
                            <div class="diff-zone" style="top: 48%; left: 67%; width: 10%; height: 10%;" title="ورقة بجانب الماوس" onclick="SpotDifference.found(3, this)"></div>
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
        this.completed = true;
        const body = document.getElementById('spotBody');
        body.innerHTML = `
            <div class="completion-screen">
                <div class="success-icon">👀</div>
                <h2>عين خبيرة!</h2>
                <p>لقد اكتشفت جميع المخاطر التي تميز البيئة غير الآمنة.</p>
                <button class="btn btn-primary" onclick="SpotDifference.close()">العودة للدرس ✅</button>
            </div>
        `;
        if (typeof SoundEffects !== 'undefined') SoundEffects.success();
        if (typeof Confetti !== 'undefined') Confetti.celebrate();
    },

    goBack() {
        if (confirm('هل تريد الخروج؟ سيتم فقدان تقدمك.')) {
            this.close();
        }
    },

    close() {
        const overlay = document.getElementById('spotOverlay');
        if (overlay) overlay.remove();
        this.isActive = false;
    }
};
