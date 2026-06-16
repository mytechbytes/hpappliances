// Scroll-reveal, count-up and the safety-badge pulse. Animation only —
// the content these decorate is already in the HTML.
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Reveal [data-reveal] elements as they scroll into view.
(() => {
  const items = [...document.querySelectorAll('[data-reveal]')];
  if (!items.length) return;
  if (reduced) { items.forEach((el) => el.classList.add('is-visible')); return; }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        el.style.transitionDelay = (el.getAttribute('data-delay') || 0) + 'ms';
        el.classList.add('is-visible');
        io.unobserve(el);
      });
    },
    { threshold: 0.14 },
  );
  items.forEach((el) => io.observe(el));
})();

// Count [data-count] numbers up from 0 when they enter view.
(() => {
  const els = [...document.querySelectorAll('[data-count]')];
  if (!els.length) return;
  const run = (el) => {
    const target = parseFloat(el.getAttribute('data-count')) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    if (reduced) { el.textContent = target + suffix; return; }
    const dur = 1300;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } }),
    { threshold: 0.6 },
  );
  els.forEach((el) => io.observe(el));
})();

// One-shot green pulse on each safety badge when it first appears.
(() => {
  if (reduced) return;
  const cards = [...document.querySelectorAll('[data-safety]')];
  if (!cards.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const badge = en.target.querySelector('[data-badge]');
        if (badge) badge.style.animation = 'hpPulseGreen 1.6s ease 1';
        io.unobserve(en.target);
      });
    },
    { threshold: 0.5 },
  );
  cards.forEach((el) => io.observe(el));
})();
