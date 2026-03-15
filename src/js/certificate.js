/**
 * Certificate Module
 * Handles certificate generation, congratulations celebration, and display
 */

const Certificate = {
    _isMasterActive: false,

    /**
     * Show certificate for completed course with celebration
     */
    show(courseId, showCelebration = true) {
        this._isMasterActive = false;
        // Get course data
        const course = App.coursesData.find(c => c.id === courseId);

        if (!course) {
            console.error('Course not found:', courseId);
            return;
        }

        // Get student name
        const studentName = Storage.getStudentName();

        // Get current date in Arabic
        const date = new Date();
        const arabicMonths = [
            'يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو',
            'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
        ];
        const formattedDate = `${date.getDate()} ${arabicMonths[date.getMonth()]} ${date.getFullYear()}`;

        // Update certificate content
        document.getElementById('certificateStudentName').textContent = studentName;
        document.getElementById('certificateCourseName').textContent = course.title;
        document.getElementById('certificateDate').textContent = formattedDate;

        // Set score if available
        const scoreEl = document.getElementById('certificateScore');
        if (scoreEl) {
            scoreEl.textContent = '100%';
        }

        // Show certificate screen
        App.showScreen('certificateScreen');

        // Start certificate tour
        if (typeof DialogueTour !== 'undefined') {
            setTimeout(() => DialogueTour.startTour('certificate'), 1500);
        }

        // Show celebration if enabled
        if (showCelebration) {
            this.showCelebration();
        }

        // Play certificate narration
        if (typeof AudioNarration !== 'undefined') {
            AudioNarration.playCertificate();
        }

        // Setup print button
        const printBtn = document.getElementById('printCertificate');
        if (printBtn) {
            printBtn.onclick = () => this.download();
        }

        // Setup continue learning button
        const continueBtn = document.getElementById('continueLearning');
        if (continueBtn) {
            continueBtn.onclick = () => this.close();
        }
    },

    /**
     * Show MASTER certificate for completing ALL courses
     */
    showMasterCertificate() {
        this._isMasterActive = true;

        // Get student name
        const studentName = Storage.getStudentName();

        // Set Master Certificate Content — NAME ONLY
        document.getElementById('certificateStudentName').textContent = studentName;

        // Update Title for distinction
        const titleEl = document.querySelector('.certificate-title');
        if (titleEl) titleEl.textContent = "شهادة إتقان وتفوق";

        const subtitleEl = document.querySelector('.certificate-subtitle');
        if (subtitleEl) subtitleEl.textContent = "هذه الشهادة تشهد وتمنح لـ...";

        // Add Master Class to container (hides course name, date, score via CSS)
        const container = document.querySelector('.certificate-container');
        if (container) container.classList.add('master-active');

        // Show certificate screen
        App.showScreen('certificateScreen');

        // Start certificate tour
        if (typeof DialogueTour !== 'undefined') {
            setTimeout(() => DialogueTour.startTour('certificate'), 1500);
        }

        // Celebration
        this.showFullCompletionCelebration();

        // Play narration
        if (typeof AudioNarration !== 'undefined') {
            AudioNarration.playCertificate();
        }

        // Setup print button
        const printBtn = document.getElementById('printCertificate');
        if (printBtn) {
            printBtn.onclick = () => this.download();
        }

        // Setup continue button
        const continueBtn = document.getElementById('continueLearning');
        if (continueBtn) {
            continueBtn.onclick = () => this.close();
        }
    },

    /**
     * Show congratulations celebration with fireworks
     */
    showCelebration() {
        const overlay = document.getElementById('congratsOverlay');
        if (!overlay) return;

        // Show overlay
        overlay.classList.add('show');

        // Launch fireworks and confetti
        if (typeof Confetti !== 'undefined') {
            // Multiple waves of confetti
            Confetti.celebrate('certificate');
            setTimeout(() => Confetti.cannon(), 1000);
            setTimeout(() => Confetti.cannon(), 2000);
        }

        // Play celebration sounds
        if (typeof SoundEffects !== 'undefined') {
            SoundEffects.play('achievement');
            setTimeout(() => SoundEffects.play('levelUp'), 500);
        }

        // Make mascot celebrate
        if (typeof Mascot !== 'undefined') {
            Mascot.speak('courseComplete', 'مبروووك! 🎉 لقد أتممت التدريب بنجاح! أنت بطل السلامة الآن!');
        }

        // Setup show certificate button
        const showCertBtn = document.getElementById('showCertificateBtn');
        if (showCertBtn) {
            showCertBtn.onclick = () => {
                overlay.classList.remove('show');
                // Final confetti burst
                if (typeof Confetti !== 'undefined') {
                    Confetti.launch({ particleCount: 200 });
                }
            };
        }
    },

    /**
     * Show 100% completion celebration (called when overall progress reaches 100%)
     */
    showFullCompletionCelebration() {
        const overlay = document.getElementById('congratsOverlay');
        if (!overlay) return;

        // Show overlay
        overlay.classList.add('show');

        // Massive fireworks display
        if (typeof Confetti !== 'undefined') {
            Confetti.cannon();
            setTimeout(() => Confetti.rain(5000), 300);
            setTimeout(() => Confetti.cannon(), 1500);
            setTimeout(() => Confetti.cannon(), 3000);
        }

        // Play multiple celebration sounds
        if (typeof SoundEffects !== 'undefined') {
            SoundEffects.play('achievement');
            setTimeout(() => SoundEffects.play('levelUp'), 300);
            setTimeout(() => SoundEffects.play('success'), 600);
        }

        // Mascot special message
        if (typeof Mascot !== 'undefined') {
            Mascot.speak('perfectScore', 'واااو! 💯 أكملت كل الدورات! أنت خبير السلامة الحقيقي! فخور جداً بك! 🏆');
        }

        // Setup show certificate button
        const showCertBtn = document.getElementById('showCertificateBtn');
        if (showCertBtn) {
            showCertBtn.onclick = () => {
                overlay.classList.remove('show');
                // Final big burst
                if (typeof Confetti !== 'undefined') {
                    Confetti.launch({ particleCount: 300 });
                }
            };
        }
    },

    /**
     * Helper function to convert image to base64
     */
    imageToBase64(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            // Don't use crossOrigin for local files
            // img.crossOrigin = 'Anonymous';

            img.onload = function () {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = this.width;
                    canvas.height = this.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(this, 0, 0);
                    const dataURL = canvas.toDataURL('image/jpeg', 0.95);
                    console.log('Image loaded successfully:', url);
                    resolve(dataURL);
                } catch (e) {
                    console.error('Error converting image to base64:', e);
                    reject(e);
                }
            };

            img.onerror = (error) => {
                console.error('Error loading image:', url, error);
                reject(new Error(`Failed to load image: ${url}`));
            };

            img.src = url;
            console.log('Loading image from:', url);
        });
    },

    /**
     * Helper to create Arabic text as image
     */
    createArabicTextImage(text, fontSize, color, isBold = false) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = 1000;
            canvas.height = 150;

            ctx.font = `${isBold ? 'bold' : 'normal'} ${fontSize}px Cairo, Arial, sans-serif`;
            ctx.fillStyle = color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.direction = 'rtl';

            ctx.fillText(text, 500, 75);

            resolve(canvas.toDataURL('image/png'));
        });
    },

    /**
     * Download certificate as PDF using template image
     */
    async download() {
        const isMaster = this._isMasterActive;
        const overlay = document.querySelector('.congrats-overlay');
        if (overlay) overlay.classList.remove('show');

        const studentName = document.getElementById('certificateStudentName')?.textContent || 'Student';
        const courseName = document.getElementById('certificateCourseName')?.textContent || 'Course';

        const filename = isMaster
            ? `${studentName}_Master_Certificate.pdf`.replace(/\s+/g, '_')
            : `${studentName}_${courseName}_Certificate.pdf`.replace(/\s+/g, '_');

        try {
            if (isMaster) {
                // ===== MASTER CERTIFICATE: Download as PNG =====
                const filenamePng = `${studentName}_Master_Certificate.png`.replace(/\s+/g, '_');
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                const img = new Image();
                img.onload = () => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img, 0, 0);

                    // Position name in the white field area (~54% down from top)
                    const nameY = canvas.height * 0.56;

                    // Draw name
                    ctx.font = `bold ${Math.round(canvas.height * 0.08)}px Cairo, Arial, sans-serif`;
                    ctx.fillStyle = '#2c3e50';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';

                    const hasArabic = /[\u0600-\u06FF]/.test(studentName);
                    if (hasArabic) {
                        ctx.direction = 'rtl';
                    }
                    ctx.fillText(studentName, canvas.width / 2, nameY);

                    // Trigger PNG download
                    const link = document.createElement('a');
                    link.download = filenamePng;
                    link.href = canvas.toDataURL('image/png', 1.0);
                    link.click();
                    console.log('Master certificate PNG generated successfully!');
                };
                img.onerror = () => {
                    alert('حدث خطأ أثناء تحميل قالب الشهادة. الرجاء المحاولة مرة أخرى.');
                };
                img.src = 'assets/images/master_certificate_template.jpg';
                return; // Exit, PDF logic below is only for module certificates
            }

            // ===== MODULE CERTIFICATE: Download as PNG =====
            const filenamePng = `${studentName}_${courseName}_Certificate.png`.replace(/\s+/g, '_');
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
                
            const img = new Image();
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                // Position name (~67% down from top) and course name (~87% down from top)
                const nameY = canvas.height * 0.67;
                const courseY = canvas.height * 0.87;
                
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                const hasArabicName = /[\u0600-\u06FF]/.test(studentName);
                if (hasArabicName) ctx.direction = 'rtl';
                else ctx.direction = 'ltr';

                // Draw student name
                ctx.font = `bold ${Math.round(canvas.height * 0.05)}px Cairo, Arial, sans-serif`;
                ctx.fillStyle = '#4a3c28';
                ctx.fillText(studentName, canvas.width / 2, nameY);

                // Draw course name
                ctx.font = `bold ${Math.round(canvas.height * 0.04)}px Cairo, Arial, sans-serif`;
                const hasArabicCourse = /[\u0600-\u06FF]/.test(courseName);
                if (hasArabicCourse) ctx.direction = 'rtl';
                else ctx.direction = 'ltr';
                ctx.fillText(courseName, canvas.width / 2, courseY);
                
                // Trigger PNG download
                const link = document.createElement('a');
                link.download = filenamePng;
                link.href = canvas.toDataURL('image/png', 1.0);
                link.click();
                console.log('Module certificate PNG generated successfully!');
            };
            img.onerror = () => {
                alert('حدث خطأ أثناء تحميل قالب الشهادة. الرجاء المحاولة مرة أخرى.');
            };
            img.src = 'assets/images/certificate_template.jpg';

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('حدث خطأ أثناء إنشاء الشهادة. الرجاء المحاولة مرة أخرى.');
        }
    },

    /**
     * Go back to dashboard
     */
    close() {
        // Reset master flag and remove master class
        this._isMasterActive = false;
        const container = document.querySelector('.certificate-container');
        if (container) container.classList.remove('master-active');

        if (typeof App !== 'undefined') {
            App.showScreen('dashboardScreen');
            App.loadDashboard();
        }
    }
};
