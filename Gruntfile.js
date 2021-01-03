module.exports = function (grunt) {
    'use strict';

    // Force use of Unix newlines
    grunt.util.linefeed = '\n';

    let releaseDir = 'rrerm_release',
        nodeDir = 'node_modules',
        vendorDir = 'vendor';

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        watch: {
            scripts: {
                files: ['_locales/**/.json', 'js/*.js', 'less/*.less', 'vendor/**/*.css', 'vendor/**/*.js', '*.html'],
                tasks: ['build'],
                options: {
                    spawn: false
                }
            }
        },

        clean: {
            vendor: [vendorDir]
        },

        uglify : {
            build : {
                src : [nodeDir + '/chrome-badge-animator/src/BadgeAnimator.js'],
                dest : vendorDir + '/chrome-badge-animator/dist/BadgeAnimator.min.js'
            }
        },

        copy: {
            'bootstrap': {
                files: [{
                    expand: true,
                    src: [nodeDir + '/bootstrap/dist/css/*.min.css'], dest: vendorDir + '/bootstrap/dist/css',
                    flatten: true
                },{
                    expand: true,
                    src: [nodeDir + '/bootstrap/dist/js/*.min.js'], dest: vendorDir + '/bootstrap/dist/js',
                    flatten: true
                }]
            },
            'bootstrap-select': {
                files: [{
                    expand: true,
                    src: [nodeDir + '/bootstrap-select/dist/css/*.min.css'], dest: vendorDir + '/bootstrap-select/dist/css',
                    flatten: true
                },{
                    expand: true,
                    src: [nodeDir + '/bootstrap-select/dist/js/*.min.js'], dest: vendorDir + '/bootstrap-select/dist/js',
                    flatten: true
                }]
            },
            'chart.js': {
                files: [{
                    expand: true,
                    src: [nodeDir + '/chart.js/dist/*.min.js'], dest: vendorDir + '/chart.js/dist/',
                    flatten: true
                }]
            },
            'jquery': {
                files: [{
                    expand: true,
                    src: [nodeDir + '/jquery/dist/*.min.js'], dest: vendorDir + '/jquery/dist/',
                    flatten: true
                }]
            },
            main: {
                files: [
                    {expand: true, src: ['_locales/**'], dest: releaseDir},
                    {expand: true, src: ['img/*'], dest: releaseDir},
                    {expand: true, src: ['sounds/*'], dest: releaseDir},
                    {expand: true, src: ['vendor/**'], dest: releaseDir},
                    {expand: true, src: ['views/*.html'], dest: releaseDir},
                    {expand: true, src: ['manifest.json'], dest: releaseDir}
                ]
            }
        },

        less: {
            production: {
                options: {
                    path: ['css']
                },
                files: {
                    'rrerm_release/css/popup.css': 'less/popup.less',
                    'rrerm_release/css/donate.css': 'less/donate.less',
                    'rrerm_release/css/options.css': 'less/options.less'
                }
            }
        },

        terser: {
            main: {
                options: {
                    compress: true,
                    mangle: true
                },
                files: [
                    {expand: true, src: 'js/*.js', dest: releaseDir},
                ]
            }
        },

        compress: {
            main: {
                options: {
                    archive: 'oldPackages/<%= pkg.short %><%= pkg.version %>.zip'
                },
                files: [
                    {src: [releaseDir + '/**'], dest: '/'}
                ]
            },
            firefox: {
                options: {
                    archive: 'oldPackages/<%= pkg.short %><%= pkg.version %>_firefox.zip'
                },
                files: [{
                    src: ['**/*'],
                    cwd: releaseDir,
                    expand: true
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-terser');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['less']);
    grunt.registerTask('build', ['uglify', 'copy', 'terser', 'less']);
    grunt.registerTask('pack', ['compress']);
    grunt.registerTask('release', ['uglify', 'copy', 'terser', 'less', 'compress']);
};
