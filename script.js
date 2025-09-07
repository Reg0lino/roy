document.addEventListener('DOMContentLoaded', () => {

    // --- Part 1: Scroll-Triggered Animation Logic ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        animatedElements.forEach(element => observer.observe(element));
    }

    // --- Part 2: Text Scramble Effect (Class Definition) ---
    class TextScramble {
        constructor(el) { this.el = el; this.chars = '!<>-_\\/[]{}—=+*^?#________'; this.update = this.update.bind(this); }
        setText(newText) {
            const oldText = this.el.innerText; const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => this.resolve = resolve); this.queue = [];
            for (let i = 0; i < length; i++) { const from = oldText[i] || ''; const to = newText[i] || ''; const start = Math.floor(Math.random() * 40); const end = start + Math.floor(Math.random() * 40); this.queue.push({ from, to, start, end }); }
            cancelAnimationFrame(this.frameRequest); this.frame = 0; this.update(); return promise;
        }
        update() {
            let output = ''; let complete = 0;
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                if (this.frame >= end) { complete++; output += to; } 
                else if (this.frame >= start) { if (!char || Math.random() < 0.28) { char = this.randomChar(); this.queue[i].char = char; } output += `<span class="scramble-char">${char}</span>`; } 
                else { output += from; }
            }
            this.el.innerHTML = output;
            if (complete === this.queue.length) { this.resolve(); } 
            else { this.frameRequest = requestAnimationFrame(this.update); this.frame++; }
        }
        randomChar() { return this.chars[Math.floor(Math.random() * this.chars.length)]; }
    }

    // Initialize text scramble on the main H2 headline
    const h2Element = document.querySelector('.hero-text h2');
    if (h2Element) {
        const fx = new TextScramble(h2Element);
        setTimeout(() => fx.setText(h2Element.getAttribute('data-text')), 300);
    }

    // --- Part 3: Interactive "Report a Sighting" Modal Logic ---
    const reportBtn = document.getElementById('report-sighting-btn');
    const modal = document.getElementById('report-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const form = document.getElementById('sighting-form');
    const transmitBtn = document.getElementById('transmit-btn');
    const progressContainer = document.getElementById('progress-container');
    const errorContainer = document.getElementById('error-container');
    const modalContent = document.querySelector('.modal-content');

    // Function to open the modal
    const openModal = () => modal.classList.add('visible');

    // Function to close the modal
    const closeModal = () => modal.classList.remove('visible');

    // Event listener for the main report button
    if (reportBtn) {
        reportBtn.addEventListener('click', openModal);
    }

    // Event listener for the close button inside the modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            closeModal();
            // After closing, disable the main button permanently
            reportBtn.textContent = '[ SYSTEM OFFLINE // BLAME ROY ]';
            reportBtn.disabled = true;
        });
    }

    // Allow closing the modal by clicking the background overlay
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
                if (errorContainer.classList.contains('hidden') === false) {
                     reportBtn.textContent = '[ SYSTEM OFFLINE // BLAME ROY ]';
                     reportBtn.disabled = true;
                }
            }
        });
    }

    // The Sabotage Sequence
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop the form from actually submitting
            
            // 1. Hide the form, show the progress bar
            form.classList.add('hidden');
            progressContainer.classList.remove('hidden');

            // 2. Animate the progress bar
            const progressBarInner = document.querySelector('.progress-bar-inner');
            setTimeout(() => {
                progressBarInner.style.width = '90%';
            }, 100); // Small delay to ensure it renders before animating

            // 3. After 2 seconds, freeze progress and start the "sabotage"
            setTimeout(() => {
                // Add shake animation
                modalContent.classList.add('modal-shake');
                
                // 4. After 1.5 seconds of shaking, show the failure message
                setTimeout(() => {
                    modalContent.classList.remove('modal-shake');
                    progressContainer.classList.add('hidden');
                    errorContainer.classList.remove('hidden');
                }, 1500);

            }, 2000);
        });
    }
});