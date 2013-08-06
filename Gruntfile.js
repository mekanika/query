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
      tasks: ['jshint:files', 'uglify']
    },

    component_build: {
      query: {
        output: './build',
        scripts: true,
        styles: false,
        standalone: true
      }
    },

    uglify: {
      build: {
        options: {
          sourceMap: 'build/query.source.map',
          report: 'min',
          mangle: { except:['Query'] },
          banner: '/* <%= pkg.name %> v<%= pkg.version %> */\n'
        },
        files: { 'build/query.min.js': ['build/query.js'] }
      }
    }


  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-component-build');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s)
  grunt.registerTask('default', ['jshint', 'component_build', 'uglify']);
  grunt.registerTask('lint', ['jshint']);

};
