'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:couponBlockDirective
 * @description
 * # couponDirective
 */
angular.module('send2CardApp')
    .directive('couponBlockDirective', function (constants) {
        return {
            controller: function (modalProvider, constants, tealiumService, pageConfiguration, $scope) {

                var vm = this;
                initialise();

                function initialise() {
                    initialiseProperties();
                    autoSendToCard();
                }

                function initialiseProperties() {
                    vm.isHidden = false;
                    vm.isReadyToUse = false;
                    vm.printed = false;
                    vm.overlay = true;
                    vm.noOverlay = false;
                    vm.windowPosition = 0;

                    if (vm.coupon.state != constants.COUPON_STATE_DEFAULT) {
                        vm.isReadyToUse = true;
                        vm.isFlipped = false;
                    }

                    if (vm.coupon.state == constants.COUPON_STATE_SENT_TO_CARD) {
                        vm.isHidden = true;
                        vm.isFlipped = true;
                    }

                    if (vm.coupon.state == constants.COUPON_STATE_PRINTED) {
                        vm.isFlipped = true;
                    }
                }

                function autoSendToCard() {
                    if (vm.configuration.AUTO_SEND_SINGLE_COUPON) {
                        vm.onSendSingleCoupon()
                            .then(sendSingleCouponComplete)
                            .catch(sendSingleCouponFailure);
                        vm.configuration.AUTO_SEND_SINGLE_COUPON = false;
                    }
                }

                if (pageConfiguration.TEALIUM_ENABLED) {
                    vm.recordSend2Card = function () {
                        tealiumService.recordPageLink(constants.PAGE_NAME, 'Click Send To Card', 'Send To Card');
                    }
                    vm.recordFirstPrintButtonClick = function () {
                        tealiumService.recordPageLink(constants.PAGE_NAME, 'Click First Print Button', 'Print');
                    }
                    vm.recordSecondPrintButtonClick = function () {
                        tealiumService.recordPageLink(constants.PAGE_NAME, 'Click Second Print Button', 'Print');
                    }
                    vm.recordViewDetails = function () {
                        tealiumService.recordPageLink(constants.PAGE_NAME, 'Click View Details', 'Coupon');
                    }
                }

                vm.collapseSection = function () {
                    var tempIsCollapsed = vm.coupon.isCollapsed;
                    vm.clickedViewDetails();
                    vm.coupon.isCollapsed = !tempIsCollapsed;
                }

                vm.sendSingleCoupon = function () {
                    vm.onSendSingleCoupon()
                        .then(sendSingleCouponComplete)
                        .catch(sendSingleCouponFailure);
                }


                function sendSingleCouponComplete(data) {
                    vm.updateState(data.state);
                    vm.isHidden = true;

                    vm.showProgressBar({
                        display: true,
                        actionedCoupon: vm.coupon
                    });
                }

                function sendSingleCouponFailure(failureState) {
                    vm.updateState(failureState.state);
                    vm.isFlipped = false;
                }

                vm.openPrintModal = function () {
                    modalProvider.openPrintModal($scope).result.catch(updateAfterprintModalClosed);
                }

                vm.closePrintModal = function () {
                    modalProvider.closePrintModal();
                }

                function updateAfterprintModalClosed() {
                    if (vm.printed) {
                        vm.updateState(2);
                        vm.showProgressBar({
                            display: true,
                            actionedCoupon: vm.coupon
                        });
                    }
                }

                vm.confirmPrinted = function () {
                    vm.printed = true;
                }

                vm.updateState = function (newState) {
                    vm.isReadyToUse = true;
                    vm.coupon.state = newState;
                    vm.isFlipped = true;
                }
            },
            controllerAs: 'couponBlockController',
            bindToController: true,
            replace: true,
            scope: {
                extraCareCardNumberEndDigits: '@',
                configuration: '=',
                couponButton: '=',
                coupon: '=',
                screenMode: '=',
                onSendSingleCoupon: '&',
                onUpdateState: '&',
                clickedViewDetails: '&',
                showProgressBar: '&'
            },
            templateUrl: constants.COUPON_BLOCK_TEMPLATE,
            restrict: 'E',
        };
    });
