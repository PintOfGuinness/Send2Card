'use strict';

describe('Service: progressBarFactory', function () {

  // load the service's module
  beforeEach(module('send2CardApp'));

  // instantiate service
  var progressBarFactory;
  beforeEach(inject(function (_progressBarFactory_) {
    progressBarFactory = _progressBarFactory_;
  }));

  it('should do something', function () {
    expect(!!progressBarFactory).toBe(true);
  });

});
