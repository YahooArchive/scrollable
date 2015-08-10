/* exported StyleHelper */
/* Copyright 2015, Yahoo Inc.
   Copyrights licensed under the MIT License.
   See the accompanying LICENSE file for terms. */
"use strict";
var prefixed = require('./prefixed');
var transform = prefixed('transform');
var cssomPrefixes = 'Webkit Moz O ms'.split(' ');
var propsToPrefix = ['transition','animation','perspective','transform','align','justify','flex'];
var startWithPropsToPrefix = new RegExp('^('+propsToPrefix.join('|')+')', 'i');

var StyleHelper = {
  prefixAll: function(styleObject) {
    var style, allPrefixed;
    for(style in styleObject) {
      allPrefixed = StyleHelper.allPrefixed(style);
      for (var i = 0; i < allPrefixed.length; i++) {
        styleObject[allPrefixed[i]] = styleObject[style];
      }
    }
    return styleObject;
  },
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
  allPrefixed: function (prop) {
    if (!startWithPropsToPrefix.test(prop)) {
      return [prop];
    }
    var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1);
    return (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');
  },
};

module.exports = StyleHelper;
