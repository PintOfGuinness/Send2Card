'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:multiPercentSavingsDirective
 * @description
 * # multiPercentSavingsDirective
 */
angular.module('drstc')
    .directive('multiPercentSavingsDirective', function () {
        return {
            templateUrl: 'app/components/landingpage/progressbar/multi-percent-savings-template.html',
            restrict: 'E',
        };
    });
