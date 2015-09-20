'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:SingleCouponDirective
 * @description
 * # SingleCouponDirective
 */
angular.module('send2CardApp')
    .directive('digitalReceiptLandingDirective', function () {
        return {
            templateUrl: 'views/digitalreceiptlanding.html',
            restrict: 'E',
            controller: function (couponsManagerFactory, progressBarFactory, singleCouponFactory, displayInformationFactory, queryParameterFactory, errorHandlerFactory, screenSize, $q, configuration) {

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
                    vm.errorPath = "views/blank.html";
                    vm.couponButton = {
                        unSentCouponPath: "images/sendtocardicon.png",
                        sentCouponPath: "images/oncard.png",
                        couponPrinted: "images/printedicon.png"
                    };
                    vm.configuration = configuration;
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
                    vm.errorPath = "views/error4.html";

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
            },
            controllerAs: 'singleCouponController',
            bindToController: true
        };
    });
