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
    cleanupStyles(this);
    this._pendingOperation && this._pendingOperation();
  },

  componentDidUpdate: function() {
    cleanupStyles(this);
  },

  componentWillUnmount: function () {
    this._node = null;
    var parentContext = this._reactInternalInstance._context;
    var parent = parentContext.scrollingParent;
    parent && parent._unRegisterItem(this);
  },

  render: function () {
    var ownProps = {
      className: "scrollable-item",
      style: {},
    };
    try {
      /*
      this._prevStyles is always client-side, after the first rendering values. It might be initialized
      by serverStyles or a race condition could make the first use of _prevStyles to be output of the
      setStyleWithPosition on <Scroller>. If we don't have it yet, it is initialized below, otherwise,
      we just keep it for consistency.
      */
      var ssStyles = this.props.serverStyles;
      this._prevStyles = this._prevStyles || StyleHelper.scrollStyles(ssStyles(this, this._scrollingParent), /* serverTick = */ false);
      ownProps.style = StyleHelper.prefixAll(StyleHelper.scrollStyles(ssStyles(this, this._scrollingParent), /* serverTick = */ true));
    } catch(e) {}
    return (
      React.createElement("div", React.__spread(ownProps,  this.props),
        this.props.children
      )
    );
  },

});

/*
  cleanupStyles
  -------------
  Used for removing all prefixed versions added by server-side rendering.
  There is a lot of edge-cases in browsers with vendor prefixes, so the
  only strategy that works consistently is let React render all prefixed styles
  at all times, then having this cleanup phase that removes all styles, then adds
  back the styles that we should keep.

  Given: <div style="-webkit-transform:FOO;transform:FOO;">
  Known cases:
    * In Chrome <= 42 the example will render the values for -webkit-transform
      even though unprefixed transform is supported. This will cause the runtime
      to use transform while the browser is rendering -webkit-transform.
    * Both Safari and Chrome will remove all combination of prefixes when
      removing a property. So `_node.style.WebkitTransform = null;` will also
      remove `_node.style.transform`.

  We go though all this trouble to make sure we recover from server-side rendering
  without using states. This whole library should not use state in any fashion, for
  the simple reason of not interfering with the consumer application. If we used
  state in any fashion, then it would require every single consumer to fine-tune
  their component for double-step mounting.

*/
function cleanupStyles(item) {
  item._node.removeAttribute('style');
  var props = item._prevStyles;
  if (props) {
    // cannot re-use applyStyles because should not check _prevStyles
    for(var prop in props) {
      item._node.style[prop] = props[prop];
    }
  }
}

module.exports = ScrollItem;
