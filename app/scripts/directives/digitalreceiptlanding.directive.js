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
            controller: function (couponsManagerFactory, progressBarFactory, singleCouponFactory, displayInformationFactory, queryParameterFactory, errorHandlerFactory, screenSize, $q, digitalReceiptLandingConfiguration, constants, tealiumService, pageConfiguration, modalProvider /*, spinnerService*/ ) {

                var vm = this;
                var extraCareCardNumber;
                var couponNumber;

                initialise();

                function initialise() {
                    var delay = 0;
                    vm.showSpinner = true;

                    initialiseProperties();
                    validateQueryParameters();
                    
/*  Andrew I've moved stuff to the landing page directive if you want to carry on with spinner

if (validateQueryParameters()) {
                        setTimeout(function () {
                            vm.showSpinner = false;
                        }, delay);
                    }*/

                    if (pageConfiguration.TEALIUM_ENABLED) {
                        tealiumService.recordPageView(constants.PAGE_NAME);
                    }
                }

                function initialiseProperties() {
                                   vm.couponsServiceData = {};
     /*               vm.couponError = true;*/
                    vm.errorPath = constants.BLANK_VIEW;
                    vm.couponButton = {
                        unSentCouponPath: constants.COUPON_SEND_TO_CARD_IMAGE,
                        sentCouponPath: constants.COUPON_SENT_TO_CARD_IMAGE,
                        couponPrinted: constants.COUPON_PRINTED
                    };
                    vm.configuration = digitalReceiptLandingConfiguration;
                }

                function validateQueryParameters() {
                    var success = false;

                    extraCareCardNumber = queryParameterFactory.getExtraCareCardNumberParameter();
                    couponNumber = queryParameterFactory.getCouponNumberParameter();

                    if (angular.isDefined(extraCareCardNumber)) {
                        vm.extraCareCardNumberEndDigits = queryParameterFactory.getExtraCareCardNumberEndDigits;
                        success = true;

                        if (angular.isUndefined(couponNumber)) {
                            vm.couponError = true;
                            vm.errorPath = errorHandlerFactory.processMissingCouponNumber(true);
                        }
                    } else {
                        vm.couponError = true;
                        vm.errorPath = errorHandlerFactory.processMissingExtraCareCardNumber(true);
                    }

                    return success;
                }
/*
                function getFilteredCouponListsSuccess(results) {
                    vm.couponError = false;
                    vm.couponsServiceData = results;
                }

                function getFilteredCouponListsFailed(error) {
                    // To sort out error handling
                }*/

                vm.sendSingleCoupon = function () {
                    return singleCouponFactory.sendSingleCoupon(extraCareCardNumber, couponNumber)
                        .catch(sendSingleCouponFailure);
                }

                function sendSingleCouponFailure(error) {
                    vm.couponError = true;
                    vm.errorPath = constants.TECHNICAL_ERROR;
                    if (pageConfiguration.TEALIUM_ENABLED) {
                        tealiumService.recordErrorMessage(error);
                    }
                    return $q.reject(error);
                }

                vm.resetCollapseStateForAll = function () {
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
                
                console.dir("d data" + vm.couponsServiceData);
            },
            controllerAs: 'digitalReceiptLandingController',
            bindToController: true,
            scope: {
                couponsServiceData: '=',
                displayProgressBar: '&',
    /*            getFilteredCouponLists: '&',*/
                resetCollapseStateForAll: '&'
            },
            templateUrl: constants.DIGITAL_RECEIPT_LANDING_TEMPLATE,
            restrict: 'E'
        };
    });
