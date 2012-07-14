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

        space.add(new engine.Entity("right-arm",
          [
            new engine.core.Transform([0.8, -0.2, 0], [0, -Math.PI/8, Math.PI/3]),
            new cubicvr.Model(resources.cylinder_mesh, resources.blue_material)
          ],
          ["avatar"],
          space.findNamed("body")
        ));

        space.add(new engine.Entity("right-hand",
          [
            new engine.core.Transform([0, -0.9, 0], [0, 0, 0], [.4, .4, .4]),
            new cubicvr.Model(resources.sphere_mesh, resources.red_material)
          ],
          ["avatar"],
          space.findNamed("right-arm")
        ));

        space.add(new engine.Entity("left-arm",
          [
            new engine.core.Transform([-0.8, -0.2, 0], [0, 3*Math.PI/2, -Math.PI/3]),
            new cubicvr.Model(resources.cylinder_mesh, resources.blue_material)
          ],
          ["avatar"],
          space.findNamed("body")
        ));

        space.add(new engine.Entity("left-hand",
          [
            new engine.core.Transform([0, -0.9, 0], [0, 0, 0], [.4, .4, .4]),
            new cubicvr.Model(resources.sphere_mesh, resources.red_material)
          ],
          ["avatar"],
          space.findNamed("left-arm")
        ));

        space.add(new engine.Entity("left-leg",
          [
            new engine.core.Transform([-0.5, -1.5, 0], [0, 0, 0]),
            new cubicvr.Model(resources.cylinder_mesh, resources.blue_material)
          ],
          ["avatar"],
          space.findNamed("body")
        ));

        space.add(new engine.Entity("left-foot",
          [
            new engine.core.Transform([0, -0.9, 0], [0, 0, 0], [.3, .3, .3]),
            new cubicvr.Model(resources.sphere_mesh, resources.red_material)
          ],
          ["avatar"],
          space.findNamed("left-leg")
        ));

        space.add(new engine.Entity("right-leg",
          [
            new engine.core.Transform([0.5, -1.5, 0], [0, 0, 0]),
            new cubicvr.Model(resources.cylinder_mesh, resources.blue_material)
          ],
          ["avatar"],
          space.findNamed("body")
        ));

        space.add(new engine.Entity("right-foot",
          [
            new engine.core.Transform([0, -0.9, 0], [0, 0, 0], [.3, .3, .3]),
            new cubicvr.Model(resources.sphere_mesh, resources.red_material)
          ],
          ["avatar"],
          space.findNamed("right-leg")
        ));

        space.add(new engine.Entity("camera",
          [
            new engine.core.Transform([0,0,-23], [Math.PI, 0, 0]),
            new cubicvr.Camera()
          ]
        ));
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
