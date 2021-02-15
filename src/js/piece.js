import * as Tone from 'tone';
import { getRandomNumberBetween, toss, invert, major9th } from '@generative-music/utilities';

import Harp from './samples';

const OCTAVES = [4, 5, 6];
const MIN_REPEAT_S = 2;
const MAX_REPEAT_S = 20;
const NOTES = toss(invert(major9th('Db'), 1), OCTAVES);

export default (function () {
  const Audio = {
    sampler: null,
    filter: null,
    distortion: null,
    state: {
      isLoaded: false,
      isPlaying: false,
    },

    /**
     * Private
     */

    _init() {
      Audio._setup();
      Audio._createSampler();
    },

    _setup() {
      window.generativeMusic = window.generativeMusic || {};
      window.generativeMusic.rng = window.generativeMusic.rng || Math.random;
    },

    _createSampler() {
      Audio.sampler = new Tone.Sampler(Harp, Audio._onSamplerLoaded).toDestination();
    },

    _onSamplerLoaded() {
      Audio.state.isLoaded = true;
      Audio._setupEffect();
      Audio._generatePiece();
    },

    _setupEffect() {
      Audio.filter = new Tone.AutoFilter({
        frequency: 50,
        octave: 8,
        wet: 1,
      });
      Audio.sampler.chain(Audio.filter, Tone.Destination);
    },

    _generatePiece() {
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

    /**
     * Public
     */

    toggleEffectOn() {
      Audio.filter.start(0);
    },

    toggleEffectOff() {
      Audio.filter.stop(0);
    },

    start() {
      Audio.state.isPlaying = true;
      Tone.Transport.start();
      Tone.start();
    },

    stop() {
      Audio.state.isPlaying = false;
      Tone.Transport.pause();
    },

    isPlaying() {
      return Audio.state.isPlaying;
    },
  };

  Audio._init();

  return Audio;
})();
