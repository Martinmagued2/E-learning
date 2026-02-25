/**
 * Text-to-Speech Module
 * Generates Egyptian Arabic speech using ElevenLabs API
 * Optimized with Caching (IndexedDB) to save credits/latency
 */

// ==========================================
// 🔑 PUT YOUR ELEVENLABS API KEY HERE
// ==========================================
const ELEVENLABS_API_KEY = "PUT_YOUR_API_KEY_HERE";
// ==========================================

const TextToSpeech = {
    audioElement: null,
    isSpeaking: false,
    audioCache: new Map(), // Runtime cache (Blob URLs)
    db: null,              // IndexedDB instance
    preloadingQueue: [],

    // Config
    API_URL: "https://api.elevenlabs.io/v1/text-to-speech",
    MODEL_ID: "eleven_multilingual_v2", // Critical for Arabic support

    DB_NAME: "SafetyApp_TTS_DB",
    STORE_NAME: "audio_files",

    // ElevenLabs Voice IDs (Multilingual supported)
    VOICES: {
        // Salem (Male) - Using 'Adam' or similar deep voice
        salem: "pNInz6obpgDQGcFmaJgB",
        // Nour (Female) - Using 'Sarah' or similar clear voice
        nour: "EXAVITQu4vr4xnSDxMaL"
    },

    DEFAULT_VOICE: "pNInz6obpgDQGcFmaJgB", // Adam

    /**
     * Initialize TTS and Database
     */
    async init() {
        this.audioElement = new Audio();
        this.audioElement.addEventListener('ended', () => {
            this.isSpeaking = false;
        });

        await this.initDB();

        if (ELEVENLABS_API_KEY === "PUT_YOUR_API_KEY_HERE") {
            console.warn("⚠️ ElevenLabs API Key is missing! Please add it in src/js/tts.js");
        }
    },

    /**
     * Initialize IndexedDB
     */
    initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.DB_NAME, 1);

            request.onerror = (event) => {
                console.error("TTS DB Error:", event);
                resolve(false);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.STORE_NAME)) {
                    db.createObjectStore(this.STORE_NAME);
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log("TTS Database Initialized (ElevenLabs)");
                resolve(true);
            };
        });
    },

    /**
     * Store Blob in DB
     */
    async storeAudioInDB(text, blob) {
        if (!this.db) return;
        try {
            const tx = this.db.transaction(this.STORE_NAME, "readwrite");
            const store = tx.objectStore(this.STORE_NAME);
            store.put(blob, text);
        } catch (e) {
            console.warn("Failed to store audio:", e);
        }
    },

    /**
     * Get Blob from DB
     */
    getAudioFromDB(text) {
        if (!this.db) return Promise.resolve(null);
        return new Promise((resolve) => {
            try {
                const tx = this.db.transaction(this.STORE_NAME, "readonly");
                const store = tx.objectStore(this.STORE_NAME);
                const request = store.get(text);

                request.onsuccess = () => resolve(request.result || null);
                request.onerror = () => resolve(null);
            } catch (e) {
                resolve(null);
            }
        });
    },

    /**
     * Preload audio for a specific text
     */
    async preload(text, character) {
        if (!text || this.audioCache.has(text)) return;

        // Check DB first to avoid queueing if we already have it
        const dbBlob = await this.getAudioFromDB(text);
        if (dbBlob) {
            const url = URL.createObjectURL(dbBlob);
            this.audioCache.set(text, url);
            return;
        }

        // Add to queue to process
        console.log(`Preloading: "${text.substring(0, 20)}..."`);
        await this.fetchAudio(text, character);
    },

    /**
     * Fetch audio from API or Cache or DB
     */
    async fetchAudio(text, character) {
        // 1. Check Runtime Cache (Fastest)
        if (this.audioCache.has(text)) {
            return this.audioCache.get(text);
        }

        // 2. Check IndexedDB (Persistent)
        const dbBlob = await this.getAudioFromDB(text);
        if (dbBlob) {
            const url = URL.createObjectURL(dbBlob);
            this.audioCache.set(text, url);
            console.log("Loaded from DB:", text.substring(0, 15));
            return url;
        }

        // 3. Fetch from ElevenLabs Network
        if (ELEVENLABS_API_KEY === "PUT_YOUR_API_KEY_HERE" || !ELEVENLABS_API_KEY) {
            console.error("ElevenLabs API Key Missing");
            // alert("Please add your ElevenLabs API Key in src/js/tts.js to hear the audio!");
            return null;
        }

        try {
            const voiceId = this.VOICES[(character || 'salem').toLowerCase()] || this.DEFAULT_VOICE;
            const url = `${this.API_URL}/${voiceId}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'audio/mpeg',
                    'Content-Type': 'application/json',
                    'xi-api-key': ELEVENLABS_API_KEY
                },
                body: JSON.stringify({
                    text: text,
                    model_id: this.MODEL_ID,
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.75
                    }
                })
            });

            if (!response.ok) {
                const err = await response.json();
                console.error("ElevenLabs API Error:", err);
                return null;
            }

            const blob = await response.blob();

            // Store in DB (Saves Credits for next time!)
            this.storeAudioInDB(text, blob);

            // Create URL for runtime
            const localUrl = URL.createObjectURL(blob);
            this.audioCache.set(text, localUrl);

            return localUrl;

        } catch (error) {
            console.error("TTS Fetch Error:", error);
            return null;
        }
    },

    /**
     * Speak text
     */
    async speak(text, options = {}) {
        this.stop();

        // 1. Check Cache immediately
        if (this.audioCache.has(text)) {
            console.log("Playing from cache:", text.substring(0, 15));
            this.playAudio(this.audioCache.get(text), options);
            return;
        }

        // 2. If not cached, fetch it
        this.isSpeaking = true;
        if (options.onStart) options.onStart();

        const url = await this.fetchAudio(text, options.character);

        if (url) {
            this.playAudio(url, options);
        } else {
            this.isSpeaking = false;
        }
    },

    /**
     * Internal play helper
     */
    playAudio(url, options) {
        this.audioElement.src = url;
        this.audioElement.play();
        this.isSpeaking = true;
        if (!this.audioCache.has(options.text)) {
            if (options.onStart) options.onStart();
        }

        this.audioElement.onended = () => {
            this.isSpeaking = false;
            if (options.onEnd) options.onEnd();
        };
    },

    /**
     * Stop current speech
     */
    stop() {
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.currentTime = 0;
        }
        this.isSpeaking = false;
    }
};

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => TextToSpeech.init());
} else {
    TextToSpeech.init();
}
