
var React = require('react');

var ScrollItem = React.createClass({

  contextTypes: {
    scrollingParent: React.PropTypes.object,
  },

  render: function () {
    return (
      <div>
        <p>{this._reactInternalInstance._context.scrollingParent.parentText()}</p>
        <p>{this.props.children}</p>
      </div>
    );
  }

});

module.exports = ScrollItem;
