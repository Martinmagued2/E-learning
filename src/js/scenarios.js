/**
 * Interactive Scenarios Module
 * Handles scenario-based learning activities before quizzes
 */

const Scenarios = {
    currentScenario: null,
    currentScenarioIndex: 0,
    score: 0,
    completed: [],

    /**
     * Start scenarios for a course
     */
    start(scenarios, courseId) {
        if (!scenarios || scenarios.length === 0) {
            console.warn('No scenarios for this course');
            return;
        }

        this.currentScenario = scenarios;
        this.currentScenario.courseId = courseId;
        this.currentScenarioIndex = 0;
        this.score = 0;
        this.completed = [];

        // Show scenarios screen
        App.showScreen('scenariosScreen');

        // Render first scenario
        this.renderScenario();

        // Start scenarios tour if available
        if (typeof DialogueTour !== 'undefined') {
            const firstScenario = scenarios[0];
            const tourName = firstScenario && firstScenario.type === 'dragdrop' ? 'dragdrop' : 'scenarios';

            setTimeout(() => {
                DialogueTour.startTour(tourName);
            }, 1000);
        }
    },

    /**
     * Render current scenario
     */
    renderScenario() {
        const scenario = this.currentScenario[this.currentScenarioIndex];
        const scenariosMain = document.getElementById('scenariosMain');

        if (!scenariosMain) {
            console.error('scenariosMain element not found!');
            return;
        }

        console.log('Rendering scenario:', scenario);

        // Check if this is a click-identify activity
        if (scenario.type === 'click-identify') {
            ClickActivity.start(scenario);
            return;
        }

        // Check if this is a drag-drop activity
        if (scenario.type === 'dragdrop') {
            // Render drag-drop activity instead
            DragDropActivity.start(scenario);
            return;
        }

        // Otherwise render as multiple choice scenario
        // Update progress
        document.getElementById('scenarioNum').textContent = this.currentScenarioIndex + 1;
        document.getElementById('scenarioTotal').textContent = this.currentScenario.length;

        // Create scenario card
        const scenarioCard = document.createElement('div');
        scenarioCard.className = 'scenario-card';

        // Build image HTML only if image exists
        let imageHTML = '';
        if (scenario.image) {
            imageHTML = `
                <div class="scenario-image-container">
                    <img src="${scenario.image}" alt="سيناريو" class="scenario-image">
                </div>
            `;
        }

        scenarioCard.innerHTML = `
            ${imageHTML}
            
            <h2 class="scenario-title">${scenario.title}</h2>
            <p class="scenario-description">${scenario.description}</p>
            
            <div class="scenario-question">
                <h3>${scenario.question}</h3>
            </div>
            
            <div class="scenario-options" id="scenarioOptions">
                ${scenario.options.map((option, index) => `
                    <div class="scenario-option" data-index="${index}">
                        ${option.icon ? `<span class="scenario-icon">${option.icon}</span>` : ''}
                        <span class="scenario-option-text">${option.text}</span>
                    </div>
                `).join('')}
            </div>
            
            <div id="scenarioFeedback" class="scenario-feedback hidden"></div>
            
            <div class="mt-lg text-center hidden" id="scenarioNextBtn">
                <button class="btn btn-primary btn-large" onclick="Scenarios.nextScenario()">
                    <span>السيناريو التالي</span>
                    <span class="btn-icon">→</span>
                </button>
            </div>
        `;

        scenariosMain.innerHTML = '';
        scenariosMain.appendChild(scenarioCard);

        console.log('Scenario card appended');

        // Add error handling for image
        const img = scenarioCard.querySelector('.scenario-image');
        if (img) {
            img.onerror = function () {
                this.style.display = 'none';
                if (this.parentElement) {
                    this.parentElement.style.display = 'none';
                }
            };
        }

        // Add click handlers
        const options = scenarioCard.querySelectorAll('.scenario-option');
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                console.log('Option clicked:', index);
                this.selectOption(index);
            });
        });
    },

    /**
     * Handle option selection
     */
    selectOption(selectedIndex) {
        const scenario = this.currentScenario[this.currentScenarioIndex];
        const isCorrect = selectedIndex === scenario.correctOption;

        // Store result
        this.completed.push({
            scenarioIndex: this.currentScenarioIndex,
            selectedOption: selectedIndex,
            isCorrect
        });

        if (isCorrect) {
            this.score++;
        }

        // Disable all options
        const options = document.querySelectorAll('.scenario-option');
        options.forEach((option, index) => {
            option.style.cursor = 'not-allowed';
            option.style.pointerEvents = 'none';

            if (index === selectedIndex) {
                option.classList.add(isCorrect ? 'correct' : 'incorrect');
            }

            if (index === scenario.correctOption) {
                option.classList.add('correct');
            }
        });

        // Show feedback
        const feedbackDiv = document.getElementById('scenarioFeedback');
        feedbackDiv.className = `scenario-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
        feedbackDiv.innerHTML = `
            <div class="feedback-icon">${isCorrect ? '✅' : '❌'}</div>
            <div class="feedback-content">
                <h4>${isCorrect ? 'إجابة ممتازة!' : 'إجابة غير صحيحة'}</h4>
                <p>${scenario.explanation}</p>
                ${!isCorrect ? `<p class="correct-answer"><strong>الإجابة الصحيحة:</strong> ${scenario.options[scenario.correctOption].text}</p>` : ''}
            </div>
        `;
        feedbackDiv.classList.remove('hidden');

        // Show next button or finish
        if (this.currentScenarioIndex < this.currentScenario.length - 1) {
            document.getElementById('scenarioNextBtn').classList.remove('hidden');
        } else {
            // Last scenario - show results after delay
            setTimeout(() => {
                this.showResults();
            }, 3000);
        }
    },

    /**
     * Move to next scenario
     */
    nextScenario() {
        this.currentScenarioIndex++;

        if (this.currentScenarioIndex < this.currentScenario.length) {
            this.renderScenario();
        } else {
            this.showResults();
        }
    },

    /**
     * Show scenarios results
     */
    showResults() {
        const scenariosMain = document.getElementById('scenariosMain');
        const totalScenarios = this.currentScenario.length;
        const percentage = Math.round((this.score / totalScenarios) * 100);

        // Save scenarios completion
        Storage.saveScenarioScore(this.currentScenario.courseId, this.score, totalScenarios);

        // Check for any new achievements
        if (typeof Achievements !== 'undefined') {
            Achievements.checkAchievements();
        }

        const resultsHTML = `
            <div class="scenario-results">
                <div class="scenario-score">${percentage}%</div>
                <h2>${percentage >= 70 ? '🎉 ممتاز! خلصت السيناريوهات بنجاح' : '👍 كويس! لكن ممكن تحسن أكتر'}</h2>
                <p>حليت <strong>${this.score}</strong> من <strong>${totalScenarios}</strong> سيناريوهات بشكل صحيح</p>
                
                <div class="scenario-next-steps">
                    <p>دلوقتي إنت جاهز للامتحان النهائي! 💪</p>
                    <button class="btn btn-primary btn-large" onclick="App.startCourseQuiz('${this.currentScenario.courseId}')">
                        <span class="btn-icon">📝</span>
                        <span>ابدأ الاختبار</span>
                    </button>
                    
                    <button class="btn btn-secondary mt-md" onclick="Scenarios.start(Scenarios.currentScenario, '${this.currentScenario.courseId}')">
                        <span class="btn-icon">🔄</span>
                        <span>إعادة السيناريوهات</span>
                    </button>
                    
                    <button class="btn btn-secondary mt-sm" onclick="App.showScreen('dashboardScreen'); App.loadDashboard();">
                        <span class="btn-icon">←</span>
                        <span>العودة للوحة التحكم</span>
                    </button>
                </div>
            </div>
        `;

        scenariosMain.innerHTML = resultsHTML;
    }
};
