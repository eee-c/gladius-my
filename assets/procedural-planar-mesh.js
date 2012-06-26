function proc( options ) {

  options = options || {};
  options.size = options.size || 1.0;

  var mesh = {
    primitive: {
      type: "plane",
      sine: options.size,
      uv: {
        projectionMode: "planar",
        projectionAxis: "x"
      }
    },
    compile: true
  };

  return mesh;
}
