'use strict';

/**
 * @ngdoc function
 * @name send2CardApp.controller:CouponsController
 * @description
 * # CouponsController
 * Controller of the send2CardApp
 */

angular.module('send2CardApp').controller('CouponsController', function (couponsManagerFactory, progressBarFactory, singleCouponFactory, displayInformationFactory, queryParameterFactory, errorHandlerFactory, screenSize, $q, configuration) {

    var coupons = this;
    var extraCareCardNumber;
    var couponNumber;

    initialise();

    function initialise() {

        extraCareCardNumber = queryParameterFactory.getExtraCareCardNumberParameter();
        couponNumber = queryParameterFactory.getCouponNumberParameter();

        checkQueryParameters();

        coupons.couponError = false;
        coupons.errorPath = "views/error3.html";
        coupons.unSentCouponPath = "images/sendtocardicon.png";
        coupons.sentCouponPath = "images/oncard.png";
        coupons.couponPrinted = "images/printedicon.png";

        // taking the configuration values for use throughout the controller
        coupons.enablePrintAction = configuration.ENABLE_PRINT_ACTION;
        coupons.autoSendSingleCoupon = configuration.AUTO_SEND_SINGLE_COUPON;
        coupons.showSingleCoupon = configuration.SHOW_SINGLE_COUPON;
        coupons.showCouponBlock = configuration.SHOW_COUPON_BLOCK;
        coupons.showBCC = configuration.SHOW_BCC;
        coupons.showMonetate = configuration.SHOW_MONETATE;
        coupons.showReadyToUse = configuration.SHOW_READY_TO_USE;

        if (checkQueryParameters()) {
            getfilteredCouponLists();
        }
    }

    function checkQueryParameters() {
        var success = false;

        if (angular.isUndefined(couponNumber)) {
            console.log("NO COUPON NUMBER " + couponNumber);
            coupons.couponError = true;
            coupons.errorPath = errorHandlerFactory.processMissingCouponNumber(false);
        } else if (angular.isUndefined(extraCareCardNumber)) {
            console.log("NO EXTRACARENUMBER" + extraCareCardNumber);
            coupons.couponError = true;
            coupons.errorPath = errorHandlerFactory.processMissingExtraCareCardNumber(false);
        } else {
            coupons.extraCareCardNumberEndDigits = queryParameterFactory.getExtraCareCardNumberEndDigits;
            success = true;
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
        if (angular.isUndefined(results.singleCoupon)) {
            coupons.couponError = true;
            coupons.errorPath = "views/error4.html";
        }
        coupons.couponsServiceData = results;
    }

    function getfilteredCouponListsFailed(error) {
        coupons.errorDisplay = error.htmlDisplay;
    }

    coupons.resetCollapseStateForAll = function () {
        couponsManagerFactory.resetCollapseStateForAll();
    }

    coupons.sendSingleCoupon = function () {
        return singleCouponFactory.sendSingleCoupon(extraCareCardNumber, couponNumber)
            .then(sendSingleCouponComplete)
            .catch(sendSingleCouponFailure);
    }

    function sendSingleCouponComplete(data) {
        return data;
    }

    function sendSingleCouponFailure(error) {
        console.log("Controller:sendSingleCouponFailure: " + error.state);
        coupons.couponError = true;
        coupons.errorPath = "views/error2.html";

        return $q.reject(error);
    }

    coupons.getRowIndexNumbers = function (indexNumber, arrayName) {
        var array = [];
        array = displayInformationFactory.getRowIndexNumbers(coupons, indexNumber, arrayName);

        return array;
    }

    coupons.getCouponsPerRow = function () {
        return displayInformationFactory.getCouponsPerRow(coupons);
    }

    coupons.showProgressBar = function (display, actionedCoupon) {
        if (display) {
            progressBarFactory.toggleProgressBarDisplay(true);
            progressBarFactory.updateProgressBarAfterAction(coupons.couponsServiceData, actionedCoupon);
        } else {
            progressBarFactory.toggleProgressBarDisplay(false);
        }
    }

    screenSize.on('xs, sm, md, lg', function (match) {
        coupons.couponsPerRow = displayInformationFactory.getCouponsPerRow(coupons);
    });

});
