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
        progressBarData.highestPercentage = 0;
        progressBarData.updatedActionedCoupons = [];

        // Public API here
        return {
            updateProgressBarAfterAction: updateProgressBarAfterAction,
            toggleProgressBarDisplay: toggleProgressBarDisplay,
            getProgressBarText: getProgressBarText,
            getServiceData: getServiceData,
            getCouponValue: getCouponValue
        };

        function getCouponValue(coupon) {
            switch (coupon.amt_type_cd) {
                case 'P':
                    return parseFloat(coupon.pct_off_amt);
                case 'D':
                    return parseFloat(coupon.max_redeem_amt);
                default:
                    return 0;
            }
        }
    
        function updateProgressBarAfterAction(couponsData, actionedCoupon) {
            if (propertiesInitialised === false) {
                calculateInitialProperties(couponsData, actionedCoupon);
                propertiesInitialised = true;
            }
            var updatedCoupons = [];
            updatedCoupons = updateActionedCoupons(couponsData.actionedCoupons, actionedCoupon);
            progressBarData.actionedLength++;
            progressBarData.unactionedLength = getUnactionedLength(progressBarData.actionedLength, progressBarData.totalCoupons);
            progressBarData.actionedSavings += updateActionedSavings(actionedCoupon);
            progressBarData.actionedSavingsAsString = checkIfZeros((progressBarData.actionedSavings).toFixed(2));
            progressBarData.progressBarValue = getProgressBarValue(progressBarData.actionedLength, progressBarData.totalCoupons);
            progressBarData.savingsText = getProgressBarText(updatedCoupons, actionedCoupon);
        }

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
            progressBarData.savingsText = getProgressBarText(couponsData.actionedCoupons, actionedCoupon);
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
            var singlePercent = false;
            var multiPercent = false;

            percentPresent = checkForDiscountType(actionedCoupons, constants.COUPON_TYPE_PERCENT);
            dollarPresent = checkForDiscountType(actionedCoupons, constants.COUPON_TYPE_DECIMAL);
            singlePercent = checkForSinglePercent(actionedCoupons);
            multiPercent = checkForMultiplePercent(actionedCoupons, actionedCoupon);
            if (multiPercent === true) {
                if (progressBarData.singlePercentage === actionedCoupon.pct_off_amt) {
                    multiPercent = false;
                    singlePercent = true;
                }
            }

            if (singlePercent === true) {
                progressBarData.singlePercentage = getSinglePercentage(actionedCoupon);
                progressBarData.highestPercentage = getSinglePercentage(actionedCoupon);
            } else if (multiPercent === true) {
                progressBarData.highestPercentage = getHighestPercentage(actionedCoupons, actionedCoupon);
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
            if (actionedCoupons.length > 0) {
                angular.forEach(actionedCoupons, function (eachCoupon, index) {
                    if (parseInt(progressBarData.highestPercentage) < parseInt(eachCoupon.pct_off_amt)) {
                        progressBarData.highestPercentage = eachCoupon.pct_off_amt;
                    }
                });

                if (parseInt(progressBarData.highestPercentage) < parseInt(actionedCoupon.pct_off_amt)) {
                    progressBarData.highestPercentage = actionedCoupon.pct_off_amt;
                }
            }
            return progressBarData.highestPercentage;
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
            if (coupons != undefined) {
                angular.forEach(coupons, function (eachCoupon, index) {
                    progressBarData.updatedActionedCoupons[index] = coupons[index];
                });

                progressBarData.updatedActionedCoupons[progressBarData.updatedActionedCoupons.length] = actionedCoupon;
            }
            return progressBarData.updatedActionedCoupons;
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
                if (eachCoupon.amt_type_cd != constants.COUPON_TYPE_PERCENT) {
                    savings += parseFloat(eachCoupon.max_redeem_amt);
                }
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
            if (actionedCoupon.amt_type_cd != constants.COUPON_TYPE_PERCENT) {
                actionedSavings += parseFloat(actionedCoupon.max_redeem_amt);
            }
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
