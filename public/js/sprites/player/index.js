const PIXI = require('pixi.js')
const config = require('./config')
const Bullet = require('../bullet/index')


//Player constructor for player game object

function player(name, gameobj) {

  const _this = this;
  const game = gameobj;

  this.name = name;
  this.lives = 3;
  this.bullet = null;
  this.obj = null;

  this.height = config.data.height;
  this.width = config.data.width;
  this.scale = config.data.scale;
  this.flood = this.scale * game.offset;

  //Create player and assiciated assets
  this.setup = function(){

    let playerRect = new PIXI.Rectangle(0, 185, this.width, this.height);
    let playerTexture = new PIXI.Texture(
      PIXI.utils.TextureCache['spriteSheet'],
      playerRect
    );

    let player = new PIXI.Sprite( playerTexture );

    player.x =  game.obj.renderer.view.width / 2;
    player.y =  game.obj.renderer.view.height - (this.height + 5);
    player.anchor.set(0.5, 0.5)
    player.pivot.set(0.5, 0.5)

    player.width = _this.width;
    player.height = _this.height;

    //Assign sprite to _this.obj
    this.obj = player;

  }

  //Initialize player
  this.init = function(){

    _this.setup();

    //Initialize player ammunition
    this.bullet = new Bullet.bullet( game, false );
    this.bullet.init()

  }

  //Player shoot ammunition method
  this.shoot = function(){
    this.bullet.fire( this.obj );
  }

  //Player basic game movements
  this.move  = function( dir ){

    //Change player direction based on user feedback
    switch( dir ){

      case 'left':
        if( this.obj.x > (0 + game.offset + (_this.width * 0.65) ) ){
          _this.obj.x = _this.obj.x-=5;
        };
        break;

      case 'right':
        if (_this.obj.x < (game.grid + game.offset - (_this.width * 0.65)) ){
          _this.obj.x = _this.obj.x+=5;
        }
        break;

    }


  }

}

module.exports.player = player;
