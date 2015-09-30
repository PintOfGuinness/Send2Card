'use strict';

/**
 * @ngdoc service
 * @name send2CardApp.queryParameterFactory
 * @description
 * # queryParameterFactory
 * Factory in the send2CardApp.
 */
angular.module('drstc')
    .factory('queryParameterFactory', function ($location) {

        var queryParameterInformation = {
            extraCareCardNumber: $location.search().eccardnum,
            couponNumber: $location.search().couponnum
        };


        return {
            getQueryParameterInformation: getQueryParameterInformation,
            getExtraCareCardNumber: getExtraCareCardNumber,
            getCouponNumber: getCouponNumber,
            getExtraCareCardNumberEndDigits: getExtraCareCardNumberEndDigits
        };

        function getQueryParameterInformation() {
            return queryParameterInformation;
        }

        function getExtraCareCardNumber() {
            return queryParameterInformation.extraCareCardNumber;
        }

        function getCouponNumber() {
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
