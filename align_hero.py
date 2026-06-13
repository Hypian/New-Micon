with open('styles.css', 'r', encoding='utf-8') as f:
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

# Fix mobile media query
old_mq = """@media (max-width: 992px) {
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

new_mq = """@media (max-width: 992px) {
  .hero-content {
    flex-direction: column;
    text-align: center;
    padding-top: 140px;
    gap: 40px;
  }
  .hero-content-left {
    max-width: 100%;
  }
  .hero-headline, .hero-sub {
    text-align: center;
  }
  .hero-sub {
    margin-left: auto;
    margin-right: auto;
  }
  .hero-btns {
    justify-content: center !important;
  }
}"""
css = css.replace(old_mq, new_mq)

with open('styles.css', 'w', encoding='utf-8') as f:
    f.write(css)
