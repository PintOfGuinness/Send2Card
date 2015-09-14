'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:errorModalDirective
 * @description
 * # errormodal.directive
 */
angular.module('send2CardApp')
  .directive('errorModalDirective', function () {
    return {
            restrict: 'E',
            templateUrl: 'views/error1.html'
        };
  });
