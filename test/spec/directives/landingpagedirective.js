'use strict';

describe('Directive: landingPageDirective', function () {

  // load the directive's module
  beforeEach(module('send2CardApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<landing-page-directive></landing-page-directive>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the landingPageDirective directive');
  }));
});
