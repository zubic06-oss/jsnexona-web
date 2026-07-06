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
