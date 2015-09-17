'use strict';

describe('Service: errorHandlerFactory', function () {

  // load the service's module
  beforeEach(module('send2CardApp'));

  // instantiate service
  var errorHandlerFactory;
  beforeEach(inject(function (_errorHandlerFactory_) {
    errorHandlerFactory = _errorHandlerFactory_;
  }));

  it('should do something', function () {
    expect(!!errorHandlerFactory).toBe(true);
  });

});
