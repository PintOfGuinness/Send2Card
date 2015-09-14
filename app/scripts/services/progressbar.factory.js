'use strict';

/**
 * @ngdoc service
 * @name send2CardApp.progressBarFactory
 * @description
 * # progressBarFactory
 * Factory in the send2CardApp.
 */
angular.module('send2CardApp')
    .factory('progressBarFactory', function () {

        var progressBarData = {};
        var propertiesInitialised = false;
        progressBarData.display = false;
        progressBarData.unactionedLength = 0;
        progressBarData.actionedLength = 0;
        progressBarData.progressBarValue = 0;
        progressBarData.unactionedSavings = 0;
        progressBarData.actionedSavings = 0;
        progressBarData.totalCoupons = 0;

        // Public API here
        return {
            updateProgressBarAfterAction: updateProgressBarAfterAction,
            toggleProgressBarDisplay: toggleProgressBarDisplay,
            getServiceData: getServiceData
        };

        function calculateInitialSavings(couponsData) {

            progressBarData.totalCoupons = getTotalNumberOfCoupons(couponsData);
            progressBarData.actionedLength = couponsData.actionedCoupons.length;
            var singleCouponSavings = getSingleCouponSavings(couponsData.singleCoupon[0]);
            progressBarData.unactionedSavings = getUnactionedSavings(couponsData.unactionedCoupons);
            progressBarData.actionedSavings = getActionedSavings(couponsData.actionedCoupons);
            progressBarData.totalSavings = getTotalSavings(singleCouponSavings, progressBarData.unactionedSavings, progressBarData.actionedSavings);
            progressBarData.unactionedLength = getUnactionedLength(progressBarData.actionedLength, progressBarData.totalCoupons);
            progressBarData.progressBarValue = getProgressBarValue(progressBarData.actionedLength, progressBarData.totalCoupons);
        }

        function getTotalNumberOfCoupons(couponsData) {
            var totalNumberOfCoupons = couponsData.unactionedCoupons.length + couponsData.actionedCoupons.length;
            if (couponsData.singleCoupon != undefined) {
                totalNumberOfCoupons += couponsData.singleCoupon.length;
            }
            return totalNumberOfCoupons;
        }

        function getSingleCouponSavings(singleCoupon) {
            var singleCouponSavings = 0.00;
            if (singleCoupon != undefined) {
                singleCouponSavings += parseFloat(singleCoupon.max_redeem_amt);
            }
            return singleCouponSavings;
        }

        function getUnactionedSavings(unactionedCoupons) {
            var unactionedSavings = 0.00;
            angular.forEach(unactionedCoupons, function (eachCoupon, index) {
                unactionedSavings += parseFloat(eachCoupon.max_redeem_amt);
            });
            return unactionedSavings;
        }

        function getActionedSavings(actionedCoupons) {
            var actionedSavings = 0.00;
            angular.forEach(actionedCoupons, function (eachCoupon, index) {
                actionedSavings += parseFloat(eachCoupon.max_redeem_amt);
            });
            return actionedSavings;
        }

        function updateActionedSavings(actionedCoupon) {
            var actionedSavings = 0.00;
            actionedSavings += parseFloat(actionedCoupon.max_redeem_amt);
            return actionedSavings;
        }

        function getTotalSavings(singleCoupon, unactionedSavings, actionedSavings) {
            return singleCoupon + unactionedSavings + actionedSavings;
        }

        function updateProgressBarAfterAction(couponsData, actionedCoupon) {

            if (propertiesInitialised === false) {
                calculateInitialSavings(couponsData);
                propertiesInitialised = true;
            }
            progressBarData.actionedLength++;
            progressBarData.unactionedLength = getUnactionedLength(progressBarData.actionedLength, progressBarData.totalCoupons);
            progressBarData.actionedSavings += updateActionedSavings(actionedCoupon);
            progressBarData.progressBarValue = getProgressBarValue(progressBarData.actionedLength, progressBarData.totalCoupons);
        }

        function getUnactionedLength(actionedLength, totalCoupons) {
            var unactionedLength = totalCoupons - actionedLength;
            return unactionedLength;
        }

        function getProgressBarValue(actionedLength, totalCoupons) {
            var progressBarValue = (actionedLength / totalCoupons) * 100;
            return progressBarValue;
        }

        function getServiceData() {
            return progressBarData;
        }

        function toggleProgressBarDisplay(show) {
            progressBarData.display = show;
        }
    });
