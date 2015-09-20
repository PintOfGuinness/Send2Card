'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:couponBlockDirective
 * @description
 * # couponDirective
 */
angular.module('send2CardApp')
    .directive('couponBlockDirective', function (modalProvider, $window) {

        function link(scope, element, attrs) {
            var didScroll = false;
            scope.isHidden = false;
            scope.isReadyToUse = false;
            scope.printed = false;

            initialise();

            function initialise() {
                if (scope.autoSendSingleCoupon === 'true') {
                    scope.onSendSingleCoupon()
                        .then(sendSingleCouponComplete)
                        .catch(sendSingleCouponFailure);
                    scope.autoSendSingleCoupon = false;
                }

                if (scope.coupon.state != 0) {
                    scope.isReadyToUse = true;
                    scope.isFlipped = false;
                }

                if (scope.coupon.state == 1) {
                    scope.isHidden = true;
                    scope.isFlipped = true;
                }

                if (scope.coupon.state == 2) {
                    scope.isFlipped = true;
                }
            }

            angular.element($window).bind("wheel", function () {
                didScroll = true;
            });

            /* Interval prevents function fired for every pixel moved */
            setInterval(function () {
                if (didScroll) {
                    scope.showProgressBar({
                        display: false
                    });
                    didScroll = false;
                }
                scope.$apply();
            }, 100);

            scope.collapseSection = function () {
                var tempIsCollapsed = scope.coupon.isCollapsed;
                scope.onResetCollapseStateForAll();
                scope.coupon.isCollapsed = !tempIsCollapsed;
            }

            scope.sendSingleCoupon = function () {
                scope.onSendSingleCoupon()
                    .then(sendSingleCouponComplete)
                    .catch(sendSingleCouponFailure);
            }

            function sendSingleCouponComplete(data) {
                scope.updateState(data.state);
                scope.isHidden = true;
                scope.showProgressBar({
                    display: true,
                    actionedCoupon: scope.coupon
                });
            }

            function sendSingleCouponFailure(failureState) {
                scope.updateState(failureState.state);
                scope.isFlipped = false;
            }

            scope.openPrintModal = function () {
                modalProvider.openPrintModal(scope);
                modalProvider.printModalInstance.result.catch(updateAfterprintModalClosed);
            }

            function updateAfterprintModalClosed() {
                console.log(scope.printed);
                if(scope.printed) {
                    scope.updateState(2);
                }
            }

            scope.confirmPrinted = function () {
                scope.printed = true;
            }

            scope.updateState = function (newState) {
                scope.isReadyToUse = true;
                scope.coupon.state = newState;
                scope.isFlipped = true;
            }
        }

        return {
            templateUrl: 'views/couponblock-template.html',
            restrict: 'E',
            replace: true,
            scope: {
                enableECOptIn: '@',
                configuration: '=',
                couponButton: '=',
                autoSendSingleCoupon: '@',
                onSendSingleCoupon: '&',
                extraCareCardNumberEndDigits: '@',
                coupon: '=',
                onUpdateState: '&',
                onResetCollapseStateForAll: '&',
                showProgressBar: '&'
            },
            link: link
        };
    });
