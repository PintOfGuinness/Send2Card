'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:viewAllCouponsDirective
 * @description
 * # viewAllCouponsDirective
 */
angular.module('send2CardApp')
  .directive('viewAllCouponsDirective', function () {
    return {
      templateUrl: 'views/viewallcoupons.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
      }
    };
  });
