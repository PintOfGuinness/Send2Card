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
                    if (input[index].cpn_seq_nbr !== couponNumber) {
                        /*  console.log("Coupons Controller: " + eachCoupon + ", index: " + index);*/
                        if (couponViewable(eachCoupon)) {
                            output.push(eachCoupon);
                        }
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

        function couponViewable(eachCoupon) {
            var viewable = false;

            if (!couponRedeemed(eachCoupon)) {
                viewable = true;
                filterCoupon(eachCoupon);
            } else {
                viewable = false;
            }

            return viewable;
        }

        function filterCoupon(eachCoupon) {
            if (couponLoaded(eachCoupon)) {
                console.log("Coupon Loaded");
                eachCoupon.state = 1;
            } else {
                if (couponPrinted(eachCoupon)) {
                    console.log("Coupon Printed");
                    eachCoupon.state = 2
                } else {
                    console.log("Unactioned Coupon");
                    eachCoupon.state = 0;
                }
            }
        }

        function couponRedeemed(eachCoupon) {
            if (eachCoupon.redeemable_ind === "Y") {
                return false;
            } else {
                return true;
            }
        }

        function couponLoaded(eachCoupon) {
            if (eachCoupon.load_actl_dt === "") {
                return false;
            } else {
                return true;
            }
        }

        function couponPrinted(eachCoupon) {
            if (eachCoupon.prnt_actl_dt === "") {
                return false;
            } else {
                return true;
            }
        }

    });
