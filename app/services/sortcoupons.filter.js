'use strict';

/**
 * @ngdoc filter
 * @name send2CardApp.filter:sortCouponsFilter
 * @function
 * @description
 * # sortCouponFilter
 * Filter in the send2CardApp.
 */
angular.module('drstc')
    .filter('sortCouponsFilter', function (progressBarFactory) {
        return function (unsortedCouponList) {
            var allSortedCoupons = sortCouponsByExpiryDate(unsortedCouponList);
            allSortedCoupons = sortCouponsByExtrabucks(allSortedCoupons);
            return allSortedCoupons;
        };

        function sortCouponsByExpiryDate(unsortedCouponList) {
            return unsortedCouponList.sort(function (date1, date2) {
                date1 = new Date(date1.expir_dt);
                date2 = new Date(date2.expir_dt);
                return date1 < date2 ? -1 : date1 > date2 ? 1 : 0;
            });
        }

        function sortCouponsByExtrabucks(sortedCouponList) {
            var extrabucksArray = [];
            var nonextrabucksArray = [];
            for (var i = 0; i < sortedCouponList.length; i++) {
                if (sortedCouponList[i].isExtraBucks) {
                    extrabucksArray.push(sortedCouponList[i]);
                } else {
                    nonextrabucksArray.push(sortedCouponList[i]);
                }
            }
            
            sortMatchingExpiriesForExtrabucks(extrabucksArray);
            //merge arrays
            for(var i=0; i<nonextrabucksArray.length;i++){
                extrabucksArray.push(nonextrabucksArray[i]);
            }

            return extrabucksArray;
        }


        function sortMatchingExpiriesForExtrabucks(extrabucksArray) {
            var swapped;
            do {
                swapped = false;
                for (var i = 0; i < extrabucksArray.length - 1; i++) {
                    if (extrabucksArray[i].expir_dt == extrabucksArray[i + 1].expir_dt) {
                        if (progressBarFactory.getCouponValue(extrabucksArray[i]) <= progressBarFactory.getCouponValue(extrabucksArray[i + 1])) {
                                var temp = extrabucksArray[i];
                                extrabucksArray[i] = extrabucksArray[i + 1];
                                extrabucksArray[i + 1] = temp;
                                swapped = true;
                            }
                        }
                    }
                } while (swapped);
            return extrabucksArray;
            } 

        function getValue(coupon) {
            switch (coupon.amt_type_cd) {
                case 'P':
                    return parseFloat(coupon.pct_off_amt);
                case 'D':
                    return parseFloat(coupon.max_redeem_amt);
                default:
                    return 0;
            }
        }

    });
