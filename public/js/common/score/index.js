const PIXI = require('pixi.js')
const config = require('./config')


//Score constructor for scoreboard game object

function score( gameobj ) {

  const _this = this;
  const game = gameobj;

  this.obj = null;

  this.width = config.data.width;
  this.height = config.data.height;
  this.style = config.data.style;
  this.score = "Score: ";
  this.scoreInt = 0;
  this.lives = "Lives: ";
  this.livesInt = 3;

  //Create score obj and assiciated assets
  this.setup = function(){

    var scoreKeeper = new PIXI.Container();
    scoreKeeper.width = game.grid
    scoreKeeper.height = 20

    scoreKeeper.x = game.offset;
    scoreKeeper.y = 10;

    let score = new PIXI.Text("Score: 0", _this.style);

    let lives = new PIXI.Text("Lives: 3", _this.style);
    lives.x = game.grid - game.offset;

    scoreKeeper.addChild(score)
    scoreKeeper.addChild(lives)

    //Assign sprite container to _this.obj
    _this.obj = scoreKeeper

  }

  //Initialize score
  this.init = function(){

    _this.setup()

  }

  //Increment score by points inc argument
  this.incScore = function(inc){
    let scoreObj = _this.obj.getChildAt(0)

    _this.scoreInt = _this.scoreInt+=inc
    scoreObj.text = _this.score + _this.scoreInt
  }

  //Decrement lives by 1
  this.decLives = function(){
    let livesObj = _this.obj.getChildAt(1)

    _this.livesInt = _this.livesInt-=1
    livesObj.text = _this.lives + _this.livesInt
  }

}

module.exports.score = score;
