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
            controller: function (couponsManagerFactory, progressBarFactory, queryParameterFactory, notificationViewsFactory, digitalReceiptLandingConfiguration, viewAllCouponsConfiguration, pageConfiguration, constants) {

                var vm = this;
                var extraCareCardNumber;
                var couponNumber;

                initialise();

                function initialise() {
                    initialiseProperties();
                    if (validateExtraCareCardNumberExists()) {
                        getFilteredCouponLists(vm.queryParameters.extraCareCardNumber, vm.queryParameters.couponNumber);
                    }
                }

                function initialiseProperties() {
                    vm.queryParameters = queryParameterFactory.getQueryParameterInformation();
                    vm.configuration = {
                        landingPage: pageConfiguration,
                        digitalReceiptLanding: digitalReceiptLandingConfiguration,
                        viewAllCoupons: viewAllCouponsConfiguration
                    };
                    vm.primaryViewControl = {
                        display: false,
                        path: constants.BLANK_VIEW
                    };
                    vm.secondaryViewControl = {
                        display: false,
                        path: constants.BLANK_VIEW
                    };
                }

                function validateExtraCareCardNumberExists() {
                    var success = false;

                    if (angular.isDefined(vm.queryParameters.extraCareCardNumber)) {
                        success = true;
                    } else {
                        vm.primaryViewControl.display = true;
                        vm.primaryViewControl.path = notificationViewsFactory.getTechnicalErrorView();
                    }

                    return success;
                }

                function getFilteredCouponLists(extraCareCardNumber, couponNumber) {
                    couponsManagerFactory.getFilteredCouponLists(extraCareCardNumber, couponNumber)
                        .then(getFilteredCouponListsSuccess)
                        .catch(getFilteredCouponListsFailed);
                }

                function getFilteredCouponListsSuccess(results) {
                    vm.couponsServiceData = results;
                    
                    if(vm.couponsServiceData.unactionedCoupons.length === 0) {
                        vm.configuration.viewAllCoupons.DISPLAY_UNACTIONED_COUPONS = false;
                    }

                    if(vm.couponsServiceData.actionedCoupons.length === 0) {
                        vm.configuration.viewAllCoupons.DISPLAY_ACTIONED_COUPONS = false;
                    }
                    
                    if (validateCouponNumberExists()) {
                        vm.primaryViewControl.display = true;
                        vm.primaryViewControl.path = notificationViewsFactory.getCampaignHeaderView();
                    } else {
                        vm.primaryViewControl.display = true;
                        vm.primaryViewControl.path = notificationViewsFactory.getViewAllCouponsHeaderView();
                    }
                    vm.secondaryViewControl.display = true;
                }

                function validateCouponNumberExists() {
                    if (angular.isUndefined(vm.queryParameters.couponNumber) || vm.queryParameters.couponNumber === "") {
                        return false;
                    } else {
                        return true;
                    }
                }

                function getFilteredCouponListsFailed(error) {
                    vm.primaryViewControl.path = notificationViewsFactory.getGetCustomerProfileNotification(error, true);
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
            templateUrl: 'views/templates/landingpage-template.html',
            controllerAs: 'landingPageController',
            bindToController: true,
            restrict: 'E'
        };
    });
