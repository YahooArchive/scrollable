
var React = require('react');
var Scroller = require('../../src/scroller');
var ScrollItem = require('../../src/scroll-item');

var TopBar = require('./top');
var BotBar = require('./bot');
var Lorem = require('../lorem');

var ConsumptionMode = React.createClass({

  getContentSize: function (items, scroller) {
    var height = 0;
    var width = 0;
    for (var item in items) {
      height += items[item].rect.height;
      width = Math.max(width, items[item].rect.width);
    }
    return {
      height: height,
      width: width,
    };
  },

  render: function () {
    return (
      <Scroller viewport scrollingX={false} scrollingY={true} getContentSize={this.getContentSize}>
        <ScrollItem name="topbar" scrollHandler={topHandler}>
          <TopBar />
        </ScrollItem>
        <ScrollItem name="content" scrollHandler={contentHandler}>
          <Lorem />
        </ScrollItem>
        <ScrollItem name="botbar" scrollHandler={botHandler}>
          <BotBar />
        </ScrollItem>
      </Scroller>
    );
  }

});


/*
Notice: The following functions are outside of the React component.
Read more about why on the minimal example.
*/
function topHandler(x, y, self, items, scroller) {
  return {
    y: 0,
    zIndex: 5,
  };
}
function botHandler(x, y, self, items, scroller) {
  return {
    y: scroller.rect.height - self.rect.height,
    zIndex: 5,
  };
}
function contentHandler(x, y, self, items, scroller) {
  return {
    y: items.topbar.rect.bottom - y,
  };
}

module.exports = ConsumptionMode;
