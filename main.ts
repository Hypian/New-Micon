// ─── MICON REAL LINE — main.ts ───────────────────────────────────────────────

// Navbar scroll behaviour
const navbar = document.getElementById('navbar') as HTMLElement;
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// Smooth scroll for nav links
document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      closeMobileMenu();
    }
  });
});

// ─── MOBILE MENU ─────────────────────────────────────────────────────────────
const hamburger = document.querySelector<HTMLButtonElement>('.hamburger');
const mobileMenu = document.getElementById('mobile-menu') as HTMLElement;

function closeMobileMenu(): void {
  hamburger?.classList.remove('open');
  mobileMenu?.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger?.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.contains('open');
  if (isOpen) {
    closeMobileMenu();
  } else {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
});

// ─── SCROLL REVEAL ────────────────────────────────────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
      } else {
        entry.target.classList.remove('visible');
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
);

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

// ─── ANIMATED COUNTERS ───────────────────────────────────────────────────────
interface CounterTarget {
  el: HTMLElement;
  target: number;
  suffix: string;
  decimals: number;
}

function parseCounterValue(raw: string): { value: number; suffix: string; decimals: number } {
  const cleaned = raw.replace(/[^0-9.MK+%]/g, '');
  const suffix = raw.replace(/[0-9.]/g, '');
  const value = parseFloat(cleaned);
  const decimals = cleaned.includes('.') ? cleaned.split('.')[1].length : 0;
  return { value, suffix, decimals };
}

function animateCounter(el: HTMLElement, target: number, suffix: string, decimals: number, duration = 2000): void {
  const start = performance.now();
  const easeOut = (t: number): number => 1 - Math.pow(1 - t, 3);

  function tick(now: number): void {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const current = target * easeOut(progress);
    const display = decimals > 0 ? current.toFixed(decimals) : Math.floor(current).toString();
    el.textContent = display + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      const el = entry.target as HTMLElement;
      if (entry.isIntersecting) {
        const raw = el.dataset.target || '0';
        const { value, suffix, decimals } = parseCounterValue(raw);
        animateCounter(el, value, suffix, decimals);
      } else {
        el.textContent = '0';
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll<HTMLElement>('[data-counter]').forEach(el => {
  counterObserver.observe(el);
});

// ─── PROGRESS BARS ───────────────────────────────────────────────────────────
const progressObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      const bar = entry.target as HTMLElement;
      if (entry.isIntersecting) {
        const pct = bar.dataset.width || '0';
        setTimeout(() => { bar.style.width = pct + '%'; }, 200);
      } else {
        bar.style.width = '0%';
      }
    });
  },
  { threshold: 0.3 }
);

document.querySelectorAll<HTMLElement>('.progress-bar-fill').forEach(bar => {
  progressObserver.observe(bar);
});

// ─── CONTACT FORM VALIDATION ─────────────────────────────────────────────────
interface FieldConfig {
  id: string;
  label: string;
  required: boolean;
  type?: string;
  minLength?: number;
}

const fields: FieldConfig[] = [
  { id: 'name', label: 'Full Name', required: true, minLength: 2 },
  { id: 'company', label: 'Company', required: false },
  { id: 'email', label: 'Email', required: true, type: 'email' },
  { id: 'phone', label: 'Phone', required: false },
  { id: 'service', label: 'Service', required: true },
  { id: 'message', label: 'Message', required: true, minLength: 10 },
];

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(fieldId: string, msg: string): void {
  const input = document.getElementById(fieldId) as HTMLInputElement | null;
  const errorEl = document.getElementById(fieldId + '-error') as HTMLElement | null;
  input?.classList.add('error');
  if (errorEl) {
    errorEl.textContent = msg;
    errorEl.classList.add('show');
  }
}

function clearError(fieldId: string): void {
  const input = document.getElementById(fieldId) as HTMLInputElement | null;
  const errorEl = document.getElementById(fieldId + '-error') as HTMLElement | null;
  input?.classList.remove('error');
  errorEl?.classList.remove('show');
}

function validateForm(): boolean {
  let valid = true;

  for (const field of fields) {
    clearError(field.id);
    const el = document.getElementById(field.id) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;
    if (!el) continue;
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
    const val = (el as HTMLInputElement).value.trim();
    if (field.required && !val) showError(field.id, `${field.label} is required.`);
    if (val && field.type === 'email' && !validateEmail(val)) showError(field.id, 'Please enter a valid email address.');
    if (val && field.minLength && val.length < field.minLength) showError(field.id, `${field.label} must be at least ${field.minLength} characters.`);
  });
});

const contactForm = document.getElementById('contact-form') as HTMLFormElement | null;
const formSuccess = document.getElementById('form-success') as HTMLElement | null;
const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement | null;

contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<svg class="spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg> Sending…`;
  }

  // Simulate async submission
  await new Promise(resolve => setTimeout(resolve, 1800));

  contactForm.style.display = 'none';
  if (formSuccess) formSuccess.classList.add('show');
});

// CSS for spinner
const style = document.createElement('style');
style.textContent = `.spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(style);

// ─── VIDEO HOVER AUTOPLAY ─────────────────────────────────────────────────────
document.querySelectorAll<HTMLVideoElement>('.video-card video').forEach(video => {
  const card = video.closest('.video-card') as HTMLElement | null;
  if (!card) return;
  card.addEventListener('mouseenter', () => { video.play().catch(() => {}); });
  card.addEventListener('mouseleave', () => { video.pause(); });
});

// ─── HERO PARALLAX ────────────────────────────────────────────────────────────
const heroVideo = document.getElementById('hero-video') as HTMLVideoElement | null;
window.addEventListener('scroll', () => {
  if (!heroVideo) return;
  const scrolled = window.scrollY;
  heroVideo.style.transform = `translateY(${scrolled * 0.3}px)`;
}, { passive: true });
