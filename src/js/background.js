import * as PIXI from 'pixi.js';
import gsap from 'gsap';

import { Direction } from './constants';

import goodBg from '/assets/images/bg-good.png';
import evilBg from '/assets/images/bg-evil.png';

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
    },
    state: {
      count: 0,
      direction: Direction.UP,
    },
    elements: {
      background: document.getElementById('Background'),
    },

    init() {
      Background.setupPixi();

      Background.elements.background.appendChild(Background.pixi.app.view);
      Background.pixi.displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;

      Background.pixi.stage.addChild(Background.pixi.displacementSprite);
      Background.pixi.stage.addChild(Background.pixi.backgroundEvil);
      Background.pixi.stage.addChild(Background.pixi.backgroundGood);

      Background.pixi.displacementSprite.scale.set(0.5);
      Background.pixi.displacementFilter.scale.set(20);

      window.addEventListener('resize', Background.resize);

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
    },

    animate() {
      requestAnimationFrame(Background.animate);

      Background.pixi.displacementSprite.x = Background.state.count * 10;
      Background.pixi.displacementSprite.y = Background.state.count * 10;

      Background.updateCountDirection();
      Background.updateCount();
      Background.pixi.stage.filters = [Background.pixi.displacementFilter];
      Background.pixi.app.renderer.render(Background.pixi.stage);
    },

    updateCountDirection() {
      if (Background.state.count >= 100) {
        Background.state.direction = Direction.DOWN;
      }

      if (Background.state.count <= 0) {
        Background.state.direction = Direction.UP;
      }
    },

    updateCount() {
      if (Background.state.direction === Direction.UP) {
        Background.state.count += 0.05;
      } else {
        Background.state.count -= 0.05;
      }
    },

    resize() {
      Background.pixi.app.renderer.resize(window.innerWidth, window.innerHeight);
    },

    transitionSlide(slideIndex, direction) {
      gsap.to(Background.pixi.stage.children, {
        duration: (1000 * 2) / 1000,
        alpha: 0,
        ease: 'power3.out',
      });

      gsap.to(Background.pixi.displacementSprite, {
        duration: (1000 * 2) / 1000,
        rotation: `${direction + 0.5}`,
        ease: 'power3.out',
      });

      gsap.to(Background.pixi.stage.children[slideIndex], {
        duration: (1000 * 2) / 1000,
        alpha: 1,
        ease: 'power3.out',
      });
    },
  };

  Background.init();

  return Background;
})();
