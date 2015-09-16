'use strict';

describe('Filter: categoriseCouponsFilter', function () {

  // load the filter's module
  beforeEach(module('send2CardApp'));

  // initialize a new instance of the filter before each test
  var categoriseCouponsFilter;
  beforeEach(inject(function ($filter) {
    categoriseCouponsFilter = $filter('categoriseCouponsFilter');
  }));

  it('should return the input prefixed with "categoriseCouponsFilter filter:"', function () {
    var text = 'angularjs';
    expect(categoriseCouponsFilter(text)).toBe('categoriseCouponsFilter filter: ' + text);
  });

});
