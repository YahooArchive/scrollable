var React = require('react');
window.React = React;

var container = document.getElementById('container');


var MinimalScroller = require('./minimal');
var ComsumptionMode = require('./consumption');
var FancyHeader = require('./fancy-header');
var Reminders = require('./reminders');

var App = React.createClass({

  getInitialState: function () {
    // intentionally get window.history.state, as this is also
    // available during reload.
    // this way it's possible to reload during development.
    var startWith = window.history.state || (document.location.hash+'').replace(/^#/,'') || 'nav';
    return {
      currentExample: startWith,
    };
  },

  switchExample: function(example, event) {
    if(event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (example !== this.state.currentExample) {
      this.setState({
        currentExample: example,
      });
      var url = (document.location.href+'').replace(/#.*$/,'') + '#' + example;
      window.history.pushState(example, '', url);
    }
  },

  componentDidMount: function () {
    var self = this;
    var url = (document.location.href+'').replace(/#.*$/,'') + '#' + self.state.currentExample;
    window.history.replaceState(self.state.currentExample, '', url);
    window.addEventListener('popstate', function(event) {
      if(event.state && event.state !== self.state.currentExample) {
        self.setState({
          currentExample: event.state,
        });
      }
    });
  },

  render: function () {
    var self = this;
    var render = self.state.currentExample;

    if (render === 'nav') {
      var examples = [
        { name:        'minimal',
          description: "minimal/ - the most minimalist example"},
        { name:        'consumption',
          description: "consumption/ - top and bottom bar consumption mode"},
        { name:        'fancy-header',
          description: "fancy-header/ - fading and parallax transitions based on scroll"},
        { name:        'reminders',
          description: "reminders/ - just like Apple's Reminders App"},
      ];

      var navList = examples.map(function(example) {
        var name = example.name;
        var click = self.switchExample.bind(self, example.name);
        return (
          <li key={'nav-'+name}>
            <a href={"#"+name} onClick={click}>
              {example.description}
            </a>
          </li>
        );
      });
    }

    return (
      <div>

        { render === 'minimal'      && <MinimalScroller /> }
        { render === 'consumption'  && <ComsumptionMode /> }
        { render === 'fancy-header' && <FancyHeader /> }
        { render === 'reminders'    && <Reminders /> }

        { render === 'nav' &&
          <div style={{padding: '10px', fontSize: '12px'}}>
            <h4>Choose a scroll example:</h4>
            <ul style={{paddingLeft: '15px'}}>
              {navList}
            </ul>
            <br/><br/>
            <p>There is no navigation on the examples themselves.</p>
            <p>{"Remember to hit back when you're done."}</p>
          </div>
        }

      </div>
    );
  }

});

React.render(<App />, container);
