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
  fillerStyle.position = 'static';
  fillerStyle.display = 'block';
  fillerStyle.visibiliy = 'hidden';

  var nodeStyle = domNode.style;
  nodeStyle.overflow = "visible";

  // there is always an innerElement since it's created on scroller.js
  // var innerElement = domNode.firstChild;
  // innerElement.style.position = "fixed";
  // innerElement.style.top = 0;
  // innerElement.style.left = 0;
  // innerElement.style.right = 0;
  // innerElement.style.bottom = 0;
  document.body.insertBefore(fillerNode, document.body.firstChild);

  window.addEventListener('scroll', this._triggerSchedule.bind(this));

  this._handler = handler;
  this._node = domNode;
  this._filler = fillerNode;
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

  _triggering: false,
  _triggerSchedule: function () {
    var self = this;
    if (self._triggering) { return; }
    self._triggering = true;
    requestAnimationFrame(self._triggerDone.bind(this));
  },
  _triggerDone: function () {
    this._handler(document.body.scrollLeft, document.body.scrollTop);
    this._triggering = false;
  },

  setDimensions: function(containerWidth, containerHeight, contentWidth, contentHeight) {
    this._filler.style.width = contentWidth + 'px';
    this._filler.style.height = contentHeight + 'px';
    this._handler(document.body.scrollLeft, document.body.scrollTop);
  },
  scrollTo: function(left, top, animate, zoom) {
    document.body.scrollTo(left, top);
  },
};

for(var key in members) {
  ScrollerEvents.prototype[key] = members[key];
}

module.exports = ScrollerEvents;
