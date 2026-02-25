/**
 * Drag and Drop Interactive Activities Module
 * Handles interactive drag-drop scenarios for hands-on learning
 */

const DragDropActivity = {
    currentActivity: null,
    draggedElement: null,
    correctDrops: 0,
    totalTargets: 0,

    /**
     * Start a drag-drop activity
     */
    start(activity) {
        this.currentActivity = activity;
        this.correctDrops = 0;
        this.totalTargets = activity.targets.length;

        // Render activity
        this.render();
    },

    /**
     * Render the drag-drop activity
     */
    render() {
        const scenariosMain = document.getElementById('scenariosMain');
        if (!scenariosMain) return;

        const activity = this.currentActivity;

        const activityHTML = `
            <div class="dragdrop-activity">
                <h2 class="scenario-title">${activity.title}</h2>
                <p class="scenario-description">${activity.description}</p>

                <!-- Scene Container -->
                <div class="dragdrop-scene" id="dragdropScene">
                    <img src="${activity.sceneImage}" alt="المشهد" class="scene-image">
                    
                    <!-- Drop Targets (invisible zones on the image) -->
                    ${activity.targets.map((target, index) => `
                        <div class="drop-target" 
                             data-target-index="${index}"
                             data-accepts="${target.accepts}"
                             style="top: ${target.top}%; left: ${target.left}%; width: ${target.width}%; height: ${target.height}%;">
                            ${target.label ? `<span class="target-label">${target.label}</span>` : ''}
                        </div>
                    `).join('')}
                </div>

                <!-- Draggable Items -->
                <div class="dragdrop-items">
                    <p class="items-instruction">اسحب الأداة المناسبة إلى المشهد:</p>
                    <div class="items-container">
                        ${activity.items.map((item, index) => `
                            <div class="draggable-item" 
                                 draggable="true"
                                 data-item-id="${item.id}"
                                 data-item-index="${index}">
                                ${item.icon.includes('.') || item.icon.includes('/')
                ? `<img src="${item.icon}" alt="${item.name}">`
                : `<span style="font-size: 3rem;">${item.icon}</span>`}
                                <span>${item.name}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Feedback Area -->
                <div id="dragdropFeedback" class="scenario-feedback hidden"></div>

                <!-- Progress -->
                <div class="dragdrop-progress">
                    <span id="dragdropScore">${this.correctDrops} / ${this.totalTargets}</span>
                    <span>✅ صحيح</span>
                </div>
            </div>
        `;

        scenariosMain.innerHTML = activityHTML;

        // Setup drag and drop handlers
        this.setupDragDrop();
    },

    /**
     * Setup drag and drop event handlers
     */
    setupDragDrop() {
        // Get all draggable items
        const draggableItems = document.querySelectorAll('.draggable-item');
        const dropTargets = document.querySelectorAll('.drop-target');

        // Drag start
        draggableItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                this.draggedElement = e.target;
                e.target.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/html', e.target.innerHTML);
            });

            item.addEventListener('dragend', (e) => {
                e.target.classList.remove('dragging');
            });
        });

        // Drop targets
        dropTargets.forEach(target => {
            target.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                target.classList.add('drag-over');
            });

            target.addEventListener('dragleave', (e) => {
                target.classList.remove('drag-over');
            });

            target.addEventListener('drop', (e) => {
                e.preventDefault();
                target.classList.remove('drag-over');

                if (!this.draggedElement) return;

                const itemId = this.draggedElement.dataset.itemId;
                const acceptedItems = target.dataset.accepts.split(',');
                const targetIndex = parseInt(target.dataset.targetIndex);

                this.handleDrop(itemId, acceptedItems, targetIndex, target);
            });
        });
    },

    /**
     * Handle item drop on target
     */
    handleDrop(itemId, acceptedItems, targetIndex, targetElement) {
        const isCorrect = acceptedItems.includes(itemId);
        const target = this.currentActivity.targets[targetIndex];
        const feedbackDiv = document.getElementById('dragdropFeedback');

        if (isCorrect) {
            // Correct! Show success animation
            this.showSuccess(target, targetElement);
            this.correctDrops++;

            // Update score
            document.getElementById('dragdropScore').textContent = `${this.correctDrops} / ${this.totalTargets}`;

            // Hide/disable the dragged item
            if (this.draggedElement) {
                this.draggedElement.style.opacity = '0.3';
                this.draggedElement.draggable = false;
            }

            // Show success feedback
            feedbackDiv.className = 'scenario-feedback correct';
            feedbackDiv.innerHTML = `
                <div class="feedback-icon">✅</div>
                <div class="feedback-content">
                    <h4>ممتاز!</h4>
                    <p>${target.correctFeedback}</p>
                </div>
            `;
            feedbackDiv.classList.remove('hidden');

            // Check if all completed
            if (this.correctDrops === this.totalTargets) {
                setTimeout(() => {
                    this.showCompletion();
                }, 2000);
            } else {
                setTimeout(() => {
                    feedbackDiv.classList.add('hidden');
                }, 3000);
            }

        } else {
            // Wrong! Show error
            this.showError(targetElement);

            feedbackDiv.className = 'scenario-feedback incorrect';
            feedbackDiv.innerHTML = `
                <div class="feedback-icon">❌</div>
                <div class="feedback-content">
                    <h4>غير صحيح</h4>
                    <p>${target.incorrectFeedback || 'حاول مرة أخرى مع أداة مختلفة!'}</p>
                </div>
            `;
            feedbackDiv.classList.remove('hidden');

            setTimeout(() => {
                feedbackDiv.classList.add('hidden');
            }, 3000);
        }
    },

    /**
     * Show success animation on target
     */
    showSuccess(target, targetElement) {
        // Add success class for animation
        targetElement.classList.add('drop-success');

        // Create success particle effect
        const particle = document.createElement('div');
        particle.className = 'success-particle';
        particle.textContent = '✨';
        particle.style.left = '50%';
        particle.style.top = '50%';
        targetElement.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 1000);

        // If target has a visual change (e.g., fire disappears)
        if (target.successEffect === 'hide') {
            setTimeout(() => {
                targetElement.style.opacity = '0';
            }, 500);
        }
    },

    /**
     * Show error animation
     */
    showError(targetElement) {
        targetElement.classList.add('drop-error');
        setTimeout(() => {
            targetElement.classList.remove('drop-error');
        }, 600);
    },

    /**
     * Show completion screen
     */
    showCompletion() {
        const scenariosMain = document.getElementById('scenariosMain');

        const completionHTML = `
            <div class="scenario-results">
                <div class="scenario-score">100%</div>
                <h2>🎉 رائع! أكملت النشاط بنجاح</h2>
                <p>عرفت إزاي تتعامل مع الموقف بشكل صحيح! 💪</p>
                
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

        scenariosMain.innerHTML = completionHTML;

        // Save completion
        if (this.currentActivity && this.currentActivity.courseId) {
            Storage.saveScenarioScore(this.currentActivity.courseId, this.totalTargets, this.totalTargets);
        }
    }
};
