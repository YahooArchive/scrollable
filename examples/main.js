var React = require('react');
window.React = React; // for React debugger

var container = document.getElementById('container');
var Scroller = require('../src/scroller');
var ScrollItem = require('../src/scroll-item');

var App = React.createClass({

  render: function () {
    return (
      <Scroller viewport>
        <ScrollItem>
          <p>First scroll-item</p>
        </ScrollItem>
      </Scroller>
    );
  }

});

React.render(<App />, container);
