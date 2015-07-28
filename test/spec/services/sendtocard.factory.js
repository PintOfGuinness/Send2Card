'use strict';

describe('Service: sendToCardFactory', function () {

  // load the service's module
  beforeEach(module('send2CardApp'));

  // instantiate service
  var sendToCard.Factory;
  beforeEach(inject(function (_sendToCard.Factory_) {
    sendToCard.Factory = _sendToCard.Factory_;
  }));

  it('should do something', function () {
    expect(!!sendToCard.Factory).toBe(true);
  });

});
