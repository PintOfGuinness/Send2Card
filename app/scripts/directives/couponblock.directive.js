'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:couponDirective
 * @description
 * # couponDirective
 */
angular.module('send2CardApp')
  .directive('couponDirective', function () {

    function link(scope, elem, attrs) {
      scope.isHidden = false;
      scope.isReadyToUse = false;

      scope.collapseSection = function () {
        var tempIsCollapsed = scope.coupon.isCollapsed;
        scope.onResetCollapseStateForAll();
        scope.coupon.isCollapsed = !tempIsCollapsed;

        elem.addClass("expanded-hide-bottom-border");
        console.log("element class name = " + elem);
      }

      if (scope.sendCouponOnStartup === 'true') {
        scope.onSendCouponToCard()
          .then(sendCouponComplete)
          .catch(sendCouponFailure);
        scope.sendCouponOnStartup = false;
      }

      if (scope.coupon.state != 0) {
        scope.isReadyToUse = true;
      }

      if (scope.coupon.state == 1) {
        scope.isHidden = true;
      }

      if(scope.coupon.amt_type_cd === "D"){
        scope.coupon.title = scope.coupon.max_redeem_amt;
        scope.coupon.showDollarSign = true;
        scope.coupon.showPercentSign = false;
        scope.coupon.dontShowCents = false;
        scope.coupon.dollar = scope.coupon.title.substring([0],[1]);

        if(scope.coupon.title.length >= 5) {
          scope.coupon.cents = scope.coupon.title.substring([3], [scope.coupon.title.length]);
        } else {
          scope.coupon.cents = scope.coupon.title.substring([2], [scope.coupon.title.length]);
        }
        var zeros = '00';

        if((scope.coupon.cents === zeros)){
          scope.coupon.dontShowCents = true;
        } else {
          scope.coupon.dontShowCents = false;
        }

      } else if (scope.coupon.amt_type_cd==="P"){
        scope.coupon.showDollarSign = false;
        scope.coupon.showPercentSign = true;
        scope.coupon.title=scope.coupon.max_redeem_amt + " off";
        scope.coupon.dollar = scope.coupon.title.substring([0],[1]);
      }

      scope.clickSendCouponToCard = function () {
        scope.onSendCouponToCard()
          .then(sendCouponComplete)
          .catch(sendCouponFailure);
      }

      function sendCouponComplete(newState) {
        scope.updateState(newState);
        scope.isHidden = true;
      }

      scope.printCoupon = function () {
        window.print();
      }

      scope.updateState = function (newState) {
        scope.isReadyToUse = true;
        scope.coupon.state = newState;
      }

      function sendCouponFailure(failureState) {
        scope.coupon.state = failureState;
      }

    }

    return {
      templateUrl: 'views/couponblock-template.html',
      restrict: 'E',
      replace: true,
      scope: {
        unSentCouponPath: '@',
        sentCouponPath: '@',
        sendCouponOnStartup: '@',
        onSendCouponToCard: '&',
        printedPath: '@',
        extraCareCardNumberEndDigits: '@',
        coupon: '=',
        onUpdateState: '&',
        onResetCollapseStateForAll: '&',
      },
      link: link
    }
  });
