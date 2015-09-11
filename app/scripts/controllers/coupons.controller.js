'use strict';

/**
 * @ngdoc function
 * @name send2CardApp.controller:CouponsController
 * @description
 * # CouponsController
 * Controller of the send2CardApp
 */
angular.module('send2CardApp')
  .controller('CouponsController', function ($location, couponsManagerFactory, progressBarFactory, sendToCardFactory, $scope, displayInformationFactory, screenSize) {

    var coupons = this;
    var extraCareCardNumber = $location.search().eccardnum || "12345678";
    var couponNumber = $location.search().couponnum;

    coupons.couponError = false;
    coupons.errorPath = "views/error3.html";
    coupons.unSentCouponPath = "images/sendtocardicon.png";
    coupons.sentCouponPath = "images/oncard.png";
    coupons.couponPrinted = "images/printedicon.png";
    coupons.extraCareCardNumberEndDigits = extraCareCardNumber.substring(extraCareCardNumber.length - 4, extraCareCardNumber.length);
    coupons.showProgressBar = false;


    coupons.resetCollapseStateForAll = function () {
      couponsManagerFactory.resetCollapseStateForAll();
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


    coupons.showSavingsDisplay = function () {
      var totalCoupons = coupons.couponsServiceData.actionedCoupons.length + coupons.couponsServiceData.unactionedCoupons.length;
      var unactionedLength = coupons.couponsServiceData.unactionedCoupons.length;
      var actionedLength = coupons.couponsServiceData.actionedCoupons.length;
      var actionedSavings = coupons.couponsServiceData.actionedSavings;
      var unactionedSavings = coupons.couponsServiceData.unactionedSavings;
      var totalSavings = coupons.couponsServiceData.totalSavings;

      progressBarFactory.setUnactionedLength(unactionedLength);
      progressBarFactory.setActionedLength(actionedLength);
      progressBarFactory.setProgressBarValue((actionedLength / totalCoupons) * 100);
      progressBarFactory.toggleProgressBarDisplay(true);
      progressBarFactory.setActionedSavings(actionedSavings);
      progressBarFactory.setUnactionedSavings(unactionedSavings);

    }

    function sendCouponFailure(data) {
      var isCouponSent = false;
      console.log("Controller:sendCouponFailure");
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

    coupons.incrementProgressBarValue = function () {
      var totalCoupons = coupons.couponsServiceData.actionedCoupons.length + coupons.couponsServiceData.unactionedCoupons.length;

      var unactionedLength = progressBarFactory.getUnactionedLength();
      var actionedLength = progressBarFactory.getActionedLength();
      unactionedLength--;
      actionedLength++;

      progressBarFactory.setProgressBarValue((actionedLength / totalCoupons) * 100);
    }

    screenSize.on('xs, sm, md, lg', function (match) {
      coupons.couponsPerRow = displayInformationFactory.getCouponsPerRow(coupons);
    });

  });
