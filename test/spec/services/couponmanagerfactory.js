'use strict';

describe('Service: couponManagerFactory', function () {

  // load the service's module
  beforeEach(module('send2CardApp'));

  // instantiate service
  var couponManagerFactory;
  beforeEach(inject(function (_couponManagerFactory_) {
    couponManagerFactory = _couponManagerFactory_;
  }));

  it('should do something', function () {
    expect(!!couponManagerFactory).toBe(true);
  });

});
