/* Copyright 2015, Yahoo Inc.
   Copyrights licensed under the MIT License.
   See the accompanying LICENSE file for terms. */

var React = require('react');
var text = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris consectetur lectus sed dolor tempor, a porta odio feugiat. Nam nec lacinia libero. Cras nec lobortis leo. Morbi sit amet mattis mi. Duis tempus malesuada dui at ornare. Nulla nec tincidunt arcu, sit amet tincidunt felis. Aenean consectetur urna ante, a rutrum sem volutpat dapibus. Aenean molestie, massa eget finibus iaculis, diam purus lobortis est, a vestibulum urna mauris ultricies augue. Pellentesque sed nisl vitae risus lobortis accumsan sed lacinia felis. Quisque a ipsum quis felis ullamcorper condimentum. Phasellus ac ligula consectetur, elementum neque in, mollis dui. Nullam et felis vel quam cursus porttitor non in urna. Nulla facilisi. Cras erat risus, euismod quis est vel, placerat pulvinar mauris.',
  'Integer ipsum velit, facilisis sit amet mauris non, finibus rutrum ipsum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec venenatis orci quis risus lacinia semper. Sed vestibulum elementum arcu, feugiat auctor justo lacinia ac. Duis semper id ex a consequat. Praesent ac faucibus leo. Praesent hendrerit sed tortor sit amet vehicula. Praesent lobortis mauris vel viverra luctus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis vulputate, arcu porta fermentum laoreet, orci lorem dignissim diam, in vestibulum urna ante nec ipsum. Ut eleifend aliquet urna, quis luctus est dictum et. Vivamus tristique ligula eget pulvinar dignissim.',
  'Nullam efficitur sit amet purus ac fermentum. Phasellus eu porttitor justo. Proin ante nunc, facilisis sit amet tincidunt sit amet, accumsan a turpis. Aenean velit eros, vehicula vitae consectetur vel, ultrices ut magna. Sed magna leo, varius a mi id, gravida euismod nunc. Nam elementum nisi sem, eget vehicula lacus tincidunt sed. Integer molestie, lectus quis elementum ornare, odio metus feugiat leo, et fringilla tortor libero eleifend elit. Pellentesque dui lorem, mollis nec augue et, imperdiet vehicula lorem. Duis ut porttitor purus. Vivamus augue arcu, dapibus in leo non, semper sodales ante. Phasellus molestie eu diam a interdum. Donec purus sem, efficitur a molestie et, sagittis in ligula.',
  'Cras sollicitudin pretium mauris ut eleifend. Nunc interdum porttitor odio. Vestibulum at nisi ut ligula posuere suscipit iaculis ut felis. Nunc quis orci accumsan, hendrerit justo id, sollicitudin sem. Nulla elementum euismod sapien, non finibus magna. Morbi eget enim ante. Morbi nec finibus risus. Fusce egestas blandit dictum.',
  'Sed fringilla sollicitudin tortor nec viverra. Nam ac egestas nulla. In nec metus nisl. Duis aliquam aliquet mauris lacinia porttitor. Morbi lobortis laoreet justo, ut ullamcorper erat scelerisque eu. Donec hendrerit ex a tellus iaculis pharetra. Ut hendrerit diam non faucibus tristique. Fusce ac sodales sem. Duis sodales id tellus sit amet dapibus.',
  'Nam non accumsan augue, et volutpat justo. Nullam pharetra tellus fermentum hendrerit sodales. Vivamus in tellus purus. Sed in justo ut dui efficitur scelerisque mattis sed ante. In nunc eros, scelerisque quis ipsum ac, lacinia viverra neque. Mauris mollis, nulla nec convallis dictum, urna quam egestas nisl, ac aliquam arcu magna at magna. Sed consequat sem auctor, eleifend sapien et, ultricies metus. Cras hendrerit magna ante, in sollicitudin enim consectetur at. Duis purus mi, cursus eget metus ac, volutpat tempor elit.',
  'Ut in nisl dolor. Maecenas dignissim elementum magna, in gravida sem blandit nec. Donec iaculis lobortis quam, non varius arcu feugiat ac. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed non orci quis massa feugiat placerat ac nec nunc. Fusce ornare interdum luctus. Proin sodales nibh maximus velit tempus faucibus. Morbi finibus ligula vel sollicitudin posuere. Praesent vitae quam viverra, tristique eros quis, tristique augue. Nam porta consequat tempus. Donec imperdiet neque ac ligula interdum, eget sagittis magna efficitur. Pellentesque vitae porta nibh. Aenean vehicula purus ac velit volutpat, et pretium ipsum lobortis.',
  'Sed ultricies metus quis iaculis faucibus. Praesent lacinia, lorem non aliquam egestas, urna elit suscipit mauris, sed consectetur tellus sem quis elit. In ullamcorper varius commodo. Phasellus vel arcu condimentum, viverra diam eu, sagittis felis. Fusce maximus a lorem et dictum. Curabitur tempus tincidunt dolor. Fusce accumsan urna sed viverra eleifend. Aenean in aliquet eros, euismod hendrerit ipsum. Nullam nec lorem enim. Ut auctor, mi vel ullamcorper gravida, nisl lectus iaculis turpis, at egestas arcu mi quis nibh.',
  'Nulla faucibus sit amet dolor a egestas. Integer nec molestie felis. Sed aliquam varius nunc, a varius tellus luctus vel. Aenean eget augue maximus, gravida leo aliquet, sollicitudin mi. Quisque imperdiet vitae felis in elementum. Fusce auctor, urna sit amet scelerisque bibendum, turpis lorem fermentum augue, blandit ornare metus est sit amet libero. Nam diam mauris, consectetur a commodo posuere, elementum eu libero. Phasellus sit amet nisl at elit ullamcorper consequat.',
  'Morbi ac placerat tellus. Duis tortor metus, interdum mollis venenatis sit amet, ultricies non sem. Nullam a accumsan nibh. Curabitur euismod dolor a suscipit gravida. Cras vehicula imperdiet turpis id cursus. Donec tempus tellus vitae ligula consectetur tempor. Maecenas dapibus nibh eget ipsum vestibulum laoreet. Interdum et malesuada fames ac ante ipsum primis in faucibus. Duis at venenatis ligula, quis convallis libero. Fusce suscipit ligula ut ornare dapibus. Duis et erat hendrerit, suscipit ipsum quis, lobortis urna. Nunc congue ac purus et pulvinar. In hac habitasse platea dictumst. Nullam viverra, risus ac sollicitudin accumsan, lectus augue pharetra risus, ut varius tellus metus ut mi. Aliquam ornare nisi quis purus tincidunt porttitor. Maecenas consequat eleifend consectetur.',
];
var Lorem = React.createClass({
  shouldComponentUpdate: function (nextProps, nextState) {
    return false;
  },
  render: function () {
    var numParagraphs = this.props.numParagraphs || 10;
    var paragraphs = [];
    for (var i = 0; i < numParagraphs; i++) {
      paragraphs.push(<p key={i}>{text[i%numParagraphs]}</p>);
    }
    return (
      <div className="lorem">
        {paragraphs}
      </div>
    );
  },

});

module.exports = Lorem;
