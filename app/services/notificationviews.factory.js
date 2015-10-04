'use strict';

/**
 * @ngdoc service
 * @name send2CardApp.notificationViewsFactory
 * @description
 * # notificationViewsFactory
 * Factory in the send2CardApp.
 */
angular.module('drstc')
    .factory('notificationViewsFactory', function (constants, campaignLandingConfiguration) {

        return {
            getBlankView: getBlankView,
            getTechnicalErrorView: getTechnicalErrorView,
            getViewAllCouponsHeaderView: getViewAllCouponsHeaderView,
            getCampaignHeaderView: getCampaignHeaderView,
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

        function getViewAllCouponsHeaderView() {
            return constants.VIEW_ALL_COUPONS_HEADER;
        }

        function getCampaignHeaderView() {
            if (campaignLandingConfiguration.AUTO_SEND_SINGLE_COUPON) {
                return constants.DIGITAL_RECEIPT_CAMPAIGN_HEADER;
            } else {
                return constants.EXTRACARE_EMAIL_CAMPAIGN_HEADER;
            }
        }

        function getSingleCouponNotification(errorCode, primaryHandler) {
            return constants.COUPON_EXPIRED;
        }

        function getGetCustomerProfileNotification(errorCode, primaryHandler) {
            return constants.TECHNICAL_ERROR;
        }

        function getBulkCouponsNotification(errorCode, primaryHandler) {}
    });
