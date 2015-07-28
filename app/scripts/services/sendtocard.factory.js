'use strict';

/**
 * @ngdoc service
 * @name send2CardApp.sendToCard.Factory
 * @description
 * # sendToCard.Factory
 * Factory in the send2CardApp.
 */
angular.module('send2CardApp')
    .factory('sendToCardFactory', function () {

        var url = 'data/sendToCardSuccess.json';

        return {
            sendCouponToCard: function () {
                return $http({
                        method: 'get',
                        url: baseUrl,
                        data: requestBody
                    }).then(function (result) {
                        var data = result.data;

                        /*                        if (data === "something I don't accept") {
                                                    return $q.reject("Invalid data");
                                                }

                                                var processedData = processData(data);*/
                        return data;
                    })
                    .catch(function (err) {
                        // for example, "re-throw" to "hide" HTTP specifics
                        return $q.reject("Data not available");
                    })
            },
            // same idea for getReport
        }

    });
