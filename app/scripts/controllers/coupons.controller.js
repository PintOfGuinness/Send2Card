'use strict';

/**
 * @ngdoc function
 * @name send2CardApp.controller:CouponsCtrl
 * @description
 * # CouponsCtrl
 * Controller of the send2CardApp
 */
angular.module('send2CardApp')
    .controller('CouponsCtrl', function ($location, couponsService, sendToCardService) {

        var coupons = this;
        coupons.allCoupons = [];

    
        var extraCareCardNumber = $location.search().eccardnum;
        var couponNumberFilter = $location.search().couponnum;
        if (typeof couponNumberFilter != 'undefined' && typeof extraCareCardNumber != 'undefined') {
            // throw error
            console.log("Passed extraCareCardNumber: " + extraCareCardNumber);
            console.log("Passed couponSequenceNumber: " + couponNumberFilter);
        }
    
        couponsService.getAllCoupons().then(function (results) {
            angular.forEach(results.data.CUST_INF_RESP.XTRACARE.CPNS.ROW, function (eachCoupon, index) {
                if (results.data.CUST_INF_RESP.XTRACARE.CPNS.ROW[index].cpn_seq_nbr != couponNumberFilter) {
                    console.log("Coupons Controller: " + eachCoupon + ", index: " + index);
                    coupons.allCoupons.push(eachCoupon);
                }
            });
        });


        var requestBody = {
            extraCareCard: "2020202020",
            cpnSeqNbr: "29582525256",
            opCd: "V",
            ts: Date.now()
        }

        coupons.unSentCouponPath = "images/sendtocard.png";
        coupons.sentCouponPath = "images/sendtocarddone.png";

        var URL = "data/sendToCardSuccess.json";
        var isCouponSent = true;    
    
        coupons.sendCouponToCard = function () {
            coupons.sendToCardResults = sendToCardService.sendToCardResults;
            console.log('Send to Card');
            sendToCardService.sendToCard(URL, requestBody)
                .then(function (response) {
                    console.log(response);
                });

            console.log("Send To Card Service: " + coupons.sendToCardResults);

            if (coupons.sendToCardResults != null) {
                isCouponSent = true;
            }

            return isCouponSent;
        };


    });
