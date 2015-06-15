/* Copyright 2015, Yahoo Inc.
   Copyrights licensed under the MIT License.
   See the accompanying LICENSE file for terms. */

var Scrollable = {
  Scroller: require('./scroller'),
  ScrollItem: require('./scroll-item'),
};

if (typeof window !== 'undefined' && window.React) {
  window.Scrollable = Scrollable;
}

module.export = Scrollable;
