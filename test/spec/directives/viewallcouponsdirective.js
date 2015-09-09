
'use strict';

describe('Directive: viewAllCouponsDirective', function () {

  // load the directive's module
  beforeEach(module('send2CardApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', function () {
 /*   element = angular.element('<view-all-coupons-directive></view-all-coupons-directive>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the viewAllCouponsDirective directive');*/
  });
});

