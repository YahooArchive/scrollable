"use strict";

var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var ScrollItem = require('../scroll-item');


describe('ScrollItem', function() {
  var div;
  beforeEach(function() {
    div = document.createElement('div');
    document.body.appendChild(div);
  });
  describe('Dependencies', function() {
    it("Would log warning outside <Scroller>", function () {
      spyOn(console, 'warn');
      TestUtils.renderIntoDocument(
        <ScrollItem name="foo" scrollHandler={function(){}}  />
      );
      expect(console.warn).toHaveBeenCalled();
      expect(console.warn.calls.count()).toEqual(1);
      expect(console.warn.calls.mostRecent().args[0]).toMatch('Scroller');
    });
    // it("implements RectCache", function () {
    //   function MockScrollerConstructor() {
    //     return React.createClass({

    //       childContextTypes: {
    //         scrollingParent: React.PropTypes.object,
    //       },

    //       getChildContext: function() {
    //         return {
    //           scrollingParent: this,
    //         };
    //       },

    //       _registerItem: jasmine.createSpy(),

    //       render: function() {
    //         return (
    //           <div {...this.props}>
    //             {this.props.chidren}
    //           </div>
    //         );
    //       },

    //     });
    //   }
    //   var MockScroller = MockScrollerConstructor();
    //   var wrapper = React.render(
    //     <MockScroller>
    //       <ScrollItem ref="sut" name="foo" scrollHandler={function(){}}>
    //         foo
    //       </ScrollItem>
    //     </MockScroller>,
    //     div
    //   );
    //   // var sut = TestUtils.findRenderedDOMComponentWithClass(wrapper, 'scrollable-item');
    //   console.log(Object.keys(sut));
    //   expect(sut.rect).toEqual({ left : 0, right : 0, top : 0, height : 0, bottom : 0, width : 0 });
    // });
  });
});
