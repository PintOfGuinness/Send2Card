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
            controller: function (couponsManagerFactory, progressBarFactory, queryParameterFactory, notificationViewsFactory, constants) {

                var vm = this;
                var extraCareCardNumber;
                var couponNumber;

                initialise();

                function initialise() {
                    initialiseProperties();
                    if (validateQueryParameters()) {
                        getFilteredCouponLists(vm.queryParameters.extraCareCardNumber, vm.queryParameters.couponNumber);
                    }
                }

                function initialiseProperties() {
                    vm.queryParameters = queryParameterFactory.getQueryParameterInformation();
                    vm.notificationControl = {
                        displayPrimary: true,
                        displaySecondary: true,
                        primaryPath: constants.BLANK_VIEW,
                        secondaryPath: constants.BLANK_VIEW
                    };
                }

                function validateQueryParameters() {
                    var success = false;

                    if (angular.isDefined(vm.queryParameters.extraCareCardNumber)) {
                        if (angular.isUndefined(vm.queryParameters.couponNumber) || vm.queryParameters.couponNumber === "") {
                            vm.notificationControl.primaryPath = notificationViewsFactory.getViewAllCouponsView();
                        } else {
                            vm.notificationControl.displayPrimary = false
                        }
                        vm.notificationControl.displaySecondary = false
                        
                        success = true;
                    } else {
                        vm.notificationControl.primaryPath = notificationViewsFactory.getTechnicalErrorView();
                        vm.notificationControl.secondaryPath = notificationViewsFactory.getBlankView();

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
                    vm.notificationControl.displaySecondary = false;
                }

                function getFilteredCouponListsFailed(error) {
                    vm.notificationControl.notificationPath = vm.notificationViewsFactory.getGetCustomerProfileNotification(error, true);
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
