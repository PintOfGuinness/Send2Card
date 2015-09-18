'use strict';

/**
 * @ngdoc service
 * @name send2CardApp.displayInformationFactory
 * @description
 * # displayInformationFactory
 * Factory in the send2CardApp.
 */
angular.module('send2CardApp')
    .factory('displayInformationFactory', function (screenSize) {

        // Public API here
        return {

            getRowIndexNumbers: function (coupons, indexNumber, arrayName) {
                var array = [];
                var couponArray = [];
                if (arrayName == "unactioned") {
                    couponArray = coupons.couponsServiceData.unactionedCoupons;
                }
                if (arrayName == "actioned") {
                    couponArray = coupons.couponsServiceData.actionedCoupons;
                }
                for (var i = indexNumber; i < coupons.couponsPerRow + indexNumber; i++) {
                    if (i < couponArray.length) {
                        array.push(i);
                    }
                }

                return array;
            },

            getDisplayMode: function () {

                var screenMode = {
                    mobile: false,
                    tablet: false,
                    desktop: false
                }

                if (screenSize.is('md, lg')) {
                    screenMode.desktop = true;
                } else if (screenSize.is('sm')) {
                    screenMode.tablet = true;
                } else if (screenSize.is('xs')) {
                    screenMode.mobile = true;
                }
                console.dir(screenMode);
                return screenMode;
            },



            getCouponsPerRow: function (coupons) {
                var couponsPerRow = 3;
                if (screenSize.is('md, lg')) {
                    coupons.couponsPerRow = 3;
                    return coupons.couponsPerRow;
                } else if (screenSize.is('sm')) {
                    coupons.couponsPerRow = 2;
                    return coupons.couponsPerRow;
                } else if (screenSize.is('xs')) {
                    coupons.couponsPerRow = 1;
                    return coupons.couponsPerRow;
                } else {
                    return coupons.couponsPerRow;
                }
            }

        };
    });
