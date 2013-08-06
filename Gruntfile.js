module.exports = function( grunt ) {

  grunt.config.set('files', [ 'lib/**/*.js' ]);

  // Project configuration
  grunt.config.init({

    // Meta data from config file
    pkg: grunt.file.readJSON('package.json'),

    // Linting options
    jshint:
    {
      // Defaults
      options: grunt.file.readJSON('.jshintrc'),
      // Files to watch
      files: { src: grunt.config.get('files') }
    },

    // Watch tasks to run on file changes
    watch:
    {
      files: grunt.config.get('files'),
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
