var ZingaScroller = require('../vendor/zynga.scroller.js');

function ScrollerEvents(domNode, handler, config) {
  if (this.constructor !== ScrollerEvents) {
    return new ScrollerEvents(domNode, handler, config);
  }

  this._node = domNode;
  this._scroller = new ZingaScroller(handler, {

    //scrolling options
    penetrationDeceleration: config.penetrationDeceleration,
    penetrationAcceleration: config.penetrationAcceleration,
    frictionFactor: config.frictionFactor,
    minVelocityToKeepDecelerating: config.minVelocityToKeepDecelerating,

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
  _temp_disabled: false,
  _isParentScrolling: false,

  /*
    Temporary Disabled is meant for animation purposes.
    It will be stronger then disable itself. During temporary disable
    calling `.enable()` or `.disable()` will just schedule this for when
    restoration is called.
  */
  temporaryDisable: function() {
    this._restore_disabled = this._disabled;
    this._temp_disabled = true;
    this._disabled = true;
  },
  restoreTempDisabled: function() {
    this._temp_disabled = false;
    this._disabled = this._restore_disabled;
  },

  disable: function() {
    this._restore_disabled = true;
    this._disabled = true;
  },
  enable: function() {
    this._restore_disabled = false;
    if (!this._temp_disabled) {
      this._disabled = false;
    }
  },

  _scrolling: false,
  _started: function() {
    this._scrolling = true;
    this.stopEvents();
  },
  _stopped: function() {
    this._scrolling = false;
    this.resumeEvents();
  },

  stopEvents: function() {
    this._node.firstChild.style.pointerEvents = "none";
  },
  resumeEvents: function() {
    this._node.firstChild.style.pointerEvents = "inherit";
  },

  setDimensions: function(containerWidth, containerHeight, contentWidth, contentHeight) {
    this._scroller.setDimensions(containerWidth, containerHeight, contentWidth, contentHeight);
  },

  scrollTo: function(left, top, animate, zoom) {
    this._scroller.scrollTo(left, top, animate, zoom);
  },

  _storeScrollers: function(event) {
    var scrollers = (event.__scrollers = event.__scrollers || []);
    var len = scrollers.length;
    if (len) {
      var parent = scrollers[len-1];
      this._isParentScrolling = parent._scrolling || parent._isParentScrolling || false;
    }
    scrollers.push(this);
  },

  _touchStart: function(event) {
    if (event.touches[0] && event.touches[0].target && event.touches[0].target.tagName.match(/input|textarea|select/i)) {
      return;
    }

    var scroller = this._scroller;
    if (!this._isParentScrolling && !this._disabled) {
       scroller.doTouchStart(event.touches, event.timeStamp);
    }
    var isMoving = scroller.__enableScrollX || scroller.__enableScrollY || scroller.__isDecelerating || scroller.__isAnimating;
    if (isMoving) {
      event.preventDefault();
      event.stopPropagation();
    }
  },

  _touchMove: function(event) {
    var scroller = this._scroller;
    if (!this._isParentScrolling && !this._disabled) {
       scroller.doTouchMove(event.touches, event.timeStamp, event.scale);
    }
    var isMoving = scroller.__enableScrollX || scroller.__enableScrollY || scroller.__isDecelerating || scroller.__isAnimating;
    if (isMoving) {
      event.stopPropagation();
    }
    event.preventDefault(); // unconditionally to prevent React onScroll handlers
  },

  _touchEnd: function(event) {
    var scroller = this._scroller;
    if (!this._isParentScrolling && !this._disabled) {
       scroller.doTouchEnd(event.timeStamp);
    }
    var isMoving = scroller.__enableScrollX || scroller.__enableScrollY || scroller.__isDecelerating || scroller.__isAnimating;
    if (isMoving) {
      event.preventDefault();
      event.stopPropagation();
    }
  },
};

for(var key in members) {
  ScrollerEvents.prototype[key] = members[key];
}

module.exports = ScrollerEvents;
