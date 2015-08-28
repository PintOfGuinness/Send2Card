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
        var extraCareCardNumber = $location.search().eccardnum || "12345678";
        var couponNumber = $location.search().couponnum;
        coupons.sendCouponOnStartup = false;
        coupons.multiCouponError = false;
        coupons.singleCouponError = false;
        coupons.unSentCouponPath = "images/sendtocardicon.png";
        coupons.sentCouponPath = "images/senttocard.png";
        coupons.couponPrinted = "images/printedicon.png";
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

        function sendCouponFailure(data) {
            var isCouponSent = false;
            return isCouponSent;
        }

        coupons.clickPrintCoupon = function () {
            console.log($scope.state);
            window.print();
            $scope.updateState(2);
        }

        couponsService.getUnfilteredCoupons(extraCareCardNumber).then(function (results) {

        coupons.clickedCoupon = [];
        var singleCoupon = $filter('couponFilter')(results.data.CUST_INF_RESP.XTRACARE.CPNS.ROW, couponNumber, false);
        singleCoupon.state = 1;            
        coupons.clickedCoupon.push(singleCoupon);

        var allCoupons = $filter('couponFilter')(results.data.CUST_INF_RESP.XTRACARE.CPNS.ROW, couponNumber, true);
        var sortedCouponLists = $filter('sortCouponsFilter')(allCoupons);

        /*coupons.notYetActionedColumns = columniseFactory.columnise(sortedCouponLists.notYetActionedCoupons);
        coupons.readyToUseColumns = columniseFactory.columnise(sortedCouponLists.readyToUseCoupons);*/
            
        coupons.notYetActionedColumns = sortedCouponLists.notYetActionedCoupons;
        coupons.readyToUseColumns = sortedCouponLists.readyToUseCoupons;
            
        }).catch(function (error) {
            coupons.multiCouponError = true;
            console.log("ERROR: Error state = " + coupons.singleCouponError);
        });

        coupons.getIndexNumber = function(indexNumber, couponsPerRow) {
            var array=[];
           /* console.log("INDEX:" + indexNumber + "/COUponsPerRow:" + couponsPerRow);
            for (var i=indexNumber; i< couponsPerRow; i++){
                array.push(i);
                console.log(i);
            }*/
            
            var array=[indexNumber, indexNumber+1, indexNumber+2];
            //var array=[indexNumber, indexNumber+1];
            //var array=[indexNumber];
            return array;
        }

        /* Event triggered by any screen size change */
        /*        screenSize.on('xs, sm, md, lg', function (match) {
                    coupons.notYetActionedColumns = columniseFactory.columnise(coupons.notYetActionedCoupons);
                    coupons.readyToUseColumns = columniseFactory.columnise(coupons.readyToUseCoupons);
                });*/
    });
