// import activate from '@generative-music/piece-enough';
// import getSamples from '@generative-music/samples-alex-bainter'; // you may need to `npm link` this from your local directory.
// import createWebProvider from '@generative-music/web-provider';
// import createWebLibrary from '@generative-music/web-library';
import * as Tone from 'tone';

import A2 from '/assets/audio/vsco2-harp/a2.wav';

import goodBg from '/assets/images/bg-good.jpg';

export default (function () {
  const Audio = {
    sampler: null,
    state: {
      isLoaded: false,
    },

    /**
     * Private
     */

    _init() {
      Audio._createSampler();
    },

    _createSampler() {
      Audio.sampler = new Tone.Sampler({ A2 }, Audio._onSamplerLoaded).toDestination();
    },

    _onSamplerLoaded() {
      console.log('loaded');
      Audio.state.isLoaded = true;
    },

    play() {
      if (Audio.state.isLoaded) {
        Audio.sampler.triggerAttackRelease(['A2'], 0.5);
      }
    },
  };

  Audio._init();

  return Audio;
})();
