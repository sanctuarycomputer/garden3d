import activate from '@generative-music/piece-enough';
import getSamples from '@generative-music/samples-alex-bainter'; // you may need to `npm link` this from your local directory.
import createWebProvider from '@generative-music/web-provider';
import createWebLibrary from '@generative-music/web-library';
import * as Tone from 'tone';

export default (function () {
  const Audio = {
    piece: {
      deactivate: null,
      schedule: null,
      effect: null,
      distortion: null,
    },
    state: {
      isLoaded: false,
      isPlaying: false,
    },
    elements: {
      audioTriggers: document.querySelectorAll('[data-trigger="audio"]'),
    },

    /**
     * Private
     */

    _init() {
      Audio._makePiece();
      Audio._addEventListeners();
    },

    _addEventListeners() {
      Audio.elements.audioTriggers.forEach((audioTrigger) => {
        audioTrigger.addEventListener('click', Audio._handler);
      });
    },

    _makePiece() {
      const sampleIndex = getSamples({ format: 'wav', host: 'http://localhost:6969' });
      const provider = createWebProvider();
      const sampleLibrary = createWebLibrary({ sampleIndex, provider });

      const effect = new Tone.PitchShift({
        wet: 0,
        pitch: -12,
      }).toDestination();

      activate({
        sampleLibrary,
        context: Tone.context,
        destination: effect,
      }).then(([deactivate, schedule]) => {
        Audio.piece.deactivate = deactivate;
        Audio.piece.schedule = schedule();
        Audio.piece.effect = effect;
        Audio.state.isLoaded = true;
      });
    },

    _play() {
      Tone.Transport.start();
      Tone.start();
      Audio.elements.audioTriggers.forEach((audioTrigger) => {
        audioTrigger.classList.add('AudioIcon--active');
      });
    },

    _pause() {
      Tone.Transport.pause();
      Audio.elements.audioTriggers.forEach((audioTrigger) => {
        audioTrigger.classList.remove('AudioIcon--active');
      });
    },

    _handler() {
      Tone.Transport.state === 'started' ? Audio._pause() : Audio._play();
    },

    /**
     * Public
     */

    makeEvil() {
      Audio.piece.effect.wet.value = 0.8;
    },

    makeGood() {
      Audio.piece.effect.wet.value = 0;
    },
  };

  Audio._init();

  return Audio;
})();
