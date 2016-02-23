/* Copyright 2015, Yahoo Inc.
   Copyrights licensed under the MIT License.
   See the accompanying LICENSE file for terms. */
"use strict";

var React = require('react');
var ReactDOM = require('react-dom');
var TestUtils = require('react-addons-test-utils');
var ScrollItem = require('../scroll-item');
var StyleHelper = require('../style-helper');
var ReactDOMServer = require('react-dom/server');

describe('<ScrollItem>', function() {
  var div;
  beforeEach(function() {
    div = document.createElement('div');
    document.body.appendChild(div);
  });

  describe('startup', function() {

    it("required props", function () {
      spyOn(console, 'error');
      TestUtils.renderIntoDocument(
        <ScrollItem serverStyles={true} />
      );
      expect(console.error).toHaveBeenCalled();
      expect(console.error.calls.count()).toEqual(3);
      expect(console.error.calls.argsFor(0)).toMatch('was not specified');
      expect(console.error.calls.argsFor(1)).toMatch('was not specified');
      expect(console.error.calls.argsFor(2)).toMatch('expected `function`');
    });

    it("Won't throw outside <Scroller>", function () {
      function go() {
        TestUtils.renderIntoDocument(
          <ScrollItem name="foo" scrollHandler={function(){}}  />
        );
      }
      expect(go).not.toThrow();
    });

    it("implements RectCache mixin", function () {
      var Scroller = MockScroller();
      var wrapper = ReactDOM.render(
        <Scroller>
          <style>{".scrollable-item {float:left;} /* this will force it not to have width: auto; */ "}</style>
          <ScrollItem name="foo" scrollHandler={function(){}}>
            <div style={{width:200,height:200}} />
          </ScrollItem>
        </Scroller>,
        div
      );
      var sut = TestUtils.findRenderedComponentWithType(wrapper, ScrollItem);
      expect(sut.rect.height).toEqual(200);
      expect(sut.rect.width).toEqual(200);
    });

  });

  describe('Server-side rendering', function() {

    it("Render styles from serverStyles prop", function () {
      var Scroller = MockScroller();
      var wrapper = ReactDOM.render(
        <Scroller>
          <ScrollItem name="foo" scrollHandler={function(){}} serverStyles={function(){
            return {
              height: '50px',
            };
          }}>
            foo
          </ScrollItem>
        </Scroller>,
        div
      );
      var sut = TestUtils.findRenderedDOMComponentWithClass(wrapper, 'scrollable-item');
      var sutDOM = ReactDOM.findDOMNode(sut);
      expect(sutDOM.style.height).toBe('50px');
    });

    it("serverStyles have all prefixes", function () {
      var Scroller = MockScroller();
      var finalString = ReactDOMServer.renderToString(
        <Scroller>
          <ScrollItem name="foo" scrollHandler={function(){}} serverStyles={function(){
            return {
              y: 10,
            };
          }}>
            foo
          </ScrollItem>
        </Scroller>,
        div
      );
      expect(finalString).toContain('transform:translate3d(0px, 10px, 0px);-webkit-transform:translate3d(0px, 10px, 0px);-moz-transform:translate3d(0px, 10px, 0px);-o-transform:translate3d(0px, 10px, 0px);-ms-transform:translate3d(0px, 10px, 0px);');
    });

    it("Won't throw if serverStyles returns false", function () {
      var Scroller = MockScroller();
      function go() {
        ReactDOM.render(
          <Scroller>
            <ScrollItem name="foo" scrollHandler={function(){}} serverStyles={function(){
              return false;
            }}>
              foo
            </ScrollItem>
          </Scroller>,
          div
        );
      }
      expect(go).not.toThrow();
    });

    it("Won't throw if serverStyles is not a function", function () {
      var Scroller = MockScroller();
      function go() {
        ReactDOM.render(
          <Scroller>
            <ScrollItem name="foo" scrollHandler={function(){}} serverStyles={true}>
              foo
            </ScrollItem>
          </Scroller>,
          div
        );
      }
      expect(go).not.toThrow();
    });

    it("cleanup serverStyles after componentDidMount", function (done) {
      var Scroller = MockScroller();
      var wrapper = ReactDOM.render(
        <Scroller>
          <ScrollItem name="foo" scrollHandler={function(){
            return {y:10};
          }} serverStyles={function(){
            return {
              y: 10,
            };
          }}>
            foo
          </ScrollItem>
        </Scroller>,
        div
      );
      var sut = TestUtils.findRenderedDOMComponentWithClass(wrapper, 'scrollable-item');
      var node = ReactDOM.findDOMNode(sut);
      var clientStyles = StyleHelper.scrollStyles({y:10});
      setTimeout(function(){
        for(var prop in clientStyles) {
          expect(node.style[prop]).toEqual(clientStyles[prop]);
        }
        expect(node.getAttribute('style')).toEqual(node.style.cssText); // this fails if there is prefixes leftovers
        done();
      },1);
    });

    it("cleanup serverStyles honors 'style' React Prop", function (done) {
      var Scroller = MockScroller();
      var wrapper = ReactDOM.render(
        <Scroller>
          <ScrollItem name="foo" scrollHandler={function(){
            return {y:10};
          }} serverStyles={function(){
            return {
              y: 10,
            };
          }}
          style={{
            height: 10
          }}>
            foo
          </ScrollItem>
        </Scroller>,
        div
      );
      var sut = TestUtils.findRenderedDOMComponentWithClass(wrapper, 'scrollable-item');
      var node = ReactDOM.findDOMNode(sut);
      var clientStyles = StyleHelper.scrollStyles({y:10});
      setTimeout(function(){
        for(var prop in clientStyles) {
          expect(node.style[prop]).toEqual(clientStyles[prop]);
        }
        expect(node.style.height).toEqual('10px');
        done();
      },1);
    });

    it("cleanup serverStyles after componentDidUpdate", function (done) {
      var Scroller = MockScroller();
      function positions10() {return {y:10};}
      function positions20() {return {y:20};}
      var SuposedConsumer = React.createClass({
        getInitialState: function() {return {changePositions:false};},
        render: function() {
          var handler = this.state.changePositions ? positions20 : positions10;
          return (
            <Scroller ref="wrapper">
              <ScrollItem name="foo" scrollHandler={handler} serverStyles={handler}>
                foo
              </ScrollItem>
            </Scroller>
          );
        },
      });

      var consumer = ReactDOM.render(
        <SuposedConsumer />,
        div
      );

      var sut = TestUtils.findRenderedComponentWithType(consumer, ScrollItem);
      var node = ReactDOM.findDOMNode(sut);

      // update state
      var clientStyles = StyleHelper.scrollStyles({y:20});
      sut._prevStyles = clientStyles; // this would be done by <Scroller>
      consumer.setState({changePositions: true}, function() {
        setTimeout(function(){
          for(var prop in clientStyles) {
            expect(node.style[prop]).toEqual(clientStyles[prop]);
          }
          expect(node.getAttribute('style')).toEqual(node.style.cssText);
          done();
          done();
        },300);
      });

    });


  });

  describe('integration with <Scroller>', function() {

    it("register against scrollingParent", function () {
      var Scroller = MockScroller();
      var wrapper = ReactDOM.render(
        <Scroller>
          <ScrollItem name="foo" scrollHandler={function(){}}>
            foo
          </ScrollItem>
        </Scroller>,
        div
      );
      var sut = TestUtils.findRenderedComponentWithType(wrapper, ScrollItem);
      var _registerItemSpy = wrapper._registerItem.__reactBoundMethod;
      expect(_registerItemSpy).toHaveBeenCalled();
      expect(_registerItemSpy.calls.mostRecent().args[0]).toEqual(sut);
    });

    it("unregister from scrollingParent when unmounted", function () {
      var Scroller = MockScroller();
      var SuposedConsumer = React.createClass({
        getInitialState: function() {return {remove:false};},
        render: function() {
          return (
            <Scroller ref="wrapper">
              { !this.state.remove &&
                <ScrollItem name="foo" scrollHandler={function(){}} />
              }
            </Scroller>
          );
        },
      });

      var consumer = ReactDOM.render(
        <SuposedConsumer />,
        div
      );
      // store instance before it's removed
      var sut = TestUtils.findRenderedComponentWithType(consumer, ScrollItem);
      // force instance to be unMounted
      consumer.setState({remove: true});
      // all good
      var _unRegisterItemSpy = consumer.refs.wrapper._unRegisterItem.__reactBoundMethod;
      expect(_unRegisterItemSpy).toHaveBeenCalled();
      expect(_unRegisterItemSpy.calls.mostRecent().args[0]).toEqual(sut);
    });

    it("cache and cleanup _node for scrollingParent use", function () {
      var Scroller = MockScroller();
      var SuposedConsumer = React.createClass({
        getInitialState: function() {return {remove:false};},
        render: function() {
          return (
            <Scroller ref="wrapper">
              { !this.state.remove &&
                <ScrollItem name="foo" scrollHandler={function(){}} />
              }
            </Scroller>
          );
        },
      });

      var consumer = ReactDOM.render(
        <SuposedConsumer />,
        div
      );
      var sut = TestUtils.findRenderedComponentWithType(consumer, ScrollItem);
      expect(sut._node).toEqual(ReactDOM.findDOMNode(sut));

      consumer.setState({remove: true});

      expect(sut._node).toBe(null);
    });

    it("execute _pendingOperation that the parent might have setup", function () {
      var Scroller = MockScroller();
      var SuposedConsumer = React.createClass({
        componentDidMount: function() {
          this.refs.item._pendingOperation = function(){};
        },
        render: function() {
          return (
            <Scroller>
              <ScrollItem ref="item" name="foo" scrollHandler={function(){}} />
            </Scroller>
          );
        },
      });

      var consumer = ReactDOM.render(
        <SuposedConsumer />,
        div
      );
      var sut = TestUtils.findRenderedComponentWithType(consumer, ScrollItem);
      spyOn(sut, '_pendingOperation');
      sut.componentDidMount();
      expect(sut._pendingOperation).toHaveBeenCalled();

    });

    it("Calls parent onResize method if item resizes", function () {
      var Scroller = MockScroller();
      var SuposedConsumer = React.createClass({
        getInitialState: function() {return {resizeItem:false};},
        render: function() {
          return (
            <Scroller ref="wrapper">
              <ScrollItem name="foo" scrollHandler={function(){}}>
                <div style={{height:'20px', width:'20px'}} />
                { this.state.resizeItem &&
                  <div style={{height:'20px', width:'20px'}} />
                }
              </ScrollItem>
            </Scroller>
          );
        },
      });

      var consumer = ReactDOM.render(
        <SuposedConsumer />,
        div
      );
      var parent = TestUtils.findRenderedComponentWithType(consumer, Scroller);
      parent.onResize = function () {};
      spyOn(parent, 'onResize');

      consumer.setState({resizeItem: true});

      expect(parent.onResize).toHaveBeenCalled();
    });

  });

});

function MockScroller(preventSpy) {
  if (!preventSpy) {
    spyOn(console, 'warn'); // silence further warnings
  }
  return React.createClass({

    childContextTypes: {
      scrollingParent: React.PropTypes.object,
    },

    getChildContext: function() {
      return {
        scrollingParent: this,
      };
    },

    _registerItem: jasmine.createSpy(),
    _unRegisterItem: jasmine.createSpy(),

    render: function() {
      return (
        <div {...this.props}>
          {this.props.children}
        </div>
      );
    },

  });
}

