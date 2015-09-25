'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:couponBlockDirective
 * @description
 * # couponDirective
 */
angular.module('send2CardApp')
    .directive('couponBlockDirective', function (modalProvider, $window, constants,tealiumService, pageConfiguration) {

        function link(scope, element, attrs) {
            var didScroll = false;
            scope.isHidden = false;
            scope.isReadyToUse = false;
            scope.printed = false;

            initialise();

            function initialise() {
                if (scope.configuration.AUTO_SEND_SINGLE_COUPON) {
                    scope.onSendSingleCoupon()
                        .then(sendSingleCouponComplete)
                        .catch(sendSingleCouponFailure);
                    scope.configuration.AUTO_SEND_SINGLE_COUPON = false;
                }

                if (scope.coupon.state != constants.COUPON_STATE_DEFAULT) {
                    scope.isReadyToUse = true;
                    scope.isFlipped = false;
                }

                if (scope.coupon.state == constants.COUPON_STATE_SENT_TO_CARD) {
                    scope.isHidden = true;
                    scope.isFlipped = true;
                }

                if (scope.coupon.state == constants.COUPON_STATE_PRINTED) {
                    scope.isFlipped = true;
                }
            }

            if (pageConfiguration.TEALIUM_ENABLED) {
                scope.recordSend2Card = function () {
                    tealiumService.recordPageLink(constants.PAGE_NAME, 'Click Send To Card','Send To Card');
                }
                scope.recordFirstPrintButtonClick = function () {
                    tealiumService.recordPageLink(constants.PAGE_NAME, 'Click First Print Button','Print');
                }
                scope.recordSecondPrintButtonClick = function () {
                    tealiumService.recordPageLink(constants.PAGE_NAME, 'Click Second Print Button','Print');
                }
                scope.recordViewDetails = function () {
                    tealiumService.recordPageLink(constants.PAGE_NAME, 'Click View Details', 'Coupon');
                }
            }

            angular.element($window).bind("wheel", function () {
                didScroll = true;
            });

            /* prevents event fired for every pixel moved */
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
                scope.clickedViewDetails();
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
                modalProvider.openPrintModal(scope).result.catch(updateAfterprintModalClosed);
            }

            scope.closePrintModal = function () {
                modalProvider.closePrintModal();
            }

            function updateAfterprintModalClosed() {
                if (scope.printed) {
                    scope.updateState(2);
                    scope.showProgressBar({
                        display: true,
                        actionedCoupon: scope.coupon
                    });
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
            templateUrl: constants.COUPON_BLOCK_TEMPLATE,
            restrict: 'E',
            replace: true,
            scope: {
                extraCareCardNumberEndDigits: '@',
                configuration: '=',
                couponButton: '=',
                coupon: '=',
                onSendSingleCoupon: '&',
                onUpdateState: '&',
                clickedViewDetails: '&',
                showProgressBar: '&'
            },
            link: link
        };
    });
