'use strict';

/**
 * @ngdoc service
 * @name send2CardApp.couponsService
 * @description
 * # couponsService
 * Service in the send2CardApp.
 */
angular.module('drstc')
    .service('getCustomerProfileService', function couponsService($http) {

        var couponServicePromise = null;
        var service = {
            getUnfilteredCouponsFromJSON: getUnfilteredCouponsFromJSON,
            getUnfilteredCouponsFromService: getUnfilteredCouponsFromService
        };
        return service;

        function getUnfilteredCouponsFromJSON(extraCareCardNumber) {
            if (couponServicePromise === null) {
                couponServicePromise = $http.get("data/customer.json");
            }

            return couponServicePromise;
        }

        function getUnfilteredCouponsFromService() {
            return $http({
                method: 'POST',
                url: 'https://rri2eslatp1v.corp.cvscaremark.com:2030/DigitalService/ExtraCare/v1/ECGetCustomerProfile',
                headers: {
                    'Content-Type': 'application/json',
                    'src_loc_cd': '90042',
                    'msg_src_cd': 'M',
                    'user_id': 'MOBILE_ENT'
                },
                data: {
                    'extraCareCard': '4872000044959',
                    'card_type': '0004',
                    'xtracare': ['CPNS', 'PTS'],
                    'prefs': ['beauty_club', 'paperless_cpns']
                }
            }).then(function (response) {
                console.dir(response);
                return response;
            }).catch(function (error) {
                console.log("REAL SERVICE SOMETHING WRONG");

                error.state = 0;
                return $q.reject(error);
            });
        }
    });
