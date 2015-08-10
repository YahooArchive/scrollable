/* Copyright 2015, Yahoo Inc.
   Copyrights licensed under the MIT License.
   See the accompanying LICENSE file for terms. */
"use strict";

var StyleHelper = require('../style-helper');
var prefixed = require('../prefixed');

describe('StyleHelper', function() {

  describe('scrollStyles', function() {

    it("transform based on x, y", function () {
      var sut = StyleHelper.scrollStyles({
        x: 12,
        y: 14,
      });
      var expectation = {};
      expectation[prefixed('transform')] = 'translate3d(12px, 14px, 0px)';
      expect(sut).toEqual(expectation);
    });

    it("scale outside of transform", function () {
      var sut = StyleHelper.scrollStyles({
        scale: 1.2,
      });
      var expectation = {};
      expectation[prefixed('transform')] = 'translate3d(0px, 0px, 0px) scale(1.2)';
      expect(sut).toEqual(expectation);
    });

    it("zIndex hack for transform", function () {
      var sut = StyleHelper.scrollStyles({
        zIndex: 1,
      });
      var expectation = {
        zIndex:1,
      };
      expectation[prefixed('transform')] = 'translate3d(0px, 0px, 0.1px)';
      expect(sut).toEqual(expectation);
    });

  });
  describe('prefixAll', function() {

    it("returns object with all transform properties prefixed", function () {
      var sut = StyleHelper.prefixAll({
        transform: 'myValue',
      });
      var expectation = { transform: 'myValue', WebkitTransform: 'myValue', MozTransform: 'myValue', OTransform: 'myValue', msTransform: 'myValue'};
      expect(sut).toEqual(expectation);
    });

    it("returns same property for other prefixed props", function () {
      var sut = StyleHelper.prefixAll({
        zIndex: 1,
      });
      var expectation = { zIndex: 1 };
      expect(sut).toEqual(expectation);
    });

    it("Mixed properties also compile correctly", function () {
      var sut = StyleHelper.prefixAll({
        zIndex: 1,
        transform: 'myValue',
      });
      var expectation = { zIndex: 1 , transform: 'myValue', WebkitTransform: 'myValue', MozTransform: 'myValue', OTransform: 'myValue', msTransform: 'myValue'};
      expect(sut).toEqual(expectation);
    });

  });
});


