document.getElementById('year').textContent = new Date().getFullYear();

// Header background on scroll
const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
navToggle.addEventListener('click', () => {
  const open = header.classList.toggle('nav-open');
  navToggle.setAttribute('aria-expanded', String(open));
});
document.getElementById('nav').addEventListener('click', (e) => {
  if (e.target.tagName === 'A') header.classList.remove('nav-open');
});

// Scroll reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// Animación de "me gusta" en los mockups de Instagram
const likeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const heart = entry.target.querySelector('.ig-like');
      if (heart) setTimeout(() => heart.classList.add('is-liked'), 1400 + i * 450);
      likeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.phone-mockup').forEach((el) => likeObserver.observe(el));

// Process line draw
const steps = document.getElementById('steps');
if (steps) {
  const stepsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        stepsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  stepsObserver.observe(steps);
}

// Antes y después slider
const baSlider = document.getElementById('baSlider');
const baRange = document.getElementById('baRange');
if (baSlider && baRange) {
  const setPos = (value) => baSlider.style.setProperty('--pos', `${value}%`);
  setPos(baRange.value);

  let baUserInteracted = false;
  baRange.addEventListener('pointerdown', () => { baUserInteracted = true; });
  baRange.addEventListener('input', () => setPos(baRange.value));

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const animateBaTo = (target, duration) => new Promise((resolve) => {
    const start = parseFloat(baRange.value);
    const startTime = performance.now();
    function frame(now) {
      if (baUserInteracted) return resolve();
      const p = Math.min((now - startTime) / duration, 1);
      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      const value = start + (target - start) * eased;
      baRange.value = value;
      setPos(value);
      if (p < 1) requestAnimationFrame(frame);
      else resolve();
    }
    requestAnimationFrame(frame);
  });
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  async function baIntroSweep() {
    if (baUserInteracted || prefersReducedMotion) return;
    await animateBaTo(28, 650);
    if (baUserInteracted) return;
    await wait(200);
    await animateBaTo(72, 750);
    if (baUserInteracted) return;
    await wait(200);
    await animateBaTo(50, 550);
  }

  const baObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        baIntroSweep();
        baObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  baObserver.observe(baSlider);

  // En ratón (pointer fino), el slider sigue al cursor con un suavizado tipo "lerp",
  // sin necesidad de arrastrar el tirador. En táctil se mantiene el input range normal.
  if (window.matchMedia('(pointer: fine)').matches) {
    let baTarget = parseFloat(baRange.value);
    let baCurrent = baTarget;
    let baRafId = null;

    function baFollowLoop() {
      baCurrent += (baTarget - baCurrent) * 0.16;
      if (Math.abs(baTarget - baCurrent) < 0.1) baCurrent = baTarget;
      setPos(baCurrent);
      baRafId = (baCurrent !== baTarget) ? requestAnimationFrame(baFollowLoop) : null;
    }

    baSlider.addEventListener('mouseenter', () => { baUserInteracted = true; });
    baSlider.addEventListener('mousemove', (e) => {
      const rect = baSlider.getBoundingClientRect();
      baTarget = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
      baRange.value = baTarget;
      if (!baRafId) baRafId = requestAnimationFrame(baFollowLoop);
    });
  }
}

// Contact form (envío real vía Formspree)
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando...';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        btn.textContent = 'Mensaje enviado ✓';
        form.reset();
      } else {
        btn.textContent = 'Error, intenta de nuevo';
      }
    } catch {
      btn.textContent = 'Error, intenta de nuevo';
    }

    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
    }, 3000);
  });
}
