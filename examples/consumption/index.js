/* Copyright 2015, Yahoo Inc.
   Copyrights licensed under the MIT License.
   See the accompanying LICENSE file for terms. */

var React = require('react');
var Scroller = require('../../src/scroller');
var ScrollItem = require('../../src/scroll-item');
var TouchEvents = require('../../src/touch-events');

var TopBar = require('./top');
var BotBar = require('./bot');
var Lorem = require('../lorem');
var Hammer = require('hammerjs');

var ConsumptionMode = React.createClass({

  render: function () {
    return (
      <div className="consumption">
        <Scroller events={TouchEvents} viewport scrollingX={false} scrollingY={true}
                  getContentSize={this.getContentSize} ref="scroller">

          <ScrollItem ref="topbar" name="topbar" scrollHandler={consumptionBars}>
            <TopBar />
          </ScrollItem>

          <ScrollItem name="content" scrollHandler={contentHandler}>
            <div ref="swipeArea">
              <Lorem />
            </div>
          </ScrollItem>

          <ScrollItem name="botbar" scrollHandler={consumptionBars}>
            <BotBar />
          </ScrollItem>

        </Scroller>
      </div>
    );
  },

  getContentSize: function (items, scroller) {
    /*
      This is a very generic contentSize implementation, accounting for all
      items regardless of semantics of each item. It's not a coincidence that a
      regular for loop is used. map/reduce/forEach creates functions in runtime.
      If you scrape each piece of performance, you can probably run this example
      on iPhone 3GS or older Androids.
    */
    var height = 0, width = 0;
    for (var item in items) {
      height += items[item].rect.height;
      width = Math.max(width, items[item].rect.width);
    }
    return {
      height: height,
      width: width,
    };
  },

  componentDidMount: function() {
    this.refs.scroller.consuming = true;
    this.refs.scroller.origin = 0;
    var hammer = (this.hammer = new Hammer(this.refs.swipeArea.getDOMNode()));
    hammer.get('swipe').set({
      direction: Hammer.DIRECTION_DOWN,
      velocity: 0.3,
      threshold: 7,
    });
    hammer.on('swipe', this.swipeDown);
  },

  componentWillUnmount: function() {
    this.hammer.off('swipe');
  },

  swipeDown: function() {
    var scroller = this.refs.scroller;
    if (!scroller.consuming) {
      scroller.consuming = true;
      scroller.origin = scroller._scroller._scroller.getValues().top - this.refs.topbar.rect.height;
    }
  },

});


/*
  Notice: It's a Scrollable best practice to use plain functions instead
  of React bound methods. Read more about why on the minimal example.
  */
function consumptionBars(x, y, self, items, scroller) {
  // All calculations are made for top handler, then inverted in the end
  // if this call refers to the bottom handler

  // If we are in the middle of the content and scrolled past the swipe origin
  // keeps reseting origin until user scrolls down. Effectively this means the
  // first time user scrolls down starts hiding the bars again.
  if (y > 0 && y < scroller.origin && scroller.consuming) {
    scroller.origin = y;
  }

  // if we are near the top, force topBar to show
  if (y <= self.rect.height && !scroller.consuming) {
    scroller.consuming = true;
    scroller.origin = 0;
  }

  var pos;
  if (scroller.consuming) {
    pos = Math.min(scroller.origin - y, 0);
  } else {
    pos = -self.rect.height; // offscreen
  }

  // As the top bar moves offscreen, it should be locked offscreen
  if (pos <= -self.rect.height) {
    scroller.consuming = false;
  }

  // If this was called from botbar, make it work from bottom of the viewport.
  if (self === items.botbar) {
    pos = scroller.rect.height - self.rect.height - pos;
  }

  return {
    y: pos,
    zIndex: 5,
  };
}

function contentHandler(x, y, self, items, scroller) {
  return {
    y: items.topbar.rect.bottom - y,
  };
}

module.exports = ConsumptionMode;
