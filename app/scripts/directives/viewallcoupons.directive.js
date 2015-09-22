'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:viewAllCouponsDirective
 * @description
 * # viewAllCouponsDirective
 */
angular.module('send2CardApp')
    .directive('viewAllCouponsDirective', function (constants) {
        return {
            controller: function (couponsManagerFactory, progressBarFactory, singleCouponFactory, displayInformationFactory, queryParameterFactory, errorHandlerFactory, modalProvider, screenSize, $q, viewAllCouponsConfiguration, constants) {

                var vm = this;
                var extraCareCardNumber;
                var couponNumber;

                initialise();

                function initialise() {
                    initialiseProperties();
                    getDisplayCouponsNumberPerRow()

                    if (validateQueryParameters()) {
                        getfilteredCouponLists();
                    }
                }

                function initialiseProperties() {
                    vm.couponError = true;
                    vm.errorPath = constants.BLANK_VIEW;
                    vm.couponButton = {
                        unSentCouponPath: constants.COUPON_SEND_TO_CARD_IMAGE,
                        sentCouponPath: constants.COUPON_SENT_TO_CARD_IMAGE,
                        couponPrinted: constants.COUPON_PRINTED
                    };
                    vm.configuration = viewAllCouponsConfiguration;
                }

                function validateQueryParameters() {
                    var success = false;

                    extraCareCardNumber = queryParameterFactory.getExtraCareCardNumberParameter();
                    couponNumber = queryParameterFactory.getCouponNumberParameter();

                    if (angular.isUndefined(extraCareCardNumber)) {
                        vm.couponError = true;
                        vm.errorPath = errorHandlerFactory.processMissingExtraCareCardNumber(false);
                    } else {
                        vm.extraCareCardNumberEndDigits = queryParameterFactory.getExtraCareCardNumberEndDigits();
                        success = true;
                    }

                    return success;
                }

                function getfilteredCouponLists() {
                    couponsManagerFactory.getFilteredCouponLists(extraCareCardNumber, couponNumber)
                        .then(getfilteredCouponListsSuccess)
                        .catch(getfilteredCouponListsFailed);
                }

                function getfilteredCouponListsSuccess(results) {
                    vm.couponError = false;
                    vm.couponsServiceData = results;
                }

                function getfilteredCouponListsFailed(error) {
                    vm.errorDisplay = error.htmlDisplay;
                }

                vm.sendSingleCoupon = function () {
                    return singleCouponFactory.sendSingleCoupon(extraCareCardNumber, couponNumber)
                        .catch(sendSingleCouponFailure);
                }

                function sendSingleCouponFailure(error) {
                    error.state = 0;
                    vm.openErrorModal();

                    return $q.reject(error);
                }

                vm.openErrorModal = function () {
                    return modalProvider.openErrorModal();
                }

                vm.closeErrorModal = function () {
                    return modalProvider.closeErrorModal();
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

                screenSize.on('xs, sm, md, lg', function (match) {
                    vm.screenMode = getDisplayCouponsNumberPerRow();
                });

                function getDisplayCouponsNumberPerRow() {
                    return displayInformationFactory.getCouponsPerRow(vm);
                }

                vm.getRowIndexNumbers = function (indexNumber, arrayName) {
                    return displayInformationFactory.getRowIndexNumbers(vm, indexNumber, arrayName);;
                }
            },
            controllerAs: 'viewAllCouponsController',
            bindToController: true,
            templateUrl: constants.VIEW_ALL_COUPONS_TEMPLATE,
            restrict: 'E',
        };
    });
