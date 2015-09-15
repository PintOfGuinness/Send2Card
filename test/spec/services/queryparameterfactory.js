'use strict';

describe('Service: queryParameterFactory', function () {

  // load the service's module
  beforeEach(module('send2CardApp'));

  // instantiate service
  var queryParameterFactory;
  beforeEach(inject(function (_queryParameterFactory_) {
    queryParameterFactory = _queryParameterFactory_;
  }));

  it('should do something', function () {
    expect(!!queryParameterFactory).toBe(true);
  });

});
