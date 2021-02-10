// import activate from '@generative-music/piece-enough';
// import getSamples from '@generative-music/samples-alex-bainter'; // you may need to `npm link` this from your local directory.
// import createWebProvider from '@generative-music/web-provider';
// import createWebLibrary from '@generative-music/web-library';
import * as Tone from 'tone';

export default (function () {
  const Audio = {
    sampler: null,

    /**
     * Private
     */

    _init() {
      Audio._createSampler();
      Audio._play();
    },

    _createSampler() {
      Audio.sampler = new Tone.Sampler({
        urls: {
          A2: 'a2.wav',
          A4: 'a4.wav',
          A6: 'a6.wav',
          B1: 'b1.wav',
          B3: 'b3.wav',
          B5: 'b5.wav',
          B6: 'b6.wav',
          C3: 'c3.wav',
          C5: 'c5.wav',
          D2: 'd2.wav',
          D4: 'd4.wav',
          D6: 'd6.wav',
          D7: 'd7.wav',
          E1: 'e1.wav',
          E3: 'e3.wav',
          E5: 'e5.wav',
          F2: 'f2.wav',
          F4: 'f4.wav',
          F6: 'f6.wav',
          F7: 'f7.wav',
          G3: 'g3.wav',
          G5: 'g5.wav',
        },
        baseUrl: '/assets/audio/vsco2-harp/',
        onload: () => {
          sampler.triggerAttackRelease(['C1', 'E1', 'G1', 'B1'], 0.5);
          console.log('we out here');
        },
      }).toDestination();
    },

    _play() {
      console.log('it me');
      Audio.sampler.triggerAttackRelease(['C1', 'E1', 'G1', 'B1'], 0.5);
    },
  };

  Audio._init();

  return Audio;
})();
