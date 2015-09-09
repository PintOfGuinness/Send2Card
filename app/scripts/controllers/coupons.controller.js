'use strict';

/**
 * @ngdoc function
 * @name send2CardApp.controller:CouponsController
 * @description
 * # CouponsController
 * Controller of the send2CardApp
 */
angular.module('send2CardApp')
    .controller('CouponsController', function ($location, couponsManagerFactory, sendToCardFactory, $scope, displayInformationFactory, screenSize) {

        var coupons = this;
        var extraCareCardNumber = $location.search().eccardnum || "12345678";
        var couponNumber = $location.search().couponnum;

        coupons.couponError = false;
        coupons.errorPath = "views/error3.html";
        coupons.unSentCouponPath = "images/sendtocardicon.png";
        coupons.sentCouponPath = "images/oncard.png";
        coupons.couponPrinted = "images/printedicon.png";
        coupons.extraCareCardNumberEndDigits = extraCareCardNumber.substring(extraCareCardNumber.length - 4, extraCareCardNumber.length);

        coupons.resetCollapseStateForAll = function () {
            if (angular.isDefined(coupons.clickedCoupon)) {
                coupons.clickedCoupon[0].isCollapsed = true;
            }
            for (var i = 0; i < coupons.unactionedCoupons.length; i++) {
                coupons.unactionedCoupons[i].isCollapsed = true;
            }
            for (var i = 0; i < coupons.actionedCoupons.length; i++) {
                coupons.actionedCoupons[i].isCollapsed = true;
            }
        }

        coupons.sendCouponToCard = function () {
            return sendToCardFactory.sendCouponToCard(extraCareCardNumber, couponNumber)
                .then(sendCouponComplete)
                .catch(sendCouponFailure);
        }

        function sendCouponComplete(data) {
            console.log("Controller:sendCouponComplete");
            return data;
        }

        function sendCouponFailure(data) {
            var isCouponSent = false;
            console.log("Controller:sendCouponFailure");            
            coupons.couponError = true;
            coupons.errorPath = "views/error1.html";
            return isCouponSent;
        }

        couponsManagerFactory.getFilteredCouponLists(extraCareCardNumber, couponNumber).then(function (results) {

            if (angular.isDefined(results.singleCoupon)) {
                coupons.clickedCoupon = results.singleCoupon;
            } else {
                coupons.couponError = true;
                coupons.errorPath = "views/error4.html";
            }
            coupons.unactionedCoupons = results.unactionedCoupons;
            coupons.actionedCoupons = results.actionedCoupons;
            coupons.unactionedSavings = results.unactionedSavings;
            coupons.actionedSavings = results.actionedSavings;

            var totalCoupons = coupons.actionedCoupons.length + coupons.unactionedCoupons.length;
            coupons.unactionedLength = coupons.unactionedCoupons.length;
            coupons.actionedLength = coupons.actionedCoupons.length;

            coupons.progressBarValue = (coupons.actionedCoupons.length / totalCoupons) * 100;


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

        coupons.incrementProgressBarValue = function () {
            var totalLength = coupons.actionedLength + coupons.unactionedLength;

            coupons.unactionedLength--;
            coupons.actionedLength++;

            var progressValue = (coupons.actionedLength / totalLength) * 100;
            coupons.progressBarValue = progressValue;
        }

        screenSize.on('xs, sm, md, lg', function (match) {
            coupons.couponsPerRow = displayInformationFactory.getCouponsPerRow(coupons);
        });

    });
