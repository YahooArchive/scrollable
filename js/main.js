
var React = require('react');

var container = document.getElementById('container');

var App = React.createClass({

  render: function () {
    return <div>works</div>;
  }

});

React.render(<App />, container);