'use strict';

/**
 * @ngdoc service
 * @name send2CardApp.couponsService
 * @description
 * # couponsService
 * Service in the send2CardApp.
 */
angular.module('send2CardApp')
    .service('couponsService', function couponsService($http) {

        var allCoupons = [];
        var service = {
            allCoupons: allCoupons,
            getAllCoupons: getAllCoupons
        };
        return service;

        function getAllCoupons(extraCareCardNumber) {
            return $http.get("data/customer2.json");
        }

        /*        function getAllCoupons() {
                    return $http({
                        method: 'POST',
                        url: 'https://esldp-east.corp.cvscaremark.com:2030/DigitalService/ExtraCare/v1/ECGetCustomerProfile',                
                        headers: {
                            'Content-Type': 'application/json',
                            'src_loc_cd': '90042',
                            'msg_src_cd': 'M',
                            'user_id': 'MOBILE_ENT'
                        },
                        data: {
                            'extraCareCard': '4872123456288',
                            'card_type': '0004',
                            'xtracare': ['CPNS', 'PTS'],
                            'prefs': ['beauty_club', 'paperless_cpns']
                        }                
                    })
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
