
var React = require('react');
var Scroller = require('../../src/scroller');
var ScrollItem = require('../../src/scroll-item');

var ReminderCartegory = require('./category');


    var categories = [
      {title: "Purple", color: "purple", uuid: "2485", order: 0},
      {title: "Green",  color: "green",  uuid: "0891", order: 1},
      {title: "Blue",   color: "blue",   uuid: "1248", order: 2},
      {title: "Pink",   color: "pink",   uuid: "3436", order: 3},
      {title: "Brown",  color: "brown",  uuid: "2384", order: 4},
      {title: "Yellow", color: "yellow", uuid: "2394", order: 5},
      {title: "Orange", color: "orange", uuid: "5330", order: 6},
      {title: "Purple", color: "purple", uuid: "9023", order: 7},
      {title: "Green",  color: "green",  uuid: "1284", order: 8},
      {title: "Blue",   color: "blue",   uuid: "0934", order: 9},
      {title: "Pink",   color: "pink",   uuid: "1723", order: 10},
      {title: "Brown",  color: "brown",  uuid: "1483", order: 11},
      {title: "Yellow", color: "yellow", uuid: "1245", order: 12},
      {title: "Orange", color: "orange", uuid: "1235", order: 13},
    ];
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

  render: function () {
    var scrollingCategories = categories.map(function(category) {
      return (
        <ScrollItem name={"category_"+category.uuid} key={category.uuid} scrollHandler={categoryScroll} model={category}>
          <ReminderCartegory order={category.order} title={category.title} color={category.color} />
        </ScrollItem>
      );
    });

    return (
      <div className="reminders">
        <Scroller viewport scrollingX={false} scrollingY={true} getContentSize={this.getContentSize}>
          <ScrollItem name="search" scrollHandler={searchStatic}>
            <div />
          </ScrollItem>
          {scrollingCategories}
        </Scroller>
      </div>
    );
  }

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
function categoryScroll(x, y, self, items, scroller) {
  var order = self.props.model.order;
  var multiplier = Math.max(1, 1 - ( y / friction)); // stretch effect

  var pos = Math.max(0, order * multiplier * stackedSize - y);
  return {
    height: (scroller.rect.height - spaceAtBottom) + 'px',
    zIndex: 2 + order,
    y: pos,
  };
}

module.exports = Reminders;
