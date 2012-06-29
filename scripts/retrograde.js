document.addEventListener( "DOMContentLoaded", function( e ) {
  require.config({
    baseUrl: "scripts"
  });

  require(
    [ "gladius-core",
      "gladius-cubicvr" ],
    function( Gladius, cubicvrExtension ) {

  var engine = new Gladius();

  // Engine monitor setup
  function monitor( engine ) {
    debugger;
    engine.detach( monitor );
  }
  document.addEventListener( "keydown", function( event ) {
    var code = event.which || event.keyCode;
    if( code === 0x4D && event.ctrlKey && event.altKey ) {
      engine.attach( monitor );
    }
  });

  var cubicvrOptions = {
    renderer: {
      canvas: document.getElementById( "test-canvas" )
    }
  };
  engine.registerExtension( cubicvrExtension, cubicvrOptions );

  var resources = {};

  engine.get(
    [
      {
        type: engine["gladius-cubicvr"].Mesh,
        url: 'assets/procedural-sphere-mesh.js?size=0.9',
        load: engine.loaders.procedural,
        onsuccess: function( mesh ) {
          resources.mesh = mesh;
        },
        onfailure: function( error ) {
        }
      },
      {
        type: engine["gladius-cubicvr"].MaterialDefinition,
        url: 'assets/procedural-material.js',
        load: engine.loaders.procedural,
        onsuccess: function( material ) {
          resources.material = material;
        },
        onfailure: function( error ) {
        }
      },
      {
        type: engine["gladius-cubicvr"].MaterialDefinition,
        url: 'assets/rgb-material.js?r=204&g=140',
        load: engine.loaders.procedural,
        onsuccess: function( material ) {
          resources.sun_material = material;
        },
        onfailure: function( error ) {
        }
      },
      {
        type: engine["gladius-cubicvr"].MaterialDefinition,
        url: 'assets/rgb-material.js?b=255',
        load: engine.loaders.procedural,
        onsuccess: function( material ) {
          resources.earth_material = material;
        },
        onfailure: function( error ) {
        }
      },
      {
        type: engine["gladius-cubicvr"].MaterialDefinition,
        url: 'assets/rgb-material.js?r=204',
        load: engine.loaders.procedural,
        onsuccess: function( material ) {
          resources.mars_material = material;
        },
        onfailure: function( error ) {
        }
      },

      // line between Earth and Mars
      {
        type: engine["gladius-cubicvr"].MaterialDefinition,
        url: 'assets/rgb-material.js?r=255&g=255',
        load: engine.loaders.procedural,
        onsuccess: function( material ) {
          resources.line_material = material;
        },
        onfailure: function( error ) {
        }
      },
      {
        type: engine["gladius-cubicvr"].Mesh,
        url: 'assets/procedural-line-mesh.js',
        load: engine.loaders.procedural,
        onsuccess: function( mesh ) {
          resources.line_mesh = mesh;
        },
        onfailure: function( error ) {
        }
      },

      // constelations
      {
        type: engine["gladius-cubicvr"].MaterialDefinition,
        url: 'assets/rgb-material.js?g=255',
        load: engine.loaders.procedural,
        onsuccess: function( material ) {
          resources.constellation_material = material;
        },
        onfailure: function( error ) {
        }
      },
      {
        type: engine["gladius-cubicvr"].Mesh,
        url: 'assets/procedural-planar-mesh.js',
        load: engine.loaders.procedural,
        onsuccess: function( mesh ) {
          resources.constellation_mesh = mesh;
        },
        onfailure: function( error ) {
        }
      }
    ],
    {
      oncomplete: game.bind( null, engine, resources )
    }
  );
  });

  function game( engine, resources ) {
    var space = new engine.simulation.Space();
    var cubicvr = engine.findExtension( "gladius-cubicvr" );
    var earthDistance = 5
      , marsDistance = earthDistance * 1.5;

    space.add( new engine.simulation.Entity( "camera1",
      [
        new engine.core.Transform( [0, 0, 0] ),
        new cubicvr.Camera({
          targeted: true,
          fov: 75
        }),
        new cubicvr.Light()
      ]
    ));

    var sun = new engine.simulation.Entity( "sun",
      [
        new engine.core.Transform( [0, 0, 20], [0, 0,0], [.5,.5,.5] ),
        new cubicvr.Model( resources.mesh, resources.sun_material )
      ]
    );

    space.add( new engine.simulation.Entity( "mars-center-of-mass",
      [
        new engine.core.Transform( [0, 0, 20], [engine.math.TAU, engine.math.TAU, engine.math.TAU] )
      ]
    ));
    space.add( new engine.simulation.Entity( "mars",
      [
        new engine.core.Transform( [marsDistance, 0, 0], [0,0,0], [.2,.2,.2]),
        new cubicvr.Model( resources.mesh, resources.mars_material )
      ]
    ));

    space.add( new engine.simulation.Entity( "earth-center-of-mass",
      [
        new engine.core.Transform( [0, 0, 20], [engine.math.TAU, engine.math.TAU, engine.math.TAU] )
      ]
    ));
    space.add( new engine.simulation.Entity( "earth",
      [
        new engine.core.Transform( [earthDistance, 0, 0], [0,0,0], [.3,.3,.3]),
        new cubicvr.Model( resources.mesh, resources.earth_material )
      ]
    ));

    space.add( new engine.simulation.Entity( "earth-mars-line-of-sight",
      [
        new engine.core.Transform( [0, 0, 20], [0,0,0], [1,1,1]),
        new cubicvr.Model( resources.line_mesh, resources.line_material )
      ]
    ));

    for (var i=0; i<8; i++) {
      // frame of reference for constellation # i
      space.add( new engine.simulation.Entity( "constellation-frame-" + i,
         [
           new engine.core.Transform( [0, 0, 20], [0, 0, (i/8)*2*Math.PI] )
        ]
      ));

      // add constellation # i to space with frame of reference as parent
      space.add( new engine.simulation.Entity(
        "constellation-" + i,
        [
          new engine.core.Transform( [12, 0, 0], [0,5*Math.PI/8,0], [1,1,1]),
          new cubicvr.Model( resources.constellation_mesh, resources.constellation_material )
        ],
        [],
        space.findNamed( "constellation-frame-" + i )
      ));
    }

    space.add( new engine.simulation.Entity( "sun-light",
      [
        new engine.core.Transform( [0, 0, 20], [0, 0, 0], [1, 1, 1] ),
        new cubicvr.Light(
          new cubicvr.LightDefinition({
            intensity: 3,
            distance: 50
          })
        )
      ]
    ));

    space.add( new engine.simulation.Entity( "sun-glow",
      [
        new engine.core.Transform( [0, 0, 18], [0, 0, 0], [1, 1, 1] ),
        new cubicvr.Light(
          new cubicvr.LightDefinition({
            intensity: 3,
            distance: 3
          })
        )
      ]
    ));

    space.add( sun );
    space.findNamed( "mars" ).setParent( space.findNamed( "mars-center-of-mass" ) );
    space.findNamed( "earth" ).setParent( space.findNamed( "earth-center-of-mass" ) );

    space.add( new engine.simulation.Entity( "camera2",
      [
        new engine.core.Transform( [-100, 0, -25], [3*Math.PI/2, 0, Math.PI/2]),
        new cubicvr.Camera({fov: 10.0})
      ],
      ['@transform', '@camera', '@light'],
      space.findNamed( "earth" )
    ));

    // space.findNamed( "camera1" ).setActive(false);
    // var camera = space.findNamed( "camera1" ).removeComponent("Camera");
    // console.log(space.findAllWith( "Camera" ));
    // console.log(thing);
    // space.findNamed( "camera1" ).addComponent(thing);

    var spacePrototype = Object.getPrototypeOf(space);

    spacePrototype._deactivateAllCameras = function() {
      if (typeof(this._inactive_cameras) == "undefined") {
        this._inactive_cameras = {};
      }

      var all_cameras = this.findAllWith("Camera");
      for (var i=0; i<all_cameras.length; i++) {
        var name = all_cameras[i].name;
        this._inactive_cameras[name] = all_cameras[i].removeComponent("Camera");
      }
    };

    spacePrototype.setCamera = function(camera_name) {
      this._deactivateAllCameras();

      var camera_entity = this.findNamed(camera_name);

      camera_entity.addComponent(this._inactive_cameras[camera_name]);

      this.camera = camera_entity;

      delete this._inactive_cameras[camera_name];
    };

    space.setCamera("camera1");

    var line_of_sight = space.findNamed( "earth-mars-line-of-sight" );

    var task = new engine.FunctionTask( function() {
      if (Math.round(space.clock.time) % 240 == 0) {
        space.setCamera(space.camera.name == "camera1" ? "camera2" : "camera1");
      }

      var cubeRotation = new engine.math.Vector3( space.findNamed( "sun" ).findComponent( "Transform" ).rotation );
      cubeRotation = engine.math.vector3.add( cubeRotation, [space.clock.delta * 0.003, space.clock.delta * 0.001, space.clock.delta * 0.0007] );
      space.findNamed( "sun" ).findComponent( "Transform" ).setRotation( cubeRotation );

      var marsRevolution = new engine.math.Vector3( space.findNamed( "mars-center-of-mass" ).findComponent( "Transform" ).rotation );
      marsRevolution = engine.math.vector3.add( marsRevolution, [0, 0, -space.clock.delta * 0.0002] );
      space.findNamed( "mars-center-of-mass" ).findComponent( "Transform" ).setRotation( marsRevolution );

      var earthRevolution = new engine.math.Vector3( space.findNamed( "earth-center-of-mass" ).findComponent( "Transform" ).rotation );
      earthRevolution = engine.math.vector3.add( earthRevolution, [0, 0, -space.clock.delta * 0.0010] );
      space.findNamed( "earth-center-of-mass" ).findComponent( "Transform" ).setRotation( earthRevolution );

      var earthX = Math.cos(earthRevolution[2]) * earthDistance
        , earthY = Math.sin(earthRevolution[2]) * earthDistance
        , marsX =  Math.cos(marsRevolution[2]) * marsDistance
        , marsY = Math.sin(marsRevolution[2]) * marsDistance
        , y_diff = marsY - earthY
        , x_diff = marsX - earthX;

//      console.log("x: " + x_diff);
//      console.log("y: " + y_diff);
      var angle = Math.atan2(x_diff, y_diff);
      //console.log(angle);

      line_of_sight.
        findComponent( "Transform" ).
        setRotation( [0,0,-angle] );

      line_of_sight.
        findComponent( "Transform" ).
        setPosition( [earthX + 25*Math.sin(angle), earthY + 25*Math.cos(angle), 20] );

    }, {
      tags: ["@update"]
    });
    task.start();

    engine.resume();
  }
});
