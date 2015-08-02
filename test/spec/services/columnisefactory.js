'use strict';

describe('Service: ColumniseFactory', function () {

  // load the service's module
  beforeEach(module('send2CardApp'));

  // instantiate service
  var ColumniseFactory;
  beforeEach(inject(function (_ColumniseFactory_) {
    ColumniseFactory = _ColumniseFactory_;
  }));

  it('should do something', function () {
    expect(!!ColumniseFactory).toBe(true);
  });

});
