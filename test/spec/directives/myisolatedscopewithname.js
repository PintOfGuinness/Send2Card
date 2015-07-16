'use strict';

describe('Directive: myIsolatedScopeWithName', function () {

  // load the directive's module
  beforeEach(module('send2CardApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<my-isolated-scope-with-name></my-isolated-scope-with-name>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the myIsolatedScopeWithName directive');
  }));
});
