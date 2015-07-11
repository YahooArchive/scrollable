/* exported RectCache */
/* Copyright 2015, Yahoo Inc.
   Designed by Irae Carvalho
   Copyrights licensed under the MIT License.
   See the accompanying LICENSE file for terms. */
"use strict";

/*

This mixin will add a `.rect` property to the consumer element and will do a "best effort"
to keep it updated, with the caveats stated below.

API:
----

`.rect` (Object): This property will have the same object signature as
DOMElement.getBoundingClientRect() or will be a direct instance returned by
the native method.

`.onResize` (optional hook event): The consumer might implement this method to get notified
of changes to `.rect` changes.

`onResize` (callback prop): Owners of component instances that implement RectCache can hook
into size changes to get notifications.

`viewport` (property): Owners can initialize component instances that implement RectCache
that will also update when window resizes or orientation changes.


Silly example, but with all API being used:
-------------------------------------------

    var HaveRectCache = React.createClass({
      mixins: [RectCache],
      render: function () {
        return (<div onClick={this.theClick}>
          <img src="large1.jpg" />
          <img src="large2.jpg" />
        </div>);
      },
      theClick: function() {
        alert(this.rect.height);
      },
    });

    var Comp = React.createClass({
      render: function () {
        return (<div>
          <HaveRectCache viewport ref="theElement" onResize={this.whenResized}>
        </div>);
      },
      whenResized: function() {
        // also called if window resizes or orientation change
        alert('Comp knows theElement height changed to ' + this.refs.theElement.rect.height);
      },
    });

How it works and quirks:
------------------------

The `.rect` object will have width and hight consistent at all times, but other properties
might get outdated if elements are dynamically re-positioned by application logic.

After initialization, the mixin will bind to DOM events to do a best effort into a watching
for element size changes. Current browser APIs won't allow for perfect resize detection on
a DOM node level, besides hacky solutions that add extra DOM and watch for scroll events. One
famous library that uses this technique is
[CSS Element Queries](https://github.com/marcj/css-element-queries). Instead, RectCache will
poll for `.getBoundingClientRect()` on reasonable events like "DOMSubtreeModified/Inserted"
and image onLoad events.

Because some edge cases might still happen, specially when window resizes or viewport
orientation changes (on mobile devices), the viewport property will help the relevant elements
to keep updated.

The reason this algorithm is used instead of the more reliable hacky solutions mentioned above,
is because using React is already adding a lot of DOM predictability to changes, and this
library only aims to "close the gap", when doing something with DOM outside of React code.

*/

var initialRect = { left : 0, right : 0, top : 0, height : 0, bottom : 0, width : 0 };

var RectCache = {
  rect: initialRect,
  _node: null,
  _updateRectCache: function() {
    if(!this._node) {
      return;
    }
    var oldRect = this.rect;
    var newRect = this._node.getBoundingClientRect();
    this.rect = newRect;

    // Interesting fact: Checking for changes is not only better for performance. Since
    // a consumer of onResize might update state variables, preventing unnecessary events also
    // avoids weird side-effects.
    // This is specially true for nested rect-cached elements inside overflow: hidden; elements
    // where the outermost rect-cache is not updated while the inner most might be.
    if (oldRect.width !== newRect.width || oldRect.height !== newRect.height) {
      this.props.onResize && this.props.onResize();
      this.onResize && this.onResize();
    }
  },

  _bindImgLoad: null,
  componentDidMount: function(){
    var node = this.getDOMNode();
    var update = this._updateRectCache;
    this._node = node;
    this._bindImgLoad = function(event) {
      watchLoadImages(event.target, update);
    };
    update();
    watchLoadImages(node, update);
    node.addEventListener('DOMSubtreeModified', update);
    node.addEventListener('DOMNodeInserted', this._bindImgLoad);
    if (this.props.hasOwnProperty('viewport')) {
      window.addEventListener('orientationchange', update);
      window.addEventListener("resize", update);
    }
  },

  componentWillUnmount: function(){
    var node = this._node;
    var update = this._updateRectCache;
    node.removeEventListener('DOMSubtreeModified', update);
    node.removeEventListener('DOMNodeInserted', this._bindImgLoad);
    this._node = null;
    this._bindImgLoad = null;
    if (this.props.hasOwnProperty('viewport')) {
      window.removeEventListener('orientationchange', update);
      window.removeEventListener("resize", update);
    }
  },
};

function watchLoadImages(node, callback) {
  var imgArr = getAllImagesInTree(node);
  for (var i = 0; i < imgArr.length; i++) {
    var img = imgArr[i];
    img.addEventListener('load', callback);
  }
}

function getAllImagesInTree(node) {
  if (node && node.nodeName.toLowerCase() === 'img') {
    return [node];
  } else {
    return (node.getElementsByTagName && node.getElementsByTagName('img')) || [];
  }
}

/* istanbul ignore if */
if (typeof window === 'undefined'){
  module.exports = {
    rect: initialRect,
  };
} else {
  module.exports = RectCache;
}
