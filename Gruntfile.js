module.exports = function( grunt ) {

  // Project configuration
  grunt.initConfig({

    // Meta data from config file
    pkg: grunt.file.readJSON('package.json'),

    // Linting options
    jshint:
    {
      // Defaults
      options: grunt.file.readJSON('.jshintrc'),
      // Files to watch
      files: { src: [ 'index.js', 'lib/**/*.js' ] }
    },

    // Watch tasks to run on file changes
    watch:
    {
      files: ['index.js', 'lib/**/*.js' ],
      tasks: ['jshint:files']
    }

  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s)
  grunt.registerTask('default', ['jshint']);
  grunt.registerTask('lint', ['jshint']);

};
