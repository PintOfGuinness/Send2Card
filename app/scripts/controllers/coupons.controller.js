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
      var isCouponSent = 1;
      return isCouponSent;
    }

    function sendCouponFailure(data) {
      var isCouponSent = false;
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


        /*To use the live service, use this code instead of the above*/
        /*couponsManagerFactory.getFilteredCouponListsFromService(extraCareCardNumber, couponNumber).then(function(results){
                coupons.clickedCoupon = results.singleCoupon;
                coupons.unactionedCoupons = results.unactionedCoupons;
                coupons.actionedCoupons = results.actionedCoupons;
            });*/

        /*coupons.getRowIndexNumber = function (indexNumber, arrayName) {
            var array = [];
            array = displayInformationFactory.getRowIndexNumbers(coupons, indexNumber, arrayName);
                console.log(array);
                return array;
            }

            coupons.getCouponsPerRow = function () {
                return displayInformationFactory.getCouponsPerRow(coupons);
            }*/

    coupons.incrementProgressBarValue = function(){

      var totalLength = coupons.actionedLength + coupons.unactionedLength;

      coupons.unactionedLength--;
      coupons.actionedLength++;

      var progressValue = (coupons.actionedLength/totalLength) * 100;
      coupons.progressBarValue=progressValue;
    }

    coupons.getRowIndexNumbers = function (indexNumber, arrayName) {
      var array = [];
      var couponArray = [];
      if (arrayName == "unactioned") {
        couponArray = coupons.unactionedCoupons;
      }
      if (arrayName == "actioned") {
        couponArray = coupons.actionedCoupons;
      }
      for (var i = indexNumber; i < coupons.couponsPerRow + indexNumber; i++) {
        if (i < couponArray.length) {
          array.push(i);
        }
      }
      return array;
    }


    coupons.getCouponsPerRow = function () {
      coupons.couponsPerRow = 3;
      if (screenSize.is('md, lg')) {
        coupons.couponsPerRow = 3;
        return coupons.couponsPerRow;
      } else if (screenSize.is('sm')) {
        coupons.couponsPerRow = 2;
        return coupons.couponsPerRow;
      } else if (screenSize.is('xs')) {
        coupons.couponsPerRow = 1;
        return coupons.couponsPerRow;
      } else {
        return coupons.couponsPerRow;
      }
    }

    screenSize.on('xs, sm, md, lg', function (match) {
      //coupons.couponsPerRow = displayInformationFactory.getCouponsPerRow(coupons);
      coupons.couponsPerRow = coupons.getCouponsPerRow();
    });

  });
