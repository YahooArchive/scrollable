
module.exports = function(config) {
  return {

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'browserify'],


    // list of files / patterns to load in the browser
    files: [
      {pattern: 'src/**/__tests__/*-test.js', watched: true, included: true, served: true},
      {pattern: 'src/**/*.gif', watched: false, included: false, served: true},
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/**/*.js': ['browserify'],
    },

    browserify: {
      debug: true,
      transform: [
        'reactify',
      ],
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter

    reporters: ["spec", "coverage"],

    specReporter: {maxLogLines: 5},

    // optionally, configure the reporter
    coverageReporter: {
      type : ['json'],
      dir : 'coverage/'
    },

    // plugins: ["karma-spec-reporter"],

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


  };
};
