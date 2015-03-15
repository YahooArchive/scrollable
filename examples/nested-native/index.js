
var React = require('react');

var PhotoList = require('../photos');
var PatternsList = require('../patterns');
var Lorem = require('../lorem');

var NestedNative = React.createClass({
  getInitialState: function() {
    return {
      display: 'photos',
    };
  },
  toggle: function() {
    this.setState({
      display: 'photos' === this.state.display ? 'patterns' : 'photos',
    });
  },
  render: function () {
    return (
      <div className="nested-native-viewport">
        <div className="nested-native-viewport-scroll">

          <Lorem numParagraphs={1} />

          <div className="nested-native-inner">
            <div className="nested-native-inner-scroll">
              { 'photos' === this.state.display &&
                <PhotoList />
              }
              { 'patterns' === this.state.display &&
                <PatternsList />
              }
            </div>
          </div>

          <Lorem numParagraphs={1} />

          <div className="nested-native-inner">
            <div className="nested-native-inner-scroll">
              { 'photos' === this.state.display &&
                <PhotoList />
              }
              { 'patterns' === this.state.display &&
                <PatternsList />
              }
            </div>
          </div>

          <button onClick={this.toggle}>Toggle between photos and CSS3 patterns</button>

          <Lorem numParagraphs={2} />

        </div>
      </div>
    );
  }

});

module.exports = NestedNative;
