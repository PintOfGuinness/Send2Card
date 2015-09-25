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
                    if (validateExtraCareCardNumber()) {
                        getFilteredCouponLists(vm.queryParameters.extraCareCardNumber, vm.queryParameters.couponNumber);
                    }
                }

                function initialiseProperties() {
                    vm.queryParameters = queryParameterFactory.getQueryParameterInformation();
                    vm.primaryNotificationControl = {
                        display: true,
                        path: constants.BLANK_VIEW
                    };
                    vm.secondaryNotificationControl = {
                        display: true,
                        path: constants.BLANK_VIEW
                    };
                }

                function validateExtraCareCardNumber() {
                    var success = false;

                    if (angular.isDefined(vm.queryParameters.extraCareCardNumber)) {
                        success = true;
                    } else {
                        vm.primaryNotificationControl.path = notificationViewsFactory.getTechnicalErrorView();
                        vm.secondaryNotificationControl.path = notificationViewsFactory.getBlankView();
                    }

                    return success;
                }

                /*                function validateQueryParameters() {
                                    var success = false;

                                    if (angular.isDefined(vm.queryParameters.extraCareCardNumber)) {
                                        if (angular.isUndefined(vm.queryParameters.couponNumber) || vm.queryParameters.couponNumber === "") {
                                            vm.primaryNotificationControl.display = true;
                                            vm.primaryNotificationControl.path = notificationViewsFactory.getViewAllCouponsView();
                                        }
                                        success = true;
                                    } else {
                                        vm.primaryNotificationControl.display = true;
                                        vm.primaryNotificationControl.path = notificationViewsFactory.getTechnicalErrorView();
                                        vm.secondaryNotificationControl.display = true;
                                        vm.secondaryNotificationControl.path = notificationViewsFactory.getBlankView();
                                    }

                                    return success;
                                }*/

                function getFilteredCouponLists(extraCareCardNumber, couponNumber) {
                    couponsManagerFactory.getFilteredCouponLists(extraCareCardNumber, couponNumber)
                        .then(getFilteredCouponListsSuccess)
                        .catch(getFilteredCouponListsFailed);
                }

                function getFilteredCouponListsSuccess(results) {
                    vm.couponsServiceData = results;

                    if (validateCouponNumberExists()) {
                        vm.primaryNotificationControl.display = false;
                    } else {
                        vm.primaryNotificationControl.path = notificationViewsFactory.getViewAllCouponsView();
                    }
                    vm.secondaryNotificationControl.display = false;
                }

                function validateCouponNumberExists() {
                    if (angular.isUndefined(vm.queryParameters.couponNumber) || vm.queryParameters.couponNumber === "") {
                        return false;
                    } else {
                        return true;
                    }
                }

                function getFilteredCouponListsFailed(error) {
                    vm.primaryNotificationControl.path = notificationViewsFactory.getGetCustomerProfileNotification(error, true);
                    console.log(vm.primaryNotificationControl.path);
                    console.log(vm.primaryNotificationControl.display);
                    console.log(vm.secondaryNotificationControl.path);
                    console.log(vm.secondaryNotificationControl.display);
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
