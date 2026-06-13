import re

def convert_button(match):
    full_match = match.group(0)
    tag_open = match.group(1) # e.g. `<a href="#contact" class="btn-primary">`
    inner_text = match.group(2).strip() # e.g. `Book Today`
    svg_icon = match.group(3).strip() # e.g. `<svg ...>...</svg>`
    tag_close = match.group(4) # e.g. `</a>`
    
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

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern to capture:
# 1. Opening tag containing class btn-something
# 2. Text content
# 3. SVG icon
# 4. Closing tag
pattern = re.compile(r'(<(?:a|button)[^>]+class="[^"]*btn-[^"]*"[^>]*>)\s*([^<]+)\s*(<svg[^>]*>.*?</svg>)\s*(</(?:a|button)>)', re.DOTALL)

new_content = pattern.sub(convert_button, content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_content)
