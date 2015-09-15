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
    .filter('couponTitleFilter', function () {
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
            if (couponInput.amt_type_cd === "D") {
                return true;
            } else {
                return false;
            }
        }

        function couponTypeIsPercentageOff(couponInput) {
            if (couponInput.amt_type_cd === "P") {
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

            couponInput.dollars = couponInput.title.substring([0], couponInput.title.indexOf('.'));
            couponInput.cents = couponInput.title.substring([couponInput.title.indexOf('.') + 1], [couponInput.title.length]);

            var zeros = '00';

            if ((couponInput.cents === zeros)) {
                couponInput.dontShowCents = true;
            } else {
                couponInput.dontShowCents = false;
            }
            
            return couponInput;            
        }

        function createPercentageOffTitle(couponInput) {
            couponInput.showDollarSign = false;
            couponInput.showPercentSign = true;
            couponInput.title = couponInput.max_redeem_amt + " off";
            couponInput.dollar = couponInput.title.substring([0], couponInput.title.indexOf('.'));
            
            return couponInput;
        }
    });
