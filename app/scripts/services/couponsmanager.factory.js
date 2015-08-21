'use strict';

/**
 * @ngdoc service
 * @name send2CardApp.couponManagerFactory
 * @description
 * # couponManagerFactory
 * Factory in the send2CardApp.
 */
angular.module('send2CardApp')
    .factory('couponsManagerFactory', function (couponsService) {

        // Public API here
        var couponsManager = function getFilteredCoupons(extraCareCardNumber) {
            return couponsService.getUnfilteredCoupons(extraCareCardNumber);
        };


        /*            getFilteredCoupons: getFilteredCoupons*/
        /*            setCouponAsLoaded: setCouponAsLoaded,
                    setCouponAsPrinted: setCouponAsPrinted*/


        return couponsManager;

        // Service logic


        /*        function setCouponAsLoad(couponSequenceNumber) {
                    return null;
                }
            
                function setCouponAsPrinted(couponSequenceNumber) {
                    return null;            
                }  */
    });
