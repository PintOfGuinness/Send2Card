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
        return function (unsortedCouponList) {
            var allSortedCoupons = sortCouponsByExpiryDate(unsortedCouponList);

            return allSortedCoupons;
        };

        function sortCouponsByExpiryDate(unsortedCouponList) {
            return unsortedCouponList.sort(function (date1, date2) {
                date1 = new Date(date1.expir_dt);
                date2 = new Date(date2.expir_dt);
                return date1 < date2 ? -1 : date1 > date2 ? 1 : 0;
            });
        }
    });
