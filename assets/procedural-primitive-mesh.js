function proc(options) {
  options = options || {
    type: "sphere",
    radius: 1.0
  };

  return {
    primitive: options,
    compile: true
  };
}

  // var uv = {
  //   projectionMode: "spherical",
  //   projectionAxis: "y",
  //   wrapW: 5,
  //   wrapH: 2
  // };
