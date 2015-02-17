
var React = require('react');
var Scroller = require('../../src/scroller');
var ScrollItem = require('../../src/scroll-item');

var Lorem = require('../lorem');

var MinimalScroller = React.createClass({

  getContentSize: function () {
    return this.refs.first.rect;
  },

  render: function () {

    // This is just a simple text component, but note that it's essential that
    // all children of a <ScrollItem> to either be a "PureComponent" or to have
    // a good `shouldComponentUpdate` method preventing almost all updates.
    // See https://facebook.github.io/react/docs/pure-render-mixin.html
    var content = <Lorem />;

    return (
      <Scroller viewport scrollingX={false} scrollingY={true} getContentSize={this.getContentSize}>
        <ScrollItem ref="first" name="first" scrollHandler={simpleHandler}>
          {content}
        </ScrollItem>
      </Scroller>
    );
  }

});

/*
Notice: The following function is outside of React.createClass object.
React bound methods will go though some very small function call
overhead in order to bind the method to the instance. This is near
zero overhead, but when trying to achieve 60fps we should avoid it.

Ideally, this function should not call any other function and do only the math needed.
*/
function simpleHandler(x, y) {
  return {
    y: -y,
  };
}

module.exports = MinimalScroller;
