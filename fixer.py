import re
import os

css_file = 'styles.css'
with open(css_file, 'r', encoding='utf-8') as f:
    css = f.read()

# 1. Move navbar to top
css = css.replace('bottom: 24px;', 'top: 24px;')
# Also adjust the Uiverse CSS shadow for top position maybe, but top: 24px is fine.

# 2. Fix CTA inner background to light or vibrant
css = css.replace('background: linear-gradient(135deg, #0d2040, #0a192f);', 'background: var(--accent); color: white;')
# Fix CTA h2 and p colors to white so they are visible on accent background
css = re.sub(r'(\.cta-inner h2 \{[^}]*)color: var\(--text-primary\);([^}]*\})', r'\1color: white;\2', css)
css = re.sub(r'(\.cta-inner p \{[^}]*)color: var\(--text-secondary\);([^}]*\})', r'\1color: rgba(255,255,255,0.9);\2', css)

# 3. Fix Footer background
css = css.replace('background: #060f1d;', 'background: var(--surface-2);')
# Footer logo text should be text-primary
css = css.replace('color: white;', 'color: var(--text-primary);') # A broad fix but wait, we already did this mostly. 
# Let's target specific known dark background replacements
css = css.replace('background: #0a192f;', 'background: var(--surface);')

# 4. Form select option
css = css.replace('background: #0a192f; color: var(--text-primary);', 'background: var(--primary); color: var(--text-primary);')

with open(css_file, 'w', encoding='utf-8') as f:
    f.write(css)

print("Fixed CSS styles.")
