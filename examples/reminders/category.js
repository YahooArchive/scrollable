
var React = require('react');
var MinimalScroller = require('../minimal');

var ReminderCartegory = React.createClass({

  getContentSize: function (items, scroller) {
    return scroller.rect;
  },

  render: function () {
    var p = this.props;
    return (
      <div className={"reminder-category "+p.color}>
        <h1>{p.title}</h1>
        <h3>No Items</h3>
      </div>
    );
  },

});

module.exports = ReminderCartegory;
