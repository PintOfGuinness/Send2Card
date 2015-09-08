'use strict';

/**
 * @ngdoc service
 * @name send2CardApp.couponManagerFactory
 * @description
 * # couponManagerFactory
 * Factory in the send2CardApp.
 */
angular.module('send2CardApp')
    .factory('couponsManagerFactory', function (couponsService, $filter) {

        // Public API here
        return {
            getFilteredCouponLists: getFilteredCouponLists
        };

        function getFilteredCouponLists(extraCareCardNumber, couponNumber) {
  //          return couponsService.getUnfilteredCouponsFromService(extraCareCardNumber, couponNumber).then(function (results) {
            return couponsService.getUnfilteredCouponsFromJSON(extraCareCardNumber, couponNumber).then(function (results) {            
                var couponLists = {};
                var allFilteredCoupons = $filter('couponFilter')(results.data.CUST_INF_RESP.XTRACARE.CPNS.ROW, couponNumber, true);
                
                couponLists.singleCoupon = getSingleCoupon(results.data.CUST_INF_RESP.XTRACARE.CPNS.ROW, couponNumber);
                couponLists.unactionedCoupons = getSortedCoupons(allFilteredCoupons.unactionedCoupons);
                couponLists.actionedCoupons = getSortedCoupons(allFilteredCoupons.actionedCoupons);
                couponLists.unactionedSavings = allFilteredCoupons.unactionedSavings;
                couponLists.actionedSavings = allFilteredCoupons.actionedSavings;
                
                return couponLists;
                
            }).catch(function (error) {
                console.log("getFilteredCouponLists SOMETHING WENT WRONG!!!!!!");
                return error.multiCouponError = true;
            });
        }


        function getSingleCoupon(allUnactionedCoupons, couponNumber) {
            var singleCoupon = [];
            var filteredSingleCoupon = $filter('couponFilter')(allUnactionedCoupons, couponNumber, false);
            if (angular.isDefined(filteredSingleCoupon)) {
                singleCoupon.push(filteredSingleCoupon);
            } else {
                return undefined;
            }
            return singleCoupon;
        }

        function getSortedCoupons(couponsList) {
            var sortedCoupons = $filter('sortCouponsFilter')(couponsList);
            return sortedCoupons;
        }

    });
