'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:couponDirective
 * @description
 * # couponDirective
 */
angular.module('send2CardApp')
    .directive('couponDirective', function (modalProvider) {

        function link(scope, elem, attrs) {
            scope.isHidden = false;
            scope.isReadyToUse = false;
            scope.showProgressBar = false;

            scope.collapseSection = function () {
                var tempIsCollapsed = scope.coupon.isCollapsed;
                scope.onResetCollapseStateForAll();
                scope.coupon.isCollapsed = !tempIsCollapsed;
            }

            if (scope.autoSendSingleCoupon === 'true') {
                scope.onSendSingleCoupon()
                    .then(sendSingleCouponComplete)
                    .catch(sendSingleCouponFailure);
                scope.autoSendSingleCoupon = false;
            }

            if (scope.coupon.state != 0) {
                scope.isReadyToUse = true;
            }

            if (scope.coupon.state == 1) {
                scope.isHidden = true;
            }

            scope.clickSendCouponToCard = function () {
                scope.onSendSingleCoupon()
                    .then(sendSingleCouponComplete)
                    .catch(sendSingleCouponFailure);
            }

            function sendSingleCouponComplete(data) {
                scope.updateState(data.state);
                scope.isHidden = true;
                scope.showSavingsDisplay({
                    actionedCoupon: scope.coupon
                });
            }

            function sendSingleCouponFailure(failureState) {
                console.log("Directive:sendSingleCouponFailure");
                scope.updateState(failureState.state);
                modalProvider.openErrorModal(scope);
            }
            
            scope.openHelpModal = function(){
                modalProvider.openHelpModal();
            }

            scope.printCoupon = function () {
                window.print();
            }

            scope.openPrintModal = function () {
                modalProvider.openPrintModal(scope);
            }

            scope.updateState = function (newState) {
                scope.isReadyToUse = true;
                scope.coupon.state = newState;
            }

        }

        return {
            templateUrl: 'views/couponblock-template.html',
            restrict: 'E',
            replace: true,
            scope: {
                unSentCouponPath: '@',
                sentCouponPath: '@',
                autoSendSingleCoupon: '@',
                onSendSingleCoupon: '&',
                printedPath: '@',
                extraCareCardNumberEndDigits: '@',
                coupon: '=',
                onUpdateState: '&',
                onResetCollapseStateForAll: '&',
                showSavingsDisplay: '&'
            },
            link: link
        }
    });
