'use strict';

/**
 * @ngdoc function
 * @name send2CardApp.controller:CouponCtrl
 * @description
 * # CouponCtrl
 * Controller of the send2CardApp
 */
angular.module('send2CardApp')
    .controller('CouponCtrl', function ($filter, couponsService, sendToCardService) {

        var coupon = this;

        couponsService.getAllCoupons();
        coupon.allCoupons = couponsService.allCoupons;
        console.log("Coupon Controller: " + coupon.allCoupons);
       
        coupon.clickedCoupon = $filter('filter')(allCoupons.couponList, {cpn_seq_nbr: "50100113622"})[0];
        console.log("Send To Card Service: " + coupon.sendToCardResults);

        var requestBody = {
            extraCareCard: "2020202020",
            cpnSeqNbr: "29582525256",
            opCd: "V",
            ts: Date.now()
        }


        coupon.unSentCouponPath = "images/sendtocard.png";
        coupon.sentCouponPath = "images/sendtocarddone.png";

    
        var URL = "data/sendToCardSuccess.json";
        var isCouponSent = true;
    
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
