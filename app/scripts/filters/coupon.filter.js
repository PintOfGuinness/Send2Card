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
                couponExpiresSoon(output);

            }
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
                eachCoupon.state = 1;
            } else {
                if (couponPrinted(eachCoupon)) {
                    eachCoupon.state = 2
                } else {
                    eachCoupon.state = 0;
                }
            }
            couponExpiresSoon(eachCoupon);
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

        function couponExpiresSoon(eachCoupon) {
            console.log("hitting expiry function in the filter: " + eachCoupon.expir_dt);
            var today = new Date();
            var expiresSoonRegion = new Date(today);
            expiresSoonRegion.setDate(today.getDate() + 14);
            var expiryDate = new Date(eachCoupon.expir_dt);

            if (expiryDate < expiresSoonRegion) {
                eachCoupon.expiresSoon = true;
                           console.log("Expires soon");
            } else {
                eachCoupon.expiresSoon = false;
                                           console.log("Not Expires soon");
            }
        }
    });
