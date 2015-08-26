'use strict';

describe('Filter: sortCouponFilter', function () {

  // load the filter's module
  beforeEach(module('send2CardApp'));

  // initialize a new instance of the filter before each test
  var sortCouponFilter;
  beforeEach(inject(function ($filter) {
    sortCouponFilter = $filter('sortCouponFilter');
  }));

  it('should return the input prefixed with "sortCouponFilter filter:"', function () {
    var text = 'angularjs';
    expect(sortCouponFilter(text)).toBe('sortCouponFilter filter: ' + text);
  });

});
