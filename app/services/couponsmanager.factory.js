'use strict';

/**
 * @ngdoc service
 * @name send2CardApp.couponsManagerFactory
 * @description
 * # couponsManagerFactory
 * Factory in the send2CardApp.
 */
angular.module('send2CardApp')
    .factory('couponsManagerFactory', function (getCustomerProfileService, categoriseCouponsFilterFilter, sortCouponsFilterFilter, $q) {

        var couponLists = {};

        return {
            getFilteredCouponLists: getFilteredCouponLists,
            resetCollapseStateForAll: resetCollapseStateForAll
        };

        function getFilteredCouponLists(extraCareCardNumber, couponNumber) {
            return getCustomerProfileService.getUnfilteredCouponsFromJSON(extraCareCardNumber).then(function (results) {

                var allFilteredCoupons = categoriseCouponsFilterFilter(results.data.CUST_INF_RESP.XTRACARE.CPNS.ROW, couponNumber, true);
                couponLists.singleCoupon = getSingleCoupon(results.data.CUST_INF_RESP.XTRACARE.CPNS.ROW, couponNumber);
                couponLists.unactionedCoupons = getSortedCoupons(allFilteredCoupons.unactionedCoupons);
                couponLists.actionedCoupons = getSortedCoupons(allFilteredCoupons.actionedCoupons);
                couponLists.unactionedSavings = allFilteredCoupons.unactionedSavings;
                couponLists.actionedSavings = allFilteredCoupons.actionedSavings;

                return couponLists;

            }).catch(function (error) {
                console.log("getFilteredCouponLists SOMETHING WENT WRONG!!!!!!");

                return $q.reject(error);
            });
        }


        function getSingleCoupon(allUnactionedCoupons, couponNumber) {
            var singleCoupon = [];
            var filteredSingleCoupon = categoriseCouponsFilterFilter(allUnactionedCoupons, couponNumber, false);
            if (angular.isDefined(filteredSingleCoupon)) {
                singleCoupon.push(filteredSingleCoupon);
            } else {
                return undefined;
            }

            return singleCoupon;
        }

        function getSortedCoupons(couponsList) {
            return sortCouponsFilterFilter(couponsList);;
        }

        function resetCollapseStateForAll() {
            if (angular.isDefined(couponLists.singleCoupon)) {
                couponLists.singleCoupon[0].isCollapsed = true;
            }
            for (var i = 0; i < couponLists.unactionedCoupons.length; i++) {
                couponLists.unactionedCoupons[i].isCollapsed = true;
            }
            for (var i = 0; i < couponLists.actionedCoupons.length; i++) {
                couponLists.actionedCoupons[i].isCollapsed = true;
            }
        }

    });
