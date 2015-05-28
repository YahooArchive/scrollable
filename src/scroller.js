
var React = (typeof window !== 'undefined' && window.React) || require('react');
var RectCache = require('./rect-cache');
var ScrollerEvents = require('./scroller-events');
var prefixed = require('./prefixed');

var transition = prefixed('transition');
var transform = prefixed('transform');

var transitionProps = {
  'delay': transition+'Delay',
  'duration': transition+'Duration',
  'property': transition+'Property',
  'timingFunction': transition+'TimingFunction',
};

var Scroller = React.createClass({displayName: "Scroller",

  mixins: [RectCache],

  childContextTypes: {
    scrollingParent: React.PropTypes.object,
  },

  getChildContext: function() {
    return {
      scrollingParent: this,
    };
  },

  propTypes: {
    scrollingX: React.PropTypes.bool.isRequired,
    scrollingY: React.PropTypes.bool.isRequired,
    getContentSize: React.PropTypes.func.isRequired,
  },

  _registerItem: function(scrollableItem) {
    if(!this._scrollItems) {
      this._scrollItems = {};
    }
    var name = scrollableItem.props.name;
    if (this._scrollItems[name]) {
      console.warn('ScrollItem Invariant Error: Mounting duplicated ScrollItem. "'+name+'" is being replaced.');
    }
    this._scrollItems[name] = scrollableItem;
  },

  _unRegisterItem: function(scrollableItem) {
    var name = scrollableItem.props.name;
    if (this._scrollItems[name] !== scrollableItem) {
      console.warn('ScrollItem Invariant Error: Unmount invalid ScrollItem "'+name+'"');
    } else {
      delete this._scrollItems[name];
    }
  },

  setStyleWithPosition: function(x, y) {
    var self = this;

    var items = self._scrollItems;
    for(var itemK in items) {
      var item = items[itemK];
      var styleObject = item.props.scrollHandler(x, y, item, items, self);
      if (styleObject) {

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

        // Using styles directly and simple for loops yeilds HUGE performance
        // improvements specially on iPhone 4 with iOS 7.

        // Set styles
        if (item._node) {
          for(var prop in styleObject) {
            item._node.style[prop] = styleObject[prop];
          }
        } else {
          item._pendingStyles = styleObject;
        }

      }
    }
  },

  _animEndX: 0,
  _animEndY: 0,
  _animTimer: null,
  animateAndResetScroll: function(x, y, atomic) {
    var self = this;
    if (atomic) {
      self._scroller.stopEvents();
    }
    self.disable();
    if (self._animTimer) {
      clearTimeout(self._animTimer);
    }

    var acumulate = {
      delay: 0,
      duration: 0,
    };
    var items = self._scrollItems;
    for(var itemK in items) {
      var item = items[itemK];
      if (item.props.transitionStyles) {
        var transitionObject = item.props.transitionStyles(item, items, self);
        for(var prop in transitionProps) {
          if (transitionObject[prop]) {
            if(prop in acumulate) {
              acumulate[prop] = Math.max(acumulate[prop], transitionObject[prop]);
              transitionObject[prop] = transitionObject[prop] + 'ms';
            }
            item._node.style[transitionProps[prop]] = transitionObject[prop];
          }
        }
      }
    }
    var totalTime = acumulate.delay + acumulate.duration;
    self._animTimer = setTimeout(self._endAnimation, totalTime);
    self._animEndX = x;
    self._animEndY = y;

    // Make sure all calculations will be based on ** after animation ** max/min scroll size
    self._resetScroll();
    // Unfortunately zynga.setDimentions won't receive top/left coordinates, so set
    // scroll to final position
    self._scroller.scrollTo(x, y);
  },

  _endAnimation: function() {
    var self = this;
    var items = self._scrollItems;
    for(var itemK in items) {
      var item = items[itemK];
      for(var prop in transitionProps) {
        item._node.style[ transitionProps[prop] ] = null;
      }
    }

    self._resetScroll();
    self._scroller.scrollTo(self._animEndX, self._animEndY);
    self._scroller.enable();
    self._scroller.resumeEvents();
  },

  _getContentSize: function() {
    return this.props.getContentSize(this._scrollItems, this);
  },

  disable: function() {
    this._scroller.disable();
  },

  enable: function() {
    this._scroller.enable();
  },

  componentDidMount: function () {
    var self = this;
    var container = self.getDOMNode();

    self._scroller = new ScrollerEvents(container, self.setStyleWithPosition, {
      scrollingX: self.props.scrollingX,
      scrollingY: self.props.scrollingY,
    });

    // Because of React batch operations and optimizations, we need to wait
    // for next tick in order to all ScrollableItems initialize and have proper
    // RectCache before updating containerSizer for the first time.
    setTimeout(self._resetScroll, 1);
  },
  _resetScroll: function() {
    var self = this;
    var content = self._getContentSize();
    self._scroller && self._scroller.setDimensions(self.rect.width, self.rect.height, content.width, content.height);
  },

  render: function () {
    var props = this.props;
    var className = 'scrollable';
    if (props.hasOwnProperty('viewport')) {
      className += '-viewport';
    }

    var isClassName = /^(className|class)$/;
    var passProps = {};

    Object.keys(props).forEach(function(key){
      var value = props[key];
      if (isClassName.test(key)) {
        className += ' ' + value;
      } else {
        passProps[key] = value;
      }
    });

    return (
      React.createElement("div", React.__spread({className: className},  passProps),
        React.createElement("div", null,
          this.props.children
        )
      )
    );
  },

});

module.exports = Scroller;
