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
            controller: function (couponsManagerFactory, progressBarFactory, singleCouponFactory, displayInformationFactory, queryParameterFactory, errorHandlerFactory, screenSize, $q, digitalReceiptLandingConfiguration, constants) {

                var vm = this;
                var extraCareCardNumber;
                var couponNumber;

                initialise();

                function initialise() {
                    initialiseProperties();

                    if (validateQueryParameters()) {
                        getfilteredCouponLists();
                    }
                }

                function initialiseProperties() {
                    vm.couponError = false;
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

                function getfilteredCouponLists() {
                    couponsManagerFactory.getFilteredCouponLists(extraCareCardNumber, couponNumber)
                        .then(getfilteredCouponListsSuccess)
                        .catch(getfilteredCouponListsFailed);
                }

                function getfilteredCouponListsSuccess(results) {
                    vm.couponsServiceData = results;
                }

                function getfilteredCouponListsFailed(error) {
                    vm.multiCouponError = error.multiCouponError;
                }

                vm.sendSingleCoupon = function () {
                    return singleCouponFactory.sendSingleCoupon(extraCareCardNumber, couponNumber)
                        .catch(sendSingleCouponFailure);
                }

                function sendSingleCouponFailure(error) {
                    vm.couponError = true;
                    vm.errorPath = constants.TECHNICAL_ERROR;

                    return $q.reject(error);
                }

                vm.resetCollapseStateForAll = function () {
                    couponsManagerFactory.resetCollapseStateForAll();
                }

                vm.showProgressBar = function (display, actionedCoupon) {
                    if (display) {
                        progressBarFactory.toggleProgressBarDisplay(true);
                        progressBarFactory.updateProgressBarAfterAction(vm.couponsServiceData, actionedCoupon);
                    } else {
                        progressBarFactory.toggleProgressBarDisplay(false);
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
            bindToController: true,
            templateUrl: constants.DIGITAL_RECEIPT_LANDING_TEMPLATE,
            restrict: 'E'
        };
    });
