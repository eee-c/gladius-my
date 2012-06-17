function proc( options ) {

  options = options || {};
  options.size = options.size || 1.0;

  var mesh = {
    primitive: {
      type: "sphere",
      radius: options.size,
      lat: 24,
      lon: 24,
      // material: {
      //    // color: [80/255, 200/255, 120/255],
      //    // specular:[1,1,1],
      //    // shininess: 0.9,
      //    // env_amount: 1.0,
      //   textures: {
      //     color: '/images/rygb_256.png'
      //     // color: "/images/cubicvr_js/2576-diffuse.jpg",
      //     // normal: "/images/cubicvr_js/2576-normal.jpg",
      //     // bump: "/images/cubicvr_js/2576-bump.jpg",
      //     // envsphere: "/images/cubicvr_js/fract_reflections.jpg"
      //   }
      // },
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
