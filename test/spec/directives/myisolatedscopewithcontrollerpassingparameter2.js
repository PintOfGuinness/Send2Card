'use strict';

describe('Directive: myIsolatedScopeWithControllerPassingParameter2', function () {

  // load the directive's module
  beforeEach(module('send2CardApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<my-isolated-scope-with-controller-passing-parameter2></my-isolated-scope-with-controller-passing-parameter2>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the myIsolatedScopeWithControllerPassingParameter2 directive');
  }));
});
