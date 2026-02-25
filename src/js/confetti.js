/**
 * Confetti Celebration System
 * Triggers celebratory confetti animation on achievements
 */

const Confetti = {
    canvas: null,
    ctx: null,
    particles: [],
    animationId: null,
    isRunning: false,

    // Color palette for confetti
    colors: [
        '#ff4757', // Red (Fire Safety)
        '#ffd32a', // Yellow (Electric Safety)
        '#26de81', // Green (Success)
        '#3742fa', // Blue (Primary)
        '#a55eea', // Purple
        '#ff6b81', // Pink
        '#2bcbba', // Teal
        '#fed330'  // Gold
    ],

    /**
     * Initialize the confetti canvas
     */
    init() {
        // Create canvas if it doesn't exist
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'confettiCanvas';
            this.canvas.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 999999;
            `;
            document.body.appendChild(this.canvas);
            this.ctx = this.canvas.getContext('2d');
        }

        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    },

    /**
     * Resize canvas to match window
     */
    resizeCanvas() {
        if (this.canvas) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
    },

    /**
     * Create a single confetti particle
     */
    createParticle(x, y) {
        return {
            x: x || Math.random() * this.canvas.width,
            y: y || -10,
            size: Math.random() * 10 + 5,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            velocityX: (Math.random() - 0.5) * 8,
            velocityY: Math.random() * 3 + 2,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            shape: Math.random() > 0.5 ? 'rect' : 'circle',
            opacity: 1,
            gravity: 0.1,
            friction: 0.99,
            wobble: Math.random() * 10
        };
    },

    /**
     * Launch confetti burst
     * @param {Object} options - Configuration options
     */
    launch(options = {}) {
        const {
            particleCount = 150,
            spread = 70,
            startX = this.canvas.width / 2,
            startY = this.canvas.height / 3,
            duration = 3000
        } = options;

        this.init();

        // Create particles
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.random() * spread - spread / 2) * Math.PI / 180;
            const velocity = Math.random() * 10 + 10;

            const particle = this.createParticle(startX, startY);
            particle.velocityX = Math.sin(angle) * velocity * (Math.random() > 0.5 ? 1 : -1);
            particle.velocityY = -Math.cos(angle) * velocity;

            this.particles.push(particle);
        }

        // Start animation if not running
        if (!this.isRunning) {
            this.isRunning = true;
            this.animate();
        }

        // Stop after duration
        setTimeout(() => this.stop(), duration);
    },

    /**
     * Cannon burst from sides
     */
    cannon() {
        this.init();

        // Left cannon
        this.launch({
            particleCount: 75,
            startX: 0,
            startY: this.canvas.height * 0.7,
            spread: 45
        });

        // Right cannon
        setTimeout(() => {
            this.launch({
                particleCount: 75,
                startX: this.canvas.width,
                startY: this.canvas.height * 0.7,
                spread: 45
            });
        }, 150);
    },

    /**
     * Rain confetti from top
     */
    rain(duration = 5000) {
        this.init();

        const interval = setInterval(() => {
            for (let i = 0; i < 5; i++) {
                this.particles.push(this.createParticle());
            }
        }, 50);

        if (!this.isRunning) {
            this.isRunning = true;
            this.animate();
        }

        setTimeout(() => {
            clearInterval(interval);
            setTimeout(() => this.stop(), 2000);
        }, duration);
    },

    /**
     * Animation loop
     */
    animate() {
        if (!this.isRunning) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            // Update physics
            p.velocityY += p.gravity;
            p.velocityX *= p.friction;
            p.x += p.velocityX + Math.sin(p.wobble) * 0.5;
            p.y += p.velocityY;
            p.rotation += p.rotationSpeed;
            p.wobble += 0.1;

            // Fade out when near bottom
            if (p.y > this.canvas.height * 0.8) {
                p.opacity -= 0.02;
            }

            // Remove dead particles
            if (p.y > this.canvas.height + 20 || p.opacity <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            // Draw particle
            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate((p.rotation * Math.PI) / 180);
            this.ctx.globalAlpha = p.opacity;
            this.ctx.fillStyle = p.color;

            if (p.shape === 'rect') {
                this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
            } else {
                this.ctx.beginPath();
                this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                this.ctx.fill();
            }

            this.ctx.restore();
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    },

    /**
     * Stop animation
     */
    stop() {
        if (this.particles.length === 0) {
            this.isRunning = false;
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
                this.animationId = null;
            }
            if (this.ctx) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
        } else {
            // Let remaining particles fall
            setTimeout(() => this.stop(), 500);
        }
    },

    /**
     * Celebrate achievement (main method to call)
     * @param {string} type - 'quiz', 'course', 'badge', 'certificate'
     */
    celebrate(type = 'default') {
        switch (type) {
            case 'quiz':
                this.launch({ particleCount: 100 });
                break;
            case 'course':
                this.cannon();
                setTimeout(() => this.rain(2000), 500);
                break;
            case 'certificate':
                this.cannon();
                setTimeout(() => this.cannon(), 300);
                setTimeout(() => this.rain(3000), 600);
                break;
            case 'badge':
                this.launch({ particleCount: 50 });
                break;
            default:
                this.launch({ particleCount: 80 });
        }
    }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Confetti.init();
});
