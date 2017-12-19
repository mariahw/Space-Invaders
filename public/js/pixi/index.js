const PIXI = require('pixi.js')
const config = require('./options.js')
const constants = require('./constants.js')
const collision = require('../common/collision')
const Keyboard = require('../common/keyboard')

//loaders
const Score = require('../common/score/index')
const Menu = require('../common/menu/index')
const Player = require('../sprites/player/index')
const Base = require('../sprites/base/index')
const Enemy = require('../sprites/enemy/index')


//Game constructor for game object

function game (){

  const _this = this;

  this.level = null;
  this.controls = null;
  this.player = null;
  this.menu = null;
  this.spritesDict = {};
  this.stateContainer = {
    boot: null,
    play: null,
    end: null
  }

  this.state = "boot";
  this.grid = ( config.options.width * 0.8) ;
  this.offset = (config.options.width - _this.grid)/2;
  this.texture = constants.texture;
  this.options = config.options;
  this.obj = new PIXI.Application(this.options);
  this.keys = {
    left: Keyboard.keys(37),
    right: Keyboard.keys(39),
    space: Keyboard.keys(32)
  }

  //Update game state
  this.changeState = function( newstate ){

    for (let stContr of Object.values(_this.stateContainer)) {
      stContr.visible = false;
    }

    switch ( newstate ) {
      case "boot":
        _this.state = "boot";
        break;
      case "play":
        _this.state = "play";
        break;
      case "end":
        _this.state = "end";
        break;
    }

  }

  //Initialize game
  this.init = function( level ){

    // Assign level per game config
    _this.level = level;
    document.getElementById("App").appendChild(_this.obj.view);

    // Create Boot Scene and add to game stage
    var bootScene = new PIXI.Container();
    _this.stateContainer.boot = bootScene
    _this.obj.stage.addChild(bootScene);

    // Create Game Scene and add to game stage
    var gameScene = new PIXI.Container();
    _this.stateContainer.play = gameScene
    _this.obj.stage.addChild(gameScene);

    // Create Game Over Scene and add to game stage
    var gameOverScene = new PIXI.Container();
    _this.stateContainer.end = gameOverScene;
    _this.obj.stage.addChild(gameOverScene);

    // Texture loader
    PIXI.loader
      .add("spriteSheet", _this.texture.spriteSheet)
      .add("base", _this.texture.base)
      .add("playBtn", _this.texture.play)
      .load(_this.setup)

  }

  //Initialize game
  this.setup = function() {

    //Load Game Menu
    _this.menu = new Menu.menu( _this )
    _this.menu.init()
    _this.stateContainer.boot.addChild(_this.menu.obj);

    //Load Game Score
    _this.score = new Score.score( _this )
    _this.score.init()
    _this.stateContainer.play.addChild(_this.score.obj);

    //Load Game Player
    _this.player = new Player.player("Mariah", _this)
    _this.player.init()
    _this.stateContainer.play.addChild(_this.player.obj);

    //Load Game Bases
    _this.spritesDict["bases"] = new Base.base( _this )
    _this.spritesDict["bases"].init()
    _this.stateContainer.play.addChild(_this.spritesDict['bases'].obj)

    //Load Game Enemies
    _this.spritesDict["enemies"] = new Enemy.enemy(_this)
    _this.spritesDict["enemies"].init()
    for (let row of Object.values(_this.spritesDict['enemies'].obj)) {
      _this.stateContainer.play.addChild(row)
    }

    // Initialize gameLoop and game state
    _this.obj.ticker.add(delta => _this.gameLoop(delta));
    _this.changeState("boot")

  }

  //Keep track of enemies currently in game
  this.enemyCount = function(){

    var enemies = 0;

    for ( intRow in _this.spritesDict.enemies.obj ){
      var countRow = _this.spritesDict.enemies.obj[intRow]
      var currRowLength = countRow.children.length
      enemies+=currRowLength
    }

    return enemies

  }

  //All collision detections
  this.collisionDetections = function(){

    //End game if enemyCount = 0
    if (
      _this.enemyCount() == 0 ||
      _this.score.livesInt == 0
    ){
      _this.changeState("end")
    }

    //Player bullet to enemy collision detections
    for ( row in _this.spritesDict.enemies.obj ){
      let currRow = _this.spritesDict.enemies.obj[row]

      for ( enemy in currRow.children ){
        let currEnemy = currRow.children[enemy]

        if(
          collision.detection (
            _this.player.bullet.obj,
            currRow.toGlobal(currEnemy.position),
            currEnemy

        ) && !currEnemy.dead ){
          //Increment score and update enemy count
          _this.score.incScore(100)
          currEnemy.dead = true;
          currEnemy.destroy();

          //Reset bullet
          _this.player.bullet.reset()

        }

      }

    }

    //Player bullet to base collision detection
    for ( base in _this.spritesDict.bases.obj.children ){

      let baseCntr = _this.spritesDict.bases.obj;
      let currBase = _this.spritesDict.bases.obj.children[base];
      let basePos = baseCntr.toGlobal(currBase.position);
      let playerBllt = _this.player.bullet.obj;

      if ( collision.detection( playerBllt, basePos, currBase )){

          //Reset bullet
          _this.player.bullet.reset()

      }

    }

    //Enemy bullet to base collision detection
    for ( base in _this.spritesDict.bases.obj.children ){

      let baseCntr = _this.spritesDict.bases.obj;
      let currBase = _this.spritesDict.bases.obj.children[base];
      let basePos = baseCntr.toGlobal(currBase.position);
      let enmyBllt = _this.spritesDict.enemies.bullet.obj;

      if ( collision.detection( enmyBllt, basePos, currBase )){

          //Reset bullet
          _this.spritesDict.enemies.bullet.reset()
          currBase.alpha-=0.25

          if(currBase.alpha <= 0){

            baseCntr.removeChild(currBase)
            currBase.visible = false

            //Decrease base count
            _this.spritesDict.bases.baseCount-=1

          }

      }

    }

    //Enemy bullet to player collision detection
    if ( collision.detection (
        _this.player.obj, _this.spritesDict.enemies.bullet.obj
      )){
        //Reset bullet
        _this.spritesDict.enemies.bullet.reset()
        //Decrement score lives
        _this.score.decLives()
    }


  }

  //Boot phase
  this.boot = function(){
    _this.stateContainer.boot.visible = true;
  }

  //Game loop
  this.gameLoop = function(delta) {

    switch( _this.state ){
      case "boot": _this.boot();
        break;
      case "play": _this.play(delta);
        break;
      case "end": _this.end();
        break;
    }

  }

  //Game play mechanics
  this.play = function(delta) {

    _this.stateContainer.play.visible = true;

    // Player controls
    this.keys.left.press = () => {
      _this.player.move('left')
    }

    this.keys.right.press = () => {
      _this.player.move('right')
    }

    this.keys.space.press = () => {
      _this.player.shoot()
    }

    //Collision Detections
    this.collisionDetections()

    //Enemy Swarm Init
    _this.spritesDict["enemies"].swarm(delta)
    _this.spritesDict["enemies"].bullet.activate(delta)

    //Activate Player Ammuniation
    _this.player.bullet.activate(delta)


  }

  //End/Boot phase
  this.end = function() {
    _this.stateContainer.boot.visible = true;
  }


}

module.exports.game = game;
