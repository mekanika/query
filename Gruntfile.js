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
      files: { src: grunt.config.get('files') },

      tests: { src: ['test/**/*.js'] }
    },

    // Watch tasks to run on file changes
    watch:
    {
      files: grunt.config.get('files'),
      tasks: ['jshint:files', 'uglify'],

      // To run tests on a watch, simply:
      // $ grunt watch:test
      test: {
        files: ['test/**/*.js'].concat( grunt.config.get('files') ),
        tasks: ['jshint', 'mochaTest']
      }
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
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/runner.js']
      },
      // Test coverage
      coverage: {
        options: {
          reporter: 'html-cov',
          quiet: true,
          captureFile: 'coverage.html'
        },
        src: ['test/runner.js']
      }
    }


  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-component-build');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-mocha-test');

  // Default task(s)
  grunt.registerTask('default', ['jshint', 'component_build', 'uglify', 'mochaTest:test']);
  grunt.registerTask('lint', ['jshint']);
  grunt.registerTask('test', ['mochaTest:test']);
  grunt.registerTask('cover', ['mochaTest:coverage']);

};
