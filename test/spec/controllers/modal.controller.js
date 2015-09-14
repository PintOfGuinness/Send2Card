'use strict';

describe('Controller: ErrormodalControllerCtrl', function () {

  // load the controller's module
  beforeEach(module('send2CardApp'));

  var ErrormodalControllerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ErrormodalControllerCtrl = $controller('ErrormodalControllerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
