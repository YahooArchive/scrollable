var React = require('react');
var RectCache = require('./rect-cache');

var ZingaScroller = require('../vendor/zynga.scroller.js');

var Scroller = React.createClass({
  mixins: [RectCache],

  childContextTypes: {
    scrollingParent: React.PropTypes.object,
  },

  getChildContext: function(){
    return {
      scrollingParent: this,
    };
  },

  registerItem: function(scrollableItem) {
    console.log(scrollableItem);
  },

  componentDidMount: function () {
    new ZingaScroller(function() {}, {
      // params
    });
  },

  render: function () {
    var className = 'scrollable';
    if (this.props.hasOwnProperty('viewport')) {
      className += '-viewport';
    }
    return (
      <div className={className}>
        {this.props.children}
      </div>
    );
  }

});

module.exports = Scroller;
