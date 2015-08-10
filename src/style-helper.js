/* exported StyleHelper */
/* Copyright 2015, Yahoo Inc.
   Copyrights licensed under the MIT License.
   See the accompanying LICENSE file for terms. */
"use strict";
var prefixed = require('./prefixed');

var StyleHelper = {
  applyStyle: function (name, value) {
    var styles = {};

    if (name.constructor === Array) {
      for (var i = 0; i < name.length; i++) {
        styles[name[i]] = value;
      }
    } else {
      styles[name] = value;
    }
    return styles;
  },
  scrollStyles: function(styleObject, allprefix) {
    allprefix = allprefix || false;

    var tx = styleObject.x || 0;
    var ty = styleObject.y || 0;
    var tz = styleObject.zIndex && styleObject.zIndex/10 || 0;
    var transform = prefixed('transform', null, null, allprefix);
    var appliedStyle = {};

    delete styleObject.x;
    delete styleObject.y;

    appliedStyle = this.applyStyle(transform, 'translate3d('+tx+'px, '+(ty)+'px, '+tz+'px)');

    if (styleObject.scale) {
      appliedStyle = this.applyStyle(transform, 'scale('+styleObject.scale+')');
      delete styleObject.scale;
    }
    for (var style in appliedStyle) {
      styleObject[style] = appliedStyle[style];
    }
    return styleObject;
  },
};

module.exports = StyleHelper;
