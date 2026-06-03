"use strict";
// ─── MICON REAL LINE — main.ts ───────────────────────────────────────────────
// Navbar scroll behaviour
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
    }
    else {
        navbar.classList.remove('scrolled');
    }
}, { passive: true });
// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || href === '#')
            return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            closeMobileMenu();
        }
    });
});
// ─── MOBILE MENU ─────────────────────────────────────────────────────────────
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.getElementById('mobile-menu');
function closeMobileMenu() {
    hamburger?.classList.remove('open');
    mobileMenu?.classList.remove('open');
    document.body.style.overflow = '';
}
hamburger?.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    if (isOpen) {
        closeMobileMenu();
    }
    else {
        hamburger.classList.add('open');
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
});
// ─── SCROLL REVEAL ────────────────────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, i * 80);
        }
        else {
            entry.target.classList.remove('visible');
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
});
function parseCounterValue(raw) {
    const cleaned = raw.replace(/[^0-9.MK+%]/g, '');
    const suffix = raw.replace(/[0-9.]/g, '');
    const value = parseFloat(cleaned);
    const decimals = cleaned.includes('.') ? cleaned.split('.')[1].length : 0;
    return { value, suffix, decimals };
}
function animateCounter(el, target, suffix, decimals, duration = 2000) {
    const start = performance.now();
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const current = target * easeOut(progress);
        const display = decimals > 0 ? current.toFixed(decimals) : Math.floor(current).toString();
        el.textContent = display + suffix;
        if (progress < 1)
            requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const el = entry.target;
        if (entry.isIntersecting) {
            const raw = el.dataset.target || '0';
            const { value, suffix, decimals } = parseCounterValue(raw);
            animateCounter(el, value, suffix, decimals);
        }
        else {
            el.textContent = '0';
        }
    });
}, { threshold: 0.5 });
document.querySelectorAll('[data-counter]').forEach(el => {
    counterObserver.observe(el);
});
// ─── PROGRESS BARS ───────────────────────────────────────────────────────────
const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const bar = entry.target;
        if (entry.isIntersecting) {
            const pct = bar.dataset.width || '0';
            setTimeout(() => { bar.style.width = pct + '%'; }, 200);
        }
        else {
            bar.style.width = '0%';
        }
    });
}, { threshold: 0.3 });
document.querySelectorAll('.progress-bar-fill').forEach(bar => {
    progressObserver.observe(bar);
});
const fields = [
    { id: 'name', label: 'Full Name', required: true, minLength: 2 },
    { id: 'company', label: 'Company', required: false },
    { id: 'email', label: 'Email', required: true, type: 'email' },
    { id: 'phone', label: 'Phone', required: false },
    { id: 'service', label: 'Service', required: true },
    { id: 'message', label: 'Message', required: true, minLength: 10 },
];
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function showError(fieldId, msg) {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(fieldId + '-error');
    input?.classList.add('error');
    if (errorEl) {
        errorEl.textContent = msg;
        errorEl.classList.add('show');
    }
}
function clearError(fieldId) {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(fieldId + '-error');
    input?.classList.remove('error');
    errorEl?.classList.remove('show');
}
function validateForm() {
    let valid = true;
    for (const field of fields) {
        clearError(field.id);
        const el = document.getElementById(field.id);
        if (!el)
            continue;
        const val = el.value.trim();
        if (field.required && !val) {
            showError(field.id, `${field.label} is required.`);
            valid = false;
            continue;
        }
        if (val && field.type === 'email' && !validateEmail(val)) {
            showError(field.id, 'Please enter a valid email address.');
            valid = false;
            continue;
        }
        if (val && field.minLength && val.length < field.minLength) {
            showError(field.id, `${field.label} must be at least ${field.minLength} characters.`);
            valid = false;
        }
    }
    return valid;
}
// Live validation
fields.forEach(field => {
    const el = document.getElementById(field.id);
    el?.addEventListener('blur', () => {
        clearError(field.id);
        const val = el.value.trim();
        if (field.required && !val)
            showError(field.id, `${field.label} is required.`);
        if (val && field.type === 'email' && !validateEmail(val))
            showError(field.id, 'Please enter a valid email address.');
        if (val && field.minLength && val.length < field.minLength)
            showError(field.id, `${field.label} must be at least ${field.minLength} characters.`);
    });
});
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');
const submitBtn = document.getElementById('submit-btn');
contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validateForm())
        return;
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<svg class="spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg> Sending…`;
    }
    // Simulate async submission
    await new Promise(resolve => setTimeout(resolve, 1800));
    contactForm.style.display = 'none';
    if (formSuccess)
        formSuccess.classList.add('show');
});
// CSS for spinner
const style = document.createElement('style');
style.textContent = `.spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(style);
// ─── VIDEO AUTOPLAY ON SCROLL ─────────────────────────────────────────────────
const videoCards = document.querySelectorAll('.video-card');
videoCards.forEach(card => {
    const video = card.querySelector('video');
    if (!video) return;

    // Switch preload from "none" to "metadata" so the browser is ready to play
    video.preload = 'auto';

    // Hover: play / pause
    card.addEventListener('mouseenter', () => { video.play().catch(() => {}); });
    card.addEventListener('mouseleave', () => {
        // Only pause on mouse-leave if the card is still visible (don't fight the scroll observer)
        if (!card.classList.contains('in-view')) video.pause();
    });

    // Scroll: play when 20% of the card enters the viewport, pause when it fully leaves
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                card.classList.add('in-view');
                // Small delay lets the browser finish any pending decode before play()
                setTimeout(() => {
                    video.play().catch(() => {});
                }, 100);
            } else {
                card.classList.remove('in-view');
                video.pause();
            }
        });
    }, {
        threshold: 0.2,       // trigger when 20% of the card is visible
        rootMargin: '0px'     // no extra margin — fires exactly at viewport edge
    });

    scrollObserver.observe(card);
});
// ─── HERO PARALLAX ────────────────────────────────────────────────────────────
const heroVideo = document.getElementById('hero-video');
window.addEventListener('scroll', () => {
    if (!heroVideo)
        return;
    const scrolled = window.scrollY;
    heroVideo.style.transform = `translateY(${scrolled * 0.3}px)`;
}, { passive: true });
