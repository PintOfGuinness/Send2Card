'use strict';

/**
 * @ngdoc function
 * @name send2CardApp.controller:CouponsCtrl
 * @description
 * # CouponsCtrl
 * Controller of the send2CardApp
 */
angular.module('send2CardApp')
    .controller('CouponsCtrl', function (couponsService, sendToCardService) {

        var coupons = this;

        couponsService.getAllCoupons();
        coupons.allCoupons = couponsService.allCoupons.couponList;
        console.log("Coupons all: " + coupons.allCoupons[0]);
                    
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
            .then(function (response){
                console.log(response);
            });

            console.log("Send To Card Service: " + coupons.sendToCardResults);

            if (coupons.sendToCardResults != null) {
                isCouponSent = true;
            }

            return isCouponSent;
        };


    });
