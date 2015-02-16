var React = require('react');
window.React = React;

var container = document.getElementById('container');
var Scroller = require('../src/scroller');
var ScrollItem = require('../src/scroll-item');

var Lorem = require('./lorem');
var App = React.createClass({

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

React.render(<App />, container);
