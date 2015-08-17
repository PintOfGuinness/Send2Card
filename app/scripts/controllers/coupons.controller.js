'use strict';

/**
 * @ngdoc function
 * @name send2CardApp.controller:CouponsController
 * @description
 * # CouponsController
 * Controller of the send2CardApp
 */
angular.module('send2CardApp')
    .controller('CouponsController', function ($location, $filter, couponsService, sendToCardFactory, columniseFactory, $scope) {

        var coupons = this;
        var extraCareCardNumber = $location.search().eccardnum;

        var couponNumber = $location.search().couponnum;
        coupons.sendCouponOnStartup = false;
        var initialCouponsOnMobileLoad = 1;
        coupons.unSentCouponPath = "images/sendtocard.png";
        coupons.sentCouponPath = "images/sendtocarddone.png";
        coupons.couponPrinted = "images/printed.png";

        coupons.cardNumber = extraCareCardNumber.substring(extraCareCardNumber.length - 4, extraCareCardNumber.length);


        coupons.sendCouponToCard = function () {
            return sendToCardFactory.sendCouponToCard(extraCareCardNumber, couponNumber)
                .then(sendCouponComplete)
                .catch(sendCouponFailure);
        }

        function sendCouponComplete(data) {
            var isCouponSent = 1;
            return isCouponSent;
        }

        coupons.printCoupon = function () {
            $scope.printCoupon();
            console.log($scope.state);
            window.print();
        }

        coupons.notYetActionedLoadMoreCoupons = function () {
            coupons.notYetActionedFilteredMobileColumn = coupons.notYetActionedMobileColumn[0];
            $scope.hideNotYetActionedLoadMore = true;
        }

        coupons.readyToUseLoadMoreCoupons = function () {
            coupons.readyToUseFilteredMobileColumn = coupons.readyToUseMobileColumn[0];
            $scope.hideReadyToUseLoadMore = true;
        }

        function sendCouponFailure(data) {
            var isCouponSent = false;
            return isCouponSent;
        }

        couponsService.getAllCoupons(extraCareCardNumber).then(function (results) {
            coupons.clickedCoupon = $filter('couponFilter')(results.data.CUST_INF_RESP.XTRACARE.CPNS.ROW, couponNumber, false);
            coupons.clickedCoupon.state = 1;
            var allCoupons = $filter('couponFilter')(results.data.CUST_INF_RESP.XTRACARE.CPNS.ROW, couponNumber, true);
            //allCoupons: List of Redeemable Coupons
            addExpiresSoon(allCoupons);
            //1. Check load_actl_dt and print_actl_dt
            sortByReadyToUse(allCoupons);
            //if they both do not exist, add to NotYetActionedArray

            sortCouponsByExpiryDate(coupons.notYetActionedCoupons);
            sortCouponsByExpiryDate(coupons.readyToUseCoupons);

            coupons.notYetActionedDesktopColumns = columniseFactory.columnise(coupons.notYetActionedCoupons, 3);
            coupons.notYetActionedTabletColumns = columniseFactory.columnise(coupons.notYetActionedCoupons, 2);
            coupons.notYetActionedMobileColumn = columniseFactory.columnise(coupons.notYetActionedCoupons, 1);
            coupons.notYetActionedFilteredMobileColumn = coupons.notYetActionedMobileColumn[0].slice(0, initialCouponsOnMobileLoad);
            coupons.notYetActionedLoadMore = coupons.notYetActionedMobileColumn[0].length - initialCouponsOnMobileLoad;
            if (coupons.notYetActionedLoadMore <= 0) {
                $scope.hideNotYetActionedLoadMore = true;
            }

            coupons.readyToUseDesktopColumns = columniseFactory.columnise(coupons.readyToUseCoupons, 3);
            coupons.readyToUseTabletColumns = columniseFactory.columnise(coupons.readyToUseCoupons, 2);
            coupons.readyToUseMobileColumn = columniseFactory.columnise(coupons.readyToUseCoupons, 1);
            coupons.readyToUseFilteredMobileColumn = coupons.readyToUseMobileColumn[0].slice(0, initialCouponsOnMobileLoad);
            coupons.readyToUseLoadMore = coupons.readyToUseMobileColumn[0].length - initialCouponsOnMobileLoad;
            if (coupons.readyToUseLoadMore <= 0) {
                $scope.hideReadyToUseLoadMore = true;
            }
        });


        function sortByReadyToUse(couponList) {
            coupons.notYetActionedCoupons = [];
            coupons.readyToUseCoupons = [];
            for (var i = 0; i < couponList.length; i++) {
                if (couponList[i].load_actl_dt === "" && couponList[i].prnt_actl_dt === "") {
                    coupons.notYetActionedCoupons.push(couponList[i]);
                } else {
                    coupons.readyToUseCoupons.push(couponList[i]);
                }
            }
        }

        function updateStateInCouponList(couponList, state, barcode) {
            for (var i = 0; i < couponList.length; i++) {
                for (var j = 0; j < couponList[i].length; j++) {
                    if (couponList[i][j].cpn_seq_nbr === barcode) {
                        couponList[i][j].state = state;
                        break;
                    }
                }
            }
        }

        function sortCouponsByExpiryDate(couponList) {
            couponList.sort(function (a, b) {
                a = new Date(a.expir_dt);
                b = new Date(b.expir_dt);
                return a < b ? -1 : a > b ? 1 : 0;
            });
        }

        function addExpiresSoon(couponList) {
            for (var i = 0; i < couponList.length; i++) {
                var today = new Date();
                var expiresSoonRegion = new Date(today);
                expiresSoonRegion.setDate(today.getDate() + 14);
                var expiryDate = new Date(couponList[i].expir_dt);

                if (expiryDate < expiresSoonRegion) {
                    couponList[i].expiresSoon = true;
                } else {
                    couponList[i].expiresSoon = false;
                }
            }
        }

        $scope.updateState = function (state, barcode) {
            updateStateInCouponList(coupons.notYetActionedDesktopColumns, state, barcode);
            updateStateInCouponList(coupons.notYetActionedTabletColumns, state, barcode);
            updateStateInCouponList(coupons.notYetActionedMobileColumn, state, barcode);
            updateStateInCouponList(coupons.notYetActionedFilteredMobileColumn, state, barcode);
        };

    });
