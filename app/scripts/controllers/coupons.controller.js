'use strict';

/**
 * @ngdoc function
 * @name send2CardApp.controller:CouponsCtrl
 * @description
 * # CouponsCtrl
 * Controller of the send2CardApp
 */
angular.module('send2CardApp')
    .controller('CouponsCtrl', function ($location, couponsService, sendToCardFactory) {

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

            coupons.columns = coupons.columnize(coupons.allCoupons, 2);
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
        coupons.isCouponSent = false;

        coupons.sendCouponToCard = function () {
            sendToCardFactory.sendToCard()
                .then(sendCouponComplete)
                .catch(sendCouponFailure);


            
        }

        function sendCouponComplete(data) {
            coupons.isCouponSent = true;
            console.log("Ctrl isCouponAlreadySent: " + coupons.isCouponSent);
            
            return coupons.isCouponSent;
        }

        function sendCouponFailure(data) {
            coupons.isCouponSent = false;
            console.log("CONTROLLER SOMETHING WRONG");
            
            return coupons.isCouponSent;
        }


        /*    
                coupons.sendCouponToCard = function () {
                    sendToCardFactory.sendToCard(URL, requestBody)
                        .then(function (response) {
                            coupons.sendToCardResults = response.data;
                            console.log("coupons.sendCouponToCard: " + response.data);
                        });

                    console.log("Send To Card Service: " + coupons.sendToCardResults);

                    if (coupons.sendToCardResults != null) {
                        coupons.isCouponSent = true;
                    }

                    return coupons.cisCouponSent;
                };*/

        var data = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
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
