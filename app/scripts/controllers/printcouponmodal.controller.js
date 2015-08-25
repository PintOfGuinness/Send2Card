'use strict';

/**
 * @ngdoc function
 * @name send2CardApp.controller:PrintCouponModalController
 * @description
 * # PrintCouponModalController
 * Controller of the send2CardApp
 */
angular.module('send2CardApp')
    .controller('PrintCouponModalController', function ($scope, $modal, $log) {

        $scope.open = function (size) {
            var modalInstance;
            var modalScope = $scope.$new();
            modalScope.ok = function () {
                modalInstance.close(modalScope.selected);
            };
            modalScope.cancel = function () {
                modalInstance.dismiss('cancel');
            };
            modalInstance = $modal.open({
                template: '<print-coupon-modal-directive></print-coupon-modal-directive>',
                size: size,
                scope: modalScope
            });
            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
    });
