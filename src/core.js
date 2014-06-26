var core = (function () {
  'use strict';

  var module = {};

  module.CANVAS_WIDTH  = 640;
  module.CANVAS_HEIGHT = 480;
  module.MAP_SCALE     = 10; // Must be a divisor or CANVAS_WIDTH and CANVAS_HEIGHT
  module.MAP_WIDTH     = module.CANVAS_WIDTH / module.MAP_SCALE;
  module.MAP_HEIGHT    = module.CANVAS_HEIGHT / module.MAP_SCALE;
  
  module.Node = function (x, y, parent, cost) {
    this.x = x;
    this.y = y;
    this.g = 0;
    this.f = 0;
    this.parent = parent;
    if (parent) {
      this.g = parent.g + cost;
    }
  };

  module.setCanvasDimensions = function (width, height) {
    module.CANVAS_WIDTH  = width;
    module.CANVAS_HEIGHT = height;
    updateMapDimensions();
  }

  module.setMapScale = function (mapScale) {
    core.MAP_SCALE = mapScale;
    updateMapDimensions();
  }

  function updateMapDimensions() {
    module.MAP_WIDTH  = Math.floor(module.CANVAS_WIDTH / module.MAP_SCALE);
    module.MAP_HEIGHT = Math.floor(module.CANVAS_HEIGHT / module.MAP_SCALE);
  }

  return module;
})();