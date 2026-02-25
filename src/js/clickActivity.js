/**
 * Click to Identify Interactive Activity Module
 * Handles scenarios where students must click specific items in an image
 */

const ClickActivity = {
    currentActivity: null,
    foundTargets: [],
    totalTargets: 0,
    debugMode: true, // Log coordinates to console for easier setup

    /**
     * Start a click-identify activity
     */
    start(activity) {
        this.currentActivity = activity;
        this.foundTargets = [];
        this.totalTargets = activity.targets.length;

        // Render activity
        this.render();
    },

    /**
     * Render the activity
     */
    render() {
        const scenariosMain = document.getElementById('scenariosMain');
        if (!scenariosMain) return;

        const activity = this.currentActivity;

        const activityHTML = `
            <div class="click-activity">
                <h2 class="scenario-title">${activity.title}</h2>
                <p class="scenario-description">${activity.description}</p>
                
                <div class="click-instruction">
                    <span class="instruction-icon">👆</span>
                    <span>اضغط على العناصر المطلوبة في الصورة:</span>
                    ${!activity.hideTargets ? `
                    <div class="targets-list">
                        ${activity.targets.map(t => `<span class="target-badge" id="badge-${t.id}">${t.name}</span>`).join('')}
                    </div>` : '<p class="hint-text">(ابحث عنها بنفسك!)</p>'}
                </div>

                <!-- Scene Container -->
                <div class="click-scene-container" id="clickScene">
                    <img src="${activity.sceneImage}" alt="المشهد" class="click-scene-image" draggable="false">
                    
                    <!-- Markers Container -->
                    <div id="clickMarkers" class="click-markers"></div>
                </div>

                <!-- Feedback Area -->
                <div id="clickFeedback" class="scenario-feedback hidden"></div>

                <!-- Progress -->
                <div class="click-progress">
                    <span id="clickScore">0 / ${this.totalTargets}</span>
                    <span>عناصر مكتشفة</span>
                </div>
            </div>
        `;

        scenariosMain.innerHTML = activityHTML;

        // Add CSS for this activity if not already present
        this.addStyles();

        // Setup click handler
        const scene = document.getElementById('clickScene');
        scene.addEventListener('click', (e) => this.handleClick(e));
    },

    /**
     * Handle click on the scene
     */
    handleClick(e) {
        const scene = document.getElementById('clickScene');
        const rect = scene.getBoundingClientRect();

        // Calculate percentage coordinates
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        if (this.debugMode) {
            console.log(`Click Coords: "x": ${x.toFixed(1)}, "y": ${y.toFixed(1)}`);
        }

        // Check if clicked any target
        let hit = false;

        this.currentActivity.targets.forEach(target => {
            if (this.foundTargets.includes(target.id)) return; // Already found

            // Check if click is within target bounds (simple box check)
            // Target should have x, y, width, height (all in %)
            if (x >= target.x && x <= target.x + target.width &&
                y >= target.y && y <= target.y + target.height) {

                this.handleCorrectClick(target, x, y);
                hit = true;
            }
        });

        if (!hit) {
            this.handleIncorrectClick(x, y);
        }
    },

    /**
     * Handle valid target click
     */
    handleCorrectClick(target, x, y) {
        this.foundTargets.push(target.id);

        // Show marker
        this.showMarker(x, y, 'correct');

        // Update badge
        const badge = document.getElementById(`badge-${target.id}`);
        if (badge) badge.classList.add('found');

        // Update score
        document.getElementById('clickScore').textContent = `${this.foundTargets.length} / ${this.totalTargets}`;

        // Show feedback
        this.showFeedback(true, target.correctFeedback || `ممتاز! وجدت ${target.name}`);

        // Check completion
        if (this.foundTargets.length === this.totalTargets) {
            setTimeout(() => this.showCompletion(), 1500);
        }
    },

    /**
     * Handle empty click
     */
    handleIncorrectClick(x, y) {
        this.showMarker(x, y, 'incorrect');
        this.showFeedback(false, 'حاول مرة أخرى! ابحث عن العناصر المطلوبة.');
    },

    /**
     * Show visual marker at click position
     */
    showMarker(x, y, type) {
        const markers = document.getElementById('clickMarkers');
        const marker = document.createElement('div');
        marker.className = `click-marker ${type}`;
        marker.style.left = `${x}%`;
        marker.style.top = `${y}%`;
        marker.innerHTML = type === 'correct' ? '✅' : '❌';

        markers.appendChild(marker);

        if (type === 'incorrect') {
            setTimeout(() => marker.remove(), 1000);
        }
    },

    /**
     * Show text feedback
     */
    showFeedback(isCorrect, message) {
        const feedback = document.getElementById('clickFeedback');
        feedback.className = `scenario-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
        feedback.innerHTML = `
            <div class="feedback-icon">${isCorrect ? '🎉' : '⚠️'}</div>
            <div class="feedback-content"><p>${message}</p></div>
        `;
        feedback.classList.remove('hidden');
    },

    /**
     * Show completion screen
     */
    showCompletion() {
        const scenariosMain = document.getElementById('scenariosMain');
        scenariosMain.innerHTML = `
            <div class="scenario-results">
                <div class="scenario-score">100%</div>
                <h2>🎉 رائع! وجدت كل العناصر</h2>
                <p>قوة ملاحظة ممتازة! 💪</p>
                <div class="scenario-next-steps">
                    <button class="btn btn-primary btn-large" onclick="App.startCourseQuiz('${this.currentActivity.courseId}')">
                        <span class="btn-icon">📝</span>
                        <span>ابدأ الاختبار</span>
                    </button>
                    <button class="btn btn-secondary mt-md" onclick="App.showScreen('dashboardScreen'); App.loadDashboard();">
                        <span class="btn-icon">←</span>
                        <span>العودة للوحة التحكم</span>
                    </button>
                </div>
            </div>
        `;

        // Save completion
        if (this.currentActivity.courseId) {
            Storage.saveScenarioScore(this.currentActivity.courseId, this.totalTargets, this.totalTargets);
        }
    },

    /**
     * Inject necessary styles
     */
    addStyles() {
        if (document.getElementById('clickActivityStyles')) return;

        const style = document.createElement('style');
        style.id = 'clickActivityStyles';
        style.textContent = `
            .click-scene-container {
                position: relative;
                width: 100%;
                max-width: 800px;
                margin: 20px auto;
                border-radius: 15px;
                overflow: hidden;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                cursor: crosshair;
            }
            .click-scene-image {
                width: 100%;
                display: block;
                user-select: none;
            }
            .click-marker {
                position: absolute;
                transform: translate(-50%, -50%);
                font-size: 2rem;
                animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                pointer-events: none;
            }
            @keyframes popIn {
                from { transform: translate(-50%, -50%) scale(0); }
                to { transform: translate(-50%, -50%) scale(1); }
            }
            .targets-list {
                display: flex;
                gap: 10px;
                justify-content: center;
                flex-wrap: wrap;
                margin: 15px 0;
            }
            .target-badge {
                background: #eee;
                padding: 5px 15px;
                border-radius: 20px;
                font-weight: bold;
                transition: all 0.3s ease;
                border: 2px solid transparent;
            }
            .target-badge.found {
                background: #4caf50;
                color: white;
                border-color: #45a049;
                padding-right: 10px;
            }
            .target-badge.found::before {
                content: '✓ ';
            }
            .click-instruction {
                text-align: center;
                margin-bottom: 20px;
                font-size: 1.1rem;
            }
        `;
        document.head.appendChild(style);
    }
};
