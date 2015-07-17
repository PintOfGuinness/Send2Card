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

        function getAllCoupons() {
            return $http.get("data/coupons.json")
        }

        /*
                function getAllCoupons() {
                    $http.get("data/coupons.json")
                        .then(function (results) {
                            //Success
                            angular.copy(results.data, allCoupons); //this is the preferred; instead of $scope.coupons = result.data
                        }, function (results) {
                            //Error
                        })
                }*/


    });
