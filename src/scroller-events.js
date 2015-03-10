var ZingaScroller = require('../vendor/zynga.scroller.js');

function ScrollerEvents(domNode, handler, config) {
  if (this.constructor !== ScrollerEvents) {
    return new ScrollerEvents(domNode, handler, config);
  }

  this._node = domNode;
  this._scroller = new ZingaScroller(handler, {
    scrollingX: config.scrollingX,
    scrollingY: config.scrollingY,
    scrollingStarted: this._started.bind(this),
    scrollingComplete: this._stopped.bind(this),
  });

  // Store ScrollerEvents instances during event capturing
  domNode.addEventListener("touchstart",  this._storeScrollers.bind(this), true);
  domNode.addEventListener("touchmove",   this._storeScrollers.bind(this), true);
  domNode.addEventListener("touchend",    this._storeScrollers.bind(this), true);
  domNode.addEventListener("touchcancel", this._storeScrollers.bind(this), true);
  // Then act on this information during bubbling
  domNode.addEventListener("touchstart",  this._touchStart.bind(this), false);
  domNode.addEventListener("touchmove",   this._touchMove.bind(this),  false);
  domNode.addEventListener("touchend",    this._touchEnd.bind(this),   false);
  domNode.addEventListener("touchcancel", this._touchEnd.bind(this),   false);

  return this;
}

var members = {
  _disabled: false,
  disable: function() {
    this._disabled = true;
  },
  enable: function() {
    this._disabled = false;
  },

  _scrolling: false,
  _started: function() {
    this._scrolling = true;
    this._node.firstChild.style.pointerEvents = "none";
  },
  _stopped: function() {
    this._scrolling = false;
    this._node.firstChild.style.pointerEvents = "inherit";
  },

  setDimensions: function(containerWidth, containerHeight, contentWidth, contentHeight) {
    this._scroller.setDimensions(containerWidth, containerHeight, contentWidth, contentHeight);
  },

  scrollTo: function(left, top, animate, zoom) {
    this._scroller.scrollTo(left, top, animate, zoom);
  },

  _storeScrollers: function(event) {
    event.__scrollers = event.__scrollers || [];
    event.__scrollers.push(this); // not using right now, but I have a feeling this will be needed
    event.__topMostScroller = this;
  },

  _touchStart: function(event) {
    var scroller = this._scroller;
    if (event.touches[0] && event.touches[0].target && event.touches[0].target.tagName.match(/input|textarea|select/i)) {
      return;
    }
    var isMoving = scroller.__isDragging || scroller.__isDecelerating || scroller.__isAnimating;
    if (isMoving) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (this === event.__topMostScroller && !this._disabled) {
       scroller.doTouchStart(event.touches, event.timeStamp);
    }
  },

  _touchMove: function(event) {
    event.preventDefault(); // unconditionally to prevent React onScroll handlers
    var scroller = this._scroller;
    var isMoving = scroller.__isDragging || scroller.__isDecelerating || scroller.__isAnimating;
    if (isMoving) {
      event.stopPropagation();
    }
    if (this === event.__topMostScroller && !this._disabled) {
       scroller.doTouchMove(event.touches, event.timeStamp, event.scale);
    }
  },

  _touchEnd: function(event) {
    var scroller = this._scroller;
    var isMoving = scroller.__isDragging || scroller.__isDecelerating || scroller.__isAnimating;
    if (isMoving) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (this === event.__topMostScroller && !this._disabled) {
       scroller.doTouchEnd(event.timeStamp);
    }
  },
};

for(var key in members) {
  ScrollerEvents.prototype[key] = members[key];
}

module.exports = ScrollerEvents;
