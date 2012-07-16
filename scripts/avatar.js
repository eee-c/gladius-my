document.addEventListener( "DOMContentLoaded", function( e ) {
  require.config({
    baseUrl: "scripts"
  });

  require(
    [ "gladius-core", "gladius-cubicvr" ],
    function( Gladius, cubicvrExtension ) {
      var engine = new Gladius();

      // CubicVR rendering backend
      engine.registerExtension(cubicvrExtension, {
        renderer: {
          canvas: document.getElementById( "test-canvas" )
        }
      });

      // Mesh and material resources
      function primitiveMesh(type, options) {
        var Mesh = engine["gladius-cubicvr"].Mesh;

        options = options || {};
        options.type = type;

        return new Mesh({primitives: options, compile: true});
      }

      function colorMaterial(r, g, b) {
        var Material = engine["gladius-cubicvr"].MaterialDefinition;

        return new Material({color: [r, g, b]});
      }

      var resources = {
        sphere_mesh: primitiveMesh('sphere'),
        cone_mesh: primitiveMesh('cone', {height: 2, base: 2}),
        cylinder_mesh: primitiveMesh('cylinder', {radius: 0.2, height: 2}),
        red_material: colorMaterial(255, 0, 0),
        blue_material: colorMaterial(0, 0, 255)
      };

      engine.resume();

      game(engine, resources);

      function game(engine, resources) {
        var math = engine.math;
        var space = new engine.SimulationSpace();
        var cubicvr = engine.findExtension("gladius-cubicvr");
        space.add(new engine.Entity("body",
          [
            new engine.core.Transform([0, 0, 0], [0, 0, Math.PI]),
            new cubicvr.Model(resources.cone_mesh, resources.red_material)
          ],
          ["avatar"]
        ));

        space.add(new engine.Entity("head",
          [
            new engine.core.Transform([0, 1.5, 0]),
            new cubicvr.Model(resources.sphere_mesh, resources.blue_material)
          ],
          ["avatar"],
          space.findNamed("body")
        ));

        space.add(new engine.Entity("right-arm-frame1",
          [
            new engine.core.Transform([0.5, 0, 0], [0, -Math.PI/8, Math.PI/3])
          ],
          ["avatar"],
          space.findNamed("body")
        ));

        space.add(new engine.Entity("right-arm-frame",
          [
            new engine.core.Transform()
          ],
          ["avatar"],
          space.findNamed("right-arm-frame1")
        ));

        space.add(new engine.Entity("right-arm",
          [
            new engine.core.Transform([0, -0.5, 0]),
            new cubicvr.Model(resources.cylinder_mesh, resources.blue_material)
          ],
          ["avatar"],
          space.findNamed("right-arm-frame")
        ));

        space.add(new engine.Entity("right-hand",
          [
            new engine.core.Transform([0, -0.9, 0], [0, 0, 0], [.4, .4, .4]),
            new cubicvr.Model(resources.sphere_mesh, resources.red_material)
          ],
          ["avatar"],
          space.findNamed("right-arm")
        ));

        space.add(new engine.Entity("left-arm-frame1",
          [
            new engine.core.Transform([-0.5, 0, 0], [0, 3*Math.PI/2, -Math.PI/3])
          ],
          ["avatar"],
          space.findNamed("body")
        ));

        space.add(new engine.Entity("left-arm-frame",
          [
            new engine.core.Transform()
          ],
          ["avatar"],
          space.findNamed("left-arm-frame1")
        ));

        space.add(new engine.Entity("left-arm",
          [
            new engine.core.Transform([0, -0.5, 0]),
            new cubicvr.Model(resources.cylinder_mesh, resources.blue_material)
          ],
          ["avatar"],
          space.findNamed("left-arm-frame")
        ));

        space.add(new engine.Entity("left-hand",
          [
            new engine.core.Transform([0, -0.9, 0], [0, 0, 0], [.4, .4, .4]),
            new cubicvr.Model(resources.sphere_mesh, resources.red_material)
          ],
          ["avatar"],
          space.findNamed("left-arm")
        ));

        space.add(new engine.Entity("left-leg-frame",
          [
            new engine.core.Transform([-0.5, -0.5, 0])
          ],
          ["avatar"],
          space.findNamed("body")
        ));

        space.add(new engine.Entity("left-leg",
          [
            new engine.core.Transform([0, -1, 0]),
            new cubicvr.Model(resources.cylinder_mesh, resources.blue_material)
          ],
          ["avatar"],
          space.findNamed("left-leg-frame")
        ));

        space.add(new engine.Entity("left-foot",
          [
            new engine.core.Transform([0, -0.9, 0], [0, 0, 0], [.3, .3, .3]),
            new cubicvr.Model(resources.sphere_mesh, resources.red_material)
          ],
          ["avatar"],
          space.findNamed("left-leg")
        ));

        space.add(new engine.Entity("right-leg-frame",
          [
            new engine.core.Transform([0.5, -0.5, 0])
          ],
          ["avatar"],
          space.findNamed("body")
        ));

        space.add(new engine.Entity("right-leg",
          [
            new engine.core.Transform([0, -1, 0]),
            new cubicvr.Model(resources.cylinder_mesh, resources.blue_material)
          ],
          ["avatar"],
          space.findNamed("right-leg-frame")
        ));

        space.add(new engine.Entity("right-foot",
          [
            new engine.core.Transform([0, -0.9, 0], [0, 0, 0], [.3, .3, .3]),
            new cubicvr.Model(resources.sphere_mesh, resources.red_material)
          ],
          ["avatar"],
          space.findNamed("right-leg")
        ));

        space.add(new engine.Entity("camera-frame",
          [
            new engine.core.Transform()
          ],
          [],
          space.findNamed("body")

        ));
        space.add(new engine.Entity("camera",
          [
            new engine.core.Transform([0, 10, 23], [-Math.PI/8, 0, 0]),
            new cubicvr.Camera()
          ],
          ["avatar"],
          space.findNamed("camera-frame")
        ));

        var w = 500
          , arm1 = space.findNamed("left-arm-frame").findComponent("Transform")
          , arm2 = space.findNamed("right-arm-frame").findComponent("Transform")
          , leg1 = space.findNamed("left-leg-frame").findComponent("Transform")
          , leg2 = space.findNamed("right-leg-frame").findComponent("Transform");

        var task = new engine.FunctionTask( function() {
          var t = space.clock.time
            , amplitude = (w/2 - Math.abs((t % (2*w)) - w))/w;

          leg1.setRotation([    amplitude*(Math.PI/8), 0, 0]);
          leg2.setRotation([ -1*amplitude*(Math.PI/8), 0, 0]);

          arm1.setRotation([ 0, 0, -1*amplitude*(Math.PI/8)]);
          arm2.setRotation([ -1*amplitude*(Math.PI/8), 0, 0]);
        });
        task.start();
      }

      // Engine debugging monitor
      function monitor( engine ) {
        debugger;
        engine.detach( monitor );
      }
      document.addEventListener( "keydown", function( event ) {
        var code = event.which || event.keyCode;
        if (code === 0x4D && event.ctrlKey && event.altKey) {
          engine.attach( monitor );
        }
      });
    }
  );
});
