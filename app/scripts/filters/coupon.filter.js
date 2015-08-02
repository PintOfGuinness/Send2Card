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

            if (excludeMode) {
                angular.forEach(input, function (eachCoupon, index) {
                    if (input[index].cpn_seq_nbr != couponNumber) {
                        /*                    console.log("Coupons Controller: " + eachCoupon + ", index: " + index);*/
                        output.push(eachCoupon);
                    }
                });
            } else {
                output =
                    $filter('filter')(input, {
                        cpn_seq_nbr: couponNumber
                    }, true)[0];
            }

            console.log("Coupon Filter Ouput: " + output);
            return output;
        };
    });
