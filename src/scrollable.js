
var Scrollable = {
  Scroller: require('./scroller'),
  ScrollItem: require('./scroll-item'),
};

if (typeof window !== 'undefined' && window.React) {
  window.Scrollable = Scrollable;
}

module.export = Scrollable;
