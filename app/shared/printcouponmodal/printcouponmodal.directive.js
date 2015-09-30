'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:printCouponModalDirective
 * @description
 * # printCouponModalDirective
 */
angular.module('drstc')
    .directive('printCouponModalDirective', function () {
        return {
            restrict: 'E',
            templateUrl: 'app/shared/printcouponmodal/printcoupon-modal.html',
            link: link
        };

        function link(scope, elem, attrs) {
            scope.printCoupon = function () {
                window.print();
            }
        }
    });
