/* exported StyleHelper */
/* Copyright 2015, Yahoo Inc.
   Copyrights licensed under the MIT License.
   See the accompanying LICENSE file for terms. */
"use strict";
var prefixed = require('./prefixed');
var transform = prefixed('transform');

var StyleHelper = {
  applyStyle: function (styleObject, name, value) {
    if (name.constructor === Array) {
      for (var i = 0; i < transform.length; i++) {
        styleObject[transform[i]] = value;
      }
    } else {
      styleObject[transform] = value;
    }

  },
  scrollStyles: function(styleObject) {
    var tx = styleObject.x || 0;
    var ty = styleObject.y || 0;
    var tz = styleObject.zIndex && styleObject.zIndex/10 || 0;

    delete styleObject.x;
    delete styleObject.y;

    this.applyStyle(styleObject, transform, 'translate3d('+tx+'px, '+(ty)+'px, '+tz+'px)');

    if (styleObject.scale) {
      this.applyStyle(styleObject, transform, 'scale('+styleObject.scale+')');
      delete styleObject.scale;
    }
    return styleObject;
  },
};

module.exports = StyleHelper;
