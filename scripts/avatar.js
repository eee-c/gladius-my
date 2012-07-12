document.addEventListener( "DOMContentLoaded", function( e ) {
  require.config({
    baseUrl: "scripts"
  });

  require(
    [ "gladius-core", "gladius-cubicvr" ],
    function( Gladius, cubicvrExtension ) {
      var engine = new Gladius();

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

      // CubicVR rendering backend
      engine.registerExtension(cubicvrExtension, {
        renderer: {
          canvas: document.getElementById( "test-canvas" )
        }
      });

      // Mesh and material resources
      var resources = {};
      engine.get(
        [
          {
            type: engine["gladius-cubicvr"].Mesh,
            url: 'assets/procedural-primitive-mesh.js?type=sphere&radius=1',
            load: engine.loaders.procedural,
            onsuccess: function(mesh) {
              resources.sphere_mesh = mesh;
            },
            onfailure: function(error) {console.log(error);}
          },
          {
            type: engine["gladius-cubicvr"].Mesh,
            url: 'assets/procedural-primitive-mesh.js?type=cone&height=2&base=2',
            load: engine.loaders.procedural,
            onsuccess: function(mesh) {
              resources.cone_mesh = mesh;
            },
            onfailure: function(error) {console.log(error);}
          },
          {
            type: engine["gladius-cubicvr"].MaterialDefinition,
            url: 'assets/rgb-material.js?r=255',
            load: engine.loaders.procedural,
            onsuccess: function(material) {
              resources.red_material = material;
            },
            onfailure: function(error) {}
          },
          {
            type: engine["gladius-cubicvr"].MaterialDefinition,
            url: 'assets/rgb-material.js?b=255',
            load: engine.loaders.procedural,
            onsuccess: function(material) {
              resources.blue_material = material;
            },
            onfailure: function(error) {}
          }
        ],
        {
          oncomplete: game.bind(null, engine, resources)
        }
      );

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

        space.add(new engine.Entity("camera",
          [
            new engine.core.Transform([0,0,-23], [Math.PI, 0, 0]),
            new cubicvr.Camera()
          ]
        ));
      }

      engine.resume();
    }
  );
});
