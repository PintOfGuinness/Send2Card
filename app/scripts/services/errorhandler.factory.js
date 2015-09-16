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
            processSingleCouponError: processSingleCouponError,
            processGetCustomerProfileError: processGetCustomerProfileError,
            processBulkCouponsError: processBulkCouponsError
        };

        function processSingleCouponError(errorCode) {}

        function processGetCustomerProfileError(errorCode) {}

        function processBulkCouponsError(errorCode) {}
    });
