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
            templateUrl: 'views/progressbar/dollar-savings-template.html',
            restrict: 'E',
            link: function postLink(scope, element, attrs) {}
        };
    });
