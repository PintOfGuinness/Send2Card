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

                var coupons = this;
                var extraCareCardNumber;
                var couponNumber;

                initialise();

                function initialise() {

                    extraCareCardNumber = queryParameterFactory.getExtraCareCardNumberParameter();
                    couponNumber = queryParameterFactory.getCouponNumberParameter();

                    coupons.couponError = false;
                    coupons.errorPath = "views/error3.html";
                    coupons.couponButton = {};
                    coupons.couponButton.unSentCouponPath = "images/sendtocardicon.png";
                    coupons.couponButton.sentCouponPath = "images/oncard.png";
                    coupons.couponButton.couponPrinted = "images/printedicon.png";

                    // taking the configuration values for use throughout the controller
                    coupons.enablePrintAction = configuration.ENABLE_PRINT_ACTION;
                    coupons.autoSendSingleCoupon = configuration.AUTO_SEND_SINGLE_COUPON;
                    coupons.showSingleCoupon = configuration.SHOW_SINGLE_COUPON;
                    coupons.showCouponBlock = configuration.SHOW_COUPON_BLOCK;
                    coupons.showBCC = configuration.SHOW_BCC;
                    coupons.showMonetate = configuration.SHOW_MONETATE;
                    coupons.showReadyToUse = configuration.SHOW_READY_TO_USE;
                    coupons.enableECOptIn = configuration.ENABLE_EC_OPT_IN; 

                    if (validateQueryParameters()) {
                        getfilteredCouponLists();
                    }
                }

                function validateQueryParameters() {
                    var success = false;

                    if (angular.isDefined(extraCareCardNumber)) {

                        coupons.extraCareCardNumberEndDigits = queryParameterFactory.getExtraCareCardNumberEndDigits;
                        success = true;

                        if (angular.isUndefined(couponNumber)) {
                            coupons.couponError = true;
                            coupons.errorPath = errorHandlerFactory.processMissingCouponNumber(true);
                        }
                    } else {
                        coupons.couponError = true;
                        coupons.errorPath = errorHandlerFactory.processMissingExtraCareCardNumber(true);
                    }

                    console.log(success);
                    return success;
                }

                function getfilteredCouponLists() {
                    couponsManagerFactory.getFilteredCouponLists(extraCareCardNumber, couponNumber)
                        .then(getfilteredCouponListsSuccess)
                        .catch(getfilteredCouponListsFailed);
                }

                function getfilteredCouponListsSuccess(results) {
                    /*                    if (angular.isUndefined(results.singleCoupon)) {
                                            coupons.couponError = true;
                                            coupons.errorPath = "views/viewallcouponsheader.html";
                                        }*/
                    coupons.couponsServiceData = results;
                }

                function getfilteredCouponListsFailed(error) {
                    coupons.multiCouponError = error.multiCouponError;
                }

                coupons.sendSingleCoupon = function () {
                    return singleCouponFactory.sendSingleCoupon(extraCareCardNumber, couponNumber)
                        .catch(sendSingleCouponFailure);
                }

                function sendSingleCouponFailure(error) {
                    console.log("Controller:sendSingleCouponFailure: " + error.state);
                    coupons.couponError = true;
                    coupons.errorPath = "views/error2.html";

                    return $q.reject(error);
                }

                coupons.resetCollapseStateForAll = function () {
                    couponsManagerFactory.resetCollapseStateForAll();
                }

                coupons.showProgressBar = function (display, actionedCoupon) {
                    if (display) {
                        progressBarFactory.toggleProgressBarDisplay(true);
                        progressBarFactory.updateProgressBarAfterAction(coupons.couponsServiceData, actionedCoupon);
                    } else {
                        progressBarFactory.toggleProgressBarDisplay(false);
                    }
                }
            },
            controllerAs: 'singleCouponController',
            bindToController: true
        };
    });
