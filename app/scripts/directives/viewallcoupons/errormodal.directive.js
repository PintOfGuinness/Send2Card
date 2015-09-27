'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:errorModalDirective
 * @description
 * # errormodal.directive
 */
angular.module('send2CardApp')
  .directive('errorModalDirective', function (constants) {
    return {
            restrict: 'E',
            templateUrl: constants.TECHNICAL_ERROR
        };
  });
