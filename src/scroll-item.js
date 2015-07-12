/* Copyright 2015, Yahoo Inc.
   Designed by Irae Carvalho
   Copyrights licensed under the MIT License.
   See the accompanying LICENSE file for terms. */

var React = (typeof window !== 'undefined' && window.React) || require('react');
var RectCache = require('./rect-cache');
var StyleHelper = require('./style-helper');

var ScrollItem = React.createClass({displayName: "ScrollItem",

  mixins: [RectCache],

  propTypes: {
    name: React.PropTypes.string.isRequired,
    scrollHandler: React.PropTypes.func.isRequired,
    serverStyles: React.PropTypes.func,
  },

  contextTypes: {
    scrollingParent: React.PropTypes.object,
  },

  onResize: function() {
    var parentContext = this._reactInternalInstance._context;
    var parent = parentContext.scrollingParent;
    parent && parent.onResize && parent.onResize();
  },

  componentWillMount: function () {
    var parentContext = this._reactInternalInstance._context;
    var parent = parentContext.scrollingParent;
    if (parent) {
      this._scrollingParent = parent;
      parent._registerItem(this);
    }
  },

  componentDidMount: function () {
    this._node = this.getDOMNode();
    this._prendingOperation && this._prendingOperation();
  },

  componentWillUnmount: function () {
    this._node = null;
    var parentContext = this._reactInternalInstance._context;
    var parent = parentContext.scrollingParent;
    parent && parent._unRegisterItem(this);
  },

  render: function () {
    var ownProps = {className: "scrollable-item"};
    var ssStyles = this.props.serverStyles;
    if (ssStyles) {
      var styleObject;
      try {
        styleObject = ssStyles(this, this._scrollingParent);
      } catch(e) {}
      if (styleObject) {
        styleObject = StyleHelper.scrollStyles(styleObject);
        ownProps.style = styleObject;
      }
    }
    return (
      React.createElement("div", React.__spread(ownProps,  this.props),
        this.props.children
      )
    );
  },

});

module.exports = ScrollItem;
