// 360° viewer — genuine interaction. Reads the frame set from data
// attributes baked into the page (data-prefix / data-frames); holds no
// product data of its own.
const stage = document.querySelector('[data-360stage]');
if (stage) {
  const img = stage.querySelector('[data-360img]');
  const bar = document.querySelector('[data-360bar]');
  const hint = document.querySelector('[data-360hint]');
  const prefix = stage.dataset.prefix;
  const frames = parseInt(stage.dataset.frames, 10) || 24;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pad = (n) => String(n).padStart(2, '0');
  const url = (i) => `${prefix}-${pad((((i % frames) + frames) % frames) + 1)}.png`;

  let cur = 0;
  const show = (i) => {
    const idx = ((i % frames) + frames) % frames;
    cur = idx;
    img.src = url(idx);
    if (bar) bar.style.width = (((idx + 1) / frames) * 100).toFixed(1) + '%';
  };

  // Preload all frames for smooth dragging.
  for (let i = 0; i < frames; i++) { const im = new Image(); im.src = url(i); }

  let used = false;
  let auto = null;
  const stopAuto = () => { if (auto) { clearInterval(auto); auto = null; } };
  const startAuto = () => {
    if (reduced || used) return;
    stopAuto();
    auto = setInterval(() => show(cur + 1), 120);
  };

  let dragging = false;
  let startX = 0;
  let startIdx = 0;
  const ppf = () => Math.max(5, stage.clientWidth / frames);
  const down = (e) => {
    dragging = true;
    startX = e.touches ? e.touches[0].clientX : e.clientX;
    startIdx = cur;
    stage.style.cursor = 'grabbing';
    used = true;
    stopAuto();
    if (hint) hint.style.opacity = '0';
  };
  const move = (e) => {
    if (!dragging) return;
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const dx = cx - startX;
    show(startIdx - Math.round(dx / ppf()));
    if (e.cancelable && e.touches && Math.abs(dx) > 4) e.preventDefault();
  };
  const up = () => { dragging = false; stage.style.cursor = 'grab'; };

  stage.addEventListener('mousedown', down);
  window.addEventListener('mousemove', move);
  window.addEventListener('mouseup', up);
  stage.addEventListener('touchstart', down, { passive: true });
  stage.addEventListener('touchmove', move, { passive: false });
  window.addEventListener('touchend', up);

  show(0);
  startAuto();
}
