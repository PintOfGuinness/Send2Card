'use strict';

/**
 * @ngdoc function
 * @name send2CardApp.controller:ModalController
 * @description
 * # ModalController
 * Controller of the send2CardApp
 */
angular.module('send2CardApp')
    .controller('ModalController', function ($scope, $modalInstance) {

        (function () { // init
            $scope.ok = function () {
                $modalInstance.close($scope.selected.item);
            };
        })();

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

    });
