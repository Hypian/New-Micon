import re
import os

html_file = 'index.html'
css_file = 'styles.css'
ts_file = 'main.ts'

with open(html_file, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Fonts & Tailwind config & Boxicons
html = html.replace(
    '<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap" rel="stylesheet" />',
    '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />'
)
html = html.replace(
    '<!-- Lucide Icons -->\n  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>',
    '''<!-- Lucide Icons -->
  <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.min.js"></script>
  <!-- Boxicons -->
  <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>'''
)

html = html.replace(
    "primary: '#0A192F',",
    "primary: '#ffffff',"
)
html = html.replace(
    "surface: '#0f2540',",
    "surface: '#f8fafc',"
)

# 2. Replace navbar and mobile menu
nav_pattern = re.compile(r'<!-- ═══════════════════════════════════════════════════════════\s*NAVBAR\s*═══════════════════════════════════════════════════════════ -->.*?</div>\s*</div>\s*</nav>', re.DOTALL)
html = nav_pattern.sub('', html)

mobile_menu_pattern = re.compile(r'<!-- Mobile Menu -->\s*<div id="mobile-menu"[^>]*>.*?</div>', re.DOTALL)
html = mobile_menu_pattern.sub('', html)

# 3. Add bottom menu right after body opening
menu_html = '''
<!-- Floating Glassy Bottom Menu -->
<div class="menu">
  <a href="#hero" class="active">
    <i class='bx bx-home'></i>
    <span>Home</span>
  </a>
  <a href="#about">
    <i class='bx bx-info-circle'></i>
    <span>About</span>
  </a>
  <a href="#services">
    <i class='bx bx-briefcase'></i>
    <span>Services</span>
  </a>
  <a href="#lineads">
    <i class='bx bx-line-chart'></i>
    <span>LineAds</span>
  </a>
  <a href="#contact">
    <i class='bx bx-envelope'></i>
    <span>Contact</span>
  </a>
</div>
'''
html = html.replace('<body class="noise">', '<body class="noise">' + menu_html)

with open(html_file, 'w', encoding='utf-8') as f:
    f.write(html)

print("Updated index.html")

# -----------------
# STYLES.CSS
# -----------------
with open(css_file, 'r', encoding='utf-8') as f:
    css = f.read()

# Replace fonts
css = css.replace("'Syne', sans-serif", "'Inter', sans-serif")
css = css.replace("'DM Sans', sans-serif", "'Inter', sans-serif")

# Replace variables
css = css.replace('--primary: #0A192F;', '--primary: #ffffff;')
css = css.replace('--surface: #0f2540;', '--surface: #f8fafc;')
css = css.replace('--surface-2: #1a365d;', '--surface-2: #f1f5f9;')
css = css.replace('--text-primary: #ffffff;', '--text-primary: #0f172a;')
css = css.replace('--text-secondary: #e2e8f0;', '--text-secondary: #334155;')
css = css.replace('--text-muted: #94a3b8;', '--text-muted: #64748b;')
css = css.replace('--border: rgba(255, 255, 255, 0.1);', '--border: #e2e8f0;')
css = css.replace('--glass-light: rgba(255, 255, 255, 0.04);', '--glass-light: rgba(255, 255, 255, 0.7);')
css = css.replace('--glass-border: rgba(255, 255, 255, 0.08);', '--glass-border: rgba(0, 0, 0, 0.1);')

# Specific hardcoded colors
css = css.replace('color: white;', 'color: var(--text-primary);')
css = css.replace('color: #ffffff;', 'color: var(--text-primary);')
# Revert color for buttons or specific dark elements if needed (e.g. .btn-primary)
css = css.replace('background: var(--accent);\n  color: var(--text-primary);', 'background: var(--accent);\n  color: white;')
css = css.replace('background: #1d4ed8;\n  color: var(--text-primary);', 'background: #1d4ed8;\n  color: white;')

# Append new menu CSS
menu_css = '''
/* Uiverse Navbar */
.menu {
  position: fixed;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  width: calc(100% - 20px);
  max-width: 520px;
  backdrop-filter: blur(12px) saturate(180%) contrast(200%);
  -webkit-backdrop-filter: blur(12px) saturate(180%) contrast(200%);
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid var(--glass-border);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  padding: 8px;
  border-radius: 99rem;
  display: flex;
  justify-content: center;
  gap: 8px;
  z-index: 50;
}

.menu::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow:
    inset 2px 2px 5px -2px rgba(255, 255, 255, 0.4),
    inset -2px -2px 5px 2px rgba(255, 255, 255, 0.4),
    inset 0 -2px 0 rgba(255, 255, 255, 0.2);
  pointer-events: none;
  z-index: -1;
}

.menu a {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1 1 0;
  min-width: 0;
  color: var(--text-muted);
  text-decoration: none;
  padding: 10px 6px;
  border-radius: 999rem;
  -webkit-tap-highlight-color: transparent;
  transition: all 0.18s ease-in-out;
}

.menu a:hover {
  background-color: rgba(37, 99, 235, 0.05);
  transform: translateY(-2px);
  color: var(--accent);
}

.menu a i {
  font-size: 1.4rem;
}

.menu a span {
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1;
  margin-top: 4px;
}

.menu a.active {
  background: rgba(37, 99, 235, 0.1);
  color: var(--accent);
}

.menu a:active {
  transform: scale(0.98);
}
'''
css += menu_css

with open(css_file, 'w', encoding='utf-8') as f:
    f.write(css)
print("Updated styles.css")

# -----------------
# MAIN.TS
# -----------------
with open(ts_file, 'r', encoding='utf-8') as f:
    ts = f.read()

# Remove mobile menu logic and active nav logic as the old navbar doesn't exist
ts = re.sub(r'// ─── NAVBAR & MOBILE MENU.*?// ─── SCROLL REVEAL', '// ─── SCROLL REVEAL', ts, flags=re.DOTALL)
# active-nav-link logic (if any)
# we might need to write a new observer for the bottom menu, but for now we just remove the old logic

with open(ts_file, 'w', encoding='utf-8') as f:
    f.write(ts)
print("Updated main.ts")
