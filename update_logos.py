import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Define the new HTML for the logos grid
logos_html = """    <div class="clients-logo-grid reveal">

      <div class="client-logo-cell">
        <img src="assets/logos/MTN-PR.png" alt="MTN Rwanda" class="client-logo-img" loading="lazy" />
      </div>
      <div class="client-logo-cell">
        <img src="assets/logos/bank of kigali.webp" alt="Bank of Kigali" class="client-logo-img" loading="lazy" />
      </div>
      <div class="client-logo-cell">
        <img src="assets/logos/Rwandair.avif" alt="RwandAir" class="client-logo-img" loading="lazy" />
      </div>
      <div class="client-logo-cell">
        <img src="assets/logos/im-bank-limited-vector-logo.png" alt="I&M Bank" class="client-logo-img" loading="lazy" />
      </div>
      <div class="client-logo-cell">
        <img src="assets/logos/equity logo.png" alt="Equity Bank" class="client-logo-img" loading="lazy" />
      </div>
      <div class="client-logo-cell">
        <img src="assets/logos/radisson blue logo.webp" alt="Radisson Blu" class="client-logo-img" loading="lazy" />
      </div>
      <div class="client-logo-cell">
        <img src="assets/logos/rwanda breweries.png" alt="Rwanda Breweries" class="client-logo-img" loading="lazy" />
      </div>
      <div class="client-logo-cell">
        <img src="assets/logos/bpr bank.webp" alt="BPR Bank" class="client-logo-img" loading="lazy" />
      </div>
      <div class="client-logo-cell">
        <img src="assets/logos/sonarwa-general-squarelogo-1663845926697.webp" alt="Sonarwa" class="client-logo-img" loading="lazy" />
      </div>
      <div class="client-logo-cell">
        <img src="assets/logos/Logo-Vision-Fund-Rwanda.webp" alt="Vision Fund" class="client-logo-img" loading="lazy" />
      </div>
      <div class="client-logo-cell">
        <img src="assets/logos/urwego-bank-logo-png_seeklogo-384009.png" alt="Urwego Bank" class="client-logo-img" loading="lazy" />
      </div>
      <div class="client-logo-cell">
        <img src="assets/logos/crystal ventures.png" alt="Crystal Ventures" class="client-logo-img" loading="lazy" />
      </div>

    </div>"""

# Replace the block
pattern = re.compile(r'    <div class="clients-logo-grid reveal">.*?</div>\n\n    <!-- Client stats -->', re.DOTALL)
new_html = pattern.sub(logos_html + '\n\n    <!-- Client stats -->', html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_html)

# Now update styles.css
with open('styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

new_css = """
.client-logo-img {
  max-width: 140px;
  max-height: 50px;
  width: 100%;
  object-fit: contain;
  opacity: 0.6;
  filter: grayscale(100%);
  transition: all 0.3s ease;
}
.client-logo-cell:hover .client-logo-img {
  opacity: 1;
  filter: grayscale(0%);
  transform: scale(1.05);
}
"""

if '.client-logo-img' not in css:
    css_pattern = re.compile(r'(.client-logo-cell:hover .client-logo-text \{ color: var\(--purple\); \})')
    css = css_pattern.sub(r'\1' + new_css, css)
    
    with open('styles.css', 'w', encoding='utf-8') as f:
        f.write(css)
