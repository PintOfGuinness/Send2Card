'use strict';

/**
 * @ngdoc service
 * @name send2CardApp.sendSingleCouponFactory
 * @description
 * # sendToCard.Factory
 * Factory in the send2CardApp.
 */
angular.module('send2CardApp')
    .factory('singleCouponFactory', function ($http, $q) {

        return {
            sendSingleCoupon: function (extraCareCardNumber, couponSequenceNumber) {

                var baseUrl = 'data/sendToCardSuccess.json';
                var requestBody = {
                    extraCareCard: extraCareCardNumber,
                    cpnSeqNbr: couponSequenceNumber,
                    opCd: "V",
                    ts: Date.now()
                }
                return $http({
                        method: 'get',
                        url: baseUrl,
                        data: requestBody
                    }).then(function (result) {
                        var data = result.data;

                        // If success return 1 (Load)
                        data.state = 1;
                        /*data.couponSequenceNumber = couponSequenceNumber;*/
                        return data;
                    })
                    .catch(function (err) {
                        console.log("SERVICE SOMETHING WRONG");
                        return $q.reject("Data not available");
                    });
            }
        }
    });
