'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:printCouponModalDirective
 * @description
 * # printCouponModalDirective
 */
angular.module('send2CardApp')
    .directive('printCouponModalDirective', function () {
        return {
            restrict: 'E',
            templateUrl: 'components/landingpage/shared/printcouponmodal/printcoupon-modal.html',
            link: link
        };

        function link(scope, elem, attrs) {
            scope.printCoupon = function () {
                window.print();
            }
        }
    });
