/* Copyright 2015, Yahoo Inc.
   Copyrights licensed under the MIT License.
   See the accompanying LICENSE file for terms. */
"use strict";

var RectCache = require('../rect-cache');
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;


describe('RectCache mixin', function() {

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
      expect(sut.rect.width).toBe(200);
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
      sut._updateRectCache();
      sut._updateRectCache();
      sut._updateRectCache();
      expect(resizeCallback.calls.count()).toBe(2);
    });

    it("support arbitrary text and asynchronous image loading", function (done) {
      var resizeCallback = jasmine.createSpy();
      sut = React.render(
        <RectCacheConsumer onResize={resizeCallback} />,
        div
      );
      expect(resizeCallback).toHaveBeenCalled();
      sut.setState({
        showImages: true,
      });

      expect(sut.rect.height>=68);
      expect(sut.rect.width>=200);

      var container = sut.refs.imgHere.getDOMNode();
      var img = document.createElement('img');
      img.addEventListener('load', function() {
        expect(resizeCallback.calls.count()).toBe(3);
        expect(sut.rect.height>=100);
        expect(sut.rect.width>=200);
        done();
      });
      // img has 500px by 268px
      img.src = '/base/src/__tests__/large_file_slow_transfer.gif';
      container.appendChild(img);
    });

    it("won't update after unmount", function () {
      var resizeCallback = jasmine.createSpy();
      sut = React.render(
        <RectCacheConsumer onResize={resizeCallback} />,
        div
      );
      expect(resizeCallback.calls.count()).toBe(1);
      sut.setState({
        showMore: true,
      });
      expect(resizeCallback.calls.count()).toBe(2);
      sut.componentWillUnmount();
      sut.setState({
        showMore: true,
      });
      expect(resizeCallback.calls.count()).toBe(2);
      sut.isMounted = function() {
        return false;
      };
      sut._updateRectCache();
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
        showImages: false,
      };
    },
    render: function () {
      return (
        <div style={{minWidth:'200px', "float": "left", overflow: "hidden"}}>
          <div style={{height:'20px', width:'20px'}} />
          { this.state.showMore &&
            <div style={{height:'20px', width:'20px'}} />
          }
          {
            this.state.showImages &&
            <div>
              <p>me coding</p>
              <p ref="imgHere"></p>
            </div>
          }
        </div>
      );
    },
  });
}
