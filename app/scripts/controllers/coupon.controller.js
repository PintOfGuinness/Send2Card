'use strict';

/**
 * @ngdoc function
 * @name send2CardApp.controller:CouponCtrl
 * @description
 * # CouponCtrl
 * Controller of the send2CardApp
 */
angular.module('send2CardApp')
    .controller('CouponCtrl', function ($location, $filter, couponsService, sendToCardService) {

        var coupon = this;

        coupon.allCoupons = [];

        var extraCareCardNumber = $location.search().eccardnum;
        var couponSequenceNumber = $location.search().couponnum;
        if (typeof couponSequenceNumber != 'undefined' && typeof extraCareCardNumber != 'undefined') {
            // throw error
            console.log("Passed extraCareCardNumber: " + extraCareCardNumber);
            console.log("Passed couponSequenceNumber: " + couponSequenceNumber);

            couponsService.getAllCoupons().then(function (results) {
                coupon.clickedCoupon = 
                    $filter('filter')(results.data.CUST_INF_RESP.XTRACARE.CPNS.ROW, {
                    cpn_seq_nbr: couponSequenceNumber
                })[0];
                console.log("Clicked coupon: " + results.data.CUST_INF_RESP.XTRACARE.CPNS.ROW);
            });
        } else {
            console.log("Failed extraCareCardNumber: " + extraCareCardNumber);
            console.log("Failed couponSequenceNumber: " + couponSequenceNumber);
        }

        var requestBody = {
            extraCareCard: "2020202020",
            cpnSeqNbr: "29582525256",
            opCd: "V",
            ts: Date.now()
        }
        coupon.unSentCouponPath = "images/sendtocard.png";
        coupon.sentCouponPath = "images/sendtocarddone.png";


        var URL = "data/sendToCardSuccess.json";
        var isCouponSent = false;

        coupon.sendCouponToCard = function () {
            coupon.sendToCardResults = sendToCardService.sendToCardResults;
            console.log('Send to Card');
            sendToCardService.sendToCard(URL, requestBody)
                .then(function (response) {
                    console.log(response);
                });

            console.log("Send To Card Service: " + coupon.sendToCardResults);

            if (coupon.sendToCardResults != null) {
                isCouponSent = true;
            }

            return isCouponSent;
        };

    });
