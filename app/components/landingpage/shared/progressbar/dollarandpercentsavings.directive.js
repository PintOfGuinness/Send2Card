'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:dollarAndPercentSavingsDirective
 * @description
 * # dollarAndPercentSavingsDirective
 */
angular.module('send2CardApp')
    .directive('dollarAndPercentSavingsDirective', function () {
        return {
            templateUrl: 'components/landingpage/shared/progressbar/dollar-and-percent-savings-template.html',
            restrict: 'E'
        };
    });
