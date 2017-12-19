const Pixi = require('./js/pixi/index');

window.addEventListener('load',
  function(){
    //Create new pixi.js game object
    var newGame = new Pixi.game();
    newGame.init("lvl1");

  },
false )
