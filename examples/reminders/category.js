/* Copyright 2015, Yahoo Inc.
   Copyrights licensed under the MIT License.
   See the accompanying LICENSE file for terms. */

var React = require('react');
var Data = require('./data');
var TodoItems = require('./items');

var ReminderCartegory = React.createClass({

  getContentSize: function (items, scroller) {
    return scroller.rect;
  },

  render: function () {
    var category = Data.categoryById[this.props.categoryId];
    return (
      <div className={"reminder-category "+category.color}>
        <h1>{category.title}</h1>
        <h3>{category.items.length ? category.items.length + " items" : "No Items"}</h3>
        <TodoItems categoryId={this.props.categoryId} />
      </div>
    );
  },

});

module.exports = ReminderCartegory;
