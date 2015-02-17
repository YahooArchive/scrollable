
var React = require('react');
var Scroller = require('../src/scroller');
var ScrollItem = require('../src/scroll-item');

var Lorem = require('./lorem');

var MinimalScroller = React.createClass({

  getContentSize: function () {
    return this.refs.first.rect;
  },

  render: function () {
    return (
      <Scroller viewport scrollingX={false} scrollingY={true} getContentSize={this.getContentSize}>
        <ScrollItem ref="first" name="first" scrollHandler={simpleHendler}>
          <Lorem />
        </ScrollItem>
      </Scroller>
    );
  }

});

function simpleHendler(x, y) {
  return {
    y: y,
  };
}

module.exports = MinimalScroller;
