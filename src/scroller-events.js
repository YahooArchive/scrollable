
function ScrollerEvents(scrollerInstance, domNode) {
  if (this.constructor !== ScrollerEvents) {
    return new ScrollerEvents(scrollerInstance, domNode);
  }

  domNode.addEventListener("touchstart",  this._touchStart.bind(this), false);
  domNode.addEventListener("touchmove",   this._touchMove.bind(this),  false);
  domNode.addEventListener("touchend",    this._touchEnd.bind(this),   false);
  domNode.addEventListener("touchcancel", this._touchEnd.bind(this),   false);

  this._node = domNode;
  this._scroller = scrollerInstance;

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
    !this._disabled && scroller.doTouchStart(event.touches, event.timeStamp);
  },

  _touchMove: function(event) {
    event.preventDefault(); // unconditionally to prevent React onScroll handlers
    var scroller = this._scroller;
    var isMoving = scroller.__isDragging || scroller.__isDecelerating || scroller.__isAnimating;
    if (isMoving) {
      event.stopPropagation();
    }
    !this._disabled && scroller.doTouchMove(event.touches, event.timeStamp, event.scale);
  },

  _touchEnd: function(event) {
    var scroller = this._scroller;
    var isMoving = scroller.__isDragging || scroller.__isDecelerating || scroller.__isAnimating;
    if (isMoving) {
      event.preventDefault();
      event.stopPropagation();
    }
    scroller.doTouchEnd(event.timeStamp);
  },
};

for(var key in members) {
  ScrollerEvents.prototype[key] = members[key];
}

module.exports = ScrollerEvents;
