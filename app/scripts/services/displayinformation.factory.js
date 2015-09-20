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

        return {
            getRowIndexNumbers: function (coupons, indexNumber, couponsCategory) {
                var rowIndexNumbers = [];
                var tempArray = [];

                if (couponsCategory == "unactioned") {
                    tempArray = coupons.couponsServiceData.unactionedCoupons;
                }
                if (couponsCategory == "actioned") {
                    tempArray = coupons.couponsServiceData.actionedCoupons;
                }
                for (var i = indexNumber; i < coupons.couponsPerRow + indexNumber; i++) {
                    if (i < tempArray.length) {
                        rowIndexNumbers.push(i);
                    }
                }

                return rowIndexNumbers;
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
