'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:dollarSavingsDirective
 * @description
 * # dollarSavingsDirective
 */
angular.module('drstc')
    .directive('dollarSavingsDirective', function () {
        return {
            templateUrl: 'app/components/landingpage/progressbar/dollar-savings-template.html',
            restrict: 'E',
        };
    });
