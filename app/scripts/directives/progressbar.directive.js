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
                    progressBarServiceData: '='
            },
            controller: function ($location, progressBarFactory) {
         //       var progressBar = this;

                
           //     var progressBarService = progressBarFactory.progressBarData;
           //     this.toggleProgressBar = progressBarFactory.display;
          //      console.log("display: " + progressBarFactory.display);
        /*        progressBar.showProgressBar = false;*/

                var extraCareCardNumber = $location.search().eccardnum || "12345678";
                var couponNumber = $location.search().couponnum;

                this.progressBarServiceData = progressBarFactory.getServiceData();
/*                progressBarFactory.getServiceData().then(function (results) {

                    this.progressBarServiceData = results;

                }).catch(function (error) {
                              coupons.multiCouponError = error.multiCouponError;
                });*/

/*                progressBar.hideProgressBarOnCTA = function () {
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
                }*/
            },
            controllerAs: 'progressBarController',
            bindToController: true,
            restrict: 'E',
            link: function postLink(scope, element, attrs) {}
        };


    });
