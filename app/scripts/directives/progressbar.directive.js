'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:progressBarDirective
 * @description
 * # progressBarDirective
 */
angular.module('send2CardApp')
    .directive('progressBarDirective', function () {
        return {
            templateUrl: 'views/progress-bar-template.html',
            scope: {
                /*    showProgressBar: '=';*/
            },
            controller: function ($location, couponsManagerFactory) {
                var progressBar = this;

                progressBar.showProgressBar = false;

                var extraCareCardNumber = $location.search().eccardnum || "12345678";
                var couponNumber = $location.search().couponnum;
                couponsManagerFactory.getFilteredCouponLists(extraCareCardNumber, couponNumber).then(function (results) {

                    /*          if (angular.isUndefined(results.singleCoupon)) {
                                coupons.couponError = true;
                                coupons.errorPath = "views/error4.html";
                              }*/
                    progressBar.couponsServiceData = results;

                    var totalCoupons = progressBar.couponsServiceData.actionedCoupons.length + progressBar.couponsServiceData.unactionedCoupons.length;
                    progressBar.unactionedLength = progressBar.couponsServiceData.unactionedCoupons.length;
                    progressBar.actionedLength = progressBar.couponsServiceData.actionedCoupons.length;
                    progressBar.progressBarValue = (progressBar.couponsServiceData.actionedCoupons.length / totalCoupons) * 100;

                }).catch(function (error) {
                    /*          coupons.multiCouponError = error.multiCouponError;*/
                });

                progressBar.hideProgressBarOnCTA = function () {
                    console.log("show progress bar before setting to true..." + progressBar.showProgressBar);
                    progressBar.showProgressBar = false;
                    console.log("show progress bar after setting to true..." + progressBar.showProgressBar);
                }

                progressBar.incrementProgressBarValue = function () {
                    var totalLength = progressBar.actionedLength + progressBar.unactionedLength;

                    progressBar.unactionedLength--;
                    progressBar.actionedLength++;

                    var progressValue = (progressBar.actionedLength / totalLength) * 100;
                    progressBar.progressBarValue = progressValue;
                }
            },
            controllerAs: 'progressBarController',
            bindToController: true,
            restrict: 'E',
            link: function postLink(scope, element, attrs) {}
        };


    });
