function proc( options ) {

  options = options || {};
  options.size = options.size || 1.0;

  var mesh = {
    primitive: {
      type: "sphere",
      radius: options.size,
      lat: 24,
      lon: 24,
      uv: {
        projectionMode: "spherical",
        projectionAxis: "y",
        wrapW: 5,
        wrapH: 2
      }
    },
    compile: true
  };

  return mesh;
}
