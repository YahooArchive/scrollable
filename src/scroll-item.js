
var React = require('react');
var RectCache = require('./rect-cache');

var ScrollItem = React.createClass({
  mixins: [RectCache],

  contextTypes: {
    scrollingParent: React.PropTypes.object,
  },

  componentWillMount: function () {
    this._reactInternalInstance._context.scrollingParent.registerItem(this);
  },

  render: function () {
    return (
      <div className="scrollable-item">
        <p>{this.props.children}</p>
      </div>
    );
  }

});

module.exports = ScrollItem;
