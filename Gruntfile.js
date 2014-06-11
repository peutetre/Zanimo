module.exports = function(grunt) {
    grunt.initConfig({
        connect: {
            server: {
                options: {
                    base: "",
                    port: 9999
                }
            }
        },
        'saucelabs-mocha': {
            all: {
                options: {
                    urls: ["http://127.0.0.1:9999/test/index.html"],
                    build: (new Date()).getTime(),
                    throttled: 3,
                    'max-duration': 360,
                    browsers: grunt.file.readJSON('browsers.json').browsers,
                    testname: "zanimo tests",
                    tags: ["master"]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-saucelabs');
    grunt.registerTask("test", ["connect", "saucelabs-mocha"]);
};
