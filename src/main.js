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
    { id: 'consent', label: 'Privacy Policy', required: true, type: 'checkbox' },
];
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function showError(fieldId, msg) {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(fieldId + '-error');
    input?.classList.add('error');
    input?.setAttribute('aria-invalid', 'true');
    if (errorEl) {
        errorEl.textContent = msg;
        errorEl.classList.add('show');
    }
}
function clearError(fieldId) {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(fieldId + '-error');
    input?.classList.remove('error');
    input?.removeAttribute('aria-invalid');
    errorEl?.classList.remove('show');
}
function validateForm() {
    let valid = true;
    for (const field of fields) {
        clearError(field.id);
        const el = document.getElementById(field.id);
        if (!el)
            continue;
            
        if (field.type === 'checkbox') {
            if (field.required && !el.checked) {
                showError(field.id, `You must agree to the ${field.label}.`);
                valid = false;
            }
            continue;
        }

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
    const eventType = field.type === 'checkbox' ? 'change' : 'blur';
    el?.addEventListener(eventType, () => {
        clearError(field.id);
        if (field.type === 'checkbox') {
            if (field.required && !el.checked) showError(field.id, `You must agree to the ${field.label}.`);
            return;
        }
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

  // Initialize EmailJS
  if (window.emailjs) {
    // Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS Public Key
    window.emailjs.init("2NOszPePvv_fItVmV");
  }

  contactForm?.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Honeypot check
      const honeypot = document.getElementById('honeypot');
      if (honeypot && honeypot.value !== '') {
          // Silent block for bots
          console.log('Submission received.');
          contactForm.style.display = 'none';
          if (formSuccess) formSuccess.classList.add('show');
          return;
      }

      if (!validateForm())
          return;
      if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `<svg class="spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg> Sending...`;
      }
      
      try {
          if (window.emailjs) {
              // Replace 'YOUR_TEMPLATE_ID' with your actual EmailJS Template ID
              await window.emailjs.sendForm('service_7eg9g3k', 'template_jz4enqa', contactForm);
          } else {
              // Fallback if EmailJS is not loaded
              await new Promise(resolve => setTimeout(resolve, 1800));
          }
          
          contactForm.style.display = 'none';
          if (formSuccess)
              formSuccess.classList.add('show');
      } catch (error) {
          console.error("EmailJS Error (full):", error);
          // EmailJS errors have .status and .text fields
          const ejsStatus = error?.status ? `[${error.status}]` : '';
          const ejsText = error?.text || error?.message || JSON.stringify(error);
          alert(`Oops! Something went wrong while sending your message.\n\n${ejsStatus} ${ejsText}\n\nCheck the browser console for details.`);
          if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = `
                <div class="svg-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"></path>
                  </svg>
                </div>
                <span>Send Message</span>
              `;
          }
      }
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

function initLocationsMap() {
  const el = document.getElementById('locations-map');
  if (!el || !window.L) return;

  // Add/remove files in `src/assets/` starting with `_c5` and they'll work automatically.
  const c5Images = [
    "assets/_c5a1074.webp",
    "assets/_c5a1093.webp",
    "assets/_c5a1132.webp",
    "assets/_c5a1145.webp",
    "assets/_c5a1146.webp",
    "assets/_c5a1151.webp",
    "assets/_c5a1165.webp",
    "assets/_c5a1171.webp",
    "assets/_c5a1183.webp",
    "assets/_c5a1192.webp",
    "assets/_c5a1230.webp",
    "assets/_c5a1245.webp",
    "assets/_c5a1261.webp",
    "assets/_c5a1272.webp",
    "assets/_c5a1276.webp",
    "assets/_c5a1281.webp",
    "assets/_c5a1295.webp",
    "assets/_c5a1299.webp",
    "assets/_c5a1301.webp",
    "assets/_c5a1705.webp",
    "assets/_c5a1708.webp",
    "assets/_c5a1712.webp",
    "assets/_c5a1723.webp",
    "assets/_c5a1727.webp",
    "assets/_c5a1738.webp",
    "assets/_c5a1742.webp",
    "assets/_c5a1743.webp",
    "assets/_c5a1761.webp",
    "assets/_c5a1787.webp",
    "assets/_c5a1810.webp",
    "assets/_c5a1836 (1).webp",
    "assets/_c5a1836.webp",
    "assets/_c5a1848.webp",
    "assets/_c5a1867.webp"
  ];

  // ✅ Pins parsed from Excel mapping around Kigali major roads
  const locations = [
    { title: 'Kimironko-Kibagabaga (Hospital)-Akabuga ka Nyarutarama', lat: -1.91980, lng: 30.07033 },
    { title: 'Kibagabaga- caiman-Nyarutarama', lat: -1.92714, lng: 30.03486 },
    { title: 'KBC-former Gasabo district', lat: -1.96614, lng: 30.06103 },
    { title: 'Nyarutarama Ku mavase-Kinyinya-Birembo', lat: -1.92445, lng: 30.03272 },
    { title: 'Agakiriro ka Gisozi-Fawe+(Umukindo House-Duhahirane Market-Kacyiru EUCL Branch Office)', lat: -1.95020, lng: 30.02316 },
    { title: 'GISHUSHU-NYARUTARAMA MTN-GACURIRO ROAD', lat: -1.98117, lng: 30.08515 },
    { title: 'Kinamba-Gisozi memorial-Kagugu-Kinyinya sector-Gacuriro (Tigo)', lat: -1.97277, lng: 30.06129 },
    { title: 'Utexrwa road-TV 1-mama sportif-MINUBUMWE', lat: -1.92976, lng: 30.08354 },
    { title: 'Kinamba-UTEXRWA-Akabuga ka Nyarutarama', lat: -1.96061, lng: 30.03611 },
    { title: 'Beausejour Hotel-Rukiri- Gishushu (Feux Rouge)', lat: -1.93648, lng: 30.04058 },
    { title: 'Gisimenti-AUCA-Tel 10-RDB', lat: -1.91384, lng: 30.02657 },
    { title: 'RDB-Controle technique (KG 8Ave)', lat: -1.98009, lng: 30.09240 },
    { title: 'Sonatubes-Rukiri I&II-Gisimenti (roundabout)', lat: -1.91359, lng: 30.04269 },
    { title: 'WDA-EARP Store-Rwahama', lat: -1.95104, lng: 30.06210 },
    { title: 'Giporoso-Kabeza-Rubilizi+Remera corridor', lat: -1.92860, lng: 30.04541 },
    { title: 'Prince House-Zigama CSS-Amahoro National stadium', lat: -1.96388, lng: 30.06399 },
    { title: 'Centre christus- Former Kigali Metropolitan Police HQ Remera-Zigama CSS', lat: -1.94429, lng: 30.05236 },
    { title: 'Gisimenti-Rosty remera-Zigama css', lat: -1.96363, lng: 30.07975 },
    { title: 'St joseph (Niboye)-Sonatubes', lat: -1.98771, lng: 30.02847 },
    { title: 'Kabeza-Niboye (St. Joseph)-Simba Kicukiro', lat: -1.91568, lng: 30.03127 },
    { title: 'Nyabugogo-PoidLourd-Kanogo', lat: -1.92359, lng: 30.05297 },
    { title: 'Cercle sportif-Rwampala-40Km', lat: -1.92894, lng: 30.05220 },
    { title: 'Nyabugogo-Gitikinyoni-Ruliba', lat: -1.94741, lng: 30.04170 },
    { title: 'Nyamirambo BPR- St Andre-Mumena', lat: -1.96453, lng: 30.08533 },
    { title: 'Nyamirambo-Baoba', lat: -1.94901, lng: 30.09447 },
    { title: 'Rwandex-Magerwa-Ocir Caf-Expo ground-Rwandex', lat: -1.94356, lng: 30.05947 },
    { title: 'Rugunga-CGM-NCC/REG-Rwandex', lat: -1.91343, lng: 30.08050 },
    { title: 'KN 3RD-Kicukiro Bralirwa-Zinia market roads-KK 15Rd', lat: -1.97855, lng: 30.02955 },
    { title: 'Kigali city center main roundabout Downtown including Downtown taxis park', lat: -1.97285, lng: 30.06176 },
    { title: 'Nyabugogo-Kimisagara-Nyamirambo', lat: -1.93853, lng: 30.04060 },
    { title: 'Rugunga-sens unique road-CGM-Nyenyeli+Merez 1 to Rwandex-Merez 2-Rujugiro estate-le petit prince school', lat: -1.92924, lng: 30.03344 },
    { title: 'Rwandex-Gitwaza-Master steel-Kicukiro centre+ Kicukiro market', lat: -1.92262, lng: 30.06559 },
    { title: 'Magerwa-Gatenga-Master steel+road to Centre de sante Gatenga', lat: -1.94153, lng: 30.04030 },
    { title: 'RP Nyamirambo-Rwarutabura-Miduha', lat: -1.95194, lng: 30.09338 },
    { title: 'Ubumwe Kinamba', lat: -1.97310, lng: 30.05546 },
    { title: 'Gisimenti-Amahoro Stadium-Controle Technique-Kimironko kobil Petrol station-Rwahama-Metropolitan police-Gisimenti', lat: -1.92186, lng: 30.06860 },
    { title: 'Kacyiru-Police Headquarter-Minagri', lat: -1.94821, lng: 30.07632 },
    { title: 'Remera-Gishushu-Parliament', lat: -1.95420, lng: 30.08811 },
    { title: 'Kigali City Center Expansion', lat: -1.96800, lng: 30.06300 },
    { title: 'Remera Corridor Expansion', lat: -1.93000, lng: 30.04800 },
    { title: 'Kabeza Residential', lat: -1.91800, lng: 30.03500 },
    { title: 'Nyamirambo Stadium Road', lat: -1.96000, lng: 30.08800 },
    { title: 'Kimihurura Central', lat: -1.95200, lng: 30.07000 },
    { title: 'Kacyiru Office Zone', lat: -1.94500, lng: 30.08000 },
    { title: 'Gisozi Heights', lat: -1.94800, lng: 30.02500 },
    { title: 'Nyabugogo Transit', lat: -1.92600, lng: 30.05000 },
    { title: 'Gikondo Industrial', lat: -1.95500, lng: 30.05800 },
    { title: 'Gatenga Commercial', lat: -1.94500, lng: 30.04500 },
    { title: 'Kanombe Airport Road', lat: -1.96000, lng: 30.03000 },
    { title: 'Kibagabaga Eastern', lat: -1.92200, lng: 30.07500 },
    { title: 'Nyarutarama Northern', lat: -1.92000, lng: 30.03000 },
    { title: 'Bumbogo Heights', lat: -1.91000, lng: 30.04000 },
    { title: 'Kimironko Market Extension', lat: -1.91500, lng: 30.06500 },
  ];

  const start = locations[0] ?? { lat: -1.9441, lng: 30.0619 };

  const map = window.L.map(el, {
    scrollWheelZoom: false,
  }).setView([start.lat, start.lng], 12);

  window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors',
    updateWhenZooming: false,
    updateWhenIdle: true,
  }).addTo(map);

  // Classic red pin marker (common style)
  const redPinIcon = window.L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    // Note: Leaflet's default icon is blue; we override with a red icon below if available.
  });

  // Try to use a red marker asset (falls back to default if blocked).
  const redPinIconAlt = window.L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  // Set up a global function for toggling night mode
  window.togglePinMode = function(btn, imgId) {
    const img = document.getElementById(imgId);
    if (!img) return;
    const isNight = img.src.includes(img.dataset.night);
    if (isNight) {
      img.src = img.dataset.day;
      btn.innerHTML = "<i class='bx bx-moon'></i>";
      btn.style.background = "rgba(0,0,0,0.6)";
      btn.style.color = "#fff";
    } else {
      img.src = img.dataset.night;
      btn.innerHTML = "<i class='bx bx-sun'></i>";
      btn.style.background = "rgba(255,255,255,0.9)";
      btn.style.color = "#f59e0b";
    }
  };

  locations.forEach((loc, idx) => {
    const daySrc = escapeHtml(encodeURI(c5Images[idx % c5Images.length]));
    const nightSrc = escapeHtml(encodeURI(c5Images[(idx + 19) % c5Images.length]));

    const popupHtml = `
      <div style="width:280px; position:relative; border-radius:16px; overflow:hidden; line-height:0; background:#fff; box-shadow:0 12px 32px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.1); border:4px solid #fff;">
        <img id="pin-img-${idx}" src="${daySrc}" data-day="${daySrc}" data-night="${nightSrc}" alt="Location" style="width:100%;height:190px;object-fit:cover;display:block;border-radius:12px;" loading="lazy" decoding="async" fetchpriority="low" />
        
        <div style="position:absolute; bottom:0; left:0; right:0; height:50px; background:linear-gradient(to top, rgba(0,0,0,0.7), transparent); border-bottom-left-radius:12px; border-bottom-right-radius:12px; pointer-events:none;"></div>

        <button onclick="window.togglePinMode(this, 'pin-img-${idx}')" style="position:absolute; top:12px; right:12px; background:rgba(255,255,255,0.2); color:white; border:1px solid rgba(255,255,255,0.4); border-radius:50%; width:38px; height:38px; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:22px; backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1); z-index:10; box-shadow:0 4px 12px rgba(0,0,0,0.25);" aria-label="Toggle Night Mode" title="Toggle Night Mode" onmouseover="this.style.background='rgba(255,255,255,0.4)'; this.style.transform='scale(1.05)';" onmouseout="this.style.background='rgba(255,255,255,0.2)'; this.style.transform='scale(1)';">
          <i class='bx bx-moon' style="filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5));"></i>
        </button>
      </div>
    `;

    const marker = window.L.marker([loc.lat, loc.lng], {
      icon: redPinIconAlt ?? redPinIcon,
      title: loc.title,
    }).addTo(map).bindPopup(popupHtml, {
      maxWidth: 280,
      closeButton: true,
    });

    // Open preview on hover and on click.
    marker.on('mouseover', () => marker.openPopup());
    marker.on('mouseout', () => marker.closePopup());
    marker.on('click', () => marker.openPopup());
  });

  // Improve UX: enable scroll zoom after user interacts with map.
  map.on('focus', () => map.scrollWheelZoom.enable());
  map.on('blur', () => map.scrollWheelZoom.disable());
  el.setAttribute('tabindex', '0');
}

// Leaflet loads after main.js (both deferred), so initialize on window load.
window.addEventListener('load', initLocationsMap);

// ─── COOKIE BANNER ────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('cookie-accept');
  const declineBtn = document.getElementById('cookie-decline');
  
  if (!cookieBanner || !acceptBtn) return;
  
  // Check if consent already given
  if (!localStorage.getItem('cookieConsent') && !sessionStorage.getItem('cookieDeclined')) {
    // Show banner after a slight delay
    setTimeout(() => {
      cookieBanner.classList.add('show');
    }, 1000);
  }
  
  acceptBtn.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'true');
    cookieBanner.classList.remove('show');
  });

  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      sessionStorage.setItem('cookieDeclined', 'true');
      cookieBanner.classList.remove('show');
    });
  }
});

