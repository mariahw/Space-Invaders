//Function to evenly measure any grouping of objects per the game grid

function posX( grid, game, object, objectCount, iter, base ){

  var grid = game.grid;
  if (base){ grid-=89 }

  var offset = Math.abs((game.obj.renderer.view.width - grid) / 2);

  var colmnWidth = (grid/objectCount)
  var colmnPadding = ((colmnWidth - object.width )/2)

  var positionX =
    offset + (colmnWidth * iter) + (object.width/2) + colmnPadding

  return positionX

}

module.exports.posX = posX
