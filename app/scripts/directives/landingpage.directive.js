'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:landingPageDirective
 * @description
 * # landingPageDirective
 */
angular.module('send2CardApp')
    .directive('landingPageDirective', function () {
        return {
            templateUrl: 'views/templates/landingpage-template.html',
            controller: function (couponsManagerFactory, progressBarFactory, queryParameterFactory) {

                var vm = this;
                var extraCareCardNumber;
                var couponNumber;

                initialise();

                function initialise() {
                    initialiseProperties();
                    getFilteredCouponLists(extraCareCardNumber, couponNumber);
                }

                function initialiseProperties() {
                    extraCareCardNumber = queryParameterFactory.getExtraCareCardNumberParameter();
                    couponNumber = queryParameterFactory.getCouponNumberParameter();
                }

                // vm.getFilteredCouponLists = function (extraCareCardNumber, couponNumber) {
                function getFilteredCouponLists(extraCareCardNumber, couponNumber) {
                    couponsManagerFactory.getFilteredCouponLists(extraCareCardNumber, couponNumber)
                        .then(getFilteredCouponListsSuccess)
                        .catch(getFilteredCouponListsFailed);
                }

                function getFilteredCouponListsSuccess(results) {
                         vm.couponsServiceData = results;
                    console.dir(vm.couponsServiceData);                    
                    //      return results;
                }

                function getFilteredCouponListsFailed(error) {

                }

                vm.resetCollapseStateForAll = function () {
                    couponsManagerFactory.resetCollapseStateForAll();
                }

                vm.displayProgressBar = function (display, actionedCoupon) {
                    if (display) {
                        progressBarFactory.toggleProgressBarDisplay(true);
                        progressBarFactory.updateProgressBarAfterAction(vm.couponsServiceData, actionedCoupon);
                    } else {
                        progressBarFactory.toggleProgressBarDisplay(false);
                    }
                }

            },
            controllerAs: 'landingPageController',
            bindToController: true,
            restrict: 'E'
        };
    });
