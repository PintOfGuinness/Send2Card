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

            if (scope.sendCouponOnStartup === 'true') {
                scope.onSendCouponToCard()
                    .then(sendCouponComplete)
                    .catch(sendCouponFailure);
                scope.sendCouponOnStartup = false;
            }
            
            //get an attribute: attrs.state

            scope.printCoupon = function printCoupon() {
                attrs.$set("state", 2);
                
            }

            scope.sendCouponToCard = function () {
                scope.onSendCouponToCard()
                    .then(sendCouponComplete)
                    .catch(sendCouponFailure);

            }

            function sendCouponComplete(data) {
                attrs.$set("state", data);
                scope.isHidden = true;
            }

            function sendCouponFailure(data) {
                scope.state = data;
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
                expiresSoon: '@',
                state: '@'
            },
            link: link
        }
    });
