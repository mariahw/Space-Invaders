const PIXI = require('pixi.js')
const Bullet = require('../bullet/index')

const position = require('../../common/position')
const config = require('./config')


//Enemy constructor for enemy game swarms

function enemy( gameobj, level ) {

  const _this = this;
  const game = gameobj;

  this.bullet = [];
  this.obj = {}
  this.timer = 0;
  this.textures = {
      alpha: null,
      beta: null,
      charlie: null,
  }

  this.level = gameobj.level;
  this.height = config.data.height;
  this.width = config.data.width;
  this.scale = config.data.scale;
  this.enemyCount = Math.floor(game.grid / (this.width * this.scale));
  this.enemyOffset = config.data.rowOffset;
  this.rows = config.data.level
  this.shiftInt = 4;
  this.shiftBool = true;

  //Create enemies and assiciated assets
  this.setup = function(){

    var grid = game.grid;
    let rowOffset = this.enemyOffset;
    var texture = null;

    for(
      let row = 1; row <= this.rows[this.level].enemyRows; row++
    ){

      //Create particle Container for each row of enemies
      var newRow = ("row" + row );
      _this.obj[newRow] = new PIXI.particles.ParticleContainer();
      let currRow = _this.obj[newRow];

      currRow.height = this.height;
      currRow.width = this.width * this.enemyCount;

      //Update enemy textures
      switch(row){
        case 1: texture = this.textures.alpha; break;
        case 2: texture = this.textures.beta; break;
        case 3: texture = this.textures.charlie; break;
        default: this.textures.alpha
      }

      //Create enemy
      for ( var enmyobj = 0; enmyobj < this.enemyCount; enmyobj++ ){

        let enemy = new PIXI.Sprite( texture );

        enemy.width = _this.width;
        enemy.height = _this.height;

        enemy.anchor.set(0.5, 0.5);
        enemy.pivot.set(0.5, 0.5);
        enemy.scale.set(0.75, 0.75);
        enemy.x = position.posX(grid, game, enemy, this.enemyCount, enmyobj);

        //Assign enemy to particleContainer
        currRow.addChild(enemy);

      }

      //Position newly created row
      var posY = Math.abs(
        (55*0.75)*row) + (rowOffset*((rowOffset/3)*(row/2))
      );
      currRow.position.set( 0, posY )

    }

  }

  //Initialize enemies
  this.init = function(){

    // create textures
    var enmyAlphaRect = new PIXI.Rectangle(0, 0, 89, 55);
    var enmyAlphaTexture = new PIXI.Texture(
      PIXI.utils.TextureCache['spriteSheet'],
      enmyAlphaRect
    );
    this.textures.alpha = enmyAlphaTexture;

    var enmyBetaRect = new PIXI.Rectangle(0, 58, 89, 55);
    var enmyBetaTexture = new PIXI.Texture(
      PIXI.utils.TextureCache['spriteSheet'],
      enmyBetaRect
    );
    this.textures.beta = enmyBetaTexture;

    var enmyCharlieRect = new PIXI.Rectangle(0, 121, 89, 55);
    var enmyCharlieTexture = new PIXI.Texture(
      PIXI.utils.TextureCache['spriteSheet'],
      enmyCharlieRect
    );
    this.textures.charlie = enmyCharlieTexture;

    // Assign bullet for enemies to utilize
    _this.bullet = new Bullet.bullet( game, true );
    _this.bullet.init();

    _this.setup();

  }

  //Enemies movment viaX method
  this.shiftX = function(posx){
    switch( this.shiftBool ) {
      case true: return posx+=8; break;
      case false: return posx-=8; break;
      default: return posx+=8;
    }
  } ;

  //Enemies movment viaY method
  this.shiftY = function(posY){
    return posY+=8;
    trigForward = false;
  }

  //Enemies movment pattern (reverse) method
  this.shiftReverse = function(){
    this.shiftBool = !this.shiftBool;
    this.shiftInt = 0;
  }

  //Enemies movment pattern (forward) method
  this.shiftForward = function(posY){
    return posY+=8;
    trigForward = false;
  }

  //Random int method
  this.getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  //Enemies attack method
  this.attack = function(){

    //Pull random enemy positions
    var rows = config.data.level[this.level].enemyRows

    var actveRow = this.getRandomInt(1, rows)
    actveRow = this.obj["row" + actveRow]

    var actveShooter =
      actveRow.children[Math.floor(Math.random() * actveRow.children.length)];

    //Shoot from selected enemy position
    var actvBullet = _this.bullet

    actvBullet.fire(actveRow.toGlobal(actveShooter.position))

  }

  //Initiate enemie swarm/attack
  this.swarm = function(delta){

    // Movements
    var trigForward = false;
    this.timer++

    if ( this.timer === 90 ){

      this.attack()

      switch( this.shiftInt ){
        case 8: trigForward = true; break;
        case 9: this.shiftReverse(); break;
        default: break;
      }

      for ( rowIndx in this.obj ){

        var currRow = this.obj[rowIndx];

        if (trigForward){ currRow.y = this.shiftY(currRow.y) }
        else { currRow.x = this.shiftX(currRow.x) }

      }

      this.timer = 0;
      this.shiftInt++

    }


  }


}

module.exports.enemy = enemy;
