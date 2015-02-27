
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
var transitionTime = 300; // ms

var Reminders = React.createClass({

  getInitialState: function() {
    return {
      mode: 'all',
      selected: null,
    };
  },

  getContentSize: function (items, scroller) {
    if (this.state.mode === 'all') {
      return {
        width: scroller.rect.width,
        height: stackedSize * categories.length,
      };
    } else {
      return {
        width: scroller.rect.width,
        height: items["category_"+this.state.selected].rect.height,
      };
    }
  },

  showCategory: function(category, event) {
    event.preventDefault();
    this.refs.scroller.animateAndResetScroll(0, 0);
    this.setState({
      mode: 'single',
      selected: category.uid,
    });
  },

  showList: function(event) {
    event.preventDefault();
    this.setState({
      mode: 'all',
      selected: null,
    }, function() {
      this.refs.scroller.animateAndResetScroll(0, 0);
    });

  },

  render: function () {
    var self = this;
    var scrollingCategories = categories.map(function(category) {
      var handler = listScroll;
      if (self.state.mode === 'single') {
        handler = self.state.selected === category.uid ? selectedItemHandler : stackedItemHandler;
      }
      return (
        <ScrollItem name={"category_"+category.uid}
                    key={category.uid}
                    model={category}
                    selectedUid={self.state.selected}
                    transitionStyles={transitionStyles}
                    scrollHandler={handler}>
          <Hammer component={ReminderCartegory} {...category}
                      onTap={function(event) {
                        if (self.state.mode === 'all') {
                          self.showCategory(category, event);
                        } else if(self.state.selected !== category.uid) {
                          self.showList(event);
                        }
                      }} />
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

function stackedItemHandler(x, y, self, items, scroller) {
  var order = category_ordering.indexOf(self.props.model.uid);
  var zIndex = 2 + order;
  var selectedIndex = category_ordering.indexOf(self.props.selectedUid);
  if (order >= selectedIndex) {
    order = order - 1;
  }

  var pos = scroller.rect.height + 5; // off screen
  var numStacked = Math.min(5, category_ordering.length-1);
  if (order <= numStacked) {
    pos = scroller.rect.height - spaceAtBottom + 10 + ( (order+1) * (spaceAtBottom-30) / numStacked );
  }

  return {
    height: (scroller.rect.height - spaceAtBottom) + 'px',
    y: pos,
    zIndex: zIndex,
  };
}

function selectedItemHandler(x, y, self, items, scroller) {
  var order = category_ordering.indexOf(self.props.model.uid);
  return {
    zIndex: 2 + order,
    y: -y,
  };
}

function transitionStyles(self, items, scroller) {
  return {
    duration: transitionTime,
    property: '-webkit-transform',
  };
}

module.exports = Reminders;
