
var React = require('react');
var Scroller = require('../../src/scroller');
var ScrollItem = require('../../src/scroll-item');

var Lorem = require('../lorem');
var Header = require('./header');

var FancyHeader = React.createClass({

  getContentSize: function (items, scroller) {
    return items.content.rect;
  },

  render: function () {
    return (
      <Scroller viewport scrollingX={false} scrollingY={true} getContentSize={this.getContentSize}>
        <ScrollItem name="background" scrollHandler={handler}>
          <div className="background">
          </div>
        </ScrollItem>
        <ScrollItem name="white" scrollHandler={handler}>
          <div className="white">
            <Header />
          </div>
        </ScrollItem>
        <ScrollItem name="transparent" scrollHandler={handler}>
          <div className="transparent">
            <Header />
          </div>
        </ScrollItem>
        <ScrollItem name="content" scrollHandler={handler}>
          <Lorem />
        </ScrollItem>
      </Scroller>
    );
  }

});

function handler(x, y, self, items, scroller) {
  var transitionPixels = 100;
  var ratio = 6;
  var headerPos = Math.max(transitionPixels - y, 0) / ratio;
  if (y < 0) {
    headerPos = transitionPixels / ratio;
  }

  switch (self.props.name) {
    case "content":
      return {
        zIndex: 1,
        y: -y + items.background.rect.height,
      };
    case "white":
      return {
        opacity: Math.min(1/transitionPixels * y, 1),
        zIndex: 5,
        y: headerPos,
      };
    case "transparent":
      return {
        zIndex: 4,
        y: headerPos,
      };
    case "background":
      return {
        zIndex: 3,
        y: Math.min(0, -y),
      };
    default:
      // during development, if I create a new <ScrollItem> this is handy
      // as it will sticky this element to the bottom of the <Scroller>
      return {
        zIndex: 10,
        y: scroller.rect.height - self.rect.height,
      };
  }
}

module.exports = FancyHeader;
