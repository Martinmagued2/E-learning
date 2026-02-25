/**
 * Audio Narration Module
 * Handles Egyptian dialect audio guidance throughout the app
 */

const AudioNarration = {
    currentAudio: null,
    isPlaying: false,
    volume: 0.7,

    // Audio file mappings (placeholder paths - replace with actual recordings)
    audioFiles: {
        welcome: 'assets/audio/welcome.mp3',
        dashboard: 'assets/audio/dashboard.mp3',
        courseIntro: 'assets/audio/course_intro.mp3',
        lessonStart: 'assets/audio/lesson_start.mp3',
        quizIntro: 'assets/audio/quiz_intro.mp3',
        quizCorrect: 'assets/audio/quiz_correct.mp3',
        quizIncorrect: 'assets/audio/quiz_incorrect.mp3',
        certificate: 'assets/audio/certificate.mp3'
    },

    /**
     * Initialize audio controller
     */
    init() {
        const playPauseBtn = document.getElementById('audioPlayPause');
        const skipBtn = document.getElementById('audioSkip');
        const volumeSlider = document.getElementById('audioVolume');

        // Play/Pause button
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => {
                this.togglePlayPause();
            });
        }

        // Skip button
        if (skipBtn) {
            skipBtn.addEventListener('click', () => {
                this.stop();
            });
        }

        // Volume control
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                this.setVolume(e.target.value / 100);
            });
        }
    },

    /**
     * Play narration audio
     */
    play(audioKey) {
        // Stop current audio if playing
        this.stop();

        const audioPath = this.audioFiles[audioKey];

        if (!audioPath) {
            console.warn(`Audio file not found for key: ${audioKey}`);
            return;
        }

        try {
            this.currentAudio = new Audio(audioPath);
            this.currentAudio.volume = this.volume;

            this.currentAudio.addEventListener('ended', () => {
                this.isPlaying = false;
                this.updatePlayPauseButton();
            });

            this.currentAudio.addEventListener('error', (e) => {
                console.warn('Audio file not available:', audioPath);
                // Silently fail if audio file doesn't exist
                this.isPlaying = false;
                this.updatePlayPauseButton();
            });

            this.currentAudio.play().then(() => {
                this.isPlaying = true;
                this.updatePlayPauseButton();
            }).catch((error) => {
                console.warn('Audio playback failed:', error);
            });
        } catch (error) {
            console.warn('Error creating audio:', error);
        }
    },

    /**
     * Pause current audio
     */
    pause() {
        if (this.currentAudio && this.isPlaying) {
            this.currentAudio.pause();
            this.isPlaying = false;
            this.updatePlayPauseButton();
        }
    },

    /**
     * Initialize TTS to prioritize specific Egyptian voices
     */
    initTts() {
        // Try to get voices immediately
        const getVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            console.log("Available voices:", voices.map(v => v.name));

            // Priority list for Egyptian/Arabic voices
            // 1. "Hoda" is the standard high-quality Egyptian voice on Windows
            // 2. "Egypt" checks for any voice labeled with Egypt
            // 3. "Salma" or "Shakir" are generic Arabic voices
            this.voice = voices.find(voice => voice.name.includes('Hoda')) ||
                voices.find(voice => voice.name.includes('Egypt')) ||
                voices.find(voice => voice.lang === 'ar-EG') ||
                voices.find(voice => voice.name.includes('Salma')) ||
                voices.find(voice => voice.lang === 'ar-SA');

            if (this.voice) {
                console.log("Selected Voice:", this.voice.name);
            }
        };

        // Chrome loads voices asynchronously
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = getVoices;
        }

        getVoices();
    },

    speak(text) {
        if (!text) return;

        // Cancel any current speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Use the selected voice or default
        if (this.voice) {
            utterance.voice = this.voice;
        }

        // Settings for more natural pacing
        utterance.lang = 'ar-EG'; // Force Egyptian locale
        utterance.rate = 0.9;     // Slightly slower is clearer
        utterance.pitch = 1.0;

        window.speechSynthesis.speak(utterance);
    },

    /**
     * Resume current audio
     */
    resume() {
        if (this.currentAudio && !this.isPlaying) {
            this.currentAudio.play().then(() => {
                this.isPlaying = true;
                this.updatePlayPauseButton();
            }).catch((error) => {
                console.warn('Audio resume failed:', error);
            });
        }
    },

    /**
     * Toggle play/pause
     */
    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.resume();
        }
    },

    /**
     * Stop and clear current audio
     */
    stop() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio.currentTime = 0;
            this.currentAudio = null;
            this.isPlaying = false;
            this.updatePlayPauseButton();
        }
    },

    /**
     * Set volume
     */
    setVolume(level) {
        this.volume = Math.max(0, Math.min(1, level));

        if (this.currentAudio) {
            this.currentAudio.volume = this.volume;
        }
    },

    /**
     * Update play/pause button icon
     */
    updatePlayPauseButton() {
        const btn = document.getElementById('audioPlayPause');
        if (btn) {
            const icon = btn.querySelector('.audio-icon');
            if (icon) {
                icon.textContent = this.isPlaying ? '⏸️' : '🔊';
            }
        }
    },

    /**
     * Play welcome screen narration
     */
    playWelcome() {
        this.play('welcome');
    },

    /**
     * Play dashboard narration
     */
    playDashboard() {
        this.play('dashboard');
    },

    /**
     * Play course introduction
     */
    playCourseIntro() {
        this.play('courseIntro');
    },

    /**
     * Play lesson start narration
     */
    playLessonStart() {
        this.play('lessonStart');
    },

    /**
     * Play quiz introduction
     */
    playQuizIntro() {
        this.play('quizIntro');
    },

    /**
     * Play correct answer feedback
     */
    playQuizCorrect() {
        this.play('quizCorrect');
    },

    /**
     * Play incorrect answer feedback
     */
    playQuizIncorrect() {
        this.play('quizIncorrect');
    },

    /**
     * Play certificate narration
     */
    playCertificate() {
        this.play('certificate');
    }
};
