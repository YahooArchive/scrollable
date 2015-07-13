/* Copyright 2015, Yahoo Inc.
   Copyrights licensed under the MIT License.
   See the accompanying LICENSE file for terms. */
"use strict";

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var StyleHelper = require('../style-helper');
var Scroller = require('../scroller');
var prefixed = require('../prefixed');
var transform = prefixed('transform');


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

  describe("Positioning items", function () {

    it("Set style props based on item scrollHandler", function () {
      var sut = React.render(
        <Scroller>
        </Scroller>,
        div
      );
      var fooItem = {
        props: {
          name: 'foo',
          scrollHandler: function(x, y) {
            return {
              height: x+'px',
            };
          },
        },
        _node: {
          style: {},
        },
      };
      sut._registerItem(fooItem);
      sut.setStyleWithPosition(23,0);
      expect(fooItem._node.style.height).toBe('23px');
    });

    it("Schedule styles when not ready to render", function () {
      var sut = React.render(
        <Scroller>
        </Scroller>,
        div
      );
      var fooItem = {
        props: {
          name: 'foo',
          scrollHandler: function(x, y) {
            return {
              height: x+'px',
            };
          },
        },
      };
      sut._registerItem(fooItem);
      sut.setStyleWithPosition(23,0);
      expect(fooItem._prendingOperation).toBeDefined();
      fooItem._node = {style:{}};
      fooItem._prendingOperation();
      expect(fooItem._node.style.height).toBe('23px');
    });

    it("Uses StyleHelper", function () {
      var sut = React.render(
        <Scroller>
        </Scroller>,
        div
      );
      var theReturn = {
        x: 20,
        y: 13,
        zIndex: 2,
      };
      var fooItem = {
        props: {
          name: 'foo',
          scrollHandler: function(x, y) {
            return JSON.parse(JSON.stringify(theReturn));
          },
        },
        _node: {
          style: {},
        },
      };
      sut._registerItem(fooItem);
      sut.setStyleWithPosition(0,0);
      var theExpected = StyleHelper.scrollStyles(theReturn);
      expect(fooItem._node.style).toEqual(theExpected);
    });

    it("self, items and scroller params passed properly", function () {
      var sut = React.render(
        <Scroller thatCustomProp="13px">
        </Scroller>,
        div
      );
      var fooItem = {
        props: {
          fooProp: "45px",
          name: 'foo',
          scrollHandler: function(x, y, self, items, scroller) {
            return {
              height: scroller.props.thatCustomProp,
              width: self.props.fooProp,
              borderWidth: items.bar.props.barProp,
            };
          },
        },
        _node: {
          style: {},
        },
      };
      var barItem = {
        props: {
          barProp: "0.5px",
          name: 'bar',
          scrollHandler: function(x, y, self, items, scroller) {
            return {
              height: items.foo.props.fooProp,
            };
          },
        },
        _node: {
          style: {},
        },
      };
      sut._registerItem(fooItem);
      sut._registerItem(barItem);
      sut.setStyleWithPosition(0,0);
      expect(fooItem._node.style.height).toBe('13px');
      expect(fooItem._node.style.width).toBe('45px');
      expect(fooItem._node.style.borderWidth).toBe('0.5px');
      expect(barItem._node.style.height).toBe('45px');
    });

    it("ScrollTo, enable and disable APIs", function (done) {
      var sut = React.render(
        <Scroller getContentSize={function(){return {width:20, height:500};}} style={{height:'200px', width:'20px'}}>
        </Scroller>,
        div
      );
      var fooItem = {
        props: {
          name: 'foo',
          scrollHandler: function(x, y) {
            return {
              y: -y,
            };
          },
        },
        _node: {
          style: {},
        },
      };
      sut._registerItem(fooItem);
      setTimeout(function(){ // needed so scroll next tick actually runs
        sut.scrollTo(0,100);
        expect(fooItem._node.style[transform]).toBe('translate3d(0px, -100px, 0px)');
        sut.disable(); // disable will disable event triggering, but not scrollerInstance.scrollTo();
        sut.scrollTo(0,50);
        expect(fooItem._node.style[transform]).toBe('translate3d(0px, -50px, 0px)');
        sut.enable();
        sut.scrollTo(0,150);
        expect(fooItem._node.style[transform]).toBe('translate3d(0px, -150px, 0px)');
        done();
      },20);
    });

  });

});
