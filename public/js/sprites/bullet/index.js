const config = require('./config')


//Bullet constructor for bullet and ammunition game objects

function bullet( gameobj, enemy ) {

  const game = gameobj;
  const _this = this;

  this.active = false;
  this.index = null;
  this.obj = null;

  this.width = config.data.width;
  this.height = config.data.height;
  this.enemy = enemy;

  //Create ammo and assiciated assets
  this.setup = function(){

    //General texture assigned
    let ammo = new PIXI.Sprite( PIXI.Texture.WHITE );

    ammo.width = this.width
    ammo.height = this.height

    ammo.anchor.set(0.5, 0.5);
    ammo.pivot.set(0.5, 0.5);

    ammo.visible = false

    //Assign sprite to _this.obj
    _this.obj = ammo;

  }

  //Initialize ammunition
  this.init = function(){

    this.setup()

    //Semi-independent object assigned seperate from parent
    game.stateContainer.play.addChild(this.obj)

  }

  //Activate sprite ammunition for gameplay
  this.activate = function(delta){

    if ( this.active ){

      if ( this.enemy ){
        if ( this.obj.y > (game.obj.renderer.view.height + _this.height) ){
          this.reset();
        }
        else { this.obj.y+=10 }
      }

      else {
        if ( this.obj.y < Math.abs(this.width) ){
          this.reset();
        }
        else { this.obj.y-=10  }
      }

    }

  }

  //Fire - assign parent obj position and visibility
	this.fire = function( obj ) {

    if ( !this.active ){
  		this.obj.x = obj.x;
  		this.obj.y = obj.y;
  		this.active = true;
      this.obj.visible = true;
    }

	};

  //Reset - reset position and visibility
	this.reset = function() {

		this.obj.x = 0;
		this.obj.y = 0;
    this.active = false;
    this.obj.visible = false;

	};

}

module.exports.bullet = bullet;
