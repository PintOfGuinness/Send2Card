'use strict';

describe('Service: modalProvider', function () {

  // load the service's module
  beforeEach(module('send2CardApp'));

  // instantiate service
  var modalProvider;
  beforeEach(inject(function (_modalProvider_) {
    modalProvider = _modalProvider_;
  }));

  it('should do something', function () {
    expect(!!modalProvider).toBe(true);
  });

});
