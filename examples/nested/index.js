/* Copyright 2015, Yahoo Inc.
   Copyrights licensed under the MIT License.
   See the accompanying LICENSE file for terms. */

var React = require('react');
var Scroller = require('../../src/scroller');
var ScrollItem = require('../../src/scroll-item');

var PhotoList = require('../photos');
var PatternsList = require('../patterns');

var Lorem = require('../lorem');

var NestedScrollers = React.createClass({

  getInitialState: function() {
    return {
      display: 'photos',
    };
  },

  getContentSize: function (items, scroller) {
    return items.content.rect;
  },

  toggle: function() {
    this.setState({
      display: 'photos' === this.state.display ? 'patterns' : 'photos',
    });
  },

  render: function () {
    return (
      <Scroller viewport scrollingX={false} scrollingY={true} getContentSize={this.getContentSize}>
        <ScrollItem name="content" scrollHandler={verticalHandler} exampleProp={"for scroll calculation"}>

          <Lorem numParagraphs={1} />

          <Scroller className={'nested-scroll'} scrollingX={true} scrollingY={false} getContentSize={this.getContentSize}>
            <ScrollItem name="content" scrollHandler={horizontalHandler}>
              { 'photos' === this.state.display &&
                <PhotoList />
              }
              { 'patterns' === this.state.display &&
                <PatternsList />
              }
            </ScrollItem>
          </Scroller>

          <Lorem numParagraphs={1} />

          <Scroller className={'nested-scroll'} scrollingX={true} scrollingY={false} getContentSize={this.getContentSize}>
            <ScrollItem name="content" scrollHandler={horizontalHandler}>
              { 'photos' === this.state.display &&
                <PhotoList />
              }
              { 'patterns' === this.state.display &&
                <PatternsList />
              }
            </ScrollItem>
          </Scroller>

          <button onClick={this.toggle}>Toggle between photos and CSS3 patterns</button>

          <Lorem numParagraphs={2} />

        </ScrollItem>
      </Scroller>
    );
  }

});

/*
  Notice: It's a Scrollable best practice to use plain functions instead
  of React bound methods. Read more about why on the minimal example.
  */

function verticalHandler(x, y) {
  return {
    zIndex:1,
    y: -y,
  };
}

function horizontalHandler(x, y) {
  return {
    zIndex:2,
    x: -x,
  };
}

module.exports = NestedScrollers;

