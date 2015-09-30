'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:landingPageDirective
 * @description
 * # landingPageDirective
 */
angular.module('drstc')
    .directive('landingPageDirective', function () {
        return {
            controller: function (couponsManagerFactory, progressBarFactory, queryParameterFactory, displayInformationFactory, notificationViewsFactory, digitalReceiptLandingConfiguration, viewAllCouponsConfiguration, pageConfiguration, constants, screenSize, $window, $scope) {


                var vm = this;
                var didScroll = false;
                var extraCareCardNumber;
                var couponNumber;
                var windowPosition = 0;
                var lastScrollPosition = 0;

                initialise();

                function initialise() {
                    initialiseProperties();
                    if (validateExtraCareCardNumberExists()) {
                        getFilteredCouponLists(vm.queryParameters.extraCareCardNumber, vm.queryParameters.couponNumber);
                    }
                }

                function initialiseProperties() {
                    vm.screenMode = getDisplayMode();
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

                    if (vm.couponsServiceData.unactionedCoupons.length === 0) {
                        vm.configuration.viewAllCoupons.DISPLAY_UNACTIONED_COUPONS = false;
                    }

                    if (vm.couponsServiceData.actionedCoupons.length === 0) {
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
                    if (angular.isUndefined(vm.couponsServiceData.singleCoupon)) {
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

                angular.element($window).bind("wheel", function () {
                    didScroll = true;
                });

                /* prevents event fired for every pixel moved */
                setInterval(function () {
                    if (didScroll) {
                        if (detectScrollDown()) {
                            vm.displayProgressBar(false);
                            didScroll = false;
                        }
                    }
                    $scope.$apply();
                }, 100);

                function detectScrollDown() {
                    var scrollDown = false;
                    windowPosition = window.pageYOffset;

                    if (windowPosition > lastScrollPosition) {
                        scrollDown = true;
                    } else {
                        scrollDown = false;
                    }

                    lastScrollPosition = windowPosition;

                    return scrollDown;
                }

                vm.displayProgressBar = function (display, actionedCoupon) {
                    if (display) {
                        progressBarFactory.toggleProgressBarDisplay(true);
                        progressBarFactory.updateProgressBarAfterAction(vm.couponsServiceData, actionedCoupon);
                    } else {
                        progressBarFactory.toggleProgressBarDisplay(false);
                    }
                }

                screenSize.on('xs, sm, md, lg', function (match) {
                    vm.screenMode = getDisplayMode();
                });

                function getDisplayMode() {
                    return displayInformationFactory.getDisplayMode();
                }
            },
            templateUrl: 'app/components/landingpage/landingpage-template.html',
            controllerAs: 'landingPageController',
            bindToController: true,
            restrict: 'E'
        };
    });
