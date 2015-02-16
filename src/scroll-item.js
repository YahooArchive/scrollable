
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

  _scrollTo: function(x, y) {
    var self = this;

    var styleObject = self.props.scrollHandler(x, y);
    var tx = styleObject.x || 0;
    var ty = styleObject.y || 0;

    // Using replaceState so CSS properties that are not
    // returned but existed on previous states get cleansed
    self.replaceState({
      WebkitTransform: 'translate3d('+tx+'px, '+(-ty)+'px, 0)',
    });
  },

  render: function () {
    return (
      <div className="scrollable-item" style={this.state}>
        <p>{this.props.children}</p>
      </div>
    );
  },

});

module.exports = ScrollItem;
