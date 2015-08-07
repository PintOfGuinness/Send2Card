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
            console.log("CONTROLLER: COUPON NOT SENT");

            return isCouponSent;
        }

        couponsService.getAllCoupons(extraCareCardNumber).then(function (results) {
            coupons.clickedCoupon = $filter('couponFilter')(results.data.CUST_INF_RESP.XTRACARE.CPNS.ROW, couponNumber, false);
            var allCoupons = $filter('couponFilter')(results.data.CUST_INF_RESP.XTRACARE.CPNS.ROW, couponNumber, true);
            coupons.columns = columniseFactory.columnise(allCoupons, 2);
        });

    });
