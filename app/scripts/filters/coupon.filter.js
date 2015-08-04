'use strict';

/**
 * @ngdoc filter
 * @name send2CardApp.filter:CouponFilter
 * @function
 * @description
 * # CouponFilter
 * Filter in the send2CardApp.
 */
angular.module('send2CardApp')
    .filter('couponFilter', function ($filter) {
        return function (input, couponNumber, excludeMode) {
            var output = [];

            console.log("Coupon Filter Input: " + input);
            if (excludeMode) {
                angular.forEach(input, function (eachCoupon, index) {
                    if (input[index].cpn_seq_nbr != couponNumber) {
                        /*                    console.log("Coupons Controller: " + eachCoupon + ", index: " + index);*/
                        output.push(eachCoupon);
                    }
                });
                            console.log("Coupon Filter Output exclude: " + output);
            } else {
                output = $filter('filter')(input, {
                        cpn_seq_nbr: couponNumber
                    }, true)[0];
                            console.log("Coupon Filter Output: " + output);
            }


            return output;
        };
    });
