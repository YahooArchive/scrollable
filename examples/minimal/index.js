/* Copyright 2015, Yahoo Inc.
   Copyrights licensed under the MIT License.
   See the accompanying LICENSE file for terms. */

var React = require('react');
var Scroller = require('../../src/scroller');
var ScrollItem = require('../../src/scroll-item');
var TouchEvents = require('../../src/touch-events');

var Lorem = require('../lorem');

var MinimalScroller = React.createClass({

  getContentSize: function (items, scroller) {
    return items.content.rect;
  },

  render: function () {

    // <Lorem/> is just a simple text component, but note that it's essential that
    // all children of a <ScrollItem> to either be a "PureComponent" or to have
    // a good `shouldComponentUpdate` method preventing almost all updates.
    // See https://facebook.github.io/react/docs/pure-render-mixin.html
    var content = <Lorem />;

    return (
      <Scroller events={TouchEvents} viewport scrollingX={false} scrollingY={true} getContentSize={this.getContentSize}>
        <ScrollItem name="content" scrollHandler={simpleHandler} exampleProp={"for scroll calculation"}>
          {content}
        </ScrollItem>
      </Scroller>
    );
  }

});

/*
  Notice:
  It's a Scrollable best practice to avoid using bound methods and use instead
  the handlers outside of the `React.createClass({})` object.

  React bound methods impose a small, though relevant for 60 fps rendering, overhead
  in order to bookkeep the function scope (in other words, enforcing `this` to be the
  React component instance). This might be invisible in smaller applications or
  contrived examples, but amazing results are achievable even on iPhone 3GS if you
  follow this and some other best practices throughout this examples folder.

  Ideally, this function (or functions) should not call any other function or component
  and neither setState. In order to compose layers efficiently the <Scroller> and
  <ScrollItem> components will be made available to this handler in a performance
  tested fashion. When state or other information is needed by those functions, you
  can pass in as props during your render method.
*/

function simpleHandler(x, y, currentScrollItem, listOfAllScrollItemsComponents, scrollerContainerComponent) {
  // In this scope all component props are still available. i.e.
  // currentScrollItem.props.exampleProp === "for scroll calculation"
  return {
    y: -y,
  };
}

module.exports = MinimalScroller;
