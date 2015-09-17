'use strict';

/**
 * @ngdoc function
 * @name send2CardApp.controller:CouponsController
 * @description
 * # CouponsController
 * Controller of the send2CardApp
 */
angular.module('send2CardApp').controller('CouponsController', function (couponsManagerFactory, progressBarFactory, singleCouponFactory, displayInformationFactory, queryParameterFactory, screenSize, $q) {

    var coupons = this;
    var extraCareCardNumber = queryParameterFactory.getExtraCareCardNumberParameter();
    var couponNumber = queryParameterFactory.getCouponNumberParameter();

    coupons.couponError = false;
    coupons.errorPath = "views/error3.html";
    coupons.unSentCouponPath = "images/sendtocardicon.png";
    coupons.sentCouponPath = "images/oncard.png";
    coupons.couponPrinted = "images/printedicon.png";
    coupons.extraCareCardNumberEndDigits = extraCareCardNumber.substring(extraCareCardNumber.length - 4, extraCareCardNumber.length);

    initialise();

    function initialise() {
        getfilteredCouponLists();
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
        coupons.multiCouponError = error.multiCouponError;
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
