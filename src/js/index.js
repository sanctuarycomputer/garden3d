'use strict';
import background from './background';
import audio from './audio';

const GOOD = 'good';
const EVIL = 'evil';

const themeToggle = document.querySelector('[data-trigger="theme-toggle"]');

const handleToggleTheme = function () {
  const activeTheme = document.body.getAttribute('data-theme');

  if (activeTheme === GOOD) {
    document.body.setAttribute('data-theme', EVIL);
    audio.makeEvil();
  } else {
    document.body.setAttribute('data-theme', GOOD);
    audio.makeGood();
  }
};

themeToggle.addEventListener('click', handleToggleTheme);
