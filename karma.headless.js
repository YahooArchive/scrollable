// Karma configuration

module.exports = function(config) {
  var sharedConf = require('./karma.shared')(config);

  // Coverage
  sharedConf.browserify.transform.push([
    'browserify-istanbul', {
      ignore: [
        '**/src/scrollable.js',
        '**/__tests__/**',
        '**/vendor/**'
      ],
    }
  ]);

  sharedConf.reporters.push("coverage");

  var options = {

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [
      'PhantomJS2',
      // 'Chrome',
    ],

    // optionally, configure the reporter
    coverageReporter: {
      type : ['json'],
      dir : 'coverage/'
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

  };

  for(var key in options) {
    sharedConf[key] = options[key];
  }
  config.set(sharedConf);
};
