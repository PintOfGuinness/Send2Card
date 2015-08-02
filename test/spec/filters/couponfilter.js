'use strict';

describe('Filter: CouponFilter', function () {

  // load the filter's module
  beforeEach(module('send2CardApp'));

  // initialize a new instance of the filter before each test
  var CouponFilter;
  beforeEach(inject(function ($filter) {
    CouponFilter = $filter('CouponFilter');
  }));

  it('should return the input prefixed with "CouponFilter filter:"', function () {
    var text = 'angularjs';
    expect(CouponFilter(text)).toBe('CouponFilter filter: ' + text);
  });

});
