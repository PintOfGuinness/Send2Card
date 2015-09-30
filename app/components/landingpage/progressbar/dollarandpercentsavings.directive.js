'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:dollarAndPercentSavingsDirective
 * @description
 * # dollarAndPercentSavingsDirective
 */
angular.module('drstc')
    .directive('dollarAndPercentSavingsDirective', function () {
        return {
            templateUrl: 'app/components/landingpage/progressbar/dollar-and-percent-savings-template.html',
            restrict: 'E'
        };
    });
