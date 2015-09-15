'use strict';

describe('Filter: couponTitleFilter', function () {

  // load the filter's module
  beforeEach(module('send2CardApp'));

  // initialize a new instance of the filter before each test
  var couponTitleFilter;
  beforeEach(inject(function ($filter) {
    couponTitleFilter = $filter('couponTitleFilter');
  }));

  it('should return the input prefixed with "couponTitleFilter filter:"', function () {
    var text = 'angularjs';
    expect(couponTitleFilter(text)).toBe('couponTitleFilter filter: ' + text);
  });

});
