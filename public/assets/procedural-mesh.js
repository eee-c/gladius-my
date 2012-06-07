function proc( options ) {

  options = options || {};
  options.size = options.size || 1.0;
  var point = options.size / 2.0;

  var mesh =
  {
    points: [
      [ point, 0,      0],
      [ 0,     point,  0],
      [-point, 0,      0],
      [ 0,    -point,  0],
      [ 0,     0,      2.5*point]
    ],
    faces: [
      [3, 2, 1, 0],
      [0, 1, 4],
      [1, 2, 4],
      [2, 3, 4],
      [3, 0, 4]
    ],
    uv: [
      [ [0, 1], [1, 1], [1, 0], [0, 0] ],
      [ [0, 1], [1, 1], [1, 0], [0, 0] ],
      [ [0, 1], [1, 1], [1, 0], [0, 0] ],
      [ [0, 1], [1, 1], [1, 0], [0, 0] ],
      [ [0, 1], [1, 1], [1, 0], [0, 0] ]
    ],
    // wireframe: true,
    uvmapper: {
      projectionMode: "cubic",
      scale: [1, 1, 1]
    }
  };

  return mesh;

}
