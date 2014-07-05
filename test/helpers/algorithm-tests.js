var Map = require("../../src/map");

module.exports = function (algorithm) {
  var map;
  var wrapper;
  var results;
  var queuedPaints;
  var goalNode;
  var openList;

  beforeEach(function () {
    wrapper = {
      callback: function (results_, queuedPaints_, goalNode_, openList_, finish) {
        results = results_;
        queuedPaints = queuedPaints_;
        goalNode = goalNode_;
        openList = openList_;
      }
    };
    spyOn(wrapper, 'callback').andCallThrough();
  });

  afterEach(function () {
    expect(wrapper.callback).toHaveBeenCalled();
  });

  describe("given a map of size 2x2 with no obstacles", function () {
    beforeEach(function () {
      map = new Map(2, 2);
    });

    it("should return a path from goal to start", function () {
      algorithm.run(map, wrapper.callback);
      expect(goalNode).toBeDefined();
      expect(goalNode.equals(map.goal)).toBe(true);
      var parent = goalNode;
      do {
        parent = parent.parent;
      } while (parent.parent);
      expect(parent.equals(map.start)).toBe(true);
    });
  });

  describe("given a large map with no obstacles", function () {
    beforeEach(function () {
      map = new Map(100, 100);
    });

    it("should return a path from goal to start", function () {
      algorithm.run(map, wrapper.callback);
      expect(goalNode).toBeDefined();
      expect(goalNode.equals(map.goal)).toBe(true);
      var parent = goalNode;
      do {
        parent = parent.parent;
      } while (parent.parent);
      expect(parent.equals(map.start)).toBe(true);
    });
  });

  describe("given a maze-like map with a path between start and goal", function () {
    beforeEach(function () {
      var x, y;
      map = new Map(100, 100);
      for (y = 1; y < map.height - 5; y+=4) {
        for (x = 0; x < map.width - 1; x++) {
          map.placeObstacles(x, y, 1);
          map.placeObstacles(x + 1, y + 2, 1);
        }
      }
    });

    it("should return a path from goal to start", function () {
      algorithm.run(map, wrapper.callback);
      expect(goalNode).toBeDefined();
      expect(goalNode.equals(map.goal)).toBe(true);
      var parent = goalNode;
      do {
        parent = parent.parent;
      } while (parent.parent);
      expect(parent.equals(map.start)).toBe(true);
    });
  });

  describe("given a map densely populated with obstacles with a path between start and goal", function () {
    beforeEach(function () {
      map = new Map(20, 20);
      map.placeObstacles(19, 0, 30);
    });

    it("should return a path from goal to start", function () {
      algorithm.run(map, wrapper.callback);
      expect(goalNode).toBeDefined();
      expect(goalNode.equals(map.goal)).toBe(true);
      var parent = goalNode;
      do {
        parent = parent.parent;
      } while (parent.parent);
      expect(parent.equals(map.start)).toBe(true);
    });
  });

  describe("given a map where the start node is surrounded in obstacles", function () {
    beforeEach(function () {
      map = new Map(50, 50);
      map.placeObstacles(map.start.x, map.start.y, 20);
    });

    it("should not return a path", function () {
      algorithm.run(map, wrapper.callback);
      expect(goalNode).not.toBeDefined();
    });
  });

  describe("given a map where the goal node is surrounded in obstacles", function () {
    beforeEach(function () {
      map = new Map(50, 50);
      map.placeObstacles(map.goal.x, map.goal.y, 20);
    });

    it("should not return a path", function () {
      algorithm.run(map, wrapper.callback);
      expect(goalNode).not.toBeDefined();
    });

    it("should visit all non-obstacle nodes", function () {
      var x, y, i;

      algorithm.run(map, wrapper.callback);

      visitedMap = [];
      for (x = 0; x < map.width; x++) {
        visitedMap[x] = [];
        for (y = 0; y < map.height; y++) {
          // false = obstacle

          visitedMap[x][y] = false;
        }
      }
      visitedMap[map.start.x][map.start.y] = true;
      visitedMap[map.goal.x][map.goal.y] = true;

      // Assume if a paint occured on a point that it was visited
      for (i = 0; i < queuedPaints.length; i++) {
        var paint = queuedPaints[i];
        visitedMap[paint.x][paint.y] = true;
      }

      // validate map
      var matches = true;
      for (x = 0; x < map.width; x++) {
        for (y = 0; y < map.height; y++) {
          if (map[x][y] !== visitedMap[x][y]) {
            matches = false;
          }
        }
      }

      expect(matches).toBe(true);
    });
  });

  describe("given a map with obstacles blocking the middle", function () {
    beforeEach(function () {
      map = new Map(50, 50);
      for (var x = 0; x < map.width; x++) {
        for (var y = map.height - 1; y >= 0; y--) {
          map.placeObstacles(x, y, 10);
        }
      }
    });

    it("should not return a path", function () {
      algorithm.run(map, wrapper.callback);
      expect(goalNode).not.toBeDefined();
    });
  });
};