export default (function () {
  const audioEl = document.getElementById('Audio');
  const audioTrigger = document.getElementById('AudioTrigger');
  const goodSrc = document.getElementById('Audio--good').getAttribute('src');
  const evilSrc = document.getElementById('Audio--evil').getAttribute('src');

  const play = function () {
    audioEl.play();
    audioTrigger.classList.add('AudioIcon--active');
  };

  const pause = function () {
    audioEl.pause();
    audioTrigger.classList.remove('AudioIcon--active');
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
  audioTrigger.addEventListener('click', handler);

  return audio;
})();
