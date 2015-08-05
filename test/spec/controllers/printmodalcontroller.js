'use strict';

describe('Controller: PrintmodalcontrollerCtrl', function () {

  // load the controller's module
  beforeEach(module('send2CardApp'));

  var PrintmodalcontrollerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PrintmodalcontrollerCtrl = $controller('PrintmodalcontrollerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
