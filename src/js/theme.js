export default (function () {
  const GOOD = 'good';
  const EVIL = 'evil';

  const toggle = document.getElementById('theme-toggle');

  const handler = function () {
    const activeTheme = document.body.getAttribute('data-theme');

    if (activeTheme === GOOD) {
      document.body.setAttribute('data-theme', EVIL);
    } else {
      document.body.setAttribute('data-theme', GOOD);
    }
  };

  return toggle.addEventListener('click', handler);
})();
