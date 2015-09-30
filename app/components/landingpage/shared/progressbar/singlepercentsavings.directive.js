'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:singlePercentSavingDirective
 * @description
 * # singlePercentSavingDirective
 */
angular.module('send2CardApp')
    .directive('singlePercentSavingsDirective', function () {
        return {
            templateUrl: 'components/landingpage/shared/progressbar/single-percent-savings-template.html',
            restrict: 'E',
        };
    });