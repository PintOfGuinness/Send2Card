'use strict';

/**
 * @ngdoc service
 * @name send2CardApp.sendToCard.Factory
 * @description
 * # sendToCard.Factory
 * Factory in the send2CardApp.
 */
angular.module('send2CardApp')
    .factory('sendToCardFactory', function ($http) {

        var baseUrl = 'data/sendToCardSuccess.json';
        var requestBody = '';
    
        return {
            sendCouponToCard: function () {
                return $http({
                        method: 'get',
                        url: baseUrl,
                        data: requestBody
                    }).then(function (result) {
                    console.log("Send To Card Service: " + result.data);
                        var data = result.data;

                        /*                        if (data === "something I don't accept") {
                                                    return $q.reject("Invalid data");
                                                }

                                                var processedData = processData(data);*/
                        return data;
                    })
                    .catch(function (err) {
                        // for example, "re-throw" to "hide" HTTP specifics
                        console.log("SERVICE SOMETHING WRONG");
                        return $q.reject("Data not available");
                    })
            },
            // same idea for getReport
        }

    });
