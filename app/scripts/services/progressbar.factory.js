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
        /*        progressBarData.unactionedLength = 0;*/
        progressBarData.actionedLength = 0;
        progressBarData.progressBarValue = 0;
        progressBarData.unactionedSavings = 0;
        progressBarData.actionedSavings = 0;
        progressBarData.totalCoupons = 0;

        // Public API here
        return {
            /*   calculateInitialSavings: calculateInitialSavings,*/
            updateProgressBarAfterAction: updateProgressBarAfterAction,
            toggleProgressBarDisplay: toggleProgressBarDisplay,
            getServiceData: getServiceData
        };

        function calculateInitialSavings(couponsData) {

            progressBarData.totalCoupons = getTotalNumberOfCoupons(couponsData);
            /*            progressBarData.unactionedLength = couponsData.unactionedCoupons.length;*/
            progressBarData.actionedLength = couponsData.actionedCoupons.length;
            progressBarData.unactionedSavings = calculateUnactionedSavings(couponsData.unactionedCoupons);
            progressBarData.actionedSavings = calculateActionedSavings(couponsData.actionedCoupons);
            progressBarData.totalSavings = calculateTotalSavings(progressBarData.unactionedSavings, progressBarData.actionedSavings);
            progressBarData.progressBarValue = getProgressBarValue(progressBarData.actionedLength, progressBarData.totalCoupons);
        }

        function getTotalNumberOfCoupons(couponsData) {
            var totalNumberOfCoupons = couponsData.unactionedCoupons.length + couponsData.actionedCoupons.length;
            if (couponsData.singleCoupon != undefined) {
                totalNumberOfCoupons += couponsData.singleCoupon.length;
            }
            return totalNumberOfCoupons;
        }

        function calculateUnactionedSavings(unactionedCoupons) {
            var unactionedSavings = 0.00;
            angular.forEach(unactionedCoupons, function (eachCoupon, index) {
                unactionedSavings += parseFloat(eachCoupon.max_redeem_amt);
            });
            return unactionedSavings;
        }

        function calculateActionedSavings(actionedCoupons) {
            var actionedSavings = 0.00;
            angular.forEach(actionedCoupons, function (eachCoupon, index) {
                actionedSavings += parseFloat(eachCoupon.max_redeem_amt);
            });
            return actionedSavings;
        }

        function calculateTotalSavings(unactionedSavings, actionedSavings) {
            return unactionedSavings + actionedSavings;
        }

        function updateProgressBarAfterAction(couponsData) {
            if (propertiesInitialised === false) {
                calculateInitialSavings(couponsData);
                propertiesInitialised = true;
            }
            progressBarData.actionedLength++;
            progressBarData.progressBarValue = getProgressBarValue(progressBarData.actionedLength, progressBarData.totalCoupons);
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
