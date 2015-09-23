'use strict';

describe('Directive: multiPercentSavingsDirective', function () {

  // load the directive's module
  beforeEach(module('send2CardApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<multi-percent-savings-directive></multi-percent-savings-directive>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the multiPercentSavingsDirective directive');
  }));
});
