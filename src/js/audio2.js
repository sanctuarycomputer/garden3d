// import activate from '@generative-music/piece-enough';
// import getSamples from '@generative-music/samples-alex-bainter'; // you may need to `npm link` this from your local directory.
// import createWebProvider from '@generative-music/web-provider';
// import createWebLibrary from '@generative-music/web-library';
import * as Tone from 'tone';
import { getRandomNumberBetween, toss, invert, major9th } from '@generative-music/utilities';

import Harp from './samples';

const OCTAVES = [1, 2, 3];
const MIN_REPEAT_S = 2;
const MAX_REPEAT_S = 20;
const NOTES = toss(invert(major9th('Db'), 1), OCTAVES);

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
      window.generativeMusic = window.generativeMusic || {};
      window.generativeMusic.rng = window.generativeMusic.rng || Math.random;

      Audio._createSampler();
    },

    _createSampler() {
      Audio.sampler = new Tone.Sampler(Harp, Audio._onSamplerLoaded).toDestination();
    },

    _onSamplerLoaded() {
      console.log('loaded');
      Audio.state.isLoaded = true;
      Audio.play();
    },

    play() {
      if (Audio.state.isLoaded) {
        NOTES.forEach((note) => {
          const interval = getRandomNumberBetween(MIN_REPEAT_S, MAX_REPEAT_S);
          const delay = getRandomNumberBetween(0, MAX_REPEAT_S - MIN_REPEAT_S);
          const playNote = () => Audio.sampler.triggerAttack(note, '+1');
          Tone.Transport.scheduleRepeat(playNote, interval, `+${delay}`);
        });

        return Audio.sampler.releaseAll(0);
      }
    },

    start() {
      Tone.Transport.start();
      Tone.start();
    },
  };

  Audio._init();

  return Audio;
})();
