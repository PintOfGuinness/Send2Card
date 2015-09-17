'use strict';

/**
 * @ngdoc service
 * @name send2CardApp.modalProvider
 * @description
 * # modalProvider
 * Service in the send2CardApp.
 */
angular.module('send2CardApp')
  .service('modalProvider', function modalProvider($modal) {
    
    this.openErrorModal = function(scope){
        var modalInstance = $modal.open({
            template: '<error-modal-directive></error-modal-directive>',
            controller: 'ModalController',
            scope: scope
        });
    }
    
    this.openPrintModal = function(scope){
        var modalInstance = $modal.open({
            template: '<print-coupon-modal-directive></print-coupon-modal-directive>',
            controller: 'ModalController',
            scope: scope
        });
    }
    
    this.openHelpModal = function(){
        var modalInstance = $modal.open({
            templateUrl: 'views/helpmodal.html',
            controller: 'ModalController'
        });
    }
  });
