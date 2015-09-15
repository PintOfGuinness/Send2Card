'use strict';

/**
 * @ngdoc service
 * @name send2CardApp.queryParameterFactory
 * @description
 * # queryParameterFactory
 * Factory in the send2CardApp.
 */
angular.module('send2CardApp')
    .factory('queryParameterFactory', function ($location) {
        // Public API here
        return {
            getExtraCareCardNumberParameter: getExtraCareCardNumberParameter,
            getCouponNumberParameter: getCouponNumberParameter
        };

        function getExtraCareCardNumberParameter() {
            var extraCareCardNumber = $location.search().eccardnum || "12345678";
            return extraCareCardNumber;
        }

        function getCouponNumberParameter() {
            var couponNumber = $location.search().couponnum;
            return couponNumber;
        }

    });
