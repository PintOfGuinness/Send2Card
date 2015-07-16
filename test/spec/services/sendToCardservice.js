'use strict';

describe('Service: sendToCardService', function () {

  // load the service's module
  beforeEach(module('sendToCardApp'));

  // instantiate service
  var sendToCardService;
  beforeEach(inject(function (_sendToCardService_) {
    sendToCardService = _sendToCardService_;
  }));

  it('should do something', function () {
    expect(!!sendToCardService).toBe(true);
  });

});
