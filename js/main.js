

var container = document.getElementById('container');
var React = require('react');

var Scroller = require('./scroller');
var ScrollItem = require('./scroll-item');

var App = React.createClass({

  render: function () {
    return (
      <Scroller>
        <ScrollItem>Text from item children</ScrollItem>
      </Scroller>
    );
  }

});

React.render(<App />, container);
