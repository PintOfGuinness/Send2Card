'use strict';

describe('Controller: CouponsCtrl', function () {

  // load the controller's module
  beforeEach(module('send2CardApp'));

  var CouponsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CouponsCtrl = $controller('CouponsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
