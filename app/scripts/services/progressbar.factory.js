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
        progressBarData.savingsText = {};

        // Public API here
        return {
            updateProgressBarAfterAction: updateProgressBarAfterAction,
            toggleProgressBarDisplay: toggleProgressBarDisplay,
            getProgressBarText: getProgressBarText,
            getServiceData: getServiceData
        };

        function calculateInitialProperties(couponsData) {
            console.log("calculateInitialProperties " + couponsData)
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
            progressBarData.savingsText = getProgressBarText(couponsData.actionedCoupons);


        }

        function updateProgressBarAfterAction(couponsData, actionedCoupon) {

            if (propertiesInitialised === false) {
                calculateInitialProperties(couponsData);
                propertiesInitialised = true;
            }
            progressBarData.actionedLength++;
            progressBarData.unactionedLength = getUnactionedLength(progressBarData.actionedLength, progressBarData.totalCoupons);
            progressBarData.actionedSavings += updateActionedSavings(actionedCoupon);
            progressBarData.actionedSavingsAsString = checkIfZeros((progressBarData.actionedSavings).toFixed(2));
            progressBarData.progressBarValue = getProgressBarValue(progressBarData.actionedLength, progressBarData.totalCoupons);
            progressBarData.savingsText = getProgressBarText(couponsData.actionedCoupons);
            console.dir(progressBarData.savingsText);
        }

        function getProgressBarText(actionedCoupons) {
            var percentPresent = checkForDiscountType(actionedCoupons, "P");
            var dollarPresent = checkForDiscountType(actionedCoupons, "D");
            var singlePercent = checkForSinglePercent(actionedCoupons);
            var multiPercent = checkForMultiplePercent(actionedCoupons);
            var savingsText = {};
            savingsText.dollarAndPercentSavingsDirective = false;
            savingsText.dollarSavingsDirective = false;
            savingsText.singlePercentSavingsDirective = false;
            savingsText.multiPercentSavingsDirective = false;


            // initial check for presence of dollar and percent discount
            if (percentPresent === true && dollarPresent === true) {
                console.log("Dollar and percent directive true");
                savingsText.dollarAndPercentSavingsDirective = true;
            }
            // dollar saving, not percent
            if (dollarPresent === true && percentPresent === false) {
                console.log("Dollar saving directive true");
                savingsText.dollarSavingsDirective = true;
                console.log(savingsText.dollarSavingsDirective);
            }

            // check percentages then determine if single or multi
            if (percentPresent === true && dollarPresent === false) {

                if (singlePercent === true) {
                    console.log("Single percent directive true");
                    savingsText.singlePercentSavingsDirective = true;
                } else if (multiPercent === true) {
                    console.log("Multi percent directive true");
                    savingsText.multiPercentSavingsDirective = true;
                }
            }

            return savingsText;
        }

        function checkForDiscountType(coupons, discountType) {
            var discountPresent = false;
            angular.forEach(coupons, function (eachCoupon, index) {
                if (eachCoupon.amt_type_cd === discountType) {
                    discountPresent = true;
                }
            });
            return discountPresent;
        }

        function checkForSinglePercent(actionedCoupons) {
            var singlePercent = false;
            console.log("checkForSinglePercent");
            console.log(actionedCoupons.length);
            if (actionedCoupons.length === 1) {
                singlePercent = true;
            }
            return singlePercent;
        }

        function checkForMultiplePercent(actionedCoupons) {
            var multiPercent = false;
            if (actionedCoupons.length > 1) {
                multiPercent = true;
            }
            return multiPercent;
        }

        function checkIfZeros(savings) {

            var cents = savings.substring(savings.indexOf(constants.DOT) + 1, savings.length);
            if ((cents === constants.DISPLAY_ZEROS)) {
                return savings.substring(0, savings.indexOf(constants.DOT));
            } else {
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
            actionedSavings += parseFloat(actionedCoupon.max_redeem_amt);
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
