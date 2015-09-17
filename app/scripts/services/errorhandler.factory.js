'use strict';

/**
 * @ngdoc service
 * @name send2CardApp.errorHandlerFactory
 * @description
 * # errorHandlerFactory
 * Factory in the send2CardApp.
 */
angular.module('send2CardApp')
    .factory('errorHandlerFactory', function () {

        return {
            processMissingExtraCareCardNumber: processMissingExtraCareCardNumber,
            processMissingCouponNumber: processMissingCouponNumber,
            processSingleCouponError: processSingleCouponError,
            processGetCustomerProfileError: processGetCustomerProfileError,
            processBulkCouponsError: processBulkCouponsError
        };

        function processMissingExtraCareCardNumber(primaryHandler) {
            if (primaryHandler) {
                return "views/error4.html"
            } else {
                return "views/blankarea.html"
            }
        }

        function processMissingCouponNumber(primaryHandler) {
            if (primaryHandler) {
                return "views/viewallcouponsheader.html";
            } else {
                return "views/blankarea.html";
            }
        }

        function processSingleCouponError(couponNumber, primaryHandler) {}

        function processGetCustomerProfileError(errorCode, primaryHandler) {}

        function processBulkCouponsError(errorCode, primaryHandler) {}
    });
