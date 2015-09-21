'use strict';

/**
 * @ngdoc filter
 * @name send2CardApp.filter:couponTitleFilter
 * @function
 * @description
 * # couponTitleFilter
 * Filter in the send2CardApp.
 */
angular.module('send2CardApp')
    .filter('couponTitleFilter', function (constants) {
        return function (couponInput) {
            var couponOutput = [];

            if (couponTypeIsDiscountOff(couponInput)) {
                couponOutput = createDiscountOffTitle(couponInput);
            } else if (couponTypeIsPercentageOff(couponInput)) {
                couponOutput = createPercentageOffTitle(couponInput);
            }

            return couponOutput;
        };

        function couponTypeIsDiscountOff(couponInput) {
            if (couponInput.amt_type_cd === constants.COUPON_TYPE_DECIMAL) {
                return true;
            } else {
                return false;
            }
        }

        function couponTypeIsPercentageOff(couponInput) {
            if (couponInput.amt_type_cd === constants.COUPON_TYPE_PERCENT) {
                return true;
            } else {
                return false;
            }
        }

        function createDiscountOffTitle(couponInput) {
            couponInput.title = couponInput.max_redeem_amt;
            couponInput.showDollarSign = true;
            couponInput.showPercentSign = false;
            couponInput.dontShowCents = false;

            couponInput.dollars = couponInput.title.substring([0], couponInput.title.indexOf(constants.DOT));
            couponInput.cents = couponInput.title.substring([couponInput.title.indexOf(constants.DOT) + 1], [couponInput.title.length]);
            if ((couponInput.cents === constants.DISPLAY_ZEROS)) {
                couponInput.dontShowCents = true;
            } else {
                couponInput.dontShowCents = false;
            }
            return couponInput;
        }

        function createPercentageOffTitle(couponInput) {
            couponInput.showDollarSign = false;
            couponInput.showPercentSign = true;
            couponInput.title = couponInput.max_redeem_amt + constants.DISPLAY_SPACE + constants.DISPLAY_OFF;
            couponInput.dollar = couponInput.title.substring([0], couponInput.title.indexOf(constants.DOT));

            return couponInput;
        }
    });
