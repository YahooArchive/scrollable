
var React = require('react');
var RectCache = require('./rect-cache');

var ScrollItem = React.createClass({

  mixins: [RectCache],

  propTypes: {
      name: React.PropTypes.string.isRequired,
      scrollHandler: React.PropTypes.func.isRequired,
  },

  contextTypes: {
    scrollingParent: React.PropTypes.object,
  },

  componentWillMount: function () {
    this._reactInternalInstance._context.scrollingParent.registerItem(this);
  },

  render: function () {
    return (
      <div className="scrollable-item" style={this.state}>
        {this.props.children}
      </div>
    );
  },

});

module.exports = ScrollItem;
