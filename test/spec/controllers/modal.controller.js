'use strict';

describe('Controller: ModalController', function () {

  beforeEach(module('send2CardApp'));

  var Ctrl, scope, modalInstance; 
    
  beforeEach(inject(function($controller, $rootScope){
      scope = $rootScope.$new();
      modalInstance = {
          dismiss: jasmine.createSpy('modalInstance.close')
      };
      Ctrl = $controller('ModalController',{
        $scope: scope,
        $modalInstance: modalInstance
      });
  }));
    
    
  it('should instantiate the controller properly', function () {
    expect(Ctrl).not.toBeUndefined();
  });
    
  it('should dismiss the modal with result "cancel" when accepted', function () {
      scope.cancel();
      expect(modalInstance.dismiss).toHaveBeenCalledWith('cancel');
    });
});
