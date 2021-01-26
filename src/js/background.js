import * as PIXI from 'pixi.js';

import goodBg from '/assets/images/bg-good.png';
// import evilBg from '/assets/images/bg-evil.png';

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
      texture: null,
      background: null,
      displacementSprite: null,
      displacementFilter: null,
    },
    state: {
      count: 0,
      ready: false,
    },
    elements: {
      background: document.getElementById('Background'),
    },

    init() {
      Background.setupPixi();

      Background.elements.background.appendChild(Background.pixi.app.view);
      Background.pixi.displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;

      Background.pixi.stage.addChild(Background.pixi.displacementSprite);
      Background.pixi.stage.addChild(Background.pixi.background);

      window.addEventListener('resize', Background.resize);

      Background.animate();
    },

    setupPixi() {
      Background.pixi.stage = new PIXI.Container();
      Background.pixi.texture = PIXI.Texture.from(goodBg);
      Background.pixi.background = new PIXI.Sprite(Background.pixi.texture);
      Background.pixi.displacementSprite = PIXI.Sprite.from(clouds);
      Background.pixi.displacementFilter = new PIXI.filters.DisplacementFilter(
        Background.pixi.displacementSprite
      );
    },

    animate() {
      Background.state.ready = true;
      requestAnimationFrame(Background.animate);

      Background.pixi.displacementSprite.x = Background.state.count * 10;
      Background.pixi.displacementSprite.y = Background.state.count * 10;

      Background.state.count += 0.05;

      Background.pixi.stage.filters = [Background.pixi.displacementFilter];
      Background.pixi.app.renderer.render(Background.pixi.stage);
    },

    resize() {
      Background.pixi.app.renderer.resize(window.innerWidth, window.innerHeight);
    },
  };

  Background.init();

  return Background;
})();
