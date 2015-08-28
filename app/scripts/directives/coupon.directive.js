'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:couponDirective
 * @description
 * # couponDirective
 */
angular.module('send2CardApp')
    .directive('couponDirective', function () {

        function link(scope, elem, attrs) {
            scope.isHidden = false;
            scope.isCollapsed = true;

            if (scope.coupon != "") {
                scope.couponFromJson = angular.fromJson(scope.coupon);
                console.log(scope.couponFromJson.cpn_seq_nbr + " " + scope.couponFromJson.expiresSoon);
            }

            if (scope.coupon != "") {
                scope.couponFromJson = angular.fromJson(scope.coupon);
            }

            scope.collapseSection = function () {
                scope.isCollapsed = !scope.isCollapsed;
            }

            if (scope.sendCouponOnStartup === 'true') {
                scope.onSendCouponToCard()
                    .then(sendCouponComplete)
                    .catch(sendCouponFailure);
                scope.sendCouponOnStartup = false;
            }

            if (scope.state == 1) {
                scope.isHidden = true;
            }

            scope.clickSendCouponToCard = function () {
                updateCSSForClickedCoupon();
                scope.onSendCouponToCard()
                    .then(sendCouponComplete)
                    .catch(sendCouponFailure);
            }

            function convertFromJson(data) {
                angular.fromJson(data);
            }

            function sendCouponComplete(newState) {
                scope.updateState(newState);
                scope.isHidden = true;
            }

            scope.updateState = function (newState) {
                scope.couponFromJson.state = newState;
            }

            function sendCouponFailure(failureState) {
                scope.couponFromJson.state = failureState;
            }

            function updateCSSForClickedCoupon() {
                elem.addClass("thick-border");
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
                coupon: '@',
                state: '@'
            },
            link: link
        }
    });
