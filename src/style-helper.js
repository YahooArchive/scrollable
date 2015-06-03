/* exported StyleHelper */
"use strict";
var prefixed = require('./prefixed');
var transform = prefixed('transform');

var StyleHelper = {
  scrollStyles: function(styleObject) {
    var tx = styleObject.x || 0;
    var ty = styleObject.y || 0;
    var tz = styleObject.zIndex && styleObject.zIndex/10 || 0;

    delete styleObject.x;
    delete styleObject.y;
    styleObject[transform] = 'translate3d('+tx+'px, '+(ty)+'px, '+tz+'px)';

    if (styleObject.scale) {
      styleObject[transform] += ' scale('+styleObject.scale+')';
      delete styleObject.scale;
    }
    return styleObject;
  },
};

module.exports = StyleHelper;
