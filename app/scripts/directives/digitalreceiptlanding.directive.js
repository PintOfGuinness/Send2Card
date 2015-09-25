'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:digitalReceiptLandingDirective
 * @description
 * # digitalReceiptLandingDirective
 */
angular.module('send2CardApp')
    .directive('digitalReceiptLandingDirective', function (constants) {
        return {
            controller: function (singleCouponFactory, notificationViewsFactory,  $q, digitalReceiptLandingConfiguration, constants, tealiumService, pageConfiguration, modalProvider, queryParameterFactory /*, spinnerService*/ ) {

                var vm = this;

                initialise();

                function initialise() {
                    var delay = 0;
                    vm.showSpinner = true;

                    initialiseProperties();

                    /*  Andrew I've moved stuff to the landing page directive if you want to carry on with spinner


                        setTimeout(function () {
                            vm.showSpinner = false;
                        }, delay);
          */

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
                    vm.configuration = digitalReceiptLandingConfiguration;
                }

                vm.sendSingleCoupon = function () {
                    return singleCouponFactory.sendSingleCoupon(queryParameterFactory.getExtraCareCardNumber, queryParameterFactory.getCouponNumber)
                        .catch(sendSingleCouponFailure);
                }

                function sendSingleCouponFailure(error) {
                    vm.notificationControl.display = true;
                    vm.notificationControl.path = notificationViewsFactory.getSingleCouponNotification(error, true);
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
                    modalProvider.closeHelpModal();
                }

            },
            controllerAs: 'digitalReceiptLandingController',
            scope: {
                notificationControl: '=',
                couponsServiceData: '=',
                displayProgressBar: '&',
                resetCollapseStateForAll: '&'
            },
            bindToController: true,
            templateUrl: constants.DIGITAL_RECEIPT_LANDING_TEMPLATE,
            restrict: 'E'
        };
    });
