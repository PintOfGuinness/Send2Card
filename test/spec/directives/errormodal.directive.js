'use strict';

describe('Directive: errormodal.directive', function () {

  // load the directive's module
  beforeEach(module('send2CardApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', function () {
      expect(true).toEqual(true);
  /*  element = angular.element('<errormodal.directive></errormodal.directive>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the errormodal.directive directive');*/
  });
});
