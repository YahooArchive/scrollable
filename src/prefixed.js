/* Extracted and re-formated from: */
/* Modernizr 2.8.3 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-prefixed-testprop-testallprops-domprefixes

   Changes to this code are Copyright 2015 Yahoo Inc. Licensed under the project's
   Open Source license. */
"use strict";

var mod = 'modernizr';
var modElem = typeof document !== "undefined" && document.createElement(mod);
var mStyle = modElem.style;
var omPrefixes = 'Webkit Moz O ms';
var cssomPrefixes = omPrefixes.split(' ');
var domPrefixes = omPrefixes.toLowerCase().split(' ');

function prefixed(prop, obj, elem) {
  if (!obj) {
    return testPropsAll(prop, 'pfx');
  } else {
    return testPropsAll(prop, obj, elem);
  }
}

prefixed.hyphenated = function(prop) {
    // http://modernizr.com/docs/#prefixed
    return prefixed(prop).replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); }).replace(/^ms-/,'-ms-');
};

function testPropsAll(prop, prefixed, elem) {
  var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1);
  var props = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

  if (is(prefixed, "string") || is(prefixed, "undefined")) {
    return testProps(props, prefixed);
  } else {
    props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
    return testDOMProps(props, prefixed, elem);
  }
}

function testProps(props, prefixed) {
  for (var i in props) {
    var prop = props[i];
    if (!contains(prop, "-") && mStyle[prop] !== undefined) {
      return prefixed === 'pfx' ? prop : true;
    }
  }
  return false;
}

function testDOMProps(props, obj, elem) {
  for (var i in props) {
    var item = obj[props[i]];
    if (item !== undefined) {

      if (elem === false) {
        return props[i];
      }

      if (is(item, 'function')) {
        return item.bind(elem || obj);
      }

      return item;
    }
  }
  return false;
}

function is(obj, type) {
  return typeof obj === type;
}

function contains(str, substr) {
  return !!~('' + str).indexOf(substr);
}

if(typeof window === 'undefined'){
  module.exports = function(prop, obj, elem) {
    var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1);
    return [
      'Webkit'+ucProp,
      'Moz'+ucProp,
      prop
    ];
  };
} else {
  module.exports = prefixed;
}
