'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:digitalReceiptLandingDirective
 * @description
 * # digitalReceiptLandingDirective
 */
angular.module('drstc')
    .directive('digitalReceiptLandingDirective', function (constants) {
        return {
            controller: function (singleCouponFactory, notificationViewsFactory, $q, constants, tealiumService, pageConfiguration, modalProvider, queryParameterFactory) {

                var vm = this;

                initialise();

                function initialise() {
                    var delay = 0;
                    initialiseProperties();
                    
                    if (pageConfiguration.TEALIUM_ENABLED) {
                        tealiumService.recordPageView(constants.PAGE_NAME);
                    }
                }

                function initialiseProperties() {
                    vm.extraCareCardNumberEndDigits = queryParameterFactory.getExtraCareCardNumberEndDigits();

                    vm.couponButton = {
                        unSentCouponPath: constants.COUPON_SEND_TO_CARD_IMAGE,
                        sentCouponPath: constants.COUPON_SENT_TO_CARD_IMAGE,
                        couponPrinted: constants.COUPON_PRINTED
                    };
                }

                vm.sendSingleCoupon = function () {
                    return singleCouponFactory.sendSingleCoupon(queryParameterFactory.getExtraCareCardNumber, queryParameterFactory.getCouponNumber)
                        .catch(sendSingleCouponFailure);
                }

                function sendSingleCouponFailure(error) {
                    vm.viewControl.display = true;
                    vm.viewControl.path = notificationViewsFactory.getSingleCouponNotification(error, true);
                    if (pageConfiguration.TEALIUM_ENABLED) {
                        tealiumService.recordErrorMessage(error);
                    }
                    return $q.reject(error);
                }

                vm.clickedViewDetails = function () {
                    vm.resetCollapseStateForAll();
                }

                vm.showProgressBar = function (display, actionedCoupon) {
                    vm.displayProgressBar({
                        display: display,
                        actionedCoupon: actionedCoupon
                    });
                }

                if (pageConfiguration.TEALIUM_ENABLED) {
                    vm.helpClick = function () {
                        tealiumService.recordPageLink(constants.PAGE_NAME, 'Click Help Button', 'Error Modal');
                    }
                }

                vm.openHelpModal = function () {
                    modalProvider.openHelpModal();
                }

                vm.closeHelpModal = function () {
                    console.log("closing help");
                    modalProvider.closeHelpModal();
                }

            },
            controllerAs: 'digitalReceiptLandingController',
            scope: {
                screenMode: '=',                
                viewControl: '=',
                configuration: '=',
                couponsServiceData: '=',
                displayProgressBar: '&',
                resetCollapseStateForAll: '&'
            },
            bindToController: true,
            templateUrl: constants.DIGITAL_RECEIPT_LANDING_TEMPLATE,
            restrict: 'E'
        };
    });
