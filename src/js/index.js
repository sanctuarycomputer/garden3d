'use strict';
import background from './background';
import audio from './audio';
import shimmer from './shimmer';
import fav from './fav';

import { Theme } from './constants';

const themeToggle = document.querySelector('[data-trigger="theme-toggle"]');

const handleToggleTheme = function () {
  const activeTheme = document.documentElement.getAttribute('data-theme');

  if (activeTheme === Theme.GOOD) {
    document.documentElement.setAttribute('data-theme', Theme.EVIL);
    fav.makeEvil();
    shimmer.makeEvil();
    audio.makeEvil();
    background.makeEvil();
  } else {
    document.documentElement.setAttribute('data-theme', Theme.GOOD);
    fav.makeGood();
    shimmer.makeGood();
    audio.makeGood();
    background.makeGood();
  }
};

(() => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', Theme.EVIL);
  } else {
    document.documentElement.setAttribute('data-theme', Theme.GOOD);
  }

  const Hero = document.getElementById('Hero');
  const Content = document.getElementById('Content');

  Hero.classList.add('Hero--active');
  Content.classList.add('Content--active');
})();

themeToggle.addEventListener('click', handleToggleTheme);

/** Credit Alex Bainter */

console.log(
  'CREDIT: Thanks to Alex Bainter for the generative music. Find him on Twitter at: https://twitter.com/alex_bainter and check out more generative sounds at: https://generative.fm/'
);
