function ScrollerEvents() {
  if (this.constructor !== ScrollerEvents) {
    return new ScrollerEvents();
  }
  return this;
}

var NOOP = function() {};

var publicMethods = [
  'disable',
  'enable',
  'stopEvents',
  'resumeEvents',
  'setDimensions',
  'scrollTo',
];

for (var i = 0; i < publicMethods.length; i++) {
  publicMethods[i] = NOOP;
}

module.exports = ScrollerEvents;
