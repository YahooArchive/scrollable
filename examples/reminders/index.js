
var React = require('react');
var Scroller = require('../../src/scroller');
var ScrollItem = require('../../src/scroll-item');
var prefixed = require('../../src/prefixed');
var Hammer = require('react-hammerjs/dist/react-hammerjs');
var ReminderCartegory = require('./category');

var Data = require('./data');
var itemSizeDuringListMode = 76;
var spaceAtBottom = 60;

var Reminders = React.createClass({

  getInitialState: function() {
    return {
      mode: 'all',               // mode = 'all'   ; Showing all categories
                                 // mode = 'single'; Showing only selected category
      selected: null,            // during single mode, the selected category id
      previousScrollPosition: 0, // scroll position bookkeeping between modes
    };
  },

  render: function () {
    var self = this;
    var scrollingCategories = Data.categoryIds.map(this.scrollItemForCategoryId);
    return (
      <div className="reminders">
        <Scroller viewport scrollingX={false} scrollingY={true}
                  ref={"scroller"} selected={self.state.selected}
                  getContentSize={this.calculateVerticalScrollArea}
                  name="remindersViewport">
          <ScrollItem name="search" scrollHandler={handleSearchBoxPosition}>
            <div />
          </ScrollItem>
          {scrollingCategories}
        </Scroller>
      </div>
    );
  },

  scrollItemForCategoryId: function(categoryId) {
    var self = this;
    var handler = handlePositionWhenShowingAllCategories;
    if (self.state.mode === 'single') {
      handler = self.state.selected === categoryId ? handlePositionForSelectedItem : handlePositionForStackedItem;
    }
    return (
      <ScrollItem name={"category_"+categoryId}
                  key={categoryId}
                  categoryId={categoryId}
                  transitionStyles={transitionStyles}
                  scrollHandler={handler}
                  style={{
                    height: window.innerHeight - spaceAtBottom,
                  }}>
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
  },

  calculateVerticalScrollArea: function (items, scroller) {
    if (this.state.mode === 'all') {
      return {
        width: scroller.rect.width,
        height: itemSizeDuringListMode * Data.categoryIds.length,
      };
    } else {
      return {
        width: scroller.rect.width,
        height: items["category_"+this.state.selected].rect.height,
      };
    }
  },

  // When listing all categories and user taps on a given category
  showCategory: function(categoryId, event) {
    event.preventDefault();
    this.setState({
      mode: 'single',
      selected: categoryId,
      previousScrollPosition: this.refs.scroller._scroller._scroller.getValues().top,
    }, function() {
      this.refs.scroller.animateAndResetScroll(0, 0);
    });
  },

  // When showing a single category and user taps the stack
  showList: function(event) {
    event.preventDefault();
    this.setState({
      mode: 'all',
      selected: null,
    }, function() {
      this.refs.scroller.animateAndResetScroll(0, this.state.previousScrollPosition);
    });
  },

});

/*
  Notice: It's a Scrollable best practice to use plain functions instead
  of React bound methods. Read more about why on the minimal example.
  */

var friction = 600;
var transitionTime = 300; // ms

function handlePositionWhenShowingAllCategories(x, y, self, items, scroller) {
  var order = Data.categoryIds.indexOf(self.props.categoryId);
  var multiplier = Math.max(1, 1 - ( y / friction)); // stretch effect

  var pos = Math.max(0, order * multiplier * itemSizeDuringListMode - y);
  return {
    zIndex: 2 + order,
    y: pos,
  };
}

function handlePositionForStackedItem(x, y, self, items, scroller) {
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
    y: pos,
    zIndex: zIndex,
  };
}

function handlePositionForSelectedItem(x, y, self, items, scroller) {
  var order = Data.categoryIds.indexOf(self.props.categoryId);
  return {
    zIndex: 2 + order,
    y: -y,
  };
}

function transitionStyles(self, items, scroller) {
  return {
    duration: transitionTime,
    property: prefixed.hyphenated('transform'),
  };
}

function handleSearchBoxPosition() {// fixed
  return {
    y: 0,
    zIndex: 1,
  };
}

module.exports = Reminders;
