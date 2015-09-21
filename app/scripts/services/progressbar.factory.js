'use strict';

/**
 * @ngdoc service
 * @name send2CardApp.progressBarFactory
 * @description
 * # progressBarFactory
 * Factory in the send2CardApp.
 */
angular.module('send2CardApp')
    .factory('progressBarFactory', function (constants) {

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

        function calculateInitialProperties(couponsData) {

            progressBarData.totalCoupons = getTotalNumberOfCoupons(couponsData);
            var singleCouponSavings = getSingleCouponSavings(couponsData.singleCoupon);
            progressBarData.unactionedSavings = getSavings(couponsData.unactionedCoupons);
            progressBarData.actionedSavings = getSavings(couponsData.actionedCoupons);

            //TODO clean this up
            progressBarData.actionedSavingsAsString = checkIfZeros((progressBarData.actionedSavings).toFixed(2));

            progressBarData.totalSavings = getTotalSavings(singleCouponSavings, progressBarData.unactionedSavings, progressBarData.actionedSavings);
            progressBarData.actionedLength = getActionedLength(couponsData.actionedCoupons);
            progressBarData.unactionedLength = getUnactionedLength(progressBarData.actionedLength, progressBarData.totalCoupons);
            progressBarData.progressBarValue = getProgressBarValue(progressBarData.actionedLength, progressBarData.totalCoupons);
        }

        function updateProgressBarAfterAction(couponsData, actionedCoupon) {

            if (propertiesInitialised === false) {
                calculateInitialProperties(couponsData);
                propertiesInitialised = true;
            }
            progressBarData.actionedLength++;
            progressBarData.unactionedLength = getUnactionedLength(progressBarData.actionedLength, progressBarData.totalCoupons);
            progressBarData.actionedSavings += updateActionedSavings(actionedCoupon);
            progressBarData.actionedSavingsAsString = (progressBarData.actionedSavings).toFixed(2);


            progressBarData.progressBarValue = getProgressBarValue(progressBarData.actionedLength, progressBarData.totalCoupons);
        }


        function checkIfZeros(savings) {

            var cents = savings.substring([savings.indexOf(constants.DOT) + 1], [savings.length]);
            console.log("Cents = " + cents);
            if ((cents === constants.DISPLAY_ZEROS)) {
                return savings.substring(savings[0], savings.indexOf(constants.DOT));
                console.log("Savings have zeros..." + savings);
            } else {
                console.log("Savings don't have zeros");
                return savings;
            }
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
                singleCouponSavings += parseFloat(singleCoupon[0].max_redeem_amt);
            }
            return singleCouponSavings;
        }

        function getSavings(coupons) {
            var savings = 0.00;
            angular.forEach(coupons, function (eachCoupon, index) {
                savings += parseFloat(eachCoupon.max_redeem_amt);
            });
            return savings;
        }

        function getTotalSavings(singleCoupon, unactionedSavings, actionedSavings) {
            return singleCoupon + unactionedSavings + actionedSavings;
        }

        function getActionedLength(actionedCoupons) {
            var actionedLength = actionedCoupons.length;
            return actionedLength;
        }

        function getUnactionedLength(actionedLength, totalCoupons) {
            var unactionedLength = totalCoupons - actionedLength;
            return unactionedLength;
        }

        function updateActionedSavings(actionedCoupon) {
            var actionedSavings = 0.00;
            console.log("Actioned redeem = " + actionedCoupon.max_redeem_amt);
            actionedSavings += parseFloat(actionedCoupon.max_redeem_amt);
            console.log("Actioned savings to 2 toFixed = " + (actionedSavings).toFixed(2));
            return actionedSavings;
        }

        function convertActionedSavingsToString(actionedSavings) {
            return (actionedSavings).toFixed(2);
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
