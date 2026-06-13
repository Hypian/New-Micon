import re

# Update HTML
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Remove video
html = re.sub(r'  <!-- Video Background -->\s*<video\s+id="hero-video".*?</video>\s*', '', html, flags=re.DOTALL)

# Re-structure hero content
old_hero_content = """  <!-- Hero Content -->
  <div class="hero-content">



    <h1 class="hero-headline tracking-in-contract-bck-bottom">
      <span class="line">Real Results.</span>
      <span class="line">Real Impact.</span>
    </h1>

    <p class="hero-sub tracking-in-contract-bck-bottom">
      Rwanda's premier advertising and technology company — delivering premium outdoor media, digital solutions, and brand experiences that move people.
    </p>

    <div class="hero-btns">"""

new_hero_content = """  <!-- Hero Content -->
  <div class="hero-content">

    <!-- Left: Text -->
    <div class="hero-content-left">
      <h1 class="hero-headline tracking-in-contract-bck-bottom">
        <span class="line">Real Results.</span>
        <span class="line">Real Impact.</span>
      </h1>

      <p class="hero-sub tracking-in-contract-bck-bottom">
        Rwanda's premier advertising and technology company — delivering premium outdoor media, digital solutions, and brand experiences that move people.
      </p>

      <div class="hero-btns" style="justify-content: flex-start;">"""

html = html.replace(old_hero_content, new_hero_content)

old_hero_end = """    </div>

  </div>

  <!-- Scroll Indicator -->"""

new_hero_end = """    </div>
    </div> <!-- End Left -->

    <!-- Right: Placeholder Asset -->
    <div class="hero-content-right reveal-right">
      <div class="hero-placeholder-asset">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="opacity: 0.5; margin-bottom: 12px;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
        <div>Asset Placeholder</div>
      </div>
    </div>

  </div>

  <!-- Scroll Indicator -->"""

html = html.replace(old_hero_end, new_hero_end)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)


# Update CSS
with open('styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Make hero-overlay opaque since video is gone
css = css.replace(
    'rgba(107,33,168,0.88) 0%,',
    '#581c87 0%, /* Opaque purple-900 */'
).replace(
    'rgba(15,23,42,0.72) 45%,',
    '#0f172a 45%, /* Opaque slate-900 */'
).replace(
    'rgba(236,30,107,0.5) 100%',
    '#be123c 100% /* Opaque rose-700 */'
)

# Update .hero-content
old_css_hero = """.hero-content {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding-top: 100px;
  padding-bottom: 80px;
}"""

new_css_hero = """.hero-content {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  width: 100%;
  text-align: left;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  min-height: 100vh;
  padding-top: 100px;
  padding-bottom: 80px;
  gap: 60px;
}

.hero-content-left {
  flex: 1;
  max-width: 55%;
}

.hero-content-right {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-placeholder-asset {
  width: 100%;
  max-width: 500px;
  aspect-ratio: 1 / 1;
  background: rgba(255,255,255,0.03);
  border: 2px dashed rgba(255,255,255,0.15);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-faint);
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  backdrop-filter: blur(10px);
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
  transition: all 0.3s ease;
}

.hero-placeholder-asset:hover {
  border-color: rgba(255,255,255,0.3);
  background: rgba(255,255,255,0.06);
}

@media (max-width: 992px) {
  .hero-content {
    flex-direction: column;
    text-align: center;
    padding-top: 140px;
    gap: 40px;
  }
  .hero-content-left {
    max-width: 100%;
  }
}"""

css = css.replace(old_css_hero, new_css_hero)

with open('styles.css', 'w', encoding='utf-8') as f:
    f.write(css)
