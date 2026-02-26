/**
 * Certificate Module
 * Handles certificate generation, congratulations celebration, and display
 */

const Certificate = {
    /**
     * Show certificate for completed course with celebration
     */
    show(courseId, showCelebration = true) {
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
        // Get student name
        const studentName = Storage.getStudentName();

        // Get current date
        const date = new Date();
        const arabicMonths = [
            'يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو',
            'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
        ];
        const formattedDate = `${date.getDate()} ${arabicMonths[date.getMonth()]} ${date.getFullYear()}`;

        // Set Master Certificate Content
        document.getElementById('certificateStudentName').textContent = studentName;
        document.getElementById('certificateCourseName').textContent = "إتمام جميع الدورات التدريبية";
        document.getElementById('certificateDate').textContent = formattedDate;

        // Update Title for distinction
        const titleEl = document.querySelector('.certificate-title');
        if (titleEl) titleEl.textContent = "شهادة إتقان وتفوق";

        const subtitleEl = document.querySelector('.certificate-subtitle');
        if (subtitleEl) subtitleEl.textContent = "Master Certificate of Achievement";

        // Add Master Class to container
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
            printBtn.onclick = () => this.download(true); // true = isMaster
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
    async download(isMaster = false) {
        const overlay = document.querySelector('.congrats-overlay');
        if (overlay) overlay.classList.remove('show');

        const studentName = document.getElementById('certificateStudentName')?.textContent || 'Student';
        const courseName = document.getElementById('certificateCourseName')?.textContent || 'Course';

        const filename = `${studentName}_${courseName}_Certificate.pdf`.replace(/\s+/g, '_');

        try {
            const { jsPDF } = window.jspdf;

            if (!jsPDF) throw new Error('jsPDF not loaded');

            // Create PDF in landscape A4
            const doc = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            const W = 297, H = 210;

            // Load certificate template
            const templateImg = await this.imageToBase64('assets/images/certificate_template.jpg');

            // Add template as background (full page)
            doc.addImage(templateImg, 'JPEG', 0, 0, W, H);

            // Special Master Certificate Overlay
            if (isMaster) {
                doc.setDrawColor(218, 165, 32); // Goldenrod
                doc.setLineWidth(2);
                doc.rect(5, 5, W - 10, H - 10);
                doc.setLineWidth(1);
                doc.rect(7, 7, W - 14, H - 14);

                // Add a gold seal emoji or similar if possible
                doc.setFontSize(40);
                doc.text('🏆', 20, 40);
            }

            // Add student name in the first decorative frame
            // Adjusted position based on template analysis (moved down further)
            const hasArabic = /[\u0600-\u06FF]/.test(studentName);
            const nameColor = isMaster ? '#b8860b' : '#4a3c28';
            if (hasArabic) {
                // Y centered around 142
                const nameImg = await this.createArabicTextImage(studentName, 70, nameColor, true);
                doc.addImage(nameImg, 'PNG', W / 2 - 85, 130, 170, 22);
            } else {
                doc.setFontSize(36);
                doc.setTextColor(isMaster ? 184 : 74, isMaster ? 134 : 60, isMaster ? 11 : 40);
                doc.setFont('helvetica', 'bold');
                doc.text(studentName, W / 2, 150, { align: 'center' });
            }

            // Add course name in the second decorative frame  
            // Adjusted position based on template analysis (moved down further)
            const courseArabic = /[\u0600-\u06FF]/.test(courseName);
            if (courseArabic) {
                // Y centered around 183
                const courseImg = await this.createArabicTextImage(courseName, 54, '#4a3c28', true);
                doc.addImage(courseImg, 'PNG', W / 2 - 80, 174, 160, 18);
            } else {
                doc.setFontSize(28);
                doc.setTextColor(74, 60, 40);
                doc.setFont('helvetica', 'bold');
                doc.text(courseName, W / 2, 183, { align: 'center' });
            }

            doc.save(filename);
            console.log('PDF generated successfully using template!');

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('حدث خطأ أثناء إنشاء الشهادة. الرجاء المحاولة مرة أخرى.');
        }
    },

    /**
     * Go back to dashboard
     */
    close() {
        // Remove master class if it was there
        const container = document.querySelector('.certificate-container');
        if (container) container.classList.remove('master-active');

        if (typeof App !== 'undefined') {
            App.showScreen('dashboardScreen');
            App.loadDashboard();
        }
    }
};
