
var React = require('react');
var Scroller = require('../../src/scroller');
var ScrollItem = require('../../src/scroll-item');
var Hammer = require('react-hammerjs/dist/react-hammerjs');

var ReminderCartegory = require('./category');
var Data = require('./data');

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
        height: stackedSize * Data.categoryIds.length,
      };
    } else {
      return {
        width: scroller.rect.width,
        height: items["category_"+this.state.selected].rect.height,
      };
    }
  },

  showCategory: function(categoryId, event) {
    event.preventDefault();
    this.setState({
      mode: 'single',
      selected: categoryId,
    }, function() {
      this.refs.scroller.animateAndResetScroll(0, 0);
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
    var scrollingCategories = Data.categoryIds.map(function(categoryId) {
      var handler = listScroll;
      if (self.state.mode === 'single') {
        handler = self.state.selected === categoryId ? selectedItemHandler : stackedItemHandler;
      }
      return (
        <ScrollItem name={"category_"+categoryId}
                    key={categoryId}
                    categoryId={categoryId}
                    transitionStyles={transitionStyles}
                    scrollHandler={handler}>
          <Hammer component={ReminderCartegory}
                  categoryId={categoryId}
                  onTap={function(event) {
                    if (self.state.mode === 'all') {
                      self.showCategory(categoryId, event);
                    } else if(self.state.selected !== categoryId) {
                      self.showList(event);
                    }
                  }} />
        </ScrollItem>
      );
    });

    return (
      <div className="reminders">
        <Scroller viewport scrollingX={false} scrollingY={true}
                  ref={"scroller"} selected={self.state.selected}
                  getContentSize={this.getContentSize}>
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
  var order = Data.categoryIds.indexOf(self.props.categoryId);
  var multiplier = Math.max(1, 1 - ( y / friction)); // stretch effect

  var pos = Math.max(0, order * multiplier * stackedSize - y);
  return {
    height: (scroller.rect.height - spaceAtBottom) + 'px',
    zIndex: 2 + order,
    y: pos,
  };
}

function stackedItemHandler(x, y, self, items, scroller) {
  var order = Data.categoryIds.indexOf(self.props.categoryId);
  var zIndex = 2 + order;
  var selectedIndex = Data.categoryIds.indexOf(scroller.props.selected);
  if (order >= selectedIndex) {
    order = order - 1;
  }

  var pos = scroller.rect.height + 5; // off screen
  var numStacked = Math.min(5, Data.categoryIds.length-1);
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
  var order = Data.categoryIds.indexOf(self.props.categoryId);
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
