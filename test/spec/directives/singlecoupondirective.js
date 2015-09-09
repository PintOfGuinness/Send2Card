'use strict';

describe('Directive: SingleCouponDirective', function () {

  it('should make hidden element visible', inject(function ($compile, $templateCache) {
      
   /* expect(true).toEqual(true);
element = angular.element('<single-coupon-directive></single-coupon-directive>');
    element = $compile(element)(scope);
       scope.$digest();*/
  }));
    
    
  beforeEach(module('send2CardApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope, $compile, $templateCache) {
    scope = $rootScope.$new();
    $templateCache.put('views/singleCoupon.html', 'Template1');
   /* element = angular.element('<single-coupon-directive></single-coupon-directive>');
    element = $compile(element)(scope);*/
/*    scope.$digest();*/
  }));
});
