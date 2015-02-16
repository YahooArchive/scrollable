/* exported RectCache */
"use strict";

var initialRect = { left : 0, right : 0, top : 0, height : 0, bottom : 0, width : 0 };

var RectCache = {
  rect: initialRect,
  _updateRectCache: function() {
    if(!this.isMounted()) {
      return; // Edge case, this should not happen, maybe react bug?
    }
    var oldRect = this.rect;
    var newRect = this.getDOMNode().getBoundingClientRect();
    this.rect = newRect;

    // Interesting fact: Checking for changes is not only better for performance. Since
    // a consumer of onResize might update state variables, preventing unnecessary events also
    // avoids weird side-effects.
    // This is specially true for nested rect-cached elements inside overflow: hidden; elements
    // where the outermost rect-cache is not updated while the inner most might be.
    if (oldRect.width !== newRect.width || oldRect.height !== newRect.height) {
      (this.props.onResize && this.props.onResize()) || (this.onResize && this.onResize());
    }
  },

  componentDidMount: function(){
    var node = this.getDOMNode();
    var update = this._updateRectCache;
    update();
    getImageLoadedNotifications(node, update);
    node.addEventListener('DOMSubtreeModified', update);
  },

  componentWillUnmount: function(){
    this.getDOMNode().removeEventListener('DOMSubtreeModified', this._updateRectCache);
  },
};

function getImageLoadedNotifications(node, callback) {
  watchLoadImages(node.getElementsByTagName('img'), callback);
  node.addEventListener('DOMNodeInserted', function(event) {
    watchLoadImages(event.target.getElementsByTagName && event.target.getElementsByTagName('img'), callback);
  });
}
function watchLoadImages(imgArr, callback) {
  if(imgArr && imgArr.length) {
    for (var i = 0; i < imgArr.length; i++) {
      var img = imgArr[i];
      img.addEventListener('load', callback);
    }
  }
}

if (typeof window === 'undefined'){
  module.exports = {
    rect: initialRect,
  };
} else {
  module.exports = RectCache;
}
