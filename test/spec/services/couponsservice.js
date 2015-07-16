'use strict';

describe('Service: couponsService', function () {

  // load the service's module
  beforeEach(module('send2CardApp'));

  // instantiate service
  var couponsService;
  beforeEach(inject(function (_couponsService_) {
    couponsService = _couponsService_;
  }));

  it('should do something', function () {
    expect(!!couponsService).toBe(true);
  });

});
