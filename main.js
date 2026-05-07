// Mobile Menu and Scroll Interactions
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    const leadForm = document.getElementById('lead-form');

    // Scroll effect for header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.padding = '1rem 0';
            header.style.backgroundColor = 'rgba(5, 5, 5, 0.95)';
        } else {
            header.style.padding = '1.5rem 0';
            header.style.backgroundColor = 'rgba(5, 5, 5, 0.8)';
        }
    });

    // Form Handling
    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(leadForm);
            const data = Object.fromEntries(formData.entries());
            
            console.log('Form submitted:', data);
            
            // Simple feedback
            const btn = leadForm.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = 'ENVIANDO...';
            btn.disabled = true;

            setTimeout(() => {
                alert('Obrigado! Em breve um de nossos especialistas entrará em contato.');
                btn.textContent = originalText;
                btn.disabled = false;
                leadForm.reset();
            }, 1500);
        });
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feat-item, .lang-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });

    // Fixed Banner Visibility + Footer Docking
    const fixedBanner = document.getElementById('fixed-cta');
    const footerEl = document.querySelector('.footer');

    const updateBanner = () => {
        const scrolled = window.scrollY > 500;
        if (scrolled) {
            fixedBanner.classList.add('visible');
        } else {
            fixedBanner.classList.remove('visible');
            return;
        }

        // Dock inside footer when footer enters viewport
        const footerRect = footerEl.getBoundingClientRect();
        const bannerHeight = fixedBanner.offsetHeight;

        if (footerRect.top < window.innerHeight) {
            // Place banner top at footer top + 1.5rem (inside footer)
            const bottom = window.innerHeight - footerRect.top - bannerHeight - 24;
            fixedBanner.style.bottom = Math.max(0, bottom) + 'px';
            fixedBanner.classList.add('docked');
        } else {
            fixedBanner.style.bottom = '1.5rem';
            fixedBanner.classList.remove('docked');
        }
    };

    window.addEventListener('scroll', updateBanner, { passive: true });

    // Method Steps Progression
    const stepCards = document.querySelectorAll('.step-card[data-step]');
    const stepConnectors = document.querySelectorAll('.step-connector');
    const STEP_DURATION = 3500;

    function activateMethodStep(index) {
        stepCards.forEach((card, i) => {
            card.classList.toggle('active', i === index);
        });

        stepConnectors.forEach((conn, i) => {
            conn.classList.remove('filling', 'filled');
            // Force reflow to restart CSS animation
            void conn.offsetWidth;

            if (i < index) {
                conn.classList.add('filled');
            } else if (i === index) {
                conn.classList.add('filling');
            }
        });
    }

    if (stepCards.length) {
        let methodStep = 0;
        activateMethodStep(0);

        setInterval(() => {
            methodStep = (methodStep + 1) % stepCards.length;
            activateMethodStep(methodStep);
        }, STEP_DURATION);
    }

    // Services Carousel
    (function () {
        const track   = document.getElementById('svc-track');
        const prevBtn = document.getElementById('svc-prev');
        const nextBtn = document.getElementById('svc-next');
        const dotsEl  = document.getElementById('svc-dots');
        if (!track) return;

        const slides = track.querySelectorAll('.svc-slide');
        const total  = slides.length;
        let idx = 0;

        // Build dots
        slides.forEach((_, i) => {
            const btn = document.createElement('button');
            btn.className = 'svc-dot' + (i === 0 ? ' active' : '');
            btn.setAttribute('aria-label', `Slide ${i + 1}`);
            btn.addEventListener('click', () => goTo(i));
            dotsEl.appendChild(btn);
        });

        function goTo(n) {
            idx = Math.max(0, Math.min(n, total - 1));
            track.style.transform = `translateX(-${idx * 100}%)`;
            if (prevBtn) prevBtn.style.opacity = idx === 0 ? '0.3' : '1';
            if (nextBtn) nextBtn.style.opacity = idx === total - 1 ? '0.3' : '1';
            dotsEl.querySelectorAll('.svc-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
        }

        if (prevBtn) prevBtn.addEventListener('click', () => goTo(idx - 1));
        if (nextBtn) nextBtn.addEventListener('click', () => goTo(idx + 1));

        // Touch swipe
        let startX = 0;
        track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
        track.addEventListener('touchend', e => {
            const dx = e.changedTouches[0].clientX - startX;
            if (Math.abs(dx) > 50) goTo(dx < 0 ? idx + 1 : idx - 1);
        }, { passive: true });

        goTo(0);
    }());

    // Cases Carousel
    const track = document.getElementById('results-track');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');

    if (track && prevBtn && nextBtn) {
        const cards = track.querySelectorAll('.result-card');
        const visibleCount = () => window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
        let currentIndex = 0;

        function updateCarousel() {
            const visible = visibleCount();
            const maxIndex = cards.length - visible;
            currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));
            const cardWidth = cards[0].getBoundingClientRect().width;
            const gap = 24; // 1.5rem
            track.style.transform = `translateX(-${currentIndex * (cardWidth + gap)}px)`;
            prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
            nextBtn.style.opacity = currentIndex >= maxIndex ? '0.3' : '1';
        }

        prevBtn.addEventListener('click', () => { currentIndex--; updateCarousel(); });
        nextBtn.addEventListener('click', () => { currentIndex++; updateCarousel(); });
        window.addEventListener('resize', updateCarousel);
        updateCarousel();
    }

    // Smooth scroll for all anchor buttons
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (!target) return;
            e.preventDefault();
            const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
            const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    // Ripple animation on CTA buttons
    document.querySelectorAll('.btn-primary, .btn-dark, .btn-roas, .btn-banner').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            const ripple = document.createElement('span');
            ripple.classList.add('ripple-wave');
            ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
            btn.appendChild(ripple);
            ripple.addEventListener('animationend', () => ripple.remove());
        });
    });
});
