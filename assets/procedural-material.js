function proc( options ) {
  return {
    //color: [80/255, 200/255, 120/255],
    specular:[1,1,1],
    shininess: 0.9,
    env_amount: 1.0,
    opacity: 1.0,
    textures: {
      color: 'images/rygb_256.png',
      normal: "images/cubicvr_js/2576-normal.jpg",
      bump: "images/cubicvr_js/2576-bump.jpg",
      // normal: "/images/line_normal.png",
      // bump: "/images/line_bump.png",
      // normal: "/images/crater_normal_map.png",
      // bump: "/images/crater_bump_map.png",
      // envsphere: "/images/cubicvr_js/fract_reflections.jpg"
    }
  };
}

      // color: "/images/cubicvr_js/2576-diffuse.jpg",
