/*
Build a bundled app.js file using browserify
*/
module.exports = function(grunt) {

  var async = require("async");
  var babel = require("babelify");
  var browserify = require("browserify");
  var exorcist = require("exorcist");
  var fs = require("fs");

  grunt.registerTask("bundle", "Build app.js using browserify", function(mode) {
    //run in dev mode unless otherwise specified
    mode = mode || "dev";
    var done = this.async();

    var scripts = [
      { src: "./src/js/main.js", dest: "build/app.js" },
      { src: "./src/js/table.js", dest: "build/table.js" }
    ];

    async.each(scripts, function(config, c) {


      var b = browserify({ debug: mode == "dev" });
      b.transform(babel);

      //make sure build/ exists
      grunt.file.mkdir("build");
      var output = fs.createWriteStream(config.dest);

      b.add(config.src);
      var assembly = b.bundle();
      var srcmapPath = config.dest + ".map";
      if (mode == "dev") {
        //output sourcemap
        assembly = assembly.pipe(exorcist(srcmapPath, null, null, "."));
      }
      assembly.pipe(output).on("finish", function() {
        //correct path separators in the sourcemap for Windows
        var sourcemap = grunt.file.readJSON(srcmapPath);
        sourcemap.sources = sourcemap.sources.map(function(s) { return s.replace(/\\/g, "/") });
        grunt.file.write(srcmapPath, JSON.stringify(sourcemap, null, 2));
        
        c();
      });

    }, done);

  });

};
