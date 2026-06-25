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
// ─── HERO VIDEO FADE SYSTEM ───────────────────────────────────────────────────
const heroVideo = document.getElementById('hero-video');

function showHeroVideo() {
    if (heroVideo) heroVideo.style.opacity = '1';
}

function heroPlaySequence() {
    if (!heroVideo) return;
    showHeroVideo();
    heroVideo.loop = true;
    heroVideo.play().catch(() => {});
}

if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.defaultMuted = true;
    heroVideo.loop = true;
    heroVideo.playsInline = true;
    heroVideo.setAttribute('muted', '');
    heroVideo.setAttribute('playsinline', '');
    heroVideo.setAttribute('webkit-playsinline', '');

    // Keep the poster/video visible even if mobile autoplay is delayed.
    showHeroVideo();

    // Listen for when enough data is loaded to play
    heroVideo.addEventListener('canplay', heroPlaySequence, { once: true });

    // Defer loading until after the page is interactive — never blocks LCP
    const startVideoLoad = () => {
        if (heroVideo.readyState >= 3) {
            // Already buffered (e.g. cached), play immediately
            heroPlaySequence();
        } else {
            heroVideo.load();
        }
    };

    if (document.readyState === 'complete') {
        // Page already loaded (e.g. cached navigation)
        if ('requestIdleCallback' in window) {
            requestIdleCallback(startVideoLoad, { timeout: 2000 });
        } else {
            startVideoLoad();
        }
    } else {
        window.addEventListener('load', () => {
            if ('requestIdleCallback' in window) {
                requestIdleCallback(startVideoLoad, { timeout: 2000 });
            } else {
                startVideoLoad();
            }
        }, { once: true });
    }

    window.addEventListener('pageshow', heroPlaySequence);
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) heroPlaySequence();
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

  // ✅ Pins from Excel "Ad Spots" sheet — 40 real Micon Real Line locations across Kigali
  const locations = [
    // ── GASABO DISTRICT ──────────────────────────────────────────────────────
    { title: 'Kimironko-Kibagabaga (Hospital)-Akabuga ka Nyarutarama', poles: 134, lat: -1.9198, lng: 30.1003 },
    { title: 'Kibagabaga-Caiman-Nyarutarama', poles: 75,  lat: -1.9149, lng: 30.0958 },
    { title: 'KBC-Former Gasabo District', poles: 70,  lat: -1.9310, lng: 30.0934 },
    { title: 'Nyarutarama Ku Mavase-Kinyinya-Birembo', poles: 149, lat: -1.9082, lng: 30.1015 },
    { title: 'Agakiriro ka Gisozi-Fawe + Umukindo House-Duhahirane Market-Kacyiru EUCL Branch Office', poles: 42,  lat: -1.9397, lng: 30.0742 },
    { title: 'Gishushu-Nyarutarama MTN-Gacuriro Road', poles: 114, lat: -1.9261, lng: 30.0887 },
    { title: 'Kinamba-Gisozi Memorial-Kagugu-Kinyinya Sector-Gacuriro (Tigo)', poles: 281, lat: -1.9350, lng: 30.0820 },
    { title: 'Utexrwa Road-TV 1-Mama Sportif-MINUBUMWE', poles: 28,  lat: -1.9505, lng: 30.0648 },
    { title: 'Kinamba-UTEXRWA-Akabuga ka Nyarutarama', poles: 114, lat: -1.9438, lng: 30.0768 },
    { title: 'Beausejour Hotel-Rukiri-Gishushu (Feux Rouge)', poles: 28,  lat: -1.9320, lng: 30.0862 },
    { title: 'WDA-EARP Store-Rwahama', poles: 13,  lat: -1.9290, lng: 30.1053 },
    { title: 'New Sites in Gasabo', poles: 200, lat: -1.9184, lng: 30.0851 },
    // ── NYARUGENGE DISTRICT ───────────────────────────────────────────────────
    { title: 'Gisimenti-AUCA-Tel 10-RDB', poles: 33,  lat: -1.9540, lng: 30.0613 },
    { title: 'RDB-Controle Technique (KG 8Ave)', poles: 75,  lat: -1.9560, lng: 30.0590 },
    { title: 'Sonatubes-Rukiri I&II-Gisimenti (Roundabout)', poles: 33,  lat: -1.9475, lng: 30.0637 },
    { title: 'Giporoso-Kabeza-Rubilizi + Remera Corridor', poles: 125, lat: -1.9410, lng: 30.0710 },
    { title: 'Prince House-Zigama CSS-Amahoro National Stadium', poles: 13,  lat: -1.9486, lng: 30.0751 },
    { title: 'Centre Christus-Former Kigali Metropolitan Police HQ Remera-Zigama CSS', poles: 16,  lat: -1.9460, lng: 30.0790 },
    { title: 'Gisimenti-Rosty Remera-Zigama CSS', poles: 30,  lat: -1.9450, lng: 30.0820 },
    { title: 'Nyabugogo-PoidLourd-Kanogo', poles: 161, lat: -1.9607, lng: 30.0521 },
    { title: 'Cercle Sportif-Rwampala-40Km', poles: 47,  lat: -1.9635, lng: 30.0552 },
    { title: 'Nyabugogo-Gitikinyoni-Ruliba', poles: 189, lat: -1.9580, lng: 30.0488 },
    { title: 'Nyamirambo BPR-St Andre-Mumena', poles: 36,  lat: -1.9730, lng: 30.0490 },
    { title: 'Nyamirambo-Baoba', poles: 33,  lat: -1.9762, lng: 30.0462 },
    { title: 'Rwandex-Magerwa-Ocir Café-Expo Ground-Rwandex', poles: 49,  lat: -1.9672, lng: 30.0580 },
    { title: 'Rugunga-CGM-NCC/REG-Rwandex', poles: 63,  lat: -1.9641, lng: 30.0608 },
    { title: 'Kigali City Center Main Roundabout Downtown including Downtown Taxis Park', poles: 166, lat: -1.9518, lng: 30.0588 },
    { title: 'Nyabugogo-Kimisagara-Nyamirambo', poles: 152, lat: -1.9649, lng: 30.0534 },
    { title: 'Rugunga-Sens Unique Road-CGM-Nyenyeli + Merez 1 to Rwandex-Merez 2-Rujugiro Estate-Le Petit Prince School', poles: 89,  lat: -1.9595, lng: 30.0560 },
    { title: 'RP Nyamirambo-Rwarutabura-Miduha', poles: 100, lat: -1.9720, lng: 30.0508 },
    { title: 'Ubumwe Kinamba', poles: 76,  lat: -1.9558, lng: 30.0625 },
    { title: 'New Sites in Nyarugenge', poles: 170, lat: -1.9500, lng: 30.0570 },
    // ── KICUKIRO DISTRICT ────────────────────────────────────────────────────
    { title: 'St Joseph (Niboye)-Sonatubes', poles: 100, lat: -1.9808, lng: 30.0655 },
    { title: 'Kabeza-Niboye (St. Joseph)-Simba Kicukiro', poles: 107, lat: -1.9870, lng: 30.0710 },
    { title: 'KN 3rd-Kicukiro Bralirwa-Zinia Market Roads-KK 15Rd', poles: 49,  lat: -1.9928, lng: 30.0610 },
    { title: 'Rwandex-Gitwaza-Master Steel-Kicukiro Centre + Kicukiro Market', poles: 63,  lat: -1.9960, lng: 30.0680 },
    { title: 'Magerwa-Gatenga-Master Steel + Road to Centre de Santé Gatenga', poles: 69,  lat: -2.0005, lng: 30.0640 },
    { title: 'Gisimenti-Airtel-Amahoro Stadium-Controle Technique-Kimironko Kobil Petrol Station-Rwahama-Metropolitan Police-Gisimenti', poles: 137, lat: -1.9752, lng: 30.0740 },
    { title: 'New Sites in Kicukiro', poles: 175, lat: -1.9902, lng: 30.0750 },
    { title: 'Kigali City Center Expansion (Kicukiro access)', poles: 175, lat: -1.9848, lng: 30.0782 },
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

    const polesLabel = loc.poles ? `<div style="line-height:1.2;padding:10px 14px 12px;background:#fff;"><div style="font-size:13px;font-weight:700;color:#111;margin-bottom:2px;">${escapeHtml(loc.title)}</div><div style="font-size:11px;color:#6B21A8;font-weight:600;letter-spacing:0.04em;">🔆 ${loc.poles} Street Poles</div></div>` : '';

    const popupHtml = `
      <div style="width:280px; position:relative; border-radius:16px; overflow:hidden; line-height:0; background:#fff; box-shadow:0 12px 32px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.1); border:4px solid #fff;">
        <img id="pin-img-${idx}" src="${daySrc}" data-day="${daySrc}" data-night="${nightSrc}" alt="Location" style="width:100%;height:160px;object-fit:cover;display:block;border-radius:12px 12px 0 0;" loading="lazy" decoding="async" fetchpriority="low" />
        
        <div style="position:absolute; top:120px; left:0; right:0; height:50px; background:linear-gradient(to top, rgba(0,0,0,0.6), transparent); pointer-events:none;"></div>

        <button onclick="window.togglePinMode(this, 'pin-img-${idx}')" style="position:absolute; top:10px; right:10px; background:rgba(255,255,255,0.2); color:white; border:1px solid rgba(255,255,255,0.4); border-radius:50%; width:34px; height:34px; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:20px; backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1); z-index:10; box-shadow:0 4px 12px rgba(0,0,0,0.25);" aria-label="Toggle Night Mode" title="Toggle Night Mode" onmouseover="this.style.background='rgba(255,255,255,0.4)'; this.style.transform='scale(1.05)';" onmouseout="this.style.background='rgba(255,255,255,0.2)'; this.style.transform='scale(1)';">
          <i class='bx bx-moon' style="filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5));"></i>
        </button>
        ${polesLabel}
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
