'use strict';
import background from './background';
import audio from './audio';
import { Operator, Theme } from './constants';

const themeToggle = document.querySelector('[data-trigger="theme-toggle"]');

const handleToggleTheme = function () {
  const activeTheme = document.body.getAttribute('data-theme');

  if (activeTheme === Theme.GOOD) {
    document.body.setAttribute('data-theme', Theme.EVIL);
    audio.makeEvil();
    background.transitionSlide(1, Operator.ADD);
  } else {
    document.body.setAttribute('data-theme', Theme.GOOD);
    audio.makeGood();
    background.transitionSlide(2, Operator.SUBTRACT);
  }
};

themeToggle.addEventListener('click', handleToggleTheme);
