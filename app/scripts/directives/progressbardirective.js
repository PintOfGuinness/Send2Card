'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:progressBarDirective
 * @description
 * # progressBarDirective
 */
angular.module('send2CardApp')
  .directive('progressBarDirective', function () {
    return {
      templateUrl: 'views/progress-bar-template.html',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
      }
    };
  });
