export default (function () {
  const audioEl = document.getElementById('Audio');
  const audioTriggers = document.querySelectorAll('[data-trigger="audio"]');
  const goodSrc = document.getElementById('Audio--good').getAttribute('src');
  const evilSrc = document.getElementById('Audio--evil').getAttribute('src');

  const play = function () {
    audioEl.play();
    audioTriggers.forEach((audioTrigger) => {
      audioTrigger.classList.add('AudioIcon--active');
    });
  };

  const pause = function () {
    audioEl.pause();
    audioTriggers.forEach((audioTrigger) => {
      audioTrigger.classList.remove('AudioIcon--active');
    });
  };

  const handler = function () {
    audioEl.paused ? play() : pause();
  };

  const audio = {
    makeEvil: function () {
      const wasPaused = audioEl.paused;

      audioEl.setAttribute('src', evilSrc);
      wasPaused ? pause() : play();
    },
    makeGood: function () {
      const wasPaused = audioEl.paused;

      audioEl.setAttribute('src', goodSrc);
      wasPaused ? pause() : play();
    },
  };

  if (!audioEl.getAttribute('src')) {
    audioEl.setAttribute('src', goodSrc);
  }

  audioTriggers.forEach((audioTrigger) => {
    audioTrigger.addEventListener('click', handler);
  });

  return audio;
})();
