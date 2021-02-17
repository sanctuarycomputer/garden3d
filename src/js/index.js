'use strict';
import background from './background';
import audio from './audio';
import shimmer from './shimmer';
import fav from './fav';

import { Theme } from './constants';

const themeToggle = document.querySelector('[data-trigger="theme-toggle"]');

const handleToggleTheme = function () {
  const activeTheme = document.body.getAttribute('data-theme');

  if (activeTheme === Theme.GOOD) {
    document.body.setAttribute('data-theme', Theme.EVIL);
    fav.makeEvil();
    shimmer.makeEvil();
    audio.makeEvil();
    background.makeEvil();
  } else {
    document.body.setAttribute('data-theme', Theme.GOOD);
    fav.makeGood();
    shimmer.makeGood();
    audio.makeGood();
    background.makeGood();
  }
};

themeToggle.addEventListener('click', handleToggleTheme);
