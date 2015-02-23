
var React = require('react');
var Scroller = require('../../src/scroller');
var ScrollItem = require('../../src/scroll-item');
var Hammer = require('react-hammerjs/dist/react-hammerjs');

var ReminderCartegory = require('./category');


    var categories = [
      {title: "Purple", color: "purple", uid: "2485"},
      {title: "Green",  color: "green",  uid: "0891"},
      {title: "Blue",   color: "blue",   uid: "1248"},
      {title: "Pink",   color: "pink",   uid: "3436"},
      {title: "Brown",  color: "brown",  uid: "2384"},
      {title: "Yellow", color: "yellow", uid: "2394"},
      {title: "Orange", color: "orange", uid: "5330"},
      {title: "Purple", color: "purple", uid: "9023"},
      {title: "Green",  color: "green",  uid: "1284"},
      {title: "Blue",   color: "blue",   uid: "0934"},
      {title: "Pink",   color: "pink",   uid: "1723"},
      {title: "Brown",  color: "brown",  uid: "1483"},
      {title: "Yellow", color: "yellow", uid: "1245"},
      {title: "Orange", color: "orange", uid: "1235"},
    ];
    var category_ordering = ["2485","0891","1248","3436","2384","2394","5330","9023","1284","0934","1723","1483","1245","1235"];
    var stackedSize = 76;
    var spaceAtBottom = 60;
    var friction = 600;


var Reminders = React.createClass({

  getContentSize: function (items, scroller) {
    return {
      width: scroller.rect.width,
      height: stackedSize * categories.length,
    };
  },

  showCategory: function(category, event) {
    event.preventDefault();
    this.refs.scroller.disable();
  },

  render: function () {
    var self = this;
    var scrollingCategories = categories.map(function(category) {
      return (
        <ScrollItem name={"category_"+category.uid}
                    key={category.uid}
                    model={category}
                    scrollHandler={listScroll}>
          <Hammer component={ReminderCartegory} {...category}
                      onTap={self.showCategory.bind(self, category)} />
        </ScrollItem>
      );
    });

    return (
      <div className="reminders">
        <Scroller ref={"scroller"} viewport scrollingX={false} scrollingY={true} getContentSize={this.getContentSize}>
          <ScrollItem name="search" scrollHandler={searchStatic}>
            <div />
          </ScrollItem>
          {scrollingCategories}
        </Scroller>
      </div>
    );
  },

});

/*
Notice: The following functions are outside of the React component.
Read more about why on the minimal example.
*/
function searchStatic() {// fixed
  return {
    y: 0,
    zIndex: 1,
  };
}
function listScroll(x, y, self, items, scroller) {
  var order = category_ordering.indexOf(self.props.model.uid);
  var multiplier = Math.max(1, 1 - ( y / friction)); // stretch effect

  var pos = Math.max(0, order * multiplier * stackedSize - y);
  return {
    height: (scroller.rect.height - spaceAtBottom) + 'px',
    zIndex: 2 + order,
    y: pos,
  };
}

module.exports = Reminders;
