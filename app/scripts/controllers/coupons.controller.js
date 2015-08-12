'use strict';

/**
 * @ngdoc function
 * @name send2CardApp.controller:CouponsController
 * @description
 * # CouponsController
 * Controller of the send2CardApp
 */
angular.module('send2CardApp')
    .controller('CouponsController', function ($location, $filter, couponsService, sendToCardFactory, columniseFactory, $scope) {

        var coupons = this;
        var extraCareCardNumber = $location.search().eccardnum;
        var couponNumber = $location.search().couponnum;
        coupons.sendCouponOnStartup = false;
        coupons.unSentCouponPath = "images/sendtocard.png";
        coupons.sentCouponPath = "images/sendtocarddone.png";
        coupons.couponPrinted = "images/printed.png";
    
        coupons.sendCouponToCard = function () {
            return sendToCardFactory.sendCouponToCard(extraCareCardNumber, couponNumber)
                .then(sendCouponComplete)
                .catch(sendCouponFailure);
        }

        function sendCouponComplete(data) {
            var isCouponSent = 1;
            return isCouponSent;
        }
    
        coupons.printCoupon = function () {
            $scope.printCoupon();
            window.print();
        }

        function sendCouponFailure(data) {
            var isCouponSent = false;
            return isCouponSent;
        }

        couponsService.getAllCoupons(extraCareCardNumber).then(function (results) {
            coupons.clickedCoupon = $filter('couponFilter')(results.data.CUST_INF_RESP.XTRACARE.CPNS.ROW, couponNumber, false);
            var allCoupons = $filter('couponFilter')(results.data.CUST_INF_RESP.XTRACARE.CPNS.ROW, couponNumber, true);
            sortCouponsByExpiryDate(allCoupons);
            addExpiresSoon(allCoupons);
            coupons.threeColumns = columniseFactory.columnise(allCoupons, 3);
            coupons.twoColumns = columniseFactory.columnise(allCoupons, 2);
            coupons.oneColumn = columniseFactory.columnise(allCoupons, 1);
        });

        function sortCouponsByExpiryDate(allCoupons) {
            allCoupons.sort(function (a, b) {
                a = new Date(a.expir_dt);
                b = new Date(b.expir_dt);
                return a < b ? -1 : a > b ? 1 : 0;
            });
        }
    
        function addExpiresSoon(allCoupons) {
           for (var i=0; i<allCoupons.length; i++){
               var today = new Date();
               var expiresSoonRegion = new Date(today);
               expiresSoonRegion.setDate(today.getDate() +14);
               var expiryDate = new Date(allCoupons[i].expir_dt);
               
               if (expiryDate < expiresSoonRegion){
                   allCoupons[i].expiresSoon = true;
               } else {
                   allCoupons[i].expiresSoon = false;
               }
           }
        }

    });
