// Nav: solidify the transparent home-hero nav once the page is scrolled.
// Other pages ship a solid nav and opt out via the body flag.
const nav = document.querySelector('[data-nav]');
if (nav && document.body.hasAttribute('data-nav-transparent')) {
  const set = (solid) => {
    nav.style.background = solid ? 'var(--hp-navbg)' : 'transparent';
    nav.style.backdropFilter = solid ? 'saturate(180%) blur(10px)' : 'none';
    nav.style.boxShadow = solid ? '0 6px 24px -14px rgba(31,36,51,.4)' : 'none';
    nav.style.borderBottom = solid ? '1px solid var(--hp-border)' : '1px solid transparent';
    nav.style.paddingTop = solid ? '12px' : '18px';
    nav.style.paddingBottom = solid ? '12px' : '18px';
  };
  set(window.scrollY > 60);
  window.addEventListener('scroll', () => set(window.scrollY > 60), { passive: true });
}
