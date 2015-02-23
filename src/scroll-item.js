
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
    this._reactInternalInstance._context.scrollingParent._registerItem(this);
  },

  componentDidMount: function () {
    this._node = this.getDOMNode();
  },

  componentWillUnmount: function () {
    this._reactInternalInstance._context.scrollingParent._unRegisterItem(this);
    this._node = null;
  },

  render: function () {
    return (
      <div className="scrollable-item">
        {this.props.children}
      </div>
    );
  },

});

module.exports = ScrollItem;
