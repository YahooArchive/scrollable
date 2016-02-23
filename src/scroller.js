/* Copyright 2015, Yahoo Inc.
   Designed by Irae Carvalho
   Copyrights licensed under the MIT License.
   See the accompanying LICENSE file for terms. */

var inBrowser = typeof window !== 'undefined';
var React = (inBrowser && window.React) || require('react');
var ReactDOM = (inBrowser && window.React) || require('react-dom');
var StyleHelper = require('./style-helper');
var prefixed = require('./prefixed');
var RectCache = require('./rect-cache');
var ScrollerEvents;

/* istanbul ignore else */
if (inBrowser) {
  ScrollerEvents = require('./scroller-events');
} else {
  ScrollerEvents = require('./scroller-events-stub');
}

var transition = prefixed('transition');

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
    self.scrollLeft = x;
    self.scrollTop = y;
    var items = self._scrollItems;
    for(var itemK in items) {
      var item = items[itemK];
      var styleObject = item.props.scrollHandler(x, y, item, items, self);
      if (styleObject) {
        styleObject = StyleHelper.scrollStyles(styleObject);

        if (item._node) {
          applyStyles(item, styleObject);
        } else {
          item._pendingOperation = queueStylesOperation(item, styleObject);
        }

      }
    }
  },


  /*******************************

  ANIMATIONS
  ----------

  In order to create smooth programmatic transitions, one could ask herself about
  why not use `scrollTo`, that is already 60 FPS while dragging to fire a series
  of programmatic points using an animation function?

  The reason this library won't encourage this kind of animation is to avoid giving
  the consumers a chance to create choppy animations. By using CSS animation, the
  library will be offloading all the work to the browser, which in place will just
  send this to the device GPU.

  Also, if the API would allow for the user code to be called during animation, it
  might cause undesired changes mid-flight and cause frame rate drop. Two concrete
  ways of breaking mid-animation would be:

    1) If one of the `ScrollItem.scrollHandler` uses properties that causes
       re-paint of the screen, i.e. changing widths or heights. If this
       happens while "dragging finger" on the screen, it's less likely to
       feel "janky", but using CSS animation we force this to happen before
       the first animation frame, and starting a smooth animation latter.

    2) When programmatic animating, the amount of pixels scrolled might be
       orders of magnitude larger then "finger dragging scroll". Safari
       breaks down large layers into smaller pieces, by doing programmatic
       transitions the other parts might have to paint during animation, but
       using CSS animations would force the paint to be made before the
       first frame, and therefore making a smooth animation.

  ## Usage

  `ScrollItem.transitionStyles`: Each `<ScrollItem>` that needs to be animated
  will need to implement this prop in order for any animation to render.

  `animateAndResetScroll`: In most cases, you only need this function. You should
  `setState` on your component to the **final** state you want **before** calling
  this method. Be sure to call this method on the `setState` callback.

      this.setState({
        selectedSection: "login"
      }, function() {
        this.animateAndResetScroll(0, 0);
      }.bind(this));

  `x, y`: in case you need to set a particular scroll position after the animation,
  you can pass x and/or y values. This can be used to transition from entirely
  different states, like moving from content list to detail view, and reseting to
  `0, 0` positions, or to just scroll to a particular element with animation, by
  passing the desired positions.

  The `atomic` param will prevent user interaction during the animation.
  For instance, let's first understand the default `false` value: one could tap a
  moving element on the page that triggers a second click handler and the
  transition will start again. If `animateAndResetScroll` gets called again, it
  will start animating from the place it is right now to the end position, which
  is actually a good user experience, but might cause undesired artifacts on some
  interactions. By setting this to `true` you can opt-out.

  To understand better there is a nice comparison of iOS 7 an 8 behavior against
  older versions of iOS. `true` is like iOS 7 and 8, and `false` is the like older
  (and better, animation and interaction-wise) versions of iOS:

  https://www.youtube.com/watch?t=52&v=5Ti0KdXrgSE


  `prepareAnimationSync`: This method is usually not needed, is tailored for use in
  larger applications where a lot of operations might run in parallel. Calling this
  method will prevent any scrolling "frames" to fire while you prepare for
  triggering `animateAndResetScroll`. This is particular useful for applications
  multiple Flux stores that might trigger callbacks that are changing the DOM, which
  in place might cause re-calculation of scroll positions.


      // Freeze scrolling
      this.prepareAnimationSync();
      // do more operations that might cause DOM changes
      this.props.someCallback();
      // change this component state
      this.setState({
        selectedSection: "login"
      }, function() {
        // start animation
        this.animateAndResetScroll(0, 0);
      }.bind(this));

  The side-effect of not calling this method is noticeable if you call
  `animateAndResetScroll` and don't see any animation, instead going directly to the
  final frame. This might happen if some internal action calls `_resetScroll()` after,
  in the example above, `selectedSection` is already `"login"` before `transitionStyles`
  are applied, resulting in a transition with same origin and destination.


  *******************************/

  _animEndX: 0,
  _animEndY: 0,
  _animating: false,
  _animTimer: null,
  prepareAnimationSync: function() {
    this._animating = true;
    this._scroller.temporaryDisable();
  },
  animateAndResetScroll: function(x, y, atomic) {
    var self = this;
    if (atomic) {
      self._scroller.stopEvents();
    }
    if (!this._animating) {
      self.prepareAnimationSync();
    }
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


    /*************************

    Using Timers versus `onTransitionEnd`.

    The way browsers implement `onTransitionEnd` and browser visibility API and
    `requestAnimationFrame` might cause undesired behaviors in programmatic annimations.
    For that reason the current implementation avoids `onTransitionEnd`. More details
    are discussed in the following issue about React.transitionGroup implementation.

    https://github.com/facebook/react/issues/1326

    The `transitionGroup` implementation does not have access to all the CSS properties
    that might modify the time the "end frame" is called. `Scrollable.Scroller`, in the
    other hand, has access to both delay and duration by design. This means that in the
    future, this might be improved by setting up the timeOut as a fallback and using
    CSS `onTransitionEnd` as the main method of triggering the `_endAnnimation` function.

    So far, the `setTimeout` implementation is working fine and unless any issue is
    proven to be blocked by this implementation, it's probably preferable to keep it as is
    for byte size concerns.

    **************************/
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
    self._scroller.restoreTempDisabled();
    this._animating = false;
    self._scroller.resumeEvents();
    delete self._animTimer;
  },

  _getContentSize: function() {
    if (!this.props.getContentSize) {
      return {width: 0, height: 0};
    }
    return this.props.getContentSize(this._scrollItems, this);
  },

  disable: function() {
    this._scroller.disable();
  },

  enable: function() {
    this._scroller.enable();
  },

  scrollTop: 0,
  scrollLeft: 0,
  scrollTo: function(x, y) {
    if (!this._animating) {
      this._scroller.scrollTo(x, y);
    } else {
      console.warn('Scroller.scrollTo will not be honored during animation');
    }
  },

  componentDidMount: function () {
    var self = this;
    var container = ReactDOM.findDOMNode(self);
    container.scrollable = this;

    var options = this.props.options || {};
    self._scroller = new ScrollerEvents(container, self.setStyleWithPosition, {
      penetrationDeceleration: options.penetrationDeceleration,
      penetrationAcceleration: options.penetrationAcceleration,
      frictionFactor: options.frictionFactor,
      minVelocityToKeepDecelerating: options.minVelocityToKeepDecelerating,
      scrollingX: self.props.scrollingX,
      scrollingY: self.props.scrollingY,
    });


    // Because of React batch operations and optimizations, we need to wait
    // for next tick in order to all ScrollableItems initialize and have proper
    // RectCache before updating containerSize for the first time.
    setTimeout(function() {
      // Since we schedule _resetScroll to the next tick, if some edge-case racing
      // condition starts to unmount the element, we should prevent that.
      if (self.isMounted()) {
        self._resetScroll();
      }
    }, 1);
  },

  componentWillUnmount: function() {
    delete ReactDOM.findDOMNode(this).scrollable;
  },

  onResize: function() {
    if (!this._animating) {
      this._resetScroll();
    }
    // no need to ward because _resetScroll will be honored on animation end
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

function queueStylesOperation(item, styleObject) {
  return applyStyles.bind(null, item, styleObject);
}

function applyStyles(item, styleObject) {
  // Using styles directly and simple for loops yeilds HUGE performance
  // improvements specially on iPhone 4 with iOS 7.
  for(var prop in styleObject) {
    if (!item._prevStyles || item._prevStyles[prop] !== styleObject[prop]) {
      item._node.style[prop] = styleObject[prop];
    }
  }
  item._prevStyles = styleObject;
}

module.exports = Scroller;
