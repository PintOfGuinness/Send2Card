'use strict';

/**
 * @ngdoc function
 * @name send2CardApp.controller:CouponsController
 * @description
 * # CouponsController
 * Controller of the send2CardApp
 */
angular.module('send2CardApp')
    .controller('CouponsController', function ($location, $filter, couponsService, sendToCardFactory, columniseFactory, $scope, screenSize) {

        var coupons = this;
        var allFilteredCoupons = [];

        /*
                var extraCareCardNumber = $location.search().eccardnum;*/

        var extraCareCardNumber = "12345678";
        var couponNumber = $location.search().couponnum;
        coupons.sendCouponOnStartup = false;
        coupons.multiCouponError = false;
        coupons.singleCouponError = false;
        var initialCouponsOnMobileLoad = 1;
        coupons.unSentCouponPath = "images/sendtocardicon.png";
        coupons.sentCouponPath = "images/senttocard.png";
        coupons.couponPrinted = "images/printedicon.png";
        coupons.cardNumber = extraCareCardNumber.substring(extraCareCardNumber.length - 4, extraCareCardNumber.length);


        coupons.sendCouponToCard = function () {
            console.log("EC Card No. = " + coupons.cardNumber);
            return sendToCardFactory.sendCouponToCard(extraCareCardNumber, couponNumber)
                .then(sendCouponComplete)
                .catch(sendCouponFailure);
        }

        function sendCouponComplete(data) {
            var isCouponSent = 1;
            return isCouponSent;
        }

        coupons.clickPrintCoupon = function () {
            console.log($scope.state);
            window.print();
            $scope.updateState(2);
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

        couponsService.getUnfilteredCoupons(extraCareCardNumber).then(function (results) {
            coupons.clickedCoupon = $filter('couponFilter')(results.data.CUST_INF_RESP.XTRACARE.CPNS.ROW, couponNumber, false);
            coupons.clickedCoupon.state = 1;
            var allCoupons = $filter('couponFilter')(results.data.CUST_INF_RESP.XTRACARE.CPNS.ROW, couponNumber, true);
            //allCoupons: List of Redeemable Coupons

            //1. Check load_actl_dt and print_actl_dt
            sortByReadyToUse(allCoupons);
            //if they both do not exist, add to NotYetActionedArray
            sortCouponsByExpiryDate(coupons.notYetActionedCoupons);
            sortCouponsByExpiryDate(coupons.readyToUseCoupons);

            coupons.notYetActionedColumns = columniseFactory.columnise(coupons.notYetActionedCoupons);
            coupons.readyToUseColumns = columniseFactory.columnise(coupons.readyToUseCoupons);
        }).catch(function (error) {
            console.log("BEEN AN ERROR");
            coupons.multiCouponError = true;
            console.log("Error state = " + coupons.singleCouponError);
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


        function sortCouponsByExpiryDate(couponList) {
            couponList.sort(function (a, b) {
                a = new Date(a.expir_dt);
                b = new Date(b.expir_dt);
                return a < b ? -1 : a > b ? 1 : 0;
            });
        }


        /* Event triggered by any screen size change */
        /*        screenSize.on('xs, sm, md, lg', function (match) {
                    coupons.notYetActionedColumns = columniseFactory.columnise(coupons.notYetActionedCoupons);
                    coupons.readyToUseColumns = columniseFactory.columnise(coupons.readyToUseCoupons);
                });*/
    });
