'use strict';

describe('Directive: myIsolatedScope', function () {

  // load the directive's module
  beforeEach(module('send2CardApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<my-isolated-scope></my-isolated-scope>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the myIsolatedScope directive');
  }));
});
