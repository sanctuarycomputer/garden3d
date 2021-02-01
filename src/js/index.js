'use strict';
import background from './background';
import audio from './audio';
import shimmer from './shimmer';

import { Theme } from './constants';

const themeToggle = document.querySelector('[data-trigger="theme-toggle"]');

const handleToggleTheme = function () {
  const activeTheme = document.body.getAttribute('data-theme');

  if (activeTheme === GOOD) {
    document.body.setAttribute('data-theme', Theme.EVIL);
    shimmer.makeEvil();
    audio.makeEvil();
    background.makeEvil();
  } else {
    document.body.setAttribute('data-theme', Theme.GOOD);
    shimmer.makeGood();
    audio.makeGood();
    background.makeGood();
  }
};

themeToggle.addEventListener('click', handleToggleTheme);
