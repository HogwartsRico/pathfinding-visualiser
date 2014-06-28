/*! pathfinding-visualiser | (c) 2014 Daniel Imms | https://github.com/Tyriar/pathfinding-visualiser/blob/master/LICENSE */
// UMD pattern: https://github.com/umdjs/umd/blob/master/returnExports.js
(function (root, factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    define(['core', 'canvas-helper', 'fibonacci-heap', 'map-node', 'a-star-common'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('./core'), require('./canvas-helper'), require('./fibonacci-heap'), require('./map-node'), require('./a-star-common'));
  } else {
    root.aStarFibonacciHeap = factory(core, canvasHelper, FibonacciHeap, MapNode, aStarCommon);
  }
}(this, function (core, canvasHelper, FibonacciHeap, MapNode, aStarCommon) {
  'use strict';

  var COST_STRAIGHT = 1;
  var COST_DIAGONAL = 1.414;

  var module = {};

  module.run = function (map, callback) {
    var closedList = {};
    var openHash = {};
    var openList = new FibonacciHeap();
    var start = map.start;
    var goal = map.goal;

    start.f = start.g + aStarCommon.heuristic(start, goal);
    openHash[start.x + ',' + start.y] = openList.insert(start.f, start);

    while (!openList.isEmpty()) {
      var current = openList.extractMinimum();

      if (current.value.equals(goal)) {
        callback('Map size = ' + core.MAP_WIDTH + 'x' + core.MAP_HEIGHT + '<br />' +
                 'Total number of nodes = ' + core.MAP_WIDTH * core.MAP_HEIGHT + '<br />' +
                 'Number of nodes in open list = ' + openList.size() + '<br />' +
                 'Number of nodes in closed list = ' + Object.keys(closedList).length);
        var list = [];
        while (!openList.isEmpty()) {
          list.push(openList.extractMinimum().value);
        }
        canvasHelper.draw(closed, list, start, current.value);
        return;
      }

      var currentKey = current.value.x + ',' + current.value.y;
      openHash[currentKey] = undefined;
      closedList[currentKey] = current;
      
      canvasHelper.drawVisited(current.value.x, current.value.y);

      var neighbours = aStarCommon.getNeighbourNodes(map, current.value);
      addNodesToOpenList(neighbours, openList, openHash, closedList, goal);
    }

    callback('No path exists');
  };

  function addNodesToOpenList(nodes, openList, openHash, closedList, goal) {
    for (var i = 0; i < nodes.length; i++) {
      var key = nodes[i].x + ',' + nodes[i].y;

      // Skip if in closed list
      if (key in closedList) {
        continue;
      }

      var nodeByHash = openHash[key];

      if (nodeByHash) {
        if (nodes[i].g < nodeByHash.g) {
          nodeByHash.g = nodes[i].g;
          nodeByHash.parent = nodes[i].parent;
          openList.decreaseKey(nodeByHash, nodeByHash.g +
              aStarCommon.heuristic(nodeByHash, goal));
        }
      } else {
        nodes[i].f = nodes[i].g +
            aStarCommon.heuristic(nodes[i], goal);
        openHash[key] = openList.insert(nodes[i].f, nodes[i]);
      }
    }
  }

  return module;
}));
