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

        /*        var allUnfilteredCoupons = [];*/
        var couponServicePromise = null;
        var service = {
            /*    allUnfilteredCoupons: allUnfilteredCoupons,*/
            getUnfilteredCoupons: getUnfilteredCoupons
        };
        return service;

        function getUnfilteredCoupons(extraCareCardNumber) {
            if (couponServicePromise === null) {
                // Coupon Service first time call
                console.log("DATA RETRIEVED FIRST TIME");
                couponServicePromise = $http.get("data/customer.json");
            }

            return couponServicePromise;
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
