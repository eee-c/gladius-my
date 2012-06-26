function proc( options ) {
  options = options || {};
  options.size = options.size || 0.05;

  return {
    primitive: {
      type: "cylinder",
      radius: options.size,
      height: 50.0
    },
    compile: true
  };
}
