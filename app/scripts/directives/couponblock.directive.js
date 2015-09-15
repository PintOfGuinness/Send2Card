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

            /* Probably don't need to send full single coupon at this point */
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

/*            if (scope.coupon.amt_type_cd === "D") {
                scope.coupon.title = scope.coupon.max_redeem_amt;
                scope.coupon.showDollarSign = true;
                scope.coupon.showPercentSign = false;
                scope.coupon.dontShowCents = false;

                scope.coupon.dollars = scope.coupon.title.substring([0], scope.coupon.title.indexOf('.'));
                scope.coupon.cents = scope.coupon.title.substring([scope.coupon.title.indexOf('.') + 1], [scope.coupon.title.length]);

                var zeros = '00';

                if ((scope.coupon.cents === zeros)) {
                    scope.coupon.dontShowCents = true;
                } else {
                    scope.coupon.dontShowCents = false;
                }

            } else if (scope.coupon.amt_type_cd === "P") {
                scope.coupon.showDollarSign = false;
                scope.coupon.showPercentSign = true;
                scope.coupon.title = scope.coupon.max_redeem_amt + " off";
                scope.coupon.dollar = scope.coupon.title.substring([0], scope.coupon.title.indexOf('.'));
            }*/

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
                scope.coupon.state = failureState;
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


            /*      scope.progressBarUpdate=function(){
                    if(scope.coupon.state !=2){
                      scope.incrementProgressBarValue();
                    }
                  }*/
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
