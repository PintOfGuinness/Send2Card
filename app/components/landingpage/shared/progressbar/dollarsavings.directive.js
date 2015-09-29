'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:dollarSavingsDirective
 * @description
 * # dollarSavingsDirective
 */
angular.module('send2CardApp')
    .directive('dollarSavingsDirective', function () {
        return {
            templateUrl: 'components/landingpage/shared/progressbar/dollar-savings-template.html',
            restrict: 'E',
        };
    });
