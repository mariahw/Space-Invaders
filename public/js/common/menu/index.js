const PIXI = require('pixi.js')
const config = require('./config')


//Menu constructor for mainMenu object

function menu( gameobj ) {

  const _this = this;
  const game = gameobj;

  this.obj = null;

  this.width = config.data.width;
  this.height = config.data.height;
  this.style = config.data.style;
  this.intro = config.data.intro;
  this.button = config.data.button;

  //Create player and assiciated assets
  this.create = function(){

    //Create and config sprite container
    var mainMenu = new PIXI.Container();
    mainMenu.width = game.grid
    mainMenu.height = 400

    mainMenu.x = game.obj.renderer.view.width / 2 - ( mainMenu.height / 2 );
    mainMenu.y = 150;

    mainMenu.interactive = true;
    mainMenu.buttonMode = true;

    mainMenu.on('click', function(e){ game.changeState("play") });

    //Assign sprite container to _this.obj
    _this.obj = mainMenu;

    //Create and config intro text
    let playRect = new PIXI.Rectangle(0, 0, _this.width, _this.height);
    let playTexture = new PIXI.Texture(
      PIXI.utils.TextureCache['playBtn'],
      playRect
    );

    let introText = new PIXI.Text( _this.intro, _this.style );
    introText.anchor.set(0.5, 0.5);

    _this.obj.addChild(introText);

    //Create and config play button
    let playBttn = new PIXI.Sprite(playTexture);
    playBttn.width = _this.width;
    playBttn.height = _this.height;
    introText.anchor.set(0.5, 0.5);

    playBttn.x = -1 * (_this.width / 2);
    playBttn.y = 125;

    _this.obj.addChild(playBttn);

  }

  //Initialize menu
  this.init = function(){

    _this.create()

  }

}

module.exports.menu = menu;
