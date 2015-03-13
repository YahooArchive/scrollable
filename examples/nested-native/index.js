
var React = require('react');

var PatternsList = require('../patterns');
var Lorem = require('../lorem');

var NestedNative = React.createClass({
  render: function () {
    return (
      <div className="nested-native-viewport">
        <div className="nested-native-viewport-scroll">

          <Lorem numParagraphs={1} />

          <div className="nested-native-inner">
            <div className="nested-native-inner-scroll">
              <PatternsList />
            </div>
          </div>

          <Lorem numParagraphs={1} />

          <div className="nested-native-inner">
            <div className="nested-native-inner-scroll">
              <PatternsList />
            </div>
          </div>

          <Lorem numParagraphs={2} />

        </div>
      </div>
    );
  }

});

module.exports = NestedNative;
