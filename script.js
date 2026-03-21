document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. LOADER & ENVELOPE OPENING ---
    const loader = document.getElementById('loader');
    const envelopeScreen = document.getElementById('envelope-screen');
    const mainContent = document.getElementById('main-content');
    const openBtn = document.getElementById('open-invitation');
    const envelope = document.querySelector('.envelope');

    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.classList.add('hidden');
            envelopeScreen.classList.remove('hidden');
        }, 800);
    }, 1500); // reduced from 2000ms for mobile quickness

    openBtn.addEventListener('click', () => {
        envelope.classList.add('open');
        openBtn.style.opacity = '0';
        
        setTimeout(() => {
            envelopeScreen.classList.add('opened');
            setTimeout(() => {
                envelopeScreen.classList.add('hidden');
                mainContent.classList.remove('hidden');
                document.body.classList.remove('locked');
                
                const heroVideo = document.getElementById('hero-video');
                if(heroVideo) heroVideo.play().catch(e => console.log(e));
                
                // Init Flower Shower after content loads
                initFlowerShower();
            }, 800);
        }, 800);
    });

    // --- 2. MOBILE MENU ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
        
        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
    }

    // --- 3. BACKGROUND MUSIC REMOVED ---

    // --- 4. COUNTDOWN TIMER ---
    // Target: April 21, 2026 07:30 PM (Reception)
    const weddingDate = new Date("April 21, 2026 19:30:00").getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            document.getElementById("days").innerText = "00";
            document.getElementById("hours").innerText = "00";
            document.getElementById("minutes").innerText = "00";
            document.getElementById("seconds").innerText = "00";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").innerText = days.toString().padStart(2, '0');
        document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
        document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
        document.getElementById("seconds").innerText = seconds.toString().padStart(2, '0');
    }
    setInterval(updateCountdown, 1000);
    updateCountdown();

    // --- 5. SCROLL REVEAL (Intersection Observer - High Perf) ---
    const revealElements = document.querySelectorAll('.reveal, .reveal-up');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { root: null, rootMargin: '0px 0px -50px 0px', threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- STORY VIDEO AUTOPLAY ON SCROLL ---
    const storyVideo = document.getElementById('story-video');
    if (storyVideo) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    storyVideo.play().catch(e => console.log('Story video autoplay blocked:', e));
                } else {
                    storyVideo.pause();
                }
            });
        }, { threshold: 0.5 });
        videoObserver.observe(storyVideo);
    }

    // --- 6. LIGHTBOX GALLERY ---
    const galleryImgs = document.querySelectorAll('.gallery-img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightbox = document.querySelector('.close-lightbox');

    galleryImgs.forEach(img => {
        img.addEventListener('click', () => {
            lightbox.style.display = 'block';
            lightboxImg.src = img.src;
            document.body.style.overflow = 'hidden';
        });
    });

    closeLightbox.addEventListener('click', () => {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    lightbox.addEventListener('click', (e) => {
        if(e.target === lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // --- 7. RSVP WHATSAPP INTEGRATION ---
    // Removed as per request

    // --- 8. DYNAMIC FLOWER SHOWER ON SCROLL (THROTTLED) ---
    function initFlowerShower() {
        const container = document.getElementById('flower-shower-container');
        if(!container) return;

        let lastScrollTop = window.scrollY;
        let lastScrollTime = Date.now();
        let particles = [];
        const MAX_PARTICLES = window.innerWidth < 768 ? 20 : 40; // hardware capacity scaling
        
        // Simple SVG vectors for lightweight rendering
        const shapes = [
            `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23D4AF37'><path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/></svg>")`, // Gold Heart
            `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%235A0F1C'><ellipse cx='12' cy='12' rx='8' ry='10'/></svg>")`, // Red Petal approx
            `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffb7c5'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z'/></svg>")` // Soft Pink Flower
        ];

        class FlowerParticle {
            constructor(x) {
                this.el = document.createElement('div');
                this.el.className = 'flower-particle';
                this.x = x;
                this.y = -30;
                this.size = Math.random() * 15 + 10;
                this.speedY = Math.random() * 2 + 1;
                this.speedX = (Math.random() - 0.5) * 1;
                this.rotation = Math.random() * 360;
                this.rotSpeed = (Math.random() - 0.5) * 2;
                
                this.el.style.width = `${this.size}px`;
                this.el.style.height = `${this.size}px`;
                this.el.style.backgroundImage = shapes[Math.floor(Math.random() * shapes.length)];
                container.appendChild(this.el);
            }
            update() {
                this.y += this.speedY;
                this.x += this.speedX;
                this.rotation += this.rotSpeed;
                this.el.style.transform = `translate(${this.x}px, ${this.y}px) rotate(${this.rotation}deg)`;
            }
        }

        // Throttle scroll logic to measure speed without locking UI thread
        let scrollTimeout = null;
        let isScrolling = false;
        let currentSpeedContext = 0;

        window.addEventListener('scroll', () => {
            if(!isScrolling) {
                window.requestAnimationFrame(function checkScrollSpeed() {
                    const now = Date.now();
                    const st = window.scrollY;
                    const dt = now - lastScrollTime;
                    const dy = Math.abs(st - lastScrollTop);
                    
                    if (dt > 0) {
                        const speed = dy / dt; // pixels per ms
                        currentSpeedContext = speed;
                        
                        // Spawn particles based on speed
                        if (speed > 0.5 && particles.length < MAX_PARTICLES) {
                            let spawnCount = Math.min(Math.floor(speed * 2), 5); // Max 5 per tick
                            for(let i=0; i<spawnCount; i++) {
                                particles.push(new FlowerParticle(Math.random() * window.innerWidth));
                            }
                        }
                    }

                    lastScrollTop = st;
                    lastScrollTime = now;

                    if (isScrolling) {
                        window.requestAnimationFrame(checkScrollSpeed);
                    }
                });
                isScrolling = true;
            }

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
                currentSpeedContext = 0;
            }, 100);
        }, { passive: true }); // passive true for scroll perf

        // Main animation loop
        function animateParticles() {
            for (let i = 0; i < particles.length; i++) {
                let p = particles[i];
                p.update();

                // Remove when out of screen bounds
                if (p.y > window.innerHeight) {
                    p.el.remove();
                    particles.splice(i, 1);
                    i--;
                }
            }
            requestAnimationFrame(animateParticles);
        }
        
        requestAnimationFrame(animateParticles);
    }

});
