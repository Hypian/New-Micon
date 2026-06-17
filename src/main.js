// ─── MICON REAL LINE — main.js ───────────────────────────────────────────────
// Navbar scroll behaviour
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
}
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
    const isOpen = mobileMenu?.classList.contains('open');
    if (isOpen) {
        closeMobileMenu();
    }
    else {
        hamburger.classList.add('open');
        mobileMenu?.classList.add('open');
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
// ─── VIDEO LAZY LOAD & AUTOPLAY ON SCROLL ─────────────────────────────────────
const videoCards = document.querySelectorAll('.video-card');
videoCards.forEach(card => {
    const video = card.querySelector('video');
    if (!video) return;
    const source = video.querySelector('source');
    const lazySrc = source ? source.getAttribute('src') : video.getAttribute('src');
    let loaded = false;

    function lazyLoadVideo() {
        if (loaded || !lazySrc) return;
        // Only set src when needed (lazy load)
        if (source && !video.getAttribute('src')) {
            // source element already has src, just load
        } else if (!source) {
            video.src = lazySrc;
        }
        video.load();
        loaded = true;
    }

    card.addEventListener('mouseenter', () => {
        lazyLoadVideo();
        video.play().catch(() => {});
    });
    card.addEventListener('mouseleave', () => {
        if (!card.classList.contains('in-view')) video.pause();
    });
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                card.classList.add('in-view');
                lazyLoadVideo();
                video.currentTime = 0;
                setTimeout(() => { video.play().catch(() => {}); }, 150);
            } else {
                card.classList.remove('in-view');
                video.pause();
            }
        });
    }, { threshold: 0.15, rootMargin: '200px 0px' });
    scrollObserver.observe(card);
});
// ─── HERO VIDEO FADE SYSTEM ───────────────────────────────────────────────────
const heroVideo = document.getElementById('hero-video');
let heroFadeFrame = null;
let heroOpacity = 0;

function setHeroOpacity(value) {
    heroOpacity = Math.max(0, Math.min(1, value));
    if (heroVideo) heroVideo.style.opacity = heroOpacity.toString();
}

function cancelHeroFade() {
    if (heroFadeFrame) {
        cancelAnimationFrame(heroFadeFrame);
        heroFadeFrame = null;
    }
}

function heroFadeTo(targetOpacity, duration) {
    cancelHeroFade();
    const start = performance.now();
    const initial = heroOpacity;
    const delta = targetOpacity - initial;

    function tick(now) {
        const progress = Math.min(1, (now - start) / duration);
        setHeroOpacity(initial + delta * progress);
        if (progress < 1) {
            heroFadeFrame = requestAnimationFrame(tick);
        } else {
            heroFadeFrame = null;
        }
    }

    heroFadeFrame = requestAnimationFrame(tick);
}

function heroPlaySequence() {
    if (!heroVideo) return;
    setHeroOpacity(0);
    heroVideo.loop = true;
    heroVideo.play().catch(() => {});
    heroFadeTo(1, 250);
}

if (heroVideo) {
    heroVideo.addEventListener('loadeddata', () => {
        heroPlaySequence();
    });
}

// ─── ACTIVE NAV LINK ON SCROLL ───────────────────────────────────────────────
const sections = ['hero','about','services','lineads','clients','cta','contact'];
const menuLinks = document.querySelectorAll('.menu a');

function updateActiveLink() {
  const scrollY = window.scrollY + 120;
  let current = 'hero';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= scrollY) current = id;
  });
  menuLinks.forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === '#' + current);
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();

/* ══════════════════════════════════════════════════════
   IDLE NAV BLOB ANIMATION
   ══════════════════════════════════════════════════════ */
let navIdleTimeout;
function resetNavIdleTimer() {
  document.body.classList.remove('nav-idle');
  clearTimeout(navIdleTimeout);
  navIdleTimeout = setTimeout(() => {
    document.body.classList.add('nav-idle');
  }, 5000);
}

// Initial start
resetNavIdleTimer();
document.addEventListener('mousemove', resetNavIdleTimer, { passive: true });
document.addEventListener('keydown', resetNavIdleTimer, { passive: true });
resetNavIdleTimer();

// Listeners
window.addEventListener('mousemove', resetNavIdleTimer);
window.addEventListener('scroll', resetNavIdleTimer, { passive: true });
window.addEventListener('click', resetNavIdleTimer);
window.addEventListener('keydown', resetNavIdleTimer);
window.addEventListener('touchstart', resetNavIdleTimer, { passive: true });

/* ------------------------------------------------------
   LOCATIONS MAP (Google Maps + pinned locations)
   ------------------------------------------------------ */
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (ch) => {
    switch (ch) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#039;';
      default: return ch;
    }
  });
}

window.initLocationsMap = function initLocationsMap() {
  const el = document.getElementById('locations-map');
  if (!el || !window.google || !window.google.maps) return;

  // Edit these pins (lat/lng + image) to match your real pole locations.
  const locations = [
    {
      title: 'Kigali CBD',
      position: { lat: -1.9441, lng: 30.0619 },
      image: 'src/assets/1.jpg',
    },
    {
      title: 'Kigali Heights',
      position: { lat: -1.9536, lng: 30.0925 },
      image: 'src/assets/2.jpg',
    },
    {
      title: 'Kimironko',
      position: { lat: -1.9366, lng: 30.1306 },
      image: 'src/assets/3.jpg',
    },
  ];

  const map = new window.google.maps.Map(el, {
    center: locations[0]?.position ?? { lat: -1.9441, lng: 30.0619 },
    zoom: 12,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
  });

  const infoWindow = new window.google.maps.InfoWindow();

  locations.forEach((loc) => {
    const marker = new window.google.maps.Marker({
      map,
      position: loc.position,
      title: loc.title,
    });

    marker.addListener('click', () => {
      const title = escapeHtml(loc.title);
      const imgSrc = escapeHtml(loc.image);
      infoWindow.setContent(`
        <div style="max-width:260px">
          <div style="font-weight:800;margin:0 0 10px 0;color:#111827;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;">
            ${title}
          </div>
          <img src="${imgSrc}" alt="${title}" style="width:100%;height:160px;object-fit:cover;border-radius:12px;border:1px solid rgba(17,24,39,0.12);" loading="lazy" />
        </div>
      `);
      infoWindow.open({ map, anchor: marker });
    });
  });
};
