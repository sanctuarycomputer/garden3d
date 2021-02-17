import goodIcon from '/assets/fav-good.ico';
import evilIcon from '/assets/fav-evil.ico';

export default (function () {
  const Fav = {
    elements: {
      icon: document.querySelector('[data-fav="icon"]'),
    },
    makeEvil() {
      Fav.elements.icon.setAttribute('href', evilIcon);
    },
    makeGood() {
      Fav.elements.icon.setAttribute('href', goodIcon);
    },
  };

  return Fav;
})();
