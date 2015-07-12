/* Copyright 2015, Yahoo Inc.
   Copyrights licensed under the MIT License.
   See the accompanying LICENSE file for terms. */
"use strict";

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var Scroller = require('../scroller');


describe('<Scroller>', function() {
  var div;
  beforeEach(function() {
    div = document.createElement('div');
    document.body.appendChild(div);
  });

  describe('startup', function() {

    it("required props", function () {
      spyOn(console, 'warn');
      TestUtils.renderIntoDocument(
        <Scroller serverStyles={true} />
      );
      expect(console.warn).toHaveBeenCalled();
      expect(console.warn.calls.count()).toEqual(3);
      expect(console.warn.calls.argsFor(0)).toMatch('was not specified');
      expect(console.warn.calls.argsFor(1)).toMatch('was not specified');
      expect(console.warn.calls.argsFor(2)).toMatch('was not specified');
    });

    it("implements RectCache mixin", function () {
      var wrapper = React.render(
        <Scroller>
          <style>{".scrollable {float:left;} /* this will force it not to have width: auto; */ "}</style>
          <div style={{width:'100px',height:'200px'}} />
        </Scroller>,
        div
      );
      var sut = TestUtils.findRenderedComponentWithType(wrapper, Scroller);
      expect(sut.rect.height).toEqual(200);
      expect(sut.rect.width).toEqual(100);
    });

    it("_resetScroll after mounting nextTick", function (done) {
      var sut = React.render(
        <Scroller>
        </Scroller>,
        div
      );
      sut._resetScroll = done;
    });

    it("_resetScroll after mounting nextTick (cover edge case)", function (done) {
      var sut = React.render(
        <Scroller>
        </Scroller>,
        div
      );
      sut.isMounted = function() {
        setTimeout(done, 1); // needed to not stop and properly cover
        return false;
      };
    });

  });

  describe("Register and unregister <ScrollItem>s", function(){

    it("register and unregister items", function () {
      var sut = React.render(
        <Scroller>
        </Scroller>,
        div
      );
      var simpleItem = {
        props: {
          name: 'simple',
          scrollHandler: function(){},
        },
      };
      sut._registerItem(simpleItem);
      expect(sut._scrollItems).toEqual({'simple':simpleItem});
      sut._unRegisterItem(simpleItem);
      expect(sut._scrollItems).toEqual({});
    });

    it("warnings about bad register and unregister", function () {
      var sut = React.render(
        <Scroller>
        </Scroller>,
        div
      );
      var simpleItem = {
        props: {
          name: 'simple',
          scrollHandler: function(){},
        },
      };
      var wrongItem = {
        props: {
          name: 'simple',
          scrollHandler: function(){},
        },
      };
      spyOn(console, 'warn');
      sut._registerItem(simpleItem);
      sut._registerItem(simpleItem);
      sut._unRegisterItem(wrongItem);
      expect(console.warn.calls.argsFor(0)).toMatch('duplicated ScrollItem');
      expect(console.warn.calls.argsFor(1)).toMatch('invalid ScrollItem');
    });

  });

});
