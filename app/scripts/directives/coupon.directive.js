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
            scope.hideNotYetActionedLoadMore = false;
            scope.hideReadyToUseLoadMore = false;
            scope.isCollapsed = true;
            scope.collapseSection = function () {
            scope.isCollapsed = !scope.isCollapsed;
            }

            scope.sendCoupon = "0";

            if (scope.sendCouponOnStartup === 'true') {
                scope.onSendCouponToCard()
                    .then(sendCouponComplete)
                    .catch(sendCouponFailure);
                scope.sendCouponOnStartup = false;
            }

            scope.printCoupon = function printCoupon() {
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
            }

            function sendCouponFailure(data) {
                scope.sendCoupon = data;
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
