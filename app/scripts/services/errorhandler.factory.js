'use strict';

/**
 * @ngdoc service
 * @name send2CardApp.errorHandlerFactory
 * @description
 * # errorHandlerFactory
 * Factory in the send2CardApp.
 */
angular.module('send2CardApp')
    .factory('errorHandlerFactory', function (constants) {

        return {
            processMissingExtraCareCardNumber: processMissingExtraCareCardNumber,
            processMissingCouponNumber: processMissingCouponNumber,
            processSingleCouponError: processSingleCouponError,
            processGetCustomerProfileError: processGetCustomerProfileError,
            processBulkCouponsError: processBulkCouponsError
        };

        function processMissingExtraCareCardNumber(primaryHandler) {
            if (primaryHandler) {
                return constants.TECHNICAL_ERROR;
            } else {
                return constants.BLANK_VIEW;
            }
        }

        function processMissingCouponNumber(primaryHandler) {
            if (primaryHandler) {
                return constants.VIEW_ALL_COUPONS_HEADER;
            } else {
                return constants.BLANK_VIEW;
            }
        }

        function processSingleCouponError(couponNumber, primaryHandler) {}

        function processGetCustomerProfileError(errorCode, primaryHandler) {}

        function processBulkCouponsError(errorCode, primaryHandler) {}
    });
