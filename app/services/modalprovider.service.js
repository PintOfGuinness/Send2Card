'use strict';

/**
 * @ngdoc service
 * @name send2CardApp.modalProvider
 * @description
 * # modalProvider
 * Service in the send2CardApp.
 */
angular.module('drstc')
    .service('modalProvider', function modalProvider($modal) {

        this.openErrorModal = function (scope) {
            return this.errorModalInstance = $modal.open({
                template: '<error-modal-directive></error-modal-directive>',
                scope: scope
            });
        }

        this.closeErrorModal = function () {
            return this.errorModalInstance.dismiss('cancel');
        }

        this.openPrintModal = function (scope) {
            return this.printModalInstance = $modal.open({
                template: '<print-coupon-modal-directive></print-coupon-modal-directive>',
                scope:scope
            });
        }

        this.closePrintModal = function () {
            return this.printModalInstance.dismiss('cancel');
        }

        this.openHelpModal = function () {
            return this.helpModalInstance = $modal.open({
                templateUrl: 'views/modals/help-modal.html',
            });
        }

        this.closeHelpModal = function () {
            return this.helpModalInstance.dismiss('cancel');
        }
    });
