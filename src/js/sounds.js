/**
 * Sound Effects System
 * Handles all audio feedback in the application
 */

const SoundEffects = {
    enabled: true,
    volume: 0.5,
    sounds: {},

    // Sound definitions using Web Audio API or Audio elements
    soundData: {
        // UI Sounds
        click: { frequency: 800, duration: 0.05, type: 'sine' },
        hover: { frequency: 600, duration: 0.03, type: 'sine' },

        // Success Sounds
        correct: { frequency: 880, duration: 0.15, type: 'sine', sequence: [880, 1100] },
        success: { frequency: 523, duration: 0.2, type: 'sine', sequence: [523, 659, 784] },
        levelUp: { frequency: 440, duration: 0.3, type: 'sine', sequence: [440, 554, 659, 880] },

        // Error Sounds
        wrong: { frequency: 200, duration: 0.2, type: 'sawtooth' },
        error: { frequency: 150, duration: 0.3, type: 'square' },

        // Notification Sounds
        notification: { frequency: 700, duration: 0.1, type: 'sine', sequence: [700, 900] },
        achievement: { frequency: 600, duration: 0.4, type: 'sine', sequence: [600, 800, 1000, 1200] },

        // Game Sounds
        countdown: { frequency: 400, duration: 0.1, type: 'sine' },
        timeWarning: { frequency: 300, duration: 0.15, type: 'square' },
        gameOver: { frequency: 200, duration: 0.5, type: 'sawtooth', sequence: [400, 300, 200] },

        // Navigation
        navigate: { frequency: 500, duration: 0.08, type: 'sine' },
        open: { frequency: 400, duration: 0.1, type: 'sine', sequence: [400, 600] },
        close: { frequency: 600, duration: 0.1, type: 'sine', sequence: [600, 400] }
    },

    audioContext: null,

    /**
     * Initialize the sound system
     */
    init() {
        // Create AudioContext on first user interaction (browser requirement)
        const initAudioContext = () => {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            document.removeEventListener('click', initAudioContext);
            document.removeEventListener('keydown', initAudioContext);
        };

        document.addEventListener('click', initAudioContext);
        document.addEventListener('keydown', initAudioContext);

        // Load saved preferences
        this.loadPreferences();

        // Add click sounds to buttons
        this.attachButtonSounds();
    },

    /**
     * Load saved sound preferences
     */
    loadPreferences() {
        try {
            const prefs = localStorage.getItem('soundPreferences');
            if (prefs) {
                const parsed = JSON.parse(prefs);
                this.enabled = parsed.enabled !== undefined ? parsed.enabled : true;
                this.volume = parsed.volume !== undefined ? parsed.volume : 0.5;
            }
        } catch (e) {
            console.warn('Could not load sound preferences:', e);
        }
    },

    /**
     * Save sound preferences
     */
    savePreferences() {
        try {
            localStorage.setItem('soundPreferences', JSON.stringify({
                enabled: this.enabled,
                volume: this.volume
            }));
        } catch (e) {
            console.warn('Could not save sound preferences:', e);
        }
    },

    /**
     * Toggle sounds on/off
     */
    toggle() {
        this.enabled = !this.enabled;
        this.savePreferences();
        return this.enabled;
    },

    /**
     * Set volume (0-1)
     */
    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
        this.savePreferences();
    },

    /**
     * Play a sound by name
     * @param {string} soundName - Name of the sound to play
     */
    play(soundName) {
        if (!this.enabled || !this.audioContext) return;

        const soundDef = this.soundData[soundName];
        if (!soundDef) {
            console.warn(`Sound "${soundName}" not found`);
            return;
        }

        // Resume audio context if suspended
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        // Play sequence or single tone
        if (soundDef.sequence) {
            this.playSequence(soundDef.sequence, soundDef.duration, soundDef.type);
        } else {
            this.playTone(soundDef.frequency, soundDef.duration, soundDef.type);
        }
    },

    /**
     * Play a single tone
     */
    playTone(frequency, duration, type = 'sine') {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

        // Volume envelope
        gainNode.gain.setValueAtTime(this.volume * 0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            this.audioContext.currentTime + duration
        );

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    },

    /**
     * Play a sequence of tones (for melodies)
     */
    playSequence(frequencies, noteDuration, type = 'sine') {
        if (!this.audioContext) return;

        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                this.playTone(freq, noteDuration, type);
            }, index * (noteDuration * 1000 * 0.8));
        });
    },

    /**
     * Attach click sounds to all buttons
     */
    attachButtonSounds() {
        document.addEventListener('click', (e) => {
            const target = e.target.closest('button, .btn, .course-card, .quiz-option');
            if (target) {
                this.play('click');
            }
        });
    },

    // Convenience methods for common sounds
    click() { this.play('click'); },
    correct() { this.play('correct'); },
    wrong() { this.play('wrong'); },
    success() { this.play('success'); },
    error() { this.play('error'); },
    levelUp() { this.play('levelUp'); },
    achievement() { this.play('achievement'); },
    countdown() { this.play('countdown'); },
    timeWarning() { this.play('timeWarning'); },
    gameOver() { this.play('gameOver'); },
    navigate() { this.play('navigate'); },
    notification() { this.play('notification'); }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    SoundEffects.init();
});
