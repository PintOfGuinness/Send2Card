'use strict';

/**
 * @ngdoc filter
 * @name send2CardApp.filter:categoriseCouponsFilter
 * @function
 * @description
 * # categoriseCouponsFilter
 * Filter in the send2CardApp.
 */
angular.module('send2CardApp')
    .filter('categoriseCouponsFilter', function () {
        return function (input, couponNumberFilter, excludeCouponNumberFilter) {
            var output = [];

            if (excludeCouponNumberFilter) {
                output = getAllViewableCouponsByFilter(input, couponNumberFilter);
            } else {
                output = getSingleCouponByFilter(input, couponNumberFilter);
            }

            return output;
        };

        function getAllViewableCouponsByFilter(input, couponNumberFilter) {
            var output = {};
            var actionedCoupons = [];
            var unactionedCoupons = [];

            angular.forEach(input, function (eachCoupon, index) {

                if (input[index].cpn_seq_nbr !== couponNumberFilter) {
                    if (couponViewable(eachCoupon)) {
                        eachCoupon = $filter('couponTitleFilter')(eachCoupon);
                        setCouponCollapsedDefault(eachCoupon);
                        if (couponActioned(eachCoupon)) {
                            actionedCoupons.push(eachCoupon);
                        } else {
                            unactionedCoupons.push(eachCoupon);
                        }
                    }
                }
            });
            output.actionedCoupons = actionedCoupons;
            output.unactionedCoupons = unactionedCoupons;

            return output;
        }

        function getSingleCouponByFilter(input, couponNumberFilter) {
            var output = [];
            if (angular.isDefined(couponNumberFilter)) {
                output = $filter('filter')(input, {
                    cpn_seq_nbr: couponNumberFilter
                }, true)[0];

                if (angular.isDefined(output)) {
                    output = $filter('couponTitleFilter')(output);

                    setCouponCollapsedDefault(output);
                    couponExpiresSoon(output);
                }
            } else {
                output = undefined;
            };

            return output;
        }
    });
