/* Copyright 2015, Yahoo Inc.
   Copyrights licensed under the MIT License.
   See the accompanying LICENSE file for terms. */
// Karma configuration

module.exports = function(config) {
  var sharedConf = require('./karma.shared')(config);

  // Coverage
  sharedConf.browserify.transform.push([
    'browserify-istanbul', {
      ignore: [
        '**/src/scrollable.js', // just a wrapper
        '**/src/prefixed.js', // almost a vendor library, tested on original project
        '**/src/scroller-events.js', // this is better tested by integration tests
                                     // at the moment, is tested internally at Yahoo, on
                                     // products integration tests. Will bootstrap a
                                     // integration suite later for this repository.
        '**/src/scroller-events-stub.js', // just for server-side
        '**/__tests__/**',
        '**/vendor/**'
      ],
    }
  ]);

  sharedConf.reporters.push("coverage");
  sharedConf.files = ['./node_modules/phantomjs-polyfill/bind-polyfill.js'].concat(sharedConf.files);

  var options = {

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [
      'PhantomJS',
      // 'Chrome',
    ],

    // optionally, configure the reporter
    coverageReporter: {
      type : 'json',
      dir : 'coverage/'
    },

    reporters: ["spec", "coverage"],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

  };

  for(var key in options) {
    sharedConf[key] = options[key];
  }
  config.set(sharedConf);
};
