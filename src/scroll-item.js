
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

  _scrollTo: function(styleObject) {
    var self = this;
    var tx = styleObject.x || 0;
    var ty = styleObject.y || 0;
    var tz = styleObject.zIndex && styleObject.zIndex/10 || 0;

    // Using replaceState so CSS properties that are not
    // returned but existed on previous states get cleansed
    self.replaceState({
      zIndex: styleObject.zIndex,
      WebkitTransform: 'translate3d('+tx+'px, '+(ty)+'px, '+tz+'px)',
    });
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
