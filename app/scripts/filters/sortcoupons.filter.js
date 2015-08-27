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
            
            var allCoupons = sortByReadyToUse(couponList);
            sortCouponsByExpiryDate(allCoupons.notYetActionedCoupons);
            sortCouponsByExpiryDate(allCoupons.readyToUseCoupons);
            return allCoupons;
        };

        function sortCouponsByExpiryDate(couponList) {
            return couponList.sort(function (a, b) {
                a = new Date(a.expir_dt);
                b = new Date(b.expir_dt);
                return a < b ? -1 : a > b ? 1 : 0;
            });
        }

        function sortByReadyToUse(couponList) {
            var notYetActionedCoupons = [];
            var readyToUseCoupons = [];
            var allCoupons = {};
            for (var i = 0; i < couponList.length; i++) {
                if (couponList[i].load_actl_dt === "" && couponList[i].prnt_actl_dt === "") {
                    notYetActionedCoupons.push(couponList[i]);
                } else {
                    readyToUseCoupons.push(couponList[i]);
                }
            }
            allCoupons.notYetActionedCoupons=notYetActionedCoupons;
            allCoupons.readyToUseCoupons=readyToUseCoupons;
            return allCoupons;
        }
    });
