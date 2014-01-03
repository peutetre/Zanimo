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
                    tunnelTimeout: 5,
                    build: (new Date()).getTime(),
                    concurrency: 3,
                    browsers: grunt.file.readJSON('browsers.json').browsers,
                    testname: "zanimo tests",
                    testReadyTimeout:30000,
                    tags: ["master"]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-saucelabs');
    grunt.registerTask("test", ["connect", "saucelabs-mocha"]);
};
