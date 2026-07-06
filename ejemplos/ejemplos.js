document.getElementById('year').textContent = new Date().getFullYear();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

const flow = document.getElementById('flow');
if (flow) {
  const flowObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        flowObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  flowObserver.observe(flow);
}

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

// Conversación de WhatsApp animada, mensaje a mensaje
const waBody = document.getElementById('waBody');
if (waBody) {
  const items = Array.from(waBody.children);
  items.forEach((el) => {
    el.classList.add('wa-hidden');
    if (el.classList.contains('wa-typing')) el.classList.add('wa-collapsed');
  });

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  const playSequence = async () => {
    for (const el of items) {
      if (el.classList.contains('wa-typing')) {
        el.classList.remove('wa-collapsed');
        await wait(20);
        el.classList.remove('wa-hidden');
        await wait(1300);
        el.classList.add('wa-hidden');
        await wait(300);
        el.classList.add('wa-collapsed');
        await wait(550);
      } else {
        el.classList.remove('wa-hidden');
        await wait(850);
      }
    }
  };

  const waObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        playSequence();
        waObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  waObserver.observe(document.getElementById('waMockup'));
}
