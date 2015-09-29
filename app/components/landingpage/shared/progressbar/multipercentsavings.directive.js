'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:multiPercentSavingsDirective
 * @description
 * # multiPercentSavingsDirective
 */
angular.module('send2CardApp')
    .directive('multiPercentSavingsDirective', function () {
        return {
            templateUrl: 'components/landingpage/shared/progressbar/multi-percent-savings-template.html',
            restrict: 'E',
        };
    });
