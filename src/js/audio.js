import piece from './piece';

export default (function () {
  const Audio = {
    elements: {
      audioTriggers: document.querySelectorAll('[data-trigger="audio"]'),
    },

    /**
     * Private
     */

    _init() {
      Audio._addEventListeners();
    },

    _addEventListeners() {
      Audio.elements.audioTriggers.forEach((audioTrigger) => {
        audioTrigger.addEventListener('click', Audio._handler);
      });
    },

    _play() {
      piece.start();
      Audio.elements.audioTriggers.forEach((audioTrigger) => {
        audioTrigger.classList.add('AudioIcon--active');
      });
    },

    _pause() {
      piece.stop();
      Audio.elements.audioTriggers.forEach((audioTrigger) => {
        audioTrigger.classList.remove('AudioIcon--active');
      });
    },

    _handler() {
      piece.isPlaying() ? Audio._pause() : Audio._play();
    },

    /**
     * Public
     */

    makeEvil() {
      piece.toggleEffectOn();
    },

    makeGood() {
      piece.toggleEffectOff();
    },
  };

  Audio._init();

  return Audio;
})();
