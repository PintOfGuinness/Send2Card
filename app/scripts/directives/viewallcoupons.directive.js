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
            controller: function (singleCouponFactory, displayInformationFactory, queryParameterFactory, errorHandlerFactory, modalProvider, screenSize, $q, viewAllCouponsConfiguration, constants) {

                var vm = this;
                var extraCareCardNumber;
                var couponNumber;

                initialise();

                function initialise() {
                    initialiseProperties();
                    getDisplayCouponsNumberPerRow()
                    validateQueryParameters();
                }

                function initialiseProperties() {
                    vm.couponsServiceData = {};
                  /*  vm.couponError = true;*/
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

                    // remvoe in future
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
                    vm.resetCollapseStateForAll();
                }

                vm.showProgressBar = function (display, actionedCoupon) {
                    vm.displayProgressBar({
                        display: display,
                        actionedCoupon: actionedCoupon
                    });
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
            scope: {
                couponsServiceData: '=',                
                displayProgressBar: '&',
                resetCollapseStateForAll: '&'
            },
            templateUrl: constants.VIEW_ALL_COUPONS_TEMPLATE,
            restrict: 'E',
        };
    });
