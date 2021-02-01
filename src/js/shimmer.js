export default (function () {
  const shimmerEl = document.getElementById('Shimmer');
  const goodClass = 'shimmer--good';
  const evilClass = 'shimmer--evil';

  const shimmer = {
    makeEvil() {
      shimmerEl.classList.remove(goodClass);
      shimmerEl.classList.add(evilClass);
    },
    makeGood() {
      shimmerEl.classList.remove(evilClass);
      shimmerEl.classList.add(goodClass);
    },
  };

  return shimmer;
})();
