module.exports = function (grunt) {
    var debug = !grunt.option('prod');

    var vendorUglifyOptions = {
        preserveComments: debug,
        compress: !debug,
        beautify: debug,
        mangle: !debug
    };
    
    var appUglifyOptions = {
        preserveComments: debug,
        compress: (!debug ? {
            drop_debugger: true,
            drop_console: true,
            angular: true
        } : false),
        beautify: debug,
        mangle: (debug ? false : {
           except: ['$route'],
        })
    };

    var lessOptions = {
        compress: !debug,
        yuicompress: false,
        optimization: (debug ? 2 : 10)
    };
    
    grunt.initConfig({
        uglify: {
            vendor: {
                files: {
                    './public/js/vendor.js': [
                        './bower_components/angular/angular.js',
                        './bower_components/angular-animate/angular-animate.js',
                        './bower_components/angular-aria/angular-aria.js',
                        './bower_components/angular-material/angular-material.js',
                        './bower_components/angular-i18n/angular-locale_fr.js',
                        './bower_components/angular-i18n/angular-locale_en.js',
                        './bower_components/angular-route/angular-route.js',
                        './bower_components/angular-ui-router/release/angular-ui-router.js',
                        './bower_components/angular-translate/angular-translate.js',
                        './bower_components/angular-translate-loader-url/angular-translate-loader-url.js',
                        './bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
                        './bower_components/angular-sanitize/angular-sanitize.js',
                        './bower_components/angular-messages/angular-messages.js',      
                        './bower_components/messageformat/messageformat.js',     
                        './bower_components/angular-translate-interpolation-messageformat/angular-translate-interpolation-messageformat.js',
                        './bower_components/messageformat/locale/fr.js',
                        './bower_components/messageformat/locale/en.js'
                    ]
                },
                options: vendorUglifyOptions
            },
            app: {
                files: {
                    './public/js/app.js': [
                        './src/app/app.js',
                        './src/app/routes.js',
                        './src/app/controllers/**/*.js',
                        './src/app/services/**/*.js',
                        './src/app/directives/**/*.js',
                        './src/app/filters/**/*.js',
                        './src/app/validators/**/*.js'
                    ]
                },
                options: appUglifyOptions
            }
        },
        concat: {
            vendor: {
                src: [
                    './bower_components/angular-material/angular-material.min.css'
                ],
                dest: './public/css/vendor.css',
            },
        },
        less: {
            app: {
                options: lessOptions,
                files: {
                    './public/css/common.css': [
                        './src/styles/variables.less',
                        './src/styles/**/*.less',
                        './src/styles/**/*.css'
                    ]
                }
            }
        },
        watch: {
            less: {
                files: [
                    './src/styles/variables.less',
                    './src/styles/**/*.less'
                ], // which files to watch
                tasks: ['less:app'],
                options: {
                    nospawn: true
                }
            },
            js: {
                files: [
                    './src/app/**/*.js'
                ],
                tasks: ['uglify:app', 'beep:error']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-beep');
    
    grunt.registerTask('default', ['watch']);
    grunt.registerTask('build', ['uglify', 'less', 'concat']);
};