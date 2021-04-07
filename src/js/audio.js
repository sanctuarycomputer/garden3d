import generativeAudioPlayerFactory from './generative-audio-player-factory';

export default (function () {
  const audioTriggers = document.querySelectorAll('[data-trigger="audio"]');
  /*
   * On iOS, if the physical ringer switch is set to silent, Web Audio API sound
   * is muted unless WebKit detects some media element is playing. This will play
   * a silent audio file to prevent WebKit from muting Web Audio API sound.
   */
  const silentAudio = document.getElementById('Audio--silence');

  let player;
  const ready = generativeAudioPlayerFactory
    .prepareAndCreatePlayer()
    .then((generativeAudioPlayer) => {
      player = generativeAudioPlayer;
      audioTriggers.forEach((audioTrigger) => {
        audioTrigger.classList.add('AudioIcon--is-ready');
        audioTrigger.addEventListener('click', handler);
      });
    })
    .catch((err) => {
      console.error(err);
    });

  const whenReady = function (callback) {
    return async function (...args) {
      if (!player) {
        await ready;
      }
      return callback(...args);
    };
  };

  const unmute = function () {
    player.unmute();
    audioTriggers.forEach((audioTrigger) => {
      audioTrigger.classList.add('AudioIcon--active');
    });
  };

  const mute = whenReady(function () {
    player.mute();
    audioTriggers.forEach((audioTrigger) => {
      audioTrigger.classList.remove('AudioIcon--active');
    });
  });

  const handler = whenReady(async function () {
    if (!player.isStarted()) {
      await Promise.all([generativeAudioPlayerFactory.enablePlayback(), silentAudio.play()]);
      player.start();
    }
    if (player.isMuted()) {
      unmute();
    } else {
      mute();
    }
  });

  const audio = {
    makeEvil: whenReady(function () {
      player.makeDark();
    }),
    makeGood: whenReady(function () {
      player.makeLight();
    }),
    ready,
  };

  return audio;
})();
