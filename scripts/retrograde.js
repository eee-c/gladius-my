document.addEventListener( "DOMContentLoaded", function( e ) {
  require.config({
    baseUrl: "scripts"
  });

  require(
    [ "gladius-core",
      "gladius-cubicvr",
      "gladius-input" ],
    function( Gladius, cubicvrExtension, inputExtension ) {

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

  var inputOptions = {
    dispatcher: {
      element: document
    }
  };
  engine.registerExtension( inputExtension, inputOptions );

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
      },

      // input extension
      {
        type: engine.findExtension( "gladius-input" ).Map,
        url: "assets/camera-controls.json",
        onsuccess: function( inputMap ) {
          resources.cameraControls = inputMap;
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
    var math = engine.math;
    var space = new engine.SimulationSpace();
    var cubicvr = engine.findExtension( "gladius-cubicvr" );
    var input = engine.findExtension( "gladius-input" );
    var earthDistance = 5
      , marsDistance = earthDistance * 1.5;

    var sun = new engine.Entity( "sun",
      [
        new engine.core.Transform(),
        new cubicvr.Model( resources.mesh, resources.sun_material )
      ]
    );

    space.add( new engine.Entity( "mars-orbital-center",
      [
        new engine.core.Transform()
      ]
    ));
    space.add( new engine.Entity( "mars",
      [
        new engine.core.Transform( [marsDistance, 0, 0], [0,0,0], [.2,.2,.2]),
        new cubicvr.Model( resources.mesh, resources.mars_material )
      ],
      [],
      space.findNamed( "mars-orbital-center" )
    ));

    space.add( new engine.Entity( "earth-orbital-center",
      [
        new engine.core.Transform()
      ]
    ));
    space.add( new engine.Entity( "earth",
      [
        new engine.core.Transform( [earthDistance, 0, 0], [0,0,0], [.3,.3,.3]),
        new cubicvr.Model( resources.mesh, resources.earth_material )
      ],
      [],
      space.findNamed( "earth-orbital-center")
    ));

    space.add( new engine.Entity( "earth-mars-line-of-sight",
      [
        new engine.core.Transform(),
        new cubicvr.Model( resources.line_mesh, resources.line_material )
      ]
    ));

    for (var i=0; i<8; i++) {
      // frame of reference for constellation # i
      space.add( new engine.Entity( "constellation-frame-" + i,
        [
          new engine.core.Transform( [0, 0, 0], [0, 0, (i/8)*2*Math.PI] )
        ]
      ));

      // add constellation # i to space with frame of reference as parent
      space.add( new engine.Entity(
        "constellation-" + i,
        [
          new engine.core.Transform( [12, 0, 0], [0,5*Math.PI/8,0], [1,1,1]),
          new cubicvr.Model( resources.constellation_mesh, resources.constellation_material )
        ],
        [],
        space.findNamed( "constellation-frame-" + i )
      ));
    }

    space.add( new engine.Entity( "sun-light",
      [
        new engine.core.Transform(),
        new cubicvr.Light(
          new cubicvr.LightDefinition({
            intensity: 3,
            distance: 50
          })
        )
      ]
    ));

    space.add( new engine.Entity( "sun-glow",
      [
        new engine.core.Transform( [0, 0, -2] ),
        new cubicvr.Light(
          new cubicvr.LightDefinition({
            intensity: 3,
            distance: 3
          })
        )
      ]
    ));

    space.add( sun );

    function rotate3d(p1, p2, p0, theta) {
      var p = math.vector3.subtract(p1, p0)
        , q = new math.Vector3()
        , N = math.vector3.subtract(p2, p1)
        , Nm = Math.sqrt(N[0]*N[0] + N[1]*N[1] + N[2]*N[2]);

      // rotation axis unit vector
      var n = new math.Vector3(N[0]/Nm, N[1]/Nm, N[2]/Nm);

      // Matrix common factors
      var c = Math.cos(theta)
        , t = (1 - Math.cos(theta))
        , s = Math.sin(theta)
        , X = n[0]
        , Y = n[1]
        , Z = n[2];

      // Matrix 'M'
      var d11 = t*X*X + c
        , d12 = t*X*Y - s*Z
        , d13 = t*X*Z + s*Y
        , d21 = t*X*Y + s*Z
        , d22 = t*Y*Y + c
        , d23 = t*Y*Z - s*X
        , d31 = t*X*Z - s*Y
        , d32 = t*Y*Z + s*X
        , d33 = t*Z*Z + c;

      //            |p.x|
      // Matrix 'M'*|p.y|
      //            |p.z|
      q[0] = d11*p[0] + d12*p[1] + d13*p[2];
      q[1] = d21*p[0] + d22*p[1] + d23*p[2];
      q[2] = d31*p[0] + d32*p[1] + d33*p[2];

      return q;
    }

    var p1 = [0,0,0],
        p2 = [1,0,0],
        p0 = [0,1,1];
    var rot = rotate3d(p1, p2, p0, Math.PI/2);
    debugger;

    var cameraLogic = {
      "Update": function(event) {
        if (!this.owner.hasComponent("Controller")) return;

        var controller = this.owner.findComponent("Controller")
          , transform = this.owner.findComponent("Transform");

        var rotation;
        if (controller.states["PanUp"])
          rotation = [space.clock.delta * 0.0005, 0, 0];
        if (controller.states["PanDown"])
          rotation = [-space.clock.delta * 0.0005, 0, 0];
        if (controller.states["PanLeft"])
          rotation = [-space.clock.delta * 0.0005, 0, 0];
        if (controller.states["PanLeft"]) {
          var frame = new engine.Entity( "camera-frame-of-reference", [transform]);
          space.add(frame);
          this.owner.setParent(frame);

          transform = this.owner.findComponent("Transform");
          rotation = [0, space.clock.delta * 0.0005, 0];
          transform.setRotation(math.vector3.add(rotation, transform.rotation));

          rotation = undefined;
          this.owner.setParent(undefined);
          space.remove(frame);
        }
        if (controller.states["PanRight"])
          rotation = [0, -space.clock.delta * 0.0005, 0];

        if (rotation)
          transform.setRotation(math.vector3.add(rotation, transform.rotation));

        var position;
        if (controller.states["MoveForward"]) {
          var direction = math.transform.translate([0, 0, -space.clock.delta * 0.005]);
          rotation = math.transform.rotate(transform.rotation);
          direction = math.matrix4.multiply( [direction, rotation] );
          direction = [direction[12], direction[13], direction[14]];
          transform.setPosition(math.vector3.add(direction, transform.position));
        }

        if (controller.states["MoveBackward"]) {
          var direction = math.transform.translate([0, 0, space.clock.delta * 0.005]);
          rotation = math.transform.rotate(transform.rotation);
          direction = math.matrix4.multiply( [direction, rotation] );
          direction = [direction[12], direction[13], direction[14]];
          transform.setPosition(math.vector3.add(direction, transform.position));
        }

        if (position)
          transform.setPosition(math.vector3.add(position, transform.position));
      }
    };

    space.add(new engine.Entity("camera1",
      [

        new engine.core.Transform([0,0,-23], [Math.PI, 0, 0]),
        new cubicvr.Camera(),
        new input.Controller( resources.cameraControls ),
        new engine.logic.Actor( cameraLogic )
      ]
    ));


    space.add( new engine.Entity( "camera2",
      [
        new engine.core.Transform( [0, 0, 0]),
        new cubicvr.Camera({targeted: false})
      ]
    ));

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
      var sunRotation = new engine.math.Vector3( space.findNamed( "sun" ).findComponent( "Transform" ).rotation );
      sunRotation = engine.math.vector3.add( sunRotation, [space.clock.delta * 0.003, space.clock.delta * 0.001, space.clock.delta * 0.0007] );
      space.findNamed( "sun" ).findComponent( "Transform" ).setRotation( sunRotation );

      var marsRevolution = new engine.math.Vector3( space.findNamed( "mars-orbital-center" ).findComponent( "Transform" ).rotation );
      marsRevolution = engine.math.vector3.add( marsRevolution, [0, 0, -space.clock.delta * 0.0002] );
      space.findNamed( "mars-orbital-center" ).findComponent( "Transform" ).setRotation( marsRevolution );

      var earthRevolution = new engine.math.Vector3( space.findNamed( "earth-orbital-center" ).findComponent( "Transform" ).rotation );
      earthRevolution = engine.math.vector3.add( earthRevolution, [0, 0, -space.clock.delta * 0.0010] );
      space.findNamed( "earth-orbital-center" ).findComponent( "Transform" ).setRotation( earthRevolution );

      var earthX = Math.cos(earthRevolution[2]) * earthDistance
        , earthY = Math.sin(earthRevolution[2]) * earthDistance
        , marsX =  Math.cos(marsRevolution[2]) * marsDistance
        , marsY = Math.sin(marsRevolution[2]) * marsDistance
        , y_diff = marsY - earthY
        , x_diff = marsX - earthX;

      var angle = Math.atan2(x_diff, y_diff);

      space.
        findNamed("camera2").
        findComponent("Transform").
        setPosition([earthX, earthY, -0.5]);

      space.
        findNamed("camera2").
        findComponent("Transform").
        setRotation([3*Math.PI/2, 0, Math.PI -angle]);

      line_of_sight.
        findComponent( "Transform" ).
        setRotation( [0,0,-angle] );

      line_of_sight.
        findComponent( "Transform" ).
        setPosition( [earthX + 25*Math.sin(angle), earthY + 25*Math.cos(angle), 0] );

    }, {
      tags: ["@update"]
    });
    task.start();

    document.addEventListener("keydown", function(event) {
      var code = event.which || event.keyCode;
      if (code == 0x31) { // 1
        space.setCamera("camera1");
      }
      else if (code == 0x32) { // 2
        space.setCamera("camera2");
      }
      else if (code == 0x50) { // p
        if (task.isStarted()) {
          task.pause();
        }
        else {
          task.start();
        }
      }
      else {
        // console.log(code);
      }
    });

    engine.resume();
  }
});
