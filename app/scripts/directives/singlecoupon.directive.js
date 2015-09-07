'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:SingleCouponDirective
 * @description
 * # SingleCouponDirective
 */
angular.module('send2CardApp')
  .directive('singleCouponDirective', function () {
    return {
      templateUrl: 'views/singlecoupon.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
      }
    };
  });
