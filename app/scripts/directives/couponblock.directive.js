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
      scope.showProgressBar = false;

      scope.collapseSection = function () {
        var tempIsCollapsed = scope.coupon.isCollapsed;
        scope.onResetCollapseStateForAll();
        scope.coupon.isCollapsed = !tempIsCollapsed;
      }
scope.showSavingsDisplay();
        
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

        scope.coupon.dollars = scope.coupon.title.substring([0], scope.coupon.title.indexOf('.'));
        scope.coupon.cents = scope.coupon.title.substring([scope.coupon.title.indexOf('.')+1], [scope.coupon.title.length]);

        var zeros = '00';

        if((scope.coupon.cents === zeros)){
          scope.coupon.dontShowCents = true;
        } else {
          scope.coupon.dontShowCents = false;
        }

      } else if (scope.coupon.amt_type_cd==="P") {
        scope.coupon.showDollarSign = false;
        scope.coupon.showPercentSign = true;
        scope.coupon.title = scope.coupon.max_redeem_amt + " off";
        scope.coupon.dollar = scope.coupon.title.substring([0], scope.coupon.title.indexOf('.'));
      }

      scope.clickSendCouponToCard = function () {
        scope.onSendCouponToCard()
          .then(sendCouponComplete)
          .catch(sendCouponFailure);
      }

      function sendCouponComplete(newState) {
        scope.updateState(newState);
        scope.isHidden = true;
        console.log("Calling show progress bar on CTAs....");
        
          scope.progressBarUpdate();
      }

      scope.printCoupon = function () {
        window.print();
      }

      scope.updateState = function (newState) {
        scope.isReadyToUse = true;
        scope.coupon.state = newState;
      }

      function sendCouponFailure(failureState) {
        console.log("Directive:sendCouponFailure");
        scope.coupon.state = failureState;
      }

      scope.progressBarUpdate=function(){
        if(scope.coupon.state !=2){
          scope.incrementProgressBarValue();
        }
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
        incrementProgressBarValue:'&',
        showSavingsDisplay:'&'
      },
      link: link
    }
  });
