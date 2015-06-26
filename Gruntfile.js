'use strict';

var LIVERELOAD_PORT, lrSnippet, markdown, mountFolder, semver;

LIVERELOAD_PORT = 35729;
lrSnippet = require('connect-livereload')({
  port: LIVERELOAD_PORT
});

mountFolder = function(connect, dir) {
  return connect.static(require('path').resolve(dir));
};

markdown = require('marked');
semver = require('semver');

module.exports = function(grunt) {
  var appConfig;
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  appConfig = {
    app: 'app',
    dist: 'src/main/webapp'
  };

  try {
    appConfig.app = require('./bower.json').appPath || appConfig.app;
  } catch (_e) {}

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    paths: appConfig,

    jade: {
      index: {
        options: {
          pretty: true
        },
        files: {
          '.tmp/index.html': ['<%= paths.app %>/index.jade']
        }
      },
      views: {
        options: {
          pretty: true
        },
        files: [
          {
            expand: true,
            cwd: '<%= paths.app %>',
            dest: '.tmp',
            src: 'views/*.jade',
            ext: '.html'
          }
        ]
      }
    },

    watch: {
      jade: {
        files: ['<%= paths.app %>/{,*/}*.jade'],
        tasks: ['jade']
      },
      sass: {
        files: ['<%= paths.app %>/styles/{,**/}*.{scss,sass}'],
        tasks: ['sass']
      },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          '.tmp/{,*/}*.html',
          '{.tmp,<%= paths.app %>}/styles/{,*/}*.css',
          '{.tmp,<%= paths.app %>}/scripts/{,*/}*.js',
          '<%= paths.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    ts: {
      options: {
        target: 'es5',
        module: 'amd',
        declaration: false,
        noImplicitAny: false,
        removeComments: false,
        noLib: false,
        sourceMap: false,
        fast: 'never'
      },
      dist: {
        src: ['<%= paths.app %>/scripts/{,**/}*.ts']
      }
    },

    connect: {
      options: {
        port: 9000,
        hostname: '0.0.0.0'
      },
      livereload: {
        options: {
          middleware: function(connect) {
            return [lrSnippet, mountFolder(connect, '.tmp'), mountFolder(connect, appConfig.app)];
          }
        }
      },
      test: {
        options: {
          middleware: function(connect) {
            return [mountFolder(connect, '.tmp'), mountFolder(connect, appConfig.app)];
          }
        }
      },
      dist: {
        options: {
          middleware: function(connect) {
            return [mountFolder(connect, appConfig.dist)];
          }
        }
      }
    },

    autoprefixer: {
      options: ["last 1 version"],
      dist: {
        files: [
          {
            expand: true,
            cwd: ".tmp/styles/",
            src: "{,*/}*.css",
            dest: ".tmp/styles/"
          }
        ]
      }
    },

    clean: {
      dist: {
        files: [
          {
            dot: true,
            src: [
              '.tmp',
              '<%= paths.dist %>/*',
              '!<%= paths.dist %>/vendors*',
              '!<%= paths.dist %>/.git*'
            ]
          }
        ]
      },
      server: '.tmp',
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: ['Gruntfile.js', '<%= paths.app %>/scripts/{,*/}*.js']
    },

    sass: {
      options: {
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= paths.app %>/styles',
          src: ['*.scss'],
          dest: '.tmp/styles',
          ext: '.css'
        }]
      }
    },

    rev: {
      dist: {
        files: {
          src: [
            '<%= paths.dist %>/scripts/main.js',
            '<%= paths.dist %>/styles/{,*/}*.css',
            '<%= paths.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= paths.dist %>/styles/fonts/*'
          ]
        }
      }
    },

    useminPrepare: {
      html: '.tmp/index.html',
      options: {
        dest: '<%= paths.dist %>'
      }
    },

    usemin: {
      html: ['<%= paths.dist %>/{,*/}*.html'],
      css: ['<%= paths.dist %>/styles/{,*/}*.css'],
      options: {
        dirs: ['<%= paths.dist %>']
      }
    },

    imagemin: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= paths.app %>/images',
            src: '{,*/}*.{png,jpg,jpeg}',
            dest: '<%= paths.dist %>/images'
          }
        ]
      }
    },

    svgmin: {
      dist: {
        files: [
          {
            expand: true,
            cwd: "<%= paths.app %>/images",
            src: "{,*/}*.svg",
            dest: "<%= paths.dist %>/images"
          }
        ]
      }
    },

    cssmin: {},

    htmlmin: {
      dist: {
        options: {},
        files: [
          {
            expand: true,
            cwd: '.tmp',
            src: ['*.html', 'views/*.html'],
            dest: '<%= paths.dist %>'
          }
        ]
      }
    },

    copy: {
      dist: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: '<%= paths.app %>',
            dest: '<%= paths.dist %>',
            src: [
              '*.{ico,png,txt}',
              '.htaccess',
              'vendors/**/*',
              'images/{,*/}*.{gif,webp}',
              'fonts/*'
            ]
          }, {
            expand: true,
            cwd: '.tmp/images',
            dest: '<%= paths.dist %>/images',
            src: ['generated/*']
          }
        ]
      },
      styles: {
        expand: true,
        cwd: "<%= paths.app %>/styles",
        dest: ".tmp/styles/",
        src: "{,*/}*.css"
      },
      vendors: {
        expand: true,
        cwd: "<%= paths.app %>/vendors",
        dest: ".tmp/vendors/",
        src: "{,**/}*"
      },
      js: {
        files: [
          {
            expand: true,
            cwd: "<%= paths.app %>/scripts",
            dest: ".tmp/scripts/",
            src: "{,**/}*"
          }
        ]
      }
    },

    concurrent: {
      server: ['sass', 'jade', 'copy:styles', 'ts'],
      dist: [
        'sass',
        'copy:styles',
        'imagemin',
        'svgmin',
        'htmlmin'
      ]
    },

    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      single: {
        singleRun: true
      },
      watch: {
        autoWatch: true
      },
      continuous: {
        singleRun: true,
        reporters: ['junit']
      }
    },

    protractor_webdriver: {
      start: {
        options: {
          keepAlive: true
        }
      },
      stop: {}
    },

    protractor: {
      options: {
        configFile: 'protractor.conf.js'
      },
      single: {
        options: {
          keepAlive: false
        },
        continuous: {
          options: {
            configFile: 'protractor.conf.junit.js',
            keepAlive: false
          }
        }
      }
    },

    ngAnnotate: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '.tmp/scripts',
            src: '**/*.js',
            dest: '.tmp/scripts'
          }
        ]
      }
    },

    requirejs: {
      compile: {
        options: {
          appDir: '.tmp/scripts/',
          baseUrl: '.',
          dir: '<%= paths.dist %>/scripts/',
          optimize: 'uglify',
          skipDirOptimize: true,
          paths: {
            config: 'empty:'
          },
          mainConfigFile: './.tmp/scripts/main.js',
          logLevel: 0,
          fileExclusionRegExp: /^\./,
          modules: [
            {name: 'main'}
          ]
        }
      }
    },

    changelog: {
      options: {
        dest: 'CHANGELOG.md',
        versionFile: 'package.json'
      }
    },

    release: {
      options: {
        commitMessage: '<%= version %>',
        tagName: 'v<%= version %>',
        tagMessage: 'tagging version <%= version %>',
        bump: false,
        file: 'package.json',
        add: true,
        commit: true,
        tag: true,
        push: true,
        pushTags: true,
        npm: false
      }
    },

    stage: {
      options: {
        files: ['CHANGELOG.md']
      }
    },

    replace: {
      dist: {
        options: {
          variables: {
            version: '<%= pkg.version %>',
            released: grunt.template.today('dddd, mmmm dS, yyyy, h:MM:ss TT')
          }
        },
        prefix: '@@',
        files: [
          {
            expand: true,
            flatten: true,
            src: ['<%= paths.dist %>/scripts/config.js'],
            dest: '<%= paths.dist %>/scripts/'
          }
        ]
      }
    }
  });

  grunt.registerTask('bump', 'bump manifest version', function(type) {
    var config, options, setup;

    setup = function(file, type) {
      var newVersion, pkg;
      pkg = grunt.file.readJSON(file);
      newVersion = pkg.version = semver.inc(pkg.version, type || 'patch');
      return {
        file: file,
        pkg: pkg,
        newVersion: newVersion
      };
    };
    options = this.options({
      file: grunt.config('pkgFile') || 'package.json'
    });
    config = setup(options.file, type);
    grunt.file.write(config.file, JSON.stringify(config.pkg, null, '  ') + '\n');
    return grunt.log.ok('Version bumped to ' + config.newVersion);
  });

  grunt.registerTask('stage', 'git add files before running the release task', function() {
    var files;
    files = this.options().files;
    return grunt.util.spawn({
      cmd: 'git',
      args: ['add'].concat(files)
    }, grunt.task.current.async());
  });

  grunt.registerTask('server', 'start a web server with extras', function(target) {
    if (target === 'dist') {
      return grunt.task.run([
        'build',
        'connect:dist:keepalive'
      ]);
    }
    return grunt.task.run([
      'clean:server',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('test:unit', 'run karma unit tests, add :watch for live reloading', function(target) {
    if (target === 'watch') {
      return grunt.task.run(['karma:watch']);
    }
    if (target === 'continuous') {
      return grunt.task.run(['karma:continuous']);
    }
    return grunt.task.run(['karma:single']);
  });

  grunt.registerTask('test:e2e', 'run protractor e2e test', function(target) {
    if (target === 'continuous') {
      return grunt.task.run(['protractor_webdriver:start', 'protractor:continuous']);
    }
    return grunt.task.run(['protractor_webdriver:start', 'protractor:single']);
  });

  grunt.registerTask('test', [
    'test:unit',
    'test:e2e'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'sass',
    'jade',
    'useminPrepare',
    'imagemin',
    'svgmin',
    'htmlmin',
    'concat',
    'ts',
    'copy',
    'ngAnnotate',
    'cssmin',
    'requirejs',
    'rev',
    'usemin',
    'replace'
  ]);

  grunt.registerTask('patch', [
    'bump:patch',
    'changelog',
    'stage',
    'release:patch',
    'replace'
  ]);

  grunt.registerTask('minor', [
    'bump:minor',
    'changelog',
    'stage',
    'release:minor',
    'replace'
  ]);

  grunt.registerTask('major', [
    'bump:major',
    'changelog',
    'stage',
    'release:major',
    'replace'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'test',
    'build'
  ]);

};
