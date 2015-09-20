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

        var extraCareCardNumber;
    
        return {
            getExtraCareCardNumberParameter: getExtraCareCardNumberParameter,
            getCouponNumberParameter: getCouponNumberParameter,
            getExtraCareCardNumberEndDigits: getExtraCareCardNumberEndDigits
        };

        function getExtraCareCardNumberParameter() {
            extraCareCardNumber = $location.search().eccardnum;
            return extraCareCardNumber;
        }

        function getExtraCareCardNumberEndDigits() {
            var extraCareCardNumberEndDigits = extraCareCardNumber.substring(extraCareCardNumber.length - 4, extraCareCardNumber.length);
            
            return extraCareCardNumberEndDigits;
        }
    
        function getCouponNumberParameter() {
            var couponNumber = $location.search().couponnum;
            return couponNumber;
        }

    });
