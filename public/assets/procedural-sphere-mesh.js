function proc( options ) {

  options = options || {};
  options.size = options.size || 1.0;
  var point = options.size / 2.0;

  var M_TWO_PI = 2.0 * Math.PI,
      M_HALF_PI = Math.PI / 2.0,
      N_LAT = 24,
      N_LON = 12;

  var points = [];
  var faces = [];

  for (var i=0; i<12; i++) {
    for (var j=0; j<24; j++) {
      points.push([
        Math.sin(Math.PI * i/12) * Math.cos(M_TWO_PI * j/24),
        Math.sin(Math.PI * i/12) * Math.sin(M_TWO_PI * j/24),
        Math.cos(Math.PI * i/12)
      ]);
      if (points.length > 25) {
        var idx = points.length-1;
        faces.push([
          idx-25,
          idx-24,
          idx
        ]);
        faces.push([
          idx-25,
          idx,
          idx-1
        ]);
      }
    }
  }

  var uv = [];
  for (var i=0; i< faces.length; i++) {
    uv.push([ [1, 0], [0, 0], [0, 1] ]);
  }

  var mesh =
  {
    points: points,
    faces: faces,
    uv: uv,
    uvmapper: {
      projectionMode: "spherical",
      projectionAxis: "y",
      wrapW: 5,
      wrapH: 2.5
    }
  };

  return mesh;
}
