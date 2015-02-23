
var React = require('react');

var ReminderCartegory = React.createClass({

  getContentSize: function (items, scroller) {
    return scroller.rect;
  },

  render: function () {
    var p = this.props;
    return (
      <div className={"reminder-category "+p.color} {...this.props}>
        <h1>{p.title}</h1>
        <h3>No Items</h3>
      </div>
    );
  },

});

module.exports = ReminderCartegory;
