'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:couponDirective
 * @description
 * # couponDirective
 */
angular.module('send2CardApp')
    .directive('couponDirective', function () {


        function link(scope, elem, attrs, controller) {
            scope.isHidden = false;
            scope.hideLoadMore = false;
            scope.isCollapsed = true;
            scope.collapseSection = function () {
                console.log("isCollapsed pre: " + scope.isCollapsed);
                scope.isCollapsed = !scope.isCollapsed;
                console.log("isCollapsed post: " + scope.isCollapsed);
            }

            scope.sendCoupon = "0";
            console.log("SEND COUPON " + scope.sendCoupon);

            if (scope.sendCouponOnStartup === 'true') {
                console.log("DIRECTIVE: SEND COUPON ON STARTUP")
                scope.onSendCouponToCard()
                    .then(sendCouponComplete)
                    .catch(sendCouponFailure);
                scope.sendCouponOnStartup = false;
            }

            scope.printCoupon = function printCoupon() {
                console.log("send coupon set at 2");
                scope.sendCoupon = "2";
            }

            scope.sendCouponToCard = function () {
                scope.onSendCouponToCard()
                    .then(sendCouponComplete)
                    .catch(sendCouponFailure);

            }

            function sendCouponComplete(data) {
                scope.sendCoupon = data;
                scope.isHidden = true;
                console.log("DIRECTIVE: SEND COUPON TO CARD SUCCESS: " + data)
            }

            function sendCouponFailure(data) {
                scope.sendCoupon = data;
                console.log("DIRECTIVE: SEND COUPON TO CARD FAILURE: " + data)
            }

        }

        return {
            templateUrl: 'views/coupon-template.html',
            restrict: 'E',
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
                onSendCouponToCard: '&',
                printedPath: '@',
                expiresSoon: '@'
            },
            link: link
        }
    });
