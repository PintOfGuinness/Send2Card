'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:viewAllCouponsDirective
 * @description
 * # viewAllCouponsDirective
 */
angular.module('send2CardApp')
    .directive('viewAllCouponsDirective', function (constants) {
        return {
            controller: function (singleCouponFactory, displayInformationFactory,  modalProvider, screenSize, $q, viewAllCouponsConfiguration, constants) {

                var vm = this;

                initialise();

                function initialise() {
                    initialiseProperties();
                    getDisplayCouponsNumberPerRow()
                }

                function initialiseProperties() {
                    vm.couponsServiceData = {};
                    vm.displayNotification = true;
                    vm.notificationPath = constants.BLANK_VIEW;
                    vm.couponButton = {
                        unSentCouponPath: constants.COUPON_SEND_TO_CARD_IMAGE,
                        sentCouponPath: constants.COUPON_SENT_TO_CARD_IMAGE,
                        couponPrinted: constants.COUPON_PRINTED
                    };
                    vm.configuration = viewAllCouponsConfiguration;
                }

                vm.sendSingleCoupon = function () {
                    return singleCouponFactory.sendSingleCoupon(vm.queryParameters.extraCareCardNumber, vm.queryParameters.couponNumber)
                        .catch(sendSingleCouponFailure);
                }

                function sendSingleCouponFailure(error) {
                    error.state = 0;
                    vm.openErrorModal();

                    return $q.reject(error);
                }

                vm.openErrorModal = function () {
                    return modalProvider.openErrorModal();
                }

                vm.closeErrorModal = function () {
                    return modalProvider.closeErrorModal();
                }

                vm.clickedViewDetails = function () {
                    vm.resetCollapseStateForAll();
                }

                vm.showProgressBar = function (display, actionedCoupon) {
                    vm.displayProgressBar({
                        display: display,
                        actionedCoupon: actionedCoupon
                    });
                }

                screenSize.on('xs, sm, md, lg', function (match) {
                    vm.screenMode = getDisplayCouponsNumberPerRow();
                });

                function getDisplayCouponsNumberPerRow() {
                    return displayInformationFactory.getCouponsPerRow(vm);
                }

                vm.getRowIndexNumbers = function (indexNumber, arrayName) {
                    return displayInformationFactory.getRowIndexNumbers(vm, indexNumber, arrayName);;
                }
            },
            controllerAs: 'viewAllCouponsController',
            bindToController: true,
            scope: {
                queryParameters: '=',
                notificationControl: '=',
                couponsServiceData: '=',                
                displayProgressBar: '&',
                resetCollapseStateForAll: '&'
            },
            templateUrl: constants.VIEW_ALL_COUPONS_TEMPLATE,
            restrict: 'E',
        };
    });
