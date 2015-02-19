
var React = require('react');
var MinimalScroller = require('../minimal');

var ReminderCartegory = React.createClass({

  getContentSize: function (items, scroller) {
    return scroller.rect;
  },

  render: function () {
    var p = this.props;
    return (
      <div className="reminder-category">
        <h1 className={p.color}>{p.title}</h1>
      </div>
    );
  },

});

module.exports = ReminderCartegory;
