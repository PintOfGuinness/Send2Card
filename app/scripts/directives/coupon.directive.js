'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:allCoupons
 * @description
 * # allCoupons
 */
angular.module('send2CardApp')
    .directive('couponDirective', function () {

        function link(scope, elem, attrs, controller) {
            scope.isCollapsed = true;
            scope.collapseSection = function () {
                console.log("isCollapsed pre: " + scope.isCollapsed);
                scope.isCollapsed = !scope.isCollapsed;
                console.log("isCollapsed post: " + scope.isCollapsed);
            }

            scope.sendCoupon = false;
            
            scope.sendCouponToCard = function () {
                console.log("$scope.onSendCouponToCard pre: " + scope.sendCoupon);
                scope.onSendCouponToCard()
                    .then(sendCouponComplete)
                    .catch(sendCouponFailure);

            }

            function sendCouponComplete(data) {
                scope.sendCoupon = data;
            }

            function sendCouponFailure(data) {
                scope.sendCoupon = data;
                console.log("DIRECTOR PROMISE SOMETHING WRONG");
            }

        }

        return {
            templateUrl: 'views/coupon-template.html',
            restrict: 'EA',
            replace: true,
            scope: {
                title: '@',
                description: '@',
                expiry: '@',
                terms: '@',
                barcode: '@',
                unSentCouponPath: '@',
                sentCouponPath: '@',
                sendCouponOnStartup: '@',
                onSendCouponToCard: '&'
            },
            link: link
        }
    });
