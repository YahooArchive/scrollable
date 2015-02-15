
var React = require('react');

var Scroller = React.createClass({

  childContextTypes: {
    scrollingParent: React.PropTypes.object,
  },

  getChildContext: function(){
    return {
      scrollingParent: this,
    };
  },

  parentText: function() {
    return 'Text from parent method';
  },

  render: function () {
    return (
      <div>{this.props.children}</div>
    );
  }

});

module.exports = Scroller;
