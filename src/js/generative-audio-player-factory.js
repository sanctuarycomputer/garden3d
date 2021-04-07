import * as Tone from 'tone';
import {
  sampleNote,
  createBuffers,
  createPitchShiftedSampler,
  transpose,
} from '@generative-music/utilities';
import createProvider from '@generative-music/web-provider';
import createLibrary from '@generative-music/web-library';
import sampleIndex from './sample-index';

// stuff you might want to adjust
const DEFAULT_TRANSITION_TIME = 0.5; // seconds

// other stuff that might be fun to play with
const LIGHT_EQ_SETTINGS = {
  // see https://tonejs.github.io/docs/14.7.39/EQ3
  highFrequency: 1000,
  lowFrequency: 100,
  mid: -2,
};
const DARK_EQ_SETTINGS = {
  lowFrequency: 150,
  highFrequency: 750,
  mid: -3,
  low: -3,
};
const DARK_MODE_PULLBACK_CUTOFF_FREQUENCY = 100; // hertz
const DARK_PITCH_SHIFT = -36; // semitones
const LIGHT_PITCH_SHIFT = -24;
const BPM = 27; // this only affects the dark mode sub synth and filter effect

// don't change these though
const PIANO_INSTRUMENT_NAME = 'vsco2-piano-mf';
const SUSVIB_INSTRUMENT_NAME = 'vsco2-violins-susvib-reverbed';
const ARCVIB_INSTRUMENT_NAME = 'vsco2-violin-arcvib-reverbed';

export default (function () {
  const createPlayer = ({ susvibBuffers, arcvibBuffers, piano, samples }) => {
    Tone.Transport.bpm.value = BPM;
    Tone.getDestination().mute = true;

    let isDark = false;

    // final shared output nodes
    const compressor = new Tone.Compressor().toDestination();
    const darkLightCrossFade = new Tone.CrossFade().connect(compressor);

    // dark nodes
    const darkEq = new Tone.Gain(DARK_EQ_SETTINGS).connect(darkLightCrossFade.a);
    const darkOutput = new Tone.Gain().connect(darkEq);
    const darkCrossFade = new Tone.CrossFade().connect(darkOutput).set({ fade: 1 });
    const darkNormalFilter = new Tone.Filter(2000).connect(darkCrossFade.b);
    const darkPullbackFilter = new Tone.Filter(DARK_MODE_PULLBACK_CUTOFF_FREQUENCY).connect(
      darkCrossFade.a
    );
    const darkSynthGain = new Tone.Gain().connect(darkOutput);
    const darkSynth = new Tone.Synth({
      oscillator: { type: 'sine' },
      volume: -5,
    }).connect(darkSynthGain);

    // light nodes
    const lightEq = new Tone.EQ3(LIGHT_EQ_SETTINGS).connect(darkLightCrossFade.b);
    const lightOutput = new Tone.Gain().connect(lightEq);
    const lightChorus = new Tone.Chorus().connect(lightOutput);
    const lightChorusWetLfo = new Tone.LFO(0.022).connect(lightChorus.wet).start();

    // source nodes
    const violinCrossFade = new Tone.CrossFade()
      .connect(lightChorus)
      .connect(darkNormalFilter)
      .connect(darkPullbackFilter);
    const violinCrossFadeLfo = new Tone.LFO(0.072, 0.2, 0.8).connect(violinCrossFade.fade).start();
    const violinFilter = new Tone.AutoFilter(0.05, 700, 2).connect(violinCrossFade.a).start();

    const activeSources = [];

    const sampleInstrumentNote = (note, instrument) => {
      let pitchShift = isDark ? DARK_PITCH_SHIFT : LIGHT_PITCH_SHIFT;
      if (isDark && note.startsWith('E')) {
        pitchShift -= 1;
      }
      return sampleNote({
        note,
        pitchShift,
        sampledNotes: Object.keys(samples[instrument]),
      });
    };

    const pianoDelay = new Tone.FeedbackDelay({
      delayTime: 2,
      maxDelay: 2,
      feedback: 0.8,
    })
      .set({ wet: 0.5 })
      .connect(lightOutput)
      .connect(darkCrossFade.a);
    const pianoGain = new Tone.Gain(0).connect(pianoDelay);
    piano.connect(pianoGain);

    const playInstrumentNote = ({ note, instrument, buffers, destination, time, fadeIn = 0 }) => {
      const { sampledNote, playbackRate } = sampleInstrumentNote(note, instrument);
      const buffer = buffers.get(sampledNote);
      buffer.reverse = true;
      const gain = new Tone.Gain().connect(destination);
      const source = new Tone.ToneBufferSource(buffer).set({
        playbackRate,
        fadeIn,
        curve: 'linear',
        onended: () => {
          const i = activeSources.findIndex(({ source: otherSource }) => otherSource === source);
          if (i !== -1) {
            activeSources.splice(i, 1);
          }
        },
      });
      source.connect(gain).start(time);
      activeSources.push({ source, note, instrument, gain });
    };

    const playNote = (note, time) => {
      playInstrumentNote({
        note,
        time,
        instrument: SUSVIB_INSTRUMENT_NAME,
        buffers: susvibBuffers,
        destination: violinFilter,
        fadeIn: 5,
      });
      playInstrumentNote({
        note,
        instrument: ARCVIB_INSTRUMENT_NAME,
        buffers: arcvibBuffers,
        destination: violinCrossFade.b,
        fadeIn: 5,
      });
      if (note.startsWith('E')) {
        return;
      }
      if (Math.random() < 0.5) {
        piano.triggerAttack(transpose(note, 12), time);
      }
      if (Math.random() < 0.5) {
        piano.triggerAttack(note, Tone.Time(time).toSeconds() + Math.random());
      }
    };

    const adjustDarkness = () => {
      const transitionTime = Math.random() * 10 + 10;
      const adjustedDuration = Math.random() * 10 + 30;
      darkSynthGain.gain.cancelScheduledValues(Tone.now());
      darkSynthGain.gain.setValueAtTime(darkSynthGain.gain.value, Tone.now());
      darkSynthGain.gain.linearRampToValueAtTime(0, Tone.now() + transitionTime);

      darkCrossFade.fade.cancelScheduledValues(Tone.now());
      darkCrossFade.fade.setValueAtTime(darkCrossFade.fade.value, Tone.now());
      darkCrossFade.fade.linearRampToValueAtTime(0, Tone.now() + transitionTime);

      Tone.Transport.scheduleOnce(() => {
        darkSynthGain.gain.cancelScheduledValues(Tone.now());
        darkSynthGain.gain.setValueAtTime(darkSynthGain.gain.value, Tone.now());
        darkSynthGain.gain.linearRampToValueAtTime(1, Tone.now() + transitionTime);

        darkCrossFade.fade.cancelScheduledValues(Tone.now());
        darkCrossFade.fade.setValueAtTime(darkCrossFade.fade.value, Tone.now());
        darkCrossFade.fade.linearRampToValueAtTime(1, Tone.now() + transitionTime);

        Tone.Transport.scheduleOnce(() => {
          adjustDarkness();
        }, Tone.now() + transitionTime + Math.random() * 30 + 60);
      }, Tone.now() + transitionTime + adjustedDuration);
    };

    const playCanvas = () => {
      playNote('C4');
      playNote('C5', `+${Math.random() * 10 + 15}`);
      playNote('C6', `+${Math.random() * 10 + 30}`);
      playNote('E4', `+${Math.random() * 10 + 45}`);
      playNote('E5', `+${Math.random() * 10 + 65}`);
      Tone.Transport.scheduleOnce(() => {
        playCanvas();
      }, `+${Math.random() * 10 + 10}`);
    };

    const extraNotes = ['G', 'B', 'A'];
    const playExtras = () => {
      const extraNote = extraNotes[Math.floor(Math.random() * extraNotes.length)];
      activeSources
        .filter(({ note }) =>
          extraNotes
            .filter((extraNotePc) => extraNotePc !== extraNote)
            .some((extraNotePc) => note.startsWith(extraNotePc))
        )
        .forEach(({ gain }) => {
          gain.gain.cancelScheduledValues(Tone.now());
          gain.gain.setValueAtTime(gain.gain.value, Tone.now());
          gain.gain.linearRampToValueAtTime(0, Tone.now() + Math.random() * 5 + 5);
        });

      playNote(`${extraNote}4`);
      playNote(`${extraNote}5`);
      if (Math.random() < 0.1) {
        playNote(`${extraNote}6`);
      }

      Tone.Transport.scheduleOnce(() => {
        playExtras();
      }, `+${Math.random() * 10 + 35}`);
    };

    const startDarkSubSynth = () => {
      Tone.Transport.scheduleRepeat((time) => {
        if (Math.random() < 0.5) {
          darkSynth.triggerAttackRelease('C1', Tone.Time('16n').toSeconds(), time);
          darkSynth.triggerAttackRelease(
            'C1',
            Tone.Time('16n').toSeconds(),
            time + Tone.Time('16n').toSeconds() * 1.25
          );
          return;
        }
        darkSynth.triggerAttackRelease('C1', Tone.Time('8n'), time);
      }, '4n');

      Tone.Transport.scheduleRepeat((time) => {
        darkNormalFilter.frequency.setValueAtTime(350, time);
        darkNormalFilter.frequency.linearRampToValueAtTime(
          2000,
          time + Tone.Time('2n').toSeconds() * 0.75
        );
      }, '2n');
    };

    const start = () => {
      darkLightCrossFade.fade.setValueAtTime(isDark ? 0 : 1, Tone.now());
      pianoGain.gain.linearRampToValueAtTime(2.5, `+${Math.random() * 20 + 60}`);
      playCanvas();
      startDarkSubSynth();
      Tone.Transport.scheduleOnce(() => {
        playExtras();
      }, `+${Math.random() * 10 + 60}`);
      Tone.Transport.scheduleOnce(() => {
        adjustDarkness();
      }, `+${Math.random() * 30 + 90}`);
      Tone.Transport.start();
    };

    const isMuted = () => Tone.getDestination().mute;

    const makeDark = ({ transitionTime = isMuted() ? 0 : DEFAULT_TRANSITION_TIME } = {}) => {
      isDark = true;
      darkLightCrossFade.fade.cancelScheduledValues(Tone.now());
      darkLightCrossFade.fade.setValueAtTime(darkLightCrossFade.fade.value, Tone.now());
      darkLightCrossFade.fade.linearRampToValueAtTime(0, Tone.now() + transitionTime);
      activeSources.forEach(({ source, note, instrument }) => {
        const { playbackRate } = sampleInstrumentNote(note, instrument);
        source.playbackRate.setValueAtTime(source.playbackRate.value, Tone.now());
        source.playbackRate.linearRampToValueAtTime(playbackRate, Tone.now() + transitionTime);
      });

      darkSynthGain.gain.cancelScheduledValues(Tone.now());
      darkSynthGain.gain.setValueAtTime(1, Tone.now());

      darkCrossFade.fade.cancelScheduledValues(Tone.now());
      darkCrossFade.fade.setValueAtTime(1, Tone.now());
    };

    const makeLight = ({ transitionTime = isMuted() ? 0 : DEFAULT_TRANSITION_TIME } = {}) => {
      isDark = false;
      darkLightCrossFade.fade.cancelScheduledValues(Tone.now());
      darkLightCrossFade.fade.setValueAtTime(darkLightCrossFade.fade.value, Tone.now());
      darkLightCrossFade.fade.linearRampToValueAtTime(1, Tone.now() + transitionTime);
      activeSources.forEach(({ source, note, instrument }) => {
        const { playbackRate } = sampleInstrumentNote(note, instrument);
        source.playbackRate.setValueAtTime(source.playbackRate.value, Tone.now());
        source.playbackRate.linearRampToValueAtTime(playbackRate, Tone.now() + transitionTime);
      });
    };

    const mute = () => {
      Tone.getDestination().mute = true;
    };

    const unmute = () => {
      Tone.getDestination().mute = false;
    };

    // see https://tonejs.github.io/docs/14.7.77/Destination#volume
    const setVolume = (volume) => {
      Tone.getDestination().volume.setValueAtTime(volume, Tone.now());
    };

    const isStarted = () => Tone.Transport.state === 'started';

    return {
      start,
      mute,
      unmute,
      isMuted,
      makeLight,
      makeDark,
      setVolume,
      isStarted,
    };
  };

  const prepareAndCreatePlayer = () => {
    const provider = createProvider();
    const sampleLibrary = createLibrary({
      sampleIndex,
      provider,
    });
    return sampleLibrary
      .request(Tone.getContext(), [
        SUSVIB_INSTRUMENT_NAME,
        ARCVIB_INSTRUMENT_NAME,
        PIANO_INSTRUMENT_NAME,
      ])
      .then((samples) =>
        Promise.all([
          createBuffers(samples[SUSVIB_INSTRUMENT_NAME]),
          createBuffers(samples[ARCVIB_INSTRUMENT_NAME]),
          createPitchShiftedSampler({
            samplesByNote: samples[PIANO_INSTRUMENT_NAME],
            pitchShift: -12,
          }),
        ]).then(([susvibBuffers, arcvibBuffers, piano]) =>
          createPlayer({
            susvibBuffers,
            arcvibBuffers,
            piano,
            samples,
          })
        )
      );
  };

  const enablePlayback = () => Tone.start(); // should be called from a user interaction event (click or touch)

  return { prepareAndCreatePlayer, enablePlayback };
})();
