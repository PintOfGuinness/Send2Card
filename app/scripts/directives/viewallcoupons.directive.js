'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:viewAllCouponsDirective
 * @description
 * # viewAllCouponsDirective
 */
angular.module('send2CardApp')
    .directive('viewAllCouponsDirective', function () {
        return {
            templateUrl: 'views/viewallcoupons.html',
            restrict: 'E',
            controller: function (couponsManagerFactory, progressBarFactory, singleCouponFactory, displayInformationFactory, queryParameterFactory, errorHandlerFactory, modalProvider, screenSize, $q, configuration) {

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

                    if (angular.isUndefined(extraCareCardNumber)) {
                        vm.couponError = true;
                        vm.errorPath = errorHandlerFactory.processMissingExtraCareCardNumber(false);
                    } else {
                        vm.extraCareCardNumberEndDigits = queryParameterFactory.getExtraCareCardNumberEndDigits;
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
                    modalProvider.openErrorModal();

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
                
                screenSize.on('xs, sm, md, lg', function (match) {
                    vm.couponsPerRow = getDisplayCouponsNumberPerRow();
                });
                
                vm.getCouponsPerRow = function () {
                    return getDisplayCouponsNumberPerRow();
                }

                function getDisplayCouponsNumberPerRow() {
                    return displayInformationFactory.getCouponsPerRow(vm);
                }
                
                vm.getRowIndexNumbers = function (indexNumber, arrayName) {
                    return displayInformationFactory.getRowIndexNumbers(vm, indexNumber, arrayName);;
                }                
            },
            controllerAs: 'viewallCouponsController',
            bindToController: true
        };
    });
