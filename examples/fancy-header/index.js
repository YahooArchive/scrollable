
var React = require('react');
var Scroller = require('../../src/scroller');
var ScrollItem = require('../../src/scroll-item');

var Lorem = require('../lorem');

var FancyHeader = React.createClass({

  getContentSize: function (items, scroller) {
    return items.content.rect;
  },

  render: function () {
    return (
      <Scroller viewport scrollingX={false} scrollingY={true} getContentSize={this.getContentSize}>
        <ScrollItem name="content" scrollHandler={content}>
          <Lorem />
        </ScrollItem>
      </Scroller>
    );
  }

});

function content(x, y) {
  return {
    y: -y,
  };
}

module.exports = FancyHeader;
