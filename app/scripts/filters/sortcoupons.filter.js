'use strict';

/**
 * @ngdoc filter
 * @name send2CardApp.filter:sortCouponsFilter
 * @function
 * @description
 * # sortCouponFilter
 * Filter in the send2CardApp.
 */
angular.module('send2CardApp')
    .filter('sortCouponsFilter', function () {
        return function (couponList) {
            return sortCouponsByExpiryDate(couponList);
        };

        function sortCouponsByExpiryDate(couponList) {
            return couponList.sort(function (a, b) {
                a = new Date(a.expir_dt);
                b = new Date(b.expir_dt);
                return a < b ? -1 : a > b ? 1 : 0;
            });
        }
    });
