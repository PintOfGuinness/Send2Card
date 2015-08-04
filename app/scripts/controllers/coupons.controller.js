'use strict';

/**
 * @ngdoc function
 * @name send2CardApp.controller:CouponsCtrl
 * @description
 * # CouponsCtrl
 * Controller of the send2CardApp
 */
angular.module('send2CardApp')
    .controller('CouponsCtrl', function ($location, $filter, couponsService, sendToCardFactory, columniseFactory) {

        var coupons = this;
        var extraCareCardNumber = $location.search().eccardnum;
        var couponNumber = $location.search().couponnum;
        coupons.sendCouponOnStartup = false;
        coupons.unSentCouponPath = "images/sendtocard.png";
        coupons.sentCouponPath = "images/sendtocarddone.png";

        coupons.sendCouponToCard = function () {
            return sendToCardFactory.sendCouponToCard(extraCareCardNumber, couponNumber)
                .then(sendCouponComplete)
                .catch(sendCouponFailure);
        }

        function sendCouponComplete(data) {
            var isCouponSent = true;
            console.log("CONTROLLER: COUPON SENT COMPLETE: " + isCouponSent);

            return isCouponSent;
        }

        coupons.printDiv = function (divName) {
            var printContents = document.getElementById(divName).innerHTML;
            var originalContents = document.body.innerHTML;
            console.log("CONTROLLER: printDiv: " + printContents);
            document.body.innerHTML = printContents;

            window.print();

            document.body.innerHTML = originalContents;
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
