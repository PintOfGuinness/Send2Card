'use strict';

/**
 * @ngdoc function
 * @name send2CardApp.controller:CouponsCtrl
 * @description
 * # CouponsCtrl
 * Controller of the send2CardApp
 */
angular.module('send2CardApp')
    .controller('CouponsCtrl', function ($location, $filter, couponsService, sendToCardFactory) {

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

        function sendCouponFailure(data) {
            var isCouponSent = false;
            console.log("CONTROLLER: COUPON NOT SENT");

            return isCouponSent;
        }

        couponsService.getAllCoupons(extraCareCardNumber).then(function (results) {
            coupons.clickedCoupon = $filter('CouponFilter')(results.data.CUST_INF_RESP.XTRACARE.CPNS.ROW, couponNumber, false);
            var allCoupons = $filter('CouponFilter')(results.data.CUST_INF_RESP.XTRACARE.CPNS.ROW, couponNumber, true);
            coupons.columns = coupons.columnize(allCoupons, 2);
        });

        coupons.columnize = function (inputArray, numberOfcolumns) {
            var length = inputArray.length,
                columnsArray = [],
                i = 0;
            while (i < length) {
                var size = Math.ceil((length - i) / numberOfcolumns--);
                columnsArray.push(inputArray.slice(i, i += size));
            }
            return columnsArray;
        }
    });
