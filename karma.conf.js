/* Copyright 2015, Yahoo Inc.
   Copyrights licensed under the MIT License.
   See the accompanying LICENSE file for terms. */
// Karma configuration

module.exports = function(config) {
  var sharedConf = require('karma.shared')(config);
  var options = {

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [
      // 'PhantomJS2',
      'Chrome',
    ],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

  };

  for(var key in options) {
    sharedConf[key] = options[key];
  }
  config.set(sharedConf);
};
