import * as PIXI from 'pixi.js';
import gsap from 'gsap';

import { Direction, Theme, Operator } from './constants';

import goodBg from '/assets/images/bg-good.jpg';
import evilBg from '/assets/images/bg-evil.jpg';
import clouds from '/assets/images/clouds.png';
import waves from '/assets/images/waves.jpg';

export default (function () {
  const Background = {
    pixi: {
      app: new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        antialias: true,
        autoResize: true,
      }),
      loader: new PIXI.Loader(),
      stage: new PIXI.Container(),
      textureGood: null,
      textureEvil: null,
      textureClouds: null,
      textureWaves: null,
      backgroundGood: null,
      backgroundEvil: null,
      displacementSprite: null,
      displacementFilter: null,
      transitionSprite: null,
      transitionFilter: null,
    },
    state: {
      count: 0,
      activeTheme: Theme.GOOD,
      direction: Direction.DOWN,
    },
    elements: {
      background: document.getElementById('Background'),
    },

    /**
     * Private
     */

    _init() {
      Background.loadTextures(Background._setupPixi);
    },

    loadTextures(onLoad) {
      Background.pixi.app.loader
        .add('good', goodBg)
        .add('evil', evilBg)
        .add('clouds', clouds)
        .add('waves', waves)
        .load(onLoad);
    },

    _setupPixi() {
      Background._setupTextures();
      Background._setupSprites();
      Background._setupFilters();
      Background._setupLayers();
      Background._animate();
      Background._fadeIn();
    },

    _setupTextures() {
      Background.pixi.textureGood = new PIXI.Texture(
        Background.pixi.app.loader.resources.good.texture
      );
      Background.pixi.textureEvil = new PIXI.Texture(
        Background.pixi.app.loader.resources.evil.texture
      );
      Background.pixi.textureClouds = new PIXI.Texture(
        Background.pixi.app.loader.resources.clouds.texture
      );
      Background.pixi.textureWaves = new PIXI.Texture(
        Background.pixi.app.loader.resources.waves.texture
      );
    },

    _setupSprites() {
      Background.pixi.backgroundGood = new PIXI.Sprite(Background.pixi.textureGood);
      Background.pixi.backgroundEvil = new PIXI.Sprite(Background.pixi.textureEvil);
      Background.pixi.displacementSprite = new PIXI.Sprite(Background.pixi.textureWaves);
      Background.pixi.transitionSprite = new PIXI.Sprite(Background.pixi.textureClouds);
    },

    _setupFilters() {
      Background.pixi.displacementFilter = new PIXI.filters.DisplacementFilter(
        Background.pixi.displacementSprite
      );
      Background.pixi.displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;

      Background.pixi.transitionFilter = new PIXI.filters.DisplacementFilter(
        Background.pixi.transitionSprite
      );
      Background.pixi.transitionSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    },

    _setupLayers() {
      Background.elements.background.appendChild(Background.pixi.app.view);
      Background.pixi.stage.addChild(Background.pixi.displacementSprite);
      Background.pixi.stage.addChild(Background.pixi.backgroundEvil);
      Background.pixi.stage.addChild(Background.pixi.backgroundGood);
      Background.pixi.stage.addChild(Background.pixi.transitionSprite);
      Background.pixi.displacementSprite.scale.set(1);
      Background.pixi.displacementFilter.scale.set(17.5);
      Background.pixi.transitionSprite.scale.set(1);
      Background.pixi.transitionFilter.scale.set(50);

      window.addEventListener('resize', Background._resize);
    },

    _animate() {
      requestAnimationFrame(Background._animate);

      Background.pixi.displacementSprite.setTransform(0, Background.state.count * 5);

      Background._updateCount();
      Background.pixi.stage.filters = [
        Background.pixi.displacementFilter,
        Background.pixi.transitionFilter,
      ];
      Background.pixi.app.renderer.render(Background.pixi.stage);
    },

    _updateCount() {
      if (Background.state.direction === Direction.UP) {
        Background.state.count -= 0.1;
      } else {
        Background.state.count += 0.1;
      }
    },

    _resize() {
      Background.pixi.app.renderer.resize(window.innerWidth, window.innerHeight);
    },

    _updateDirection() {
      if (Background.state.direction === Direction.DOWN) {
        Background.state.direction = Direction.UP;
      } else {
        Background.state.direction = Direction.DOWN;
      }
    },

    _transitionSlide(slideIndex, direction) {
      gsap.to(Background.pixi.stage.children, {
        duration: (500 * 2) / 1000,
        alpha: 0,
        ease: 'power3.out',
        onStart: Background._updateDirection,
      });

      gsap.to(Background.pixi.transitionSprite, {
        duration: (2000 * 2) / 1000,
        rotation: `${direction + 0.2}`,
        ease: 'power3.out',
      });

      gsap.to(Background.pixi.stage.children[slideIndex], {
        duration: (500 * 2) / 1000,
        alpha: 1,
        ease: 'power3.out',
      });
    },

    _fadeIn() {
      gsap.to('#Background', {
        duration: 2,
        opacity: 1,
        rotate: 0.01,
        ease: 'power3.out',
      });

      gsap.to('#Hero', {
        duration: 1,
        delay: 1.5,
        opacity: 1,
        rotate: 0.01,
        ease: 'power3.out',
      });

      gsap.to('#Content', {
        duration: 1,
        delay: 2,
        opacity: 1,
        y: 0,
        rotate: 0.01,
        ease: 'power3.out',
      });
    },

    /**
     * Public
     */

    makeGood() {
      Background._transitionSlide(2, Operator.SUBTRACT);
      Background.state.activeTheme = Theme.GOOD;
    },

    makeEvil() {
      Background._transitionSlide(1, Operator.ADD);
      Background.state.activeTheme = Theme.EVIL;
    },
  };

  Background._init();

  return Background;
})();
