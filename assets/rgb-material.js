function proc( options ) {
  options = options || {};
  var r = (options.r || 0)/ 255,
      g = (options.g || 0)/ 255,
      b = (options.b || 0)/ 255;

  return {
    color: [r, g, b]
  };
};
