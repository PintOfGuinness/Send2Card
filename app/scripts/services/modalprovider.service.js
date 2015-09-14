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
    
    this.openErrorModal = function(){
        var modalInstance = $modal.open({
            /*templateUrl: 'views/error1.html',*/
            template: '<error-modal-directive></error-modal-directive>',
            controller: 'ModalController'
        });
    }
    
    this.openPrintModal = function(scope){
        var modalInstance = $modal.open({
            /*templateUrl: 'views/printcoupon-modal.html',*/
            template: '<print-coupon-modal-directive></print-coupon-modal-directive>',
            controller: 'ModalController',
            scope: scope
        });
    }
  });
