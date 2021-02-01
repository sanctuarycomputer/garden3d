import * as PIXI from 'pixi.js';
import gsap from 'gsap';

import { Direction, Theme, Operator } from './constants';

import goodBg from '/assets/images/bg-good.jpg';
import evilBg from '/assets/images/bg-evil.jpg';

const clouds = 'https://res.cloudinary.com/dvxikybyi/image/upload/v1486634113/2yYayZk_vqsyzx.png';

export default (function () {
  const Background = {
    pixi: {
      app: new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        antialias: true,
        autoResize: true,
      }),
      stage: null,
      textureGood: null,
      textureEvil: null,
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
      direction: Direction.UP,
    },
    elements: {
      background: document.getElementById('Background'),
    },

    init() {
      Background.setupPixi();
      Background.setupLayers();
      Background.animate();
    },

    setupPixi() {
      Background.pixi.stage = new PIXI.Container();
      Background.pixi.textureGood = PIXI.Texture.from(goodBg);
      Background.pixi.textureEvil = PIXI.Texture.from(evilBg);
      Background.pixi.backgroundGood = new PIXI.Sprite(Background.pixi.textureGood);
      Background.pixi.backgroundEvil = new PIXI.Sprite(Background.pixi.textureEvil);

      Background.pixi.displacementSprite = PIXI.Sprite.from(clouds);
      Background.pixi.displacementFilter = new PIXI.filters.DisplacementFilter(
        Background.pixi.displacementSprite
      );
      Background.pixi.displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;

      Background.pixi.transitionSprite = PIXI.Sprite.from(clouds);
      Background.pixi.transitionFilter = new PIXI.filters.DisplacementFilter(
        Background.pixi.transitionSprite
      );
      Background.pixi.transitionSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    },

    setupLayers() {
      Background.elements.background.appendChild(Background.pixi.app.view);
      Background.pixi.stage.addChild(Background.pixi.displacementSprite);
      Background.pixi.stage.addChild(Background.pixi.backgroundEvil);
      Background.pixi.stage.addChild(Background.pixi.backgroundGood);
      Background.pixi.stage.addChild(Background.pixi.transitionSprite);

      window.addEventListener('resize', Background.resize);
    },

    animate() {
      requestAnimationFrame(Background.animate);

      if (Background.state.activeTheme === Theme.GOOD) {
        Background.pixi.displacementSprite.scale.set(0.5);
        Background.pixi.displacementFilter.scale.set(20);
        Background.pixi.transitionSprite.scale.set(0.5);
        Background.pixi.transitionFilter.scale.set(20);
      } else {
        Background.pixi.displacementSprite.scale.set(0.5);
        Background.pixi.displacementFilter.scale.set(50);
        Background.pixi.transitionSprite.scale.set(0.5);
        Background.pixi.transitionFilter.scale.set(50);
      }
      Background.pixi.displacementSprite.x = Background.state.count * 10;
      Background.pixi.displacementSprite.y = Background.state.count * 10;

      Background.updateCount();
      Background.pixi.stage.filters = [
        Background.pixi.displacementFilter,
        Background.pixi.transitionFilter,
      ];
      Background.pixi.app.renderer.render(Background.pixi.stage);
    },

    updateCount() {
      if (Background.state.direction === Direction.UP) {
        Background.state.count -= 0.05;
      } else {
        Background.state.count += 0.05;
      }
    },

    resize() {
      Background.pixi.app.renderer.resize(window.innerWidth, window.innerHeight);
    },

    makeGood() {
      Background.state.activeTheme = Theme.GOOD;
      Background.state.direction = Direction.UP;
      Background.transitionSlide(2, Operator.SUBTRACT);
    },

    makeEvil() {
      Background.state.activeTheme = Theme.EVIL;
      Background.state.direction = Direction.DOWN;
      Background.transitionSlide(1, Operator.ADD);
    },

    transitionSlide(slideIndex, direction) {
      gsap.to(Background.pixi.stage.children, {
        duration: (500 * 2) / 1000,
        alpha: 0,
        ease: 'power3.out',
      });

      gsap.to(Background.pixi.transitionSprite, {
        duration: (1000 * 2) / 1000,
        rotation: `${direction + 0.2}`,
        ease: 'power3.out',
      });

      gsap.to(Background.pixi.stage.children[slideIndex], {
        duration: (500 * 2) / 1000,
        alpha: 1,
        ease: 'power3.out',
      });
    },
  };

  Background.init();

  return Background;
})();
