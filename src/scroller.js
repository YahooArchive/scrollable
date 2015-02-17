var React = require('react');
var RectCache = require('./rect-cache');

var ZingaScroller = require('../vendor/zynga.scroller.js');

var Scroller = React.createClass({

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

  _scrollItems: {},

  registerItem: function(scrollableItem) {
    this._scrollItems[scrollableItem.props.name] = scrollableItem;
  },

  _scrollHandler: function(x, y) {
    var items = this._scrollItems;
    for(var itemK in items) {
      var item = items[itemK];
      var styleObject = item.props.scrollHandler(x, y, item, items, this);

      var tx = styleObject.x || 0;
      var ty = styleObject.y || 0;
      var tz = styleObject.zIndex && styleObject.zIndex/10 || 0;

      // Using replaceState so CSS properties that are not
      // returned but existed on previous states get cleansed

      // Also, doing setState from the parent is an anti-pattern, but
      // there is a large performance improvement on doing less function
      // calls.
      item.replaceState({
        zIndex: styleObject.zIndex,
        WebkitTransform: 'translate3d('+tx+'px, '+(ty)+'px, '+tz+'px)',
      });

    }
  },

  _getContentSize: function() {
    return this.props.getContentSize(this._scrollItems, this);
  },

  componentDidMount: function () {
    var self = this;
    var container = this.getDOMNode();

    var scroller = (self.scroller = new ZingaScroller(
      self._scrollHandler,
      {
        scrollingX: self.props.scrollingX,
        scrollingY: self.props.scrollingY,
      }
    ));

    // Because of React batch operations and optimizations, we need to wait
    // for next tick in order to all ScrollableItems initialize and have proper
    // RectCache before updating containerSizer for the first time.
    setTimeout(function() {
      var content = self._getContentSize();
      self.scroller.setDimensions(self.rect.width, self.rect.height, content.width, content.height);
    }, 1);

    // setup events
    container.addEventListener("touchstart", function(e) {
      if (e.touches[0] && e.touches[0].target && e.touches[0].target.tagName.match(/input|textarea|select/i)) {
        return;
      }
      var isMoving = !scroller.__isDragging || !scroller.__isDecelerating || !scroller.__isAnimating;
      if (isMoving) {
        e.preventDefault();
        e.stopPropagation();
      }
      scroller.doTouchStart(e.touches, e.timeStamp);
    }, false);
    container.addEventListener("touchmove", function(e) {
      e.preventDefault(); // unconditionally to prevent React onScroll handlers
      var isMoving = !scroller.__isDragging || !scroller.__isDecelerating || !scroller.__isAnimating;
      if (isMoving) {
        e.stopPropagation();
      }
      scroller.doTouchMove(e.touches, e.timeStamp, e.scale);
    }, false);

    container.addEventListener("touchend", function(e) {
      var isMoving = !scroller.__isDragging || !scroller.__isDecelerating || !scroller.__isAnimating;
      if (isMoving) {
        e.preventDefault();
        e.stopPropagation();
      }
      scroller.doTouchEnd(e.timeStamp);
    }, false);
    container.addEventListener("touchcancel", function(e) {
      var isMoving = !scroller.__isDragging || !scroller.__isDecelerating || !scroller.__isAnimating;
      if (isMoving) {
        e.preventDefault();
        e.stopPropagation();
      }
      scroller.doTouchEnd(e.timeStamp);
    }, false);
  },

  render: function () {
    var className = 'scrollable';
    if (this.props.hasOwnProperty('viewport')) {
      className += '-viewport';
    }
    return (
      <div className={className}>
        {this.props.children}
      </div>
    );
  },

});

module.exports = Scroller;
