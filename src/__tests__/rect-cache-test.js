"use strict";

var RectCache = require('../rect-cache');
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;


describe('RectCache', function() {

  describe("startup",function() {
    it("rect exists even before componentDidMount", function () {
      // spyOn effectively will prevent the real componentDidMount to run
      spyOn(RectCache, 'componentDidMount');
      var RectCacheConsumer = createConstructor();
      var sut = TestUtils.renderIntoDocument(
        <RectCacheConsumer />
      );
      expect(sut.rect).toEqual({ left : 0, right : 0, top : 0, height : 0, bottom : 0, width : 0 });
    });
  });

  describe("rect transformations", function () {
    var div, sut, RectCacheConsumer;
    beforeEach(function() {
      div = document.createElement('div');
      document.body.appendChild(div);

      RectCacheConsumer = createConstructor();
    });
    afterEach(function() {
      document.body.removeChild(div);
    });

    it("updated rect after mounting", function () {
      sut = React.render(
        <RectCacheConsumer />,
        div
      );
      expect(sut.rect).not.toBeNull();
      expect(sut.rect.height).toBe(20);
      expect(sut.rect.width).toBe(20);
    });

    it("updated rect after DOM changes", function () {
      sut = React.render(
        <RectCacheConsumer />,
        div
      );
      expect(sut.rect.height).toBe(20);
      sut.setState({
        showMore: true,
      });
      expect(sut.rect.height).toBe(40);
    });

    it("support for onResize callback when size changes", function () {
      var resizeCallback = jasmine.createSpy();
      sut = React.render(
        <RectCacheConsumer onResize={resizeCallback} />,
        div
      );
      expect(resizeCallback).toHaveBeenCalled();
      sut.setState({
        showMore: true,
      });
      expect(resizeCallback.calls.count()).toBe(2);
    });

  });
});

// We need the constructor to be created on demand
// So we can patch some methods to test others
// specially the initialization
function createConstructor() {
  return React.createClass({
    mixins: [RectCache],
    getInitialState: function() {
      return {
        showMore: false,
      };
    },
    render: function () {
      return (
        <div style={{width:'20px;'}}>
          <div style={{height:'20px', width:'20px'}} />
          { this.state.showMore &&
            <div style={{height:'20px', width:'20px'}} />
          }
        </div>
      );
    },
  });
}
