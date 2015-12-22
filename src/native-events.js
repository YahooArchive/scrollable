/* Copyright 2015, Yahoo Inc.
   Designed by Irae Carvalho
   Copyrights licensed under the MIT License.
   See the accompanying LICENSE file for terms. */

function ScrollerEvents(domNode, handler, config) {
  if (this.constructor !== ScrollerEvents) {
    return new ScrollerEvents(domNode, handler, config);
  }

  var fillerNode = document.createElement('div');
  var fillerStyle = fillerNode.style;
  fillerStyle.position = 'relative';
  fillerStyle.display = 'block';
  fillerStyle.visibiliy = 'hidden';
  fillerStyle.zIndex = 300;

  this._node = domNode;
  this._handler = handler;
  this._filler = fillerNode;
  this._wrapper = this._node.firstChild;
  this._wrapper.style.position = 'fixed';
  // should be detected based on this._node, just assuming viewport so far
  this._wrapper.style.top = 0;
  this._wrapper.style.bottom = 0;
  this._wrapper.style.left = 0;
  this._wrapper.style.right = 0;

  this._node.insertBefore(this._filler, this._wrapper);
  this._node.style.overflow = "scroll";

  // Store ScrollerEvents instances during event capturing
  // domNode.addEventListener("scroll", this._storeScrollers.bind(this), true);
  // Then act on this information during bubbling
  domNode.addEventListener("scroll", this._scrollFired.bind(this),    false);
  return this;
}

function inViewport (touch) {
  return touch.pageX > 0 &&
         touch.pageX < window.innerWidth,
         touch.pageY > 0 &&
         touch.pageY < window.innerHeight;
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

    Since `temporaryDisable` it's only called for animation purposes, we
    can assume it is considered a type of programmatic scrolling. So it
    will also trigger proper 'scrollStateChanged' events.

    TODO: A better way would be to handle CSS animations and programmatic
    transitions like the elastic effect when scrolling out of boundaries,
    in the same file and unify Zynga internal variables with those of this
    file. Candidate for eventual Zynga complete rewrite.
  */
  temporaryDisable: function() {
    if (!this._temp_disabled) {
      this._restore_disabled = this._disabled;
      this._temp_disabled = true;
      this._disabled = true;
      this._notifyChange('scrolling');
    }
  },
  restoreTempDisabled: function() {
    this._temp_disabled = false;
    this._disabled = this._restore_disabled;
    if (!this._disabled) {
      this._notifyChange('stopped');
    }
  },

  disable: function() {
    this._restore_disabled = true;
    this._disabled = true;
  },
  enable: function() {
    this._restore_disabled = false;
    if (!this._temp_disabled) {
      if (this._disabled) {
        this._notifyChange('stopped');
      }
      this._disabled = false;
    }
  },

  _scrolling: false,
  _started: function() {
    this._scrolling = true;
    this.stopEvents();
    this._notifyChange('scrolling');
  },
  _stopped: function() {
    this._scrolling = false;
    this.resumeEvents();
    this._notifyChange('stopped');
  },

  _notifyChange: function(stateString) {
    var scrollStateChanged = document.createEvent('Event');
    scrollStateChanged.initEvent('scrollStateChanged', true, true);
    scrollStateChanged.state = stateString;
    this._node.dispatchEvent(scrollStateChanged);
  },

  stopEvents: function() {
    this._wrapper.style.pointerEvents = "none";
  },
  resumeEvents: function() {
    this._wrapper.style.pointerEvents = "inherit";
  },

  setDimensions: function(containerWidth, containerHeight, contentWidth, contentHeight) {
    this._filler.style.width = contentWidth + 'px';
    this._filler.style.height = contentHeight + 'px';
    this._handler(this._node.scrollLeft, this._node.scrollTop);
  },

  scrollTo: function(left, top, animate, zoom) {
    this._node.scrollTo(left, top, animate, zoom);
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

  _scrollFired: function(event) {
    console.log('scroll', event);
    var self = this;
    if (!self._scrolling) {
      self._started();
    }
    if (self._endFrame) {
      cancelAnimationFrame(self._endFrame);
      delete self._endFrame;
    };
    if (!self._animationFrame) {
      self._animationFrame = requestAnimationFrame(function() {
        delete self._animationFrame;
        self._handler(self._node.scrollLeft, self._node.scrollTop);
        self._endFrame = requestAnimationFrame(function() {
          self._stopped();
        });
      });
    }
  },

};

for(var key in members) {
  ScrollerEvents.prototype[key] = members[key];
}

module.exports = ScrollerEvents;
