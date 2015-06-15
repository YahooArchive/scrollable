/* Copyright 2015, Yahoo Inc.
   Copyrights licensed under the MIT License.
   See the accompanying LICENSE file for terms. */
var React = require('react');

var photos = [
  require('./photos/13171992334.json'),
  require('./photos/13384906064.json'),
  require('./photos/5591534161.json'),
  require('./photos/6864967715.json'),
  require('./photos/7854621608.json'),
  require('./photos/8493626388.json'),
];

var PhotoList = React.createClass({
  shouldComponentUpdate: function (nextProps, nextState) {
    return false;
  },
  getInitialState: function() {
    var min = 4, max = 5;
    var howMany = Math.round(Math.random() * (max - min) + min);
    var showIndexes = [];
    for (var i = 0; i < howMany; i++) {
      var tryIndex = Math.round(Math.random() * howMany);
      if (showIndexes.indexOf(tryIndex) === -1) {
        showIndexes.push(tryIndex);
      } else {
        i--;
      }
    }
    return {
      showIndexes: showIndexes
    };
  },
  photos: function() {
    return this.state.showIndexes.map(function(photoIndex) {
      var photo = photos[photoIndex].photo;
      return <li><img src={'photos/'+photo.id+'_'+photo.originalsecret+'_100h@2x.'+photo.originalformat} /></li>;
    });
  },
  render: function() {
    return (
      <ul className="photos">
        {this.photos()}
      </ul>
    );
  }
});

module.exports = PhotoList;
