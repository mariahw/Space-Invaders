const PIXI = require('pixi.js')
const position = require('../../common/position')
const config = require('./config')


//Base constructor for base game object

function base(gameobj, level) {

  const _this = this;
  const game = gameobj;

  this.level = level;
  this.obj = null;

  this.texture = config.data.texture;
  this.height = config.data.height;
  this.width = config.data.width;
  this.scale = config.data.scale;
  this.baseCount = config.data.baseCount;

  //Create bases and assiciated assets
  this.setup = function(){

    let baseRect = new PIXI.Rectangle(0, 0, _this.width, _this.height);
    let baseTexture = new PIXI.Texture(
      PIXI.utils.TextureCache['base'],
      baseRect
    );

    var grid = game.grid;
    var baseContainer = new PIXI.Container(_this.baseCount);

    //Create and place bases based off of level count (baseCount)
    for( let i = 0; i < _this.baseCount; i++ ){

      let base = new PIXI.Sprite( baseTexture );

      base.width = _this.width;
      base.height = _this.height;

      base.anchor.set(0.5, 0.5);
      base.pivot.set(0.5, 0.5);

      base.x =
        position.posX(grid, game, base, _this.baseCount, i, true);

      baseContainer.addChild(base);

    }

    baseContainer.position.set (
      0, (game.obj.renderer.view.height - ( _this.height/2 )) - 100
    );

    //Assign sprite container to _this.obj
    _this.obj = baseContainer;

  }

  //Initialize bases
  this.init = function(){

    this.setup()

  }

}

module.exports.base = base;
