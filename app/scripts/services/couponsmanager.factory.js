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
            getFilteredCouponLists: getFilteredCouponLists,
            getFilteredCouponListsFromService: getFilteredCouponListsFromService
        };

        function getFilteredCouponListsFromService(extraCareCardNumber, couponNumber){
            //open with:
            //chrome.exe --user-data-dir="C:/Chrome dev session" --disable-web-security
            return couponsService.getUnfilteredCouponsFromService(extraCareCardNumber, couponNumber).then(function (results) {
                var couponLists = {};
                var allFilteredCoupons = $filter('couponFilter')(results.data.CUST_INF_RESP.XTRACARE.CPNS.ROW, couponNumber, true);
                couponLists.singleCoupon = getSingleCoupon(results.data.CUST_INF_RESP.XTRACARE.CPNS.ROW, couponNumber);

                couponLists.unactionedCoupons = getSortedCoupons(allFilteredCoupons.unactionedCoupons);
                couponLists.actionedCoupons = getSortedCoupons(allFilteredCoupons.actionedCoupons);

                return couponLists;
            });
        }
    
        function getFilteredCouponLists(extraCareCardNumber, couponNumber) {

            return couponsService.getUnfilteredCouponsFromJSON(extraCareCardNumber).then(function (results) {

                var couponLists = {};
                var allFilteredCoupons = $filter('couponFilter')(results.data.CUST_INF_RESP.XTRACARE.CPNS.ROW, couponNumber, true);
                couponLists.singleCoupon = getSingleCoupon(results.data.CUST_INF_RESP.XTRACARE.CPNS.ROW, couponNumber);

                couponLists.unactionedCoupons = getSortedCoupons(allFilteredCoupons.unactionedCoupons);
                couponLists.actionedCoupons = getSortedCoupons(allFilteredCoupons.actionedCoupons);

                return couponLists;

            }).catch(function (error) {
                console.log("getFilteredCouponLists SOMETHING WENT WRONG!!!!!!");
                return error.multiCouponError = true;
            });
        };

        function getSingleCoupon(allUnactionedCoupons, couponNumber) {
            var singleCoupon = [];
            singleCoupon.push($filter('couponFilter')(allUnactionedCoupons, couponNumber, false));
            return singleCoupon;
        }

        function getSortedCoupons(couponsList) {
            var sortedCoupons = $filter('sortCouponsFilter')(couponsList);
            return sortedCoupons;
        }

    });
