
var React = (typeof window !== 'undefined' && window.React) || require('react');
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

  onResize: function() {
    var parentContext = this._reactInternalInstance._context;
    var parent = parentContext.scrollingParent;
    parent && parent._resetScroll && parent._resetScroll();
  },

  componentWillMount: function () {
    var parentContext = this._reactInternalInstance._context;
    var parent = parentContext.scrollingParent;
    parent && parent._registerItem(this);
  },

  componentDidMount: function () {
    this._node = this.getDOMNode();
  },

  componentWillUnmount: function () {
    this._node = null;
    var parentContext = this._reactInternalInstance._context;
    var parent = parentContext.scrollingParent;
    parent && parent._unRegisterItem(this);
  },

  render: function () {
    return (
      React.createElement("div", React.__spread({className: "scrollable-item"},  this.props),
        this.props.children
      )
    );
  },

});

module.exports = ScrollItem;
