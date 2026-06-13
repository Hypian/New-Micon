import re

with open('styles.css', 'r', encoding='utf-8') as f:
    content = f.read()

# Split the content at the Uiverse.io comment
parts = content.split('/* From Uiverse.io by marcelodolza */')

if len(parts) > 1:
    original_css = parts[0]
    
    # New CSS that ONLY keeps the animations (outline, text wave, icon fly)
    # and removes all color, background, and shadow overrides
    new_css = """/* From Uiverse.io by marcelodolza */
.btn-primary, .btn-secondary, .btn-submit {
  --primary: #ffffff; /* For text hover effect */
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s ease;
  text-decoration: none;
}

/* Ensure inner elements inherit the button's text color (white) */
.state p {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  color: inherit; 
}

.state .icon {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  transform: scale(1.25);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit;
}

.state .icon svg {
  overflow: visible;
}

/* Outline Animation */
.outline {
  position: absolute;
  border-radius: inherit;
  overflow: hidden;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.4s ease;
  inset: -2px -3.5px;
  pointer-events: none;
}

.outline::before {
  content: "";
  position: absolute;
  inset: -100%;
  background: conic-gradient(
    from 180deg,
    transparent 60%,
    rgba(255,255,255,0.8) 80%,
    transparent 100%
  );
  animation: spin 2s linear infinite;
  animation-play-state: paused;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.btn-primary:hover .outline, .btn-secondary:hover .outline, .btn-submit:hover .outline {
  opacity: 1;
}

.btn-primary:hover .outline::before, .btn-secondary:hover .outline::before, .btn-submit:hover .outline::before {
  animation-play-state: running;
}

/* Letters Animation */
.state p span {
  display: block;
  opacity: 0;
  animation: slideDown 0.8s ease forwards calc(var(--i) * 0.03s);
}

.btn-primary:hover p span, .btn-secondary:hover p span, .btn-submit:hover p span {
  opacity: 1;
  animation: wave 0.5s ease forwards calc(var(--i) * 0.02s);
}

.btn-primary:focus p span, .btn-secondary:focus p span, .btn-submit:focus p span {
  opacity: 1;
  animation: disapear 0.6s ease forwards calc(var(--i) * 0.03s);
}

@keyframes wave {
  30% { opacity: 1; transform: translateY(4px) translateX(0) rotate(0); }
  50% { opacity: 1; transform: translateY(-3px) translateX(0) rotate(0); color: var(--primary); }
  100% { opacity: 1; transform: translateY(0) translateX(0) rotate(0); }
}

@keyframes slideDown {
  0% { opacity: 0; transform: translateY(-20px) translateX(5px) rotate(-90deg); color: var(--primary); filter: blur(5px); }
  30% { opacity: 1; transform: translateY(4px) translateX(0) rotate(0); filter: blur(0); }
  50% { opacity: 1; transform: translateY(-3px) translateX(0) rotate(0); }
  100% { opacity: 1; transform: translateY(0) translateX(0) rotate(0); }
}

@keyframes disapear {
  from { opacity: 1; }
  to { opacity: 0; transform: translateX(5px) translateY(20px); color: var(--primary); filter: blur(5px); }
}

/* Icon Fly Animation */
.state--default .icon svg {
  animation: land 0.6s ease forwards;
}

.btn-primary:hover .state--default .icon, .btn-secondary:hover .state--default .icon, .btn-submit:hover .state--default .icon {
  transform: rotate(45deg) scale(1.25);
}

.btn-primary:focus .state--default svg, .btn-secondary:focus .state--default svg, .btn-submit:focus .state--default svg {
  animation: takeOff 0.8s linear forwards;
}

.btn-primary:focus .state--default .icon, .btn-secondary:focus .state--default .icon, .btn-submit:focus .state--default .icon {
  transform: rotate(0) scale(1.25);
}

@keyframes takeOff {
  0% { opacity: 1; }
  60% { opacity: 1; transform: translateX(70px) rotate(45deg) scale(2); }
  100% { opacity: 0; transform: translateX(160px) rotate(45deg) scale(0); }
}

@keyframes land {
  0% { transform: translateX(-60px) translateY(30px) rotate(-50deg) scale(2); opacity: 0; filter: blur(3px); }
  100% { transform: translateX(0) translateY(0) rotate(0); opacity: 1; filter: blur(0); }
}

/* Contrail */
.state--default .icon:before {
  content: "";
  position: absolute;
  top: 50%;
  height: 2px;
  width: 0;
  left: -5px;
  background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.5));
}

.btn-primary:focus .state--default .icon:before, .btn-secondary:focus .state--default .icon:before, .btn-submit:focus .state--default .icon:before {
  animation: contrail 0.8s linear forwards;
}

@keyframes contrail {
  0% { width: 0; opacity: 1; }
  8% { width: 15px; }
  60% { opacity: 0.7; width: 80px; }
  100% { opacity: 0; width: 160px; }
}

/* States */
.state {
  padding-left: 29px;
  z-index: 2;
  display: flex;
  position: relative;
}

.state--sent {
  display: none;
}

.state--sent svg {
  transform: scale(1.25);
  margin-right: 8px;
}

.btn-primary:focus .state--default, .btn-secondary:focus .state--default, .btn-submit:focus .state--default {
  position: absolute;
}

.btn-primary:focus .state--sent, .btn-secondary:focus .state--sent, .btn-submit:focus .state--sent {
  display: flex;
}

.btn-primary:focus .state--sent span, .btn-secondary:focus .state--sent span, .btn-submit:focus .state--sent span {
  opacity: 0;
  animation: slideDown 0.8s ease forwards calc(var(--i) * 0.2s);
}

.btn-primary:focus .state--sent .icon svg, .btn-secondary:focus .state--sent .icon svg, .btn-submit:focus .state--sent .icon svg {
  opacity: 0;
  animation: appear 1.2s ease forwards 0.8s;
}

@keyframes appear {
  0% { opacity: 0; transform: scale(4) rotate(-40deg); color: var(--primary); filter: blur(4px); }
  30% { opacity: 1; transform: scale(0.6); filter: blur(1px); }
  50% { opacity: 1; transform: scale(1.2); filter: blur(0); }
  100% { opacity: 1; transform: scale(1); }
}
"""

    with open('styles.css', 'w', encoding='utf-8') as f:
        f.write(original_css + new_css)
