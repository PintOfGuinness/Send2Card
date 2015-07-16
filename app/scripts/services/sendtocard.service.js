'use strict';

/**
 * @ngdoc service
 * @name send2CardApp.send2CardService
 * @description
 * # send2CardService
 * Service in the send2CardApp.
 */
angular.module('send2CardApp')
    .service('sendToCardService', function sendToCardService($http, $q) {

        var sendToCardResults = [];
        var service = {
            sendToCardResults: sendToCardResults,
            sendToCard: sendToCard,
/*            mockSendToCard: mockSendToCard*/
        };
        return service;

        function sendToCard(URL, requestBody) {
            return $http({
                method: 'get',
                url: URL,
                data: requestBody
            }).then(function (results) {
                //Success
                console.log("Success: " + results.data + ", "+ URL + requestBody.cpnSeqNbr + ", " + requestBody.extraCareCard + ", " + requestBody.opCd + ", " + requestBody.ts);
                angular.copy(results.data, sendToCardResults);
 
            }, function (results) {
                console.log("Fail: " + URL + requestBody);
                //            logger.error(message, reason);
            });
        }
    
/*        function mockSendToCard(URL, requestBody){
            var deferred = $q.defer();
            deferred.resolve(fakeResponse);
            return deferred.promise;
        }
    
        var fakeResponse = {
          "cpnSeqNbr": "50100102547",
          "statusCd": "10",
          "redeemEndDt": null
        }*/
        
    });

/*

function POST(URL, requestParams, requestBody, ResponseModel) {
    return $http({
        method: 'POST',
        url: URL + requestParams,
        data: requestBody
    }).then(serviceCallComplete)['catch'](serviceCallFailed);

    function serviceCallComplete(responseBody) {
        if (ResponseModel) {
            return angular.extend({}, new ResponseModel(), responseBody);
        }
        return responseBody;
    }

    function serviceCallFailed(error) {
        return $q.reject(error);
    }
}
*/
