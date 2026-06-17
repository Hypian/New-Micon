"""
Build & Utility Scripts for Micon Real Line Website
======================================================

This file consolidates maintenance utilities used during development.
These are legacy scripts and generally not needed after initial setup.

Functions:
- fix_hero_alignment(): Aligns hero section text
- fix_button_styles(): Converts button HTML to animated versions  
- update_client_logos(): Updates the client logo grid in HTML
- append_custom_css(): Appends custom button styles to CSS

Note: The website works perfectly without running these. Only use if:
- HTML/CSS structure needs to be reset
- Button animations need to be regenerated
- Logo grid needs updating
"""

import re
import os


def fix_hero_alignment():
    """Fix hero section text alignment (left-aligned on desktop)"""
    with open('../src/styles.css', 'r', encoding='utf-8') as f:
        css = f.read()

    # Fix .hero-headline
    css = css.replace(
        '  overflow: hidden;\n  text-align: center;\n  color: white;',
        '  overflow: hidden;\n  text-align: left;\n  color: white;'
    )

    # Fix .hero-sub
    old_sub = """.hero-sub {
  max-width: 620px;
  font-size: clamp(16px, 2vw, 20px);
  font-weight: 400;
  color: rgba(255,255,255,0.9);
  line-height: 1.6;
  margin: 0 auto 44px;
  opacity: 0;
  animation: fade-in 1s ease 0.6s forwards;
  text-align: center;
  text-shadow: 0 4px 12px rgba(0,0,0,0.5);
}"""

    new_sub = """.hero-sub {
  max-width: 620px;
  font-size: clamp(16px, 2vw, 20px);
  font-weight: 400;
  color: rgba(255,255,255,0.9);
  line-height: 1.6;
  margin: 0 0 44px 0;
  opacity: 0;
  animation: fade-in 1s ease 0.6s forwards;
  text-align: left;
  text-shadow: 0 4px 12px rgba(0,0,0,0.5);
}"""
    
    css = css.replace(old_sub, new_sub)

    with open('../src/styles.css', 'w', encoding='utf-8') as f:
        f.write(css)
    
    print("✓ Hero alignment fixed")


def fix_button_styles():
    """Convert button HTML to animated versions with character-level animations"""
    def convert_button(match):
        full_match = match.group(0)
        tag_open = match.group(1)
        inner_text = match.group(2).strip()
        svg_icon = match.group(3).strip()
        tag_close = match.group(4)
        
        # Generate animated text spans
        spans = []
        for i, char in enumerate(inner_text):
            if char == " ":
                spans.append(f'<span style="--i:{i}">&nbsp;</span>')
            else:
                spans.append(f'<span style="--i:{i}">{char}</span>')
        spans_html = "".join(spans)
        
        # Construct new HTML
        new_html = f"""{tag_open}
  <div class="outline"></div>
  <div class="state state--default">
    <div class="icon">
      {svg_icon}
    </div>
    <p>
      {spans_html}
    </p>
  </div>
  <div class="state state--sent">
    <div class="icon">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
    </div>
    <p>
      <span style="--i:0">D</span><span style="--i:1">o</span><span style="--i:2">n</span><span style="--i:3">e</span>
    </p>
  </div>
{tag_close}"""
        
        return new_html

    with open('../src/index.html', 'r', encoding='utf-8') as f:
        content = f.read()

    pattern = re.compile(r'(<(?:a|button)[^>]+class="[^"]*btn-[^"]*"[^>]*>)\s*([^<]+)\s*(<svg[^>]*>.*?</svg>)\s*(</(?:a|button)>)', re.DOTALL)
    
    new_content = pattern.sub(convert_button, content)
    
    with open('../src/index.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("✓ Button styles updated")


def update_client_logos():
    """Update the client logo grid in the HTML"""
    with open('../src/index.html', 'r', encoding='utf-8') as f:
        html = f.read()

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

    </div>"""

    pattern = re.compile(r'    <div class="clients-logo-grid reveal">.*?</div>\n\n    <!-- Client stats -->', re.DOTALL)
    new_html = pattern.sub(logos_html + '\n\n    <!-- Client stats -->', html)

    with open('../src/index.html', 'w', encoding='utf-8') as f:
        f.write(new_html)
    
    print("✓ Client logos updated")


if __name__ == '__main__':
    print("Micon Real Line — Build Utilities")
    print("==================================\n")
    print("These are legacy development scripts.")
    print("The website works perfectly without running them.\n")
    print("Available functions:")
    print("  - fix_hero_alignment()")
    print("  - fix_button_styles()")
    print("  - update_client_logos()")
