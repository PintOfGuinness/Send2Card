'use strict';

describe('Controller: CouponsCtrl', function () {

  // load the controller's module
  beforeEach(module('send2CardApp'));

  var CouponsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(true).toBe(true);
  });
});
