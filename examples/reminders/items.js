/* Copyright 2015, Yahoo Inc.
   Copyrights licensed under the MIT License.
   See the accompanying LICENSE file for terms. */

var React = require('react');
var Scroller = require('../../src/scroller');
var ScrollItem = require('../../src/scroll-item');
var TouchEvents = require('../../src/touch-events');

var Data = require('./data');

var TodoItems = React.createClass({

  todosHeight: function (items, scroller) {
    return items["allItems"+this.props.categoryId].rect;
  },

  render: function () {
    var id = this.props.categoryId;
    var items = Data.itemsForCategoryId[id];
    return (
      <Scroller events={TouchEvents} ref="totoScroll" name={"todoScroller"+id} scrollingX={false} scrollingY={true} getContentSize={this.todosHeight}>
        <ScrollItem name={"allItems"+this.props.categoryId} scrollHandler={simpleHandler} onResize={this.contentSizeChanged}>
          {items.map(function(item) {return (
            <p key={id+item}>{item}</p>
          );})}
        </ScrollItem>
      </Scroller>
    );
  },
  contentSizeChanged: function() {
    this.refs.totoScroll && this.refs.totoScroll._scroller.scrollTo();
  },

});

function simpleHandler(x, y) {
  // same as minimal scroll example
  return {
    zIndes: 10,
    y: -y,
  };
}

module.exports = TodoItems;
