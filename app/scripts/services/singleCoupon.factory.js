'use strict';

/**
 * @ngdoc service
 * @name send2CardApp.sendSingleCouponFactory
 * @description
 * # sendToCard.Factory
 * Factory in the send2CardApp.
 */
angular.module('send2CardApp')
    .factory('singleCouponFactory', function ($http, $q, $filter) {

        return {
            sendSingleCoupon: function (extraCareCardNumber, couponSequenceNumber) {

                getTimeStampInECFormat();
                
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
                    .catch(function (error) {
                        console.log("SINGLE COUPON SERVICE SOMETHING WRONG");

                        error.state = 0;
                        return $q.reject(error);
                    });
            }
        }
        
        function getTimeStampInECFormat() {
            var timeStampFormat = "yyyyMMddHH:mm:ssZ";
            var formattedDate = $filter('date')(new Date(), timeStampFormat);
            console.log("Date " + formattedDate);
        }
    });
