'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:printCouponDirective
 * @description
 * # printCouponDirective
 */
angular.module('send2CardApp')
    .directive('printCouponModalDirective', function () {
    return {
        restrict: 'E',
        templateUrl: 'views/print-modal.html',
        controller: function ($scope) {
          $scope.selected = {
            item: $scope.items[0] 
          };
        }
    };
});
