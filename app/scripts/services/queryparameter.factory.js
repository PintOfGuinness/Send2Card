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

        var queryParameterInformation = {
            extraCareCardNumber: $location.search().eccardnum,
            couponNumber: $location.search().couponnum
        };


        return {
            getQueryParameterInformation: getQueryParameterInformation,
            getExtraCareCardNumberParameter: getExtraCareCardNumberParameter,
            getCouponNumberParameter: getCouponNumberParameter,
            getExtraCareCardNumberEndDigits: getExtraCareCardNumberEndDigits
        };

        function getQueryParameterInformation() {
            return queryParameterInformation;
        }

        function getExtraCareCardNumberParameter() {
            return queryParameterInformation.extraCareCardNumber;
        }

        function getCouponNumberParameter() {
            return queryParameterInformation.couponNumber;
        }

        function getExtraCareCardNumberEndDigits() {
            var extraCareCardNumberEndDigits;
            if (angular.isDefined(queryParameterInformation.extraCareCardNumber)) {
                extraCareCardNumberEndDigits = queryParameterInformation.extraCareCardNumber.substring(queryParameterInformation.extraCareCardNumber.length - 4, queryParameterInformation.extraCareCardNumber.length);
            }
            return extraCareCardNumberEndDigits;
        }
    });
