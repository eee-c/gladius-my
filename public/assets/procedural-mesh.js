function proc( options ) {

  options = options || {};
  options.size = options.size || 1.0;
  var point = options.size / 2.0;

  var mesh =
  {
    points: [
      [ point, 0,      0],
      [ point, point,  0],
      [ 0,     point,  0],
      [-point, 0,      0],
      [ 0,    -point,  0],
      [ 0,     0,      1.5*point]
    ],
    faces: [
      [4, 3, 2, 1],
      [1, 0, 4],
      [0, 1, 5],
      [1, 2, 5],
      [2, 3, 5],
      [3, 4, 5],
      [4, 0, 5]
    ],
    uv: [
      [ [1, 0], [0, 0], [0, 1], [1, 1] ],
      [ [1, 0], [0, 0], [0, 1] ],
      [ [1, 0], [0, 0], [0, 1] ],
      [ [1, 0], [0, 0], [0, 1] ],
      [ [1, 0], [0, 0], [0, 1] ],
      [ [1, 0], [0, 0], [0, 1] ],
      [ [1, 0], [0, 0], [0, 1] ]
    ],
    // wireframe: true,
    uvmapper: {
      projectionMode: "cubic",
      scale: [1, 1, 1]
    }
  };

  return mesh;
}
