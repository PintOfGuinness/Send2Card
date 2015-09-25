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
        progressBarData.singlePercentage = 0;

        // Public API here
        return {
            updateProgressBarAfterAction: updateProgressBarAfterAction,
            toggleProgressBarDisplay: toggleProgressBarDisplay,
            getProgressBarText: getProgressBarText,
            getServiceData: getServiceData
        };

        function calculateInitialProperties(couponsData, actionedCoupon) {
            progressBarData.totalCoupons = getTotalNumberOfCoupons(couponsData);
            var singleCouponSavings = getSingleCouponSavings(couponsData.singleCoupon);
            progressBarData.unactionedSavings = getSavings(couponsData.unactionedCoupons);
            progressBarData.actionedSavings = getSavings(couponsData.actionedCoupons);

            progressBarData.actionedSavingsAsString = checkIfZeros((progressBarData.actionedSavings).toFixed(2));
            progressBarData.totalSavings = getTotalSavings(singleCouponSavings, progressBarData.unactionedSavings, progressBarData.actionedSavings);
            progressBarData.actionedLength = getActionedLength(couponsData.actionedCoupons);
            progressBarData.unactionedLength = getUnactionedLength(progressBarData.actionedLength, progressBarData.totalCoupons);
            progressBarData.progressBarValue = getProgressBarValue(progressBarData.actionedLength, progressBarData.totalCoupons);
            progressBarData.highestPercentage = getHighestPercentage(couponsData.actionedCoupons, actionedCoupon);
            console.log("Highest percentage = " + progressBarData.highestPercentage);
            progressBarData.savingsText = getProgressBarText(couponsData.actionedCoupons, actionedCoupon);

            if (progressBarData.savingsText.singlePercentSavingsDirective === true) {
                progressBarData.singlePercentage = getSinglePercentage(actionedCoupon);

            }


        } // end of calculate initial function

        function updateProgressBarAfterAction(couponsData, actionedCoupon) {
            if (propertiesInitialised === false) {
                calculateInitialProperties(couponsData, actionedCoupon);
                propertiesInitialised = true;
            }

            progressBarData.actionedLength++;
            progressBarData.unactionedLength = getUnactionedLength(progressBarData.actionedLength, progressBarData.totalCoupons);
            progressBarData.actionedSavings += updateActionedSavings(actionedCoupon);
            progressBarData.actionedSavingsAsString = checkIfZeros((progressBarData.actionedSavings).toFixed(2));
            progressBarData.progressBarValue = getProgressBarValue(progressBarData.actionedLength, progressBarData.totalCoupons);
            
            if(progressBarData.highestPercentage < actionedCoupon.pct_off_amt){
            progressBarData.highestPercentage = actionedCoupon.pct_off_amt;
            }

            var updatedCoupons = [];
            if (progressBarData.actionedLength === 0) {
                updatedCoupons = updateActionedCoupons(couponsData.actionedCoupons, actionedCoupon);
                progressBarData.savingsText = getProgressBarText(updateActionedCoupons(updatedCoupons, actionedCoupon));
            } else if (progressBarData.actionedLength > 1) {
                updatedCoupons = updateActionedCoupons(updatedCoupons, actionedCoupon);
                progressBarData.savingsText = getProgressBarText(updatedCoupons, actionedCoupon);

            }

            if (isSingleActionedCoupon(couponsData.actionedCoupons, actionedCoupon) === true) {
                progressBarData.singlePercentage = actionedCoupon.pct_off_amt;
            }

        }

        function isSingleActionedCoupon(coupons, actionedCoupon) {

            if (coupons.length === 0 && actionedCoupon != undefined) {
                return true
            } else {
                return false;
            }
        }

        function getProgressBarText(actionedCoupons, actionedCoupon) {
            var percentPresent = false;
            var dollarPresent = false;
            if (actionedCoupons.length != 0) {
                percentPresent = checkForDiscountType(actionedCoupons, constants.COUPON_TYPE_PERCENT);
                dollarPresent = checkForDiscountType(actionedCoupons, constants.COUPON_TYPE_DECIMAL);
            } else if (actionedCoupons.length === 0) {
                percentPresent = checkIfSingleCouponIsDiscountType(actionedCoupon, constants.COUPON_TYPE_PERCENT);
                dollarPresent = checkIfSingleCouponIsDiscountType(actionedCoupon, constants.COUPON_TYPE_DECIMAL);
            }

            if (percentPresent === true) {
                var singlePercent = isSingleActionedCoupon(actionedCoupons, actionedCoupons);
                var multiPercent = checkForMultiplePercent(actionedCoupons, actionedCoupon);
            }

            var savingsText = {};
            savingsText.dollarAndPercentSavingsDirective = false;
            savingsText.dollarSavingsDirective = false;
            savingsText.singlePercentSavingsDirective = false;
            savingsText.multiPercentSavingsDirective = false;


            // initial check for presence of dollar and percent discount
            if ((percentPresent === true) && (dollarPresent === true)) {
                savingsText.dollarAndPercentSavingsDirective = true;
            } else if (dollarPresent === true && percentPresent === false) {
                savingsText.dollarSavingsDirective = true;
            } else if (percentPresent === true && dollarPresent === false) {
                if (singlePercent === true) {
                    savingsText.singlePercentSavingsDirective = true;
                } else if (multiPercent === true) {
                    savingsText.multiPercentSavingsDirective = true;
                }
            }

            return savingsText;
        }

        function checkIfSingleCouponIsDiscountType(actionedCoupon, discountType) {
            if (actionedCoupon.amt_type_cd === discountType) {
                return true;
            } else {
                return false;
            }
        }


        function getSinglePercentage(actionedCoupon) {
            var singlePercentage = actionedCoupon.pct_off_amt;
            return singlePercentage;
        }

        function getHighestPercentage(actionedCoupons, actionedCoupon) {
            var highestPercentage = 0;

            if (actionedCoupons.length === 0) {
                return highestPercentage = actionedCoupon.pct_off_amt;
           
            } else if (actionedCoupons.length > 0) {
                angular.forEach(actionedCoupons, function (eachCoupon, index) {
                    if (eachCoupon.pct_off_amt > highestPercentage) {
                        highestPercentage = eachCoupon.pct_off_amt;
                    }
                });
                

                if (highestPercentage < actionedCoupon.pct_off_amt) {
                   return highestPercentage = actionedCoupon.pct_off_amt;
                }
            }
            return highestPercentage;
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
            if (actionedCoupons.length != 0) {
                if (actionedCoupons.length === 1) {
                    singlePercent = true;
                }
            }
            return singlePercent;
        }

        function updateActionedCoupons(coupons, actionedCoupon) {

            var updatedCoupons = [];

            if (coupons != undefined) {
                angular.forEach(coupons, function (eachCoupon, index) {
                    updatedCoupons[index] = coupons[index];
                });

                updatedCoupons[updatedCoupons.length] = actionedCoupon;
            }
            return updatedCoupons;
        }

        function checkForMultiplePercent(actionedCoupons, actionedCoupon) {
            var multiPercent = false;
            if (actionedCoupons.length > 0 && actionedCoupon != undefined) {
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

        function updateActionedSinglePercentage(actionedCoupon) {
            return actionedCoupon.pct_off_amt;
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