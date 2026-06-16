// Theme persistence. The visual theming is 100% CSS ([data-theme="…"]
// rules set the --hp-* variables). This script only remembers the choice
// in localStorage and reflects it on <html> + the <select> controls.
const KEY = 'hp-theme';

function read() {
  try { return localStorage.getItem(KEY); } catch (e) { return null; }
}
function apply(name) {
  document.documentElement.dataset.theme = name;
  document.querySelectorAll('[data-theme-select]').forEach((s) => {
    if (s.value !== name) s.value = name;
  });
}

const saved = read() || document.documentElement.dataset.theme || 'blue-light';
apply(saved);

document.querySelectorAll('[data-theme-select]').forEach((sel) => {
  sel.value = saved;
  sel.addEventListener('change', () => {
    const v = sel.value;
    try { localStorage.setItem(KEY, v); } catch (e) { /* ignore */ }
    apply(v);
  });
});
