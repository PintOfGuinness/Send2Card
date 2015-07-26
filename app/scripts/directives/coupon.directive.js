'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:allCoupons
 * @description
 * # allCoupons
 */
angular.module('send2CardApp')
    .directive('couponDirective', function () {
        return {
            templateUrl: 'views/coupon-template.html',
            restrict: 'EA',
            replace: true,
            scope: {
                title: '@',
                description: '@',
                expiry: '@',
                unSentCouponPath: '@',
                sentCouponPath: '@',
                onSendCouponToCard: '&'
            },
            link: function (scope, elem, attrs, controller) {
                scope.status = {
                    isOpen: false,
                };
                scope.sendCoupon = false;

                scope.sendCouponToCard = function () {
                    console.log("$scope.onSendCouponToCard pre: " + scope.sendCoupon);
                    scope.sendCoupon = scope.onSendCouponToCard();
                    console.log("$scope.onSendCouponToCard post: " + scope.sendCoupon);
                };

            }
        };
    });
