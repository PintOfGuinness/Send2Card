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
                }

                if (scope.coupon.state == 1) {
                    scope.isHidden = true;
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

            scope.clickSendCouponToCard = function () {
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
                console.log("Directive:sendSingleCouponFailure");
                scope.updateState(failureState.state);
                modalProvider.openErrorModal(scope);
            }

            scope.openHelpModal = function () {
                modalProvider.openHelpModal();
            }

            scope.openPrintModal = function () {
                modalProvider.openPrintModal(scope);
            }

            scope.updateState = function (newState) {
                scope.isReadyToUse = true;
                scope.coupon.state = newState;
            }

        }

        return {
            templateUrl: 'views/couponblock-template.html',
            restrict: 'E',
            replace: true,
            scope: {
                unSentCouponPath: '@',
                sentCouponPath: '@',
                autoSendSingleCoupon: '@',
                onSendSingleCoupon: '&',
                printedPath: '@',
                extraCareCardNumberEndDigits: '@',
                coupon: '=',
                onUpdateState: '&',
                onResetCollapseStateForAll: '&',
                showProgressBar: '&'
            },
            link: link
        };
    });
