'use strict';

/**
 * @ngdoc function
 * @name send2CardApp.controller:CouponsController
 * @description
 * # CouponsController
 * Controller of the send2CardApp
 */
angular.module('send2CardApp')
    .controller('CouponsController', function (couponsManagerFactory, progressBarFactory, singleCouponFactory, $scope, displayInformationFactory, queryParameterFactory, screenSize) {

        var coupons = this;
        var extraCareCardNumber = queryParameterFactory.getExtraCareCardNumberParameter();
        var couponNumber = queryParameterFactory.getCouponNumberParameter();

        coupons.couponError = false;
        coupons.errorPath = "views/error3.html";
        coupons.unSentCouponPath = "images/sendtocardicon.png";
        coupons.sentCouponPath = "images/oncard.png";
        coupons.couponPrinted = "images/printedicon.png";
        coupons.extraCareCardNumberEndDigits = extraCareCardNumber.substring(extraCareCardNumber.length - 4, extraCareCardNumber.length);

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

        function sendSingleCouponFailure(data) {
            var isCouponSent = false;
            console.log("Controller:sendSingleCouponFailure");
            coupons.couponError = true;
            coupons.errorPath = "views/error1.html";
            return isCouponSent;
        }

        couponsManagerFactory.getFilteredCouponLists(extraCareCardNumber, couponNumber).then(function (results) {

            if (angular.isUndefined(results.singleCoupon)) {
                coupons.couponError = true;
                coupons.errorPath = "views/error4.html";
            }
            coupons.couponsServiceData = results;

        }).catch(function (error) {
            coupons.multiCouponError = error.multiCouponError;
        });

        coupons.getRowIndexNumbers = function (indexNumber, arrayName) {
            var array = [];
            array = displayInformationFactory.getRowIndexNumbers(coupons, indexNumber, arrayName);
            return array;
        }

        coupons.getCouponsPerRow = function () {
            return displayInformationFactory.getCouponsPerRow(coupons);
        }

        coupons.showSavingsDisplay = function (actionedCoupon) {
            progressBarFactory.updateProgressBarAfterAction(coupons.couponsServiceData, actionedCoupon);
            progressBarFactory.toggleProgressBarDisplay(true);

        }

        screenSize.on('xs, sm, md, lg', function (match) {
            coupons.couponsPerRow = displayInformationFactory.getCouponsPerRow(coupons);
        });

    });
