'use strict';

/**
 * @ngdoc service
 * @name send2CardApp.notificationViewsFactory
 * @description
 * # notificationViewsFactory
 * Factory in the send2CardApp.
 */
angular.module('send2CardApp')
    .factory('notificationViewsFactory', function (constants) {

        return {
            getBlankView: getBlankView,
            getTechnicalErrorView: getTechnicalErrorView,
            getViewAllCouponsView: getViewAllCouponsView,
            getSingleCouponNotification: getSingleCouponNotification,
            getGetCustomerProfileNotification: getGetCustomerProfileNotification,
            getBulkCouponsNotification: getBulkCouponsNotification
        };

        function getBlankView() {
            return constants.BLANK_VIEW;
        }

        function getTechnicalErrorView() {
            return constants.TECHNICAL_ERROR;
        }
    
        function getViewAllCouponsView() {
            return constants.VIEW_ALL_COUPONS_HEADER;
        }

        function getSingleCouponNotification(errorCode, primaryHandler) {
            return constants.COUPON_EXPIRED;
        }

        function getGetCustomerProfileNotification(errorCode, primaryHandler) {
            return constants.TECHNICAL_ERROR;
        }

        function getBulkCouponsNotification(errorCode, primaryHandler) {}
    });
