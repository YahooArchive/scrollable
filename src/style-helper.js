/* exported StyleHelper */
/* Copyright 2015, Yahoo Inc.
   Copyrights licensed under the MIT License.
   See the accompanying LICENSE file for terms. */
"use strict";
var prefixed = require('./prefixed');
var prefixedTransform = prefixed('transform');
var cssomPrefixes = 'Webkit Moz O ms'.split(' ');
var propsToPrefix = ['transition','animation','perspective','transform','align','justify','flex'];
var startWithPropsToPrefix = new RegExp('^('+propsToPrefix.join('|')+')', 'i');

var StyleHelper = {
  // receives a styleObject and returns a NEW styleObject with the same properties and additional prefixed props
  // returns the same modified object as a convenience
  prefixAll: function(styleObject) {
    var style, allPrefixed, result = {};
    for(style in styleObject) {
      allPrefixed = StyleHelper.allPrefixed(style);
      for (var i = 0; i < allPrefixed.length; i++) {
        result[allPrefixed[i]] = styleObject[style];
      }
    }
    return result;
  },
  // receives one scrollable styleObject with X, Y and translate abstractions and MODIFIES it
  // returns the same modified object as a convenience
  scrollStyles: function(styleObject, serverTick) {
    var transform = serverTick ? 'transform':prefixedTransform;
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
  // receives one property name string and return an array of strings with prefixes when needed
  allPrefixed: function (prop) {
    if (!startWithPropsToPrefix.test(prop)) {
      return [prop];
    }
    var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1);
    return (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');
  },
};

module.exports = StyleHelper;
