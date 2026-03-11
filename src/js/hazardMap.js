/**
 * Interactive Hazard Map
 * Site navigation and hazard resolution
 */

const HazardMap = {
    isActive: false,
    resolvedCount: 0,
    totalHazards: 3,
    completed: false,

    start() {
        this.isActive = true;
        this.resolvedCount = 0;
        this.completed = false;
        this.renderUI();

        if (typeof DialogueTour !== 'undefined') {
            DialogueTour.startTour('hazardMap');
        }
    },

    renderUI() {
        const overlay = document.createElement('div');
        overlay.id = 'mapOverlay';
        overlay.className = 'game-overlay';
        overlay.innerHTML = `
            <div class="map-container">
                <div class="map-header" style="display: flex; align-items: center; gap: 15px;">
                    <button class="btn btn-secondary btn-back" onclick="HazardMap.goBack()" style="font-size: 0.9rem;">
                        <span class="btn-icon">→</span>
                        <span>رجوع</span>
                    </button>
                    <h2 style="margin: 0; flex: 1;">🗺️ خريطة مخاطر الموقع</h2>
                    <div class="map-progress">النقاط المؤمنة: <span id="mapCount">0</span>/${this.totalHazards}</div>
                </div>
                <div class="map-body" id="mapBody">
                    <div class="site-map facility-map">
                        <div class="map-point active" id="mapPoint1" style="top: 20%; left: 30%;" onclick="HazardMap.inspect(1, this)">⚠️</div>
                        <div class="map-point active" id="mapPoint2" style="top: 50%; left: 70%;" onclick="HazardMap.inspect(2, this)">⚠️</div>
                        <div class="map-point active" id="mapPoint3" style="top: 80%; left: 40%;" onclick="HazardMap.inspect(3, this)">⚠️</div>
                    </div>
                    <p class="instruction">اضغط على علامات التحذير في الموقع لتأمينها.</p>
                </div>
                <div class="puzzle-modal" id="mapModal" style="display:none;">
                    <div class="modal-content">
                        <h3 id="mapQuestionTitle">فحص السلامة</h3>
                        <p id="mapQuestionText"></p>
                        <div id="mapOptions"></div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    },

    inspect(id, el) {
        if (!el.classList.contains('active')) return;

        let question = '';
        let options = [];
        let correct = 0;

        if (id === 1) {
            question = 'وجدت تسرباً زيتياً في هذا الممر. ماذا تفعل؟';
            options = ['وضع علامة تحذير وتنظيفه فوراً', 'تغطية الزيت بورق مقوى', 'تركه للمنظفين لاحقاً'];
            correct = 0;
        } else if (id === 2) {
            question = 'سلك كهربائي مكشوف بالقرب من منطقة العمل.';
            options = ['عزله وإبلاغ الصيانة', 'تغطيته بشريط لاصق عادي', 'الاستمرار في العمل بحذر'];
            correct = 0;
        } else if (id === 3) {
            question = 'مطفأة الحريق مفقودة من مكانها المخصص.';
            options = ['البحث عنها وإعادتها أو إبلاغ الأمن', 'تجاهل الأمر', 'استخدام دلو ماء بدلاً منها'];
            correct = 0;
        }

        const modal = document.getElementById('mapModal');
        const text = document.getElementById('mapQuestionText');
        const container = document.getElementById('mapOptions');

        text.textContent = question;
        container.innerHTML = options.map((opt, i) => `
            <button class="option-btn" onclick="HazardMap.solve(${i === correct}, ${id})">${opt}</button>
        `).join('');

        modal.style.display = 'flex';
    },

    solve(isCorrect, id) {
        const modal = document.getElementById('mapModal');
        if (isCorrect) {
            if (typeof SoundEffects !== 'undefined') SoundEffects.correct();
            const el = document.getElementById(`mapPoint${id}`);
            if (el) {
                el.classList.remove('active');
                el.classList.add('resolved');
                el.textContent = '✅';
            }
            this.resolvedCount++;
            document.getElementById('mapCount').textContent = this.resolvedCount;

            modal.style.display = 'none';

            if (this.resolvedCount === this.totalHazards) {
                this.complete();
            }
        } else {
            if (typeof SoundEffects !== 'undefined') SoundEffects.wrong();
            alert('خيار غير آمن! فكر في سلامة الجميع.');
        }
    },

    complete() {
        this.completed = true;
        const body = document.getElementById('mapBody');
        body.innerHTML = `
            <div class="completion-screen">
                <div class="success-icon">🛡️</div>
                <h2>الموقع الآن آمن للجميع!</h2>
                <p>لقد نجحت في تأمين جميع النقاط الخطرة في المنشأة.</p>
                <button class="btn btn-primary" onclick="HazardMap.close()">العودة للدرس ✅</button>
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
        const overlay = document.getElementById('mapOverlay');
        if (overlay) overlay.remove();
        this.isActive = false;
    }
};
