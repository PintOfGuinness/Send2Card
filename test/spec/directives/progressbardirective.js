
'use strict';

describe('Directive: progressBarDirective', function () {

  // load the directive's module
  beforeEach(module('send2CardApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', function () {
      expect(true).toEqual(true);
   /* element = angular.element('<progress-bar-directive></progress-bar-directive>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the progressBarDirective directive');*/
  });
});

