document.getElementById('year').textContent = new Date().getFullYear();

// Custom cursor
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
const supportsFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (supportsFinePointer) {
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  const animateRing = () => {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    requestAnimationFrame(animateRing);
  };
  animateRing();

  const hoverTargets = 'a, button, .service-card, input, textarea';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      cursorRing.classList.add('is-hover');
      cursorDot.classList.add('is-hover');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      cursorRing.classList.remove('is-hover');
      cursorDot.classList.remove('is-hover');
    }
  });
}

// Hero parallax
const hero = document.querySelector('.hero');
const heroGrid = document.querySelector('.hero-grid');
const heroLines = document.querySelector('.hero-lines');
if (hero && supportsFinePointer) {
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    heroGrid.style.transform = `translate(${px * 20}px, ${py * 20}px)`;
    heroLines.style.transform = `translate(${px * -14}px, ${py * -14}px)`;
  });
  hero.addEventListener('mouseleave', () => {
    heroGrid.style.transform = 'translate(0, 0)';
    heroLines.style.transform = 'translate(0, 0)';
  });
}

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
