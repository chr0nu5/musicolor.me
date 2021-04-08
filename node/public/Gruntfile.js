module.exports = function(grunt) {

    'use strict';

    require('load-grunt-tasks')(grunt, {
        scope: 'devDependencies'
    });

    var appConfig = {

        // ---------------------------------------------------------------------
        // | Project Settings                                                  |
        // ---------------------------------------------------------------------

        settings: {
            // Configurable paths
            dir: {
                src: 'src',
                dest: 'build'
            }
        },

        // ---------------------------------------------------------------------
        // | Tasks Configurations                                              |
        // ---------------------------------------------------------------------

        clean: {
            build: ['<%= settings.dir.dest %>']
        },

        copy: {
            target: {
                files: [{
                    expand: true, // Enable dynamic expansion.
                    cwd: '<%= settings.dir.src %>/', // Src matches are relative to this path.
                    src: ['*.html', 'font/**', 'img/**'], // Actual pattern(s) to match.
                    dest: 'build/' // Destination path prefix.
                }]
            }
        },

        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: '<%= settings.dir.src %>/css',
                    src: ['*.css', '!*.min.css'],
                    dest: '<%= settings.dir.dest %>/css'
                }]
            }
        },

        uglify: {
            target: {
                files: [{
                    expand: true,
                    cwd: '<%= settings.dir.src %>/js',
                    src: '**/*.js',
                    dest: '<%= settings.dir.dest %>/js'
                }]
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            files: {
                src: ['Gruntfile.js', '<%= settings.dir.src %>/js/*.js']
            }
        },

        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: '<%= settings.dir.src %>/img/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: '<%= settings.dir.dest %>/img/'
                }]
            }
        },

        notify: {
            build: {
                options: {
                    title: 'Deploy completed!',
                    message: 'Congratulations, your app is up :)'
                }
            }
        },

        watch: {
            scripts: {
                files: ['**/*.js'],
                tasks: ['uglify'],
                options: {
                    livereload: true,
                },
            },
            css: {
                files: '**/*.css',
                tasks: ['cssmin'],
                options: {
                    livereload: true,
                },
            },
        },

    };

    //Init
    grunt.initConfig(appConfig);

    grunt.registerTask('test', ['jshint']);
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['clean', 'copy', 'cssmin', 'uglify', 'imagemin', 'notify']);
    grunt.registerTask('build', ['clean', 'copy', 'cssmin', 'uglify', 'notify']);
    grunt.registerTask('build-no-statics', ['cssmin', 'uglify']);

};
