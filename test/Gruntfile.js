module.exports = function(grunt) {
 
  // Add the grunt-mocha-test tasks. 
  grunt.loadNpmTasks('grunt-mocha-test');
 
  grunt.initConfig({
    // Configure a mochaTest task 
    mochaTest: {
      test: {
        options: {
          mstc: {
            outputFile: "out/results.xml" // if you want to capture to this file instead captureFile (this file will not get prints at stdout)
          },
          reporter: 'mocha-sonar-generic-test-coverage',
          captureFile: 'out/results.txt', // Optionally capture the reporter output to a file 
          quiet: false, // Optionally suppress output to standard out (defaults to false) 
          clearRequireCache: false, // Optionally clear the require cache before running tests (defaults to false) 
          noFail: false // Optionally set to not fail on failed tests (will still fail on other errors) 
        },
        src: ['main/report/**/*.js']
      }
    }
  });
 
  grunt.registerTask('default', 'mochaTest');
 
};