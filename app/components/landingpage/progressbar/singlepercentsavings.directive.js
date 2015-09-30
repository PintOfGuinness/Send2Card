'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:singlePercentSavingDirective
 * @description
 * # singlePercentSavingDirective
 */
angular.module('drstc')
    .directive('singlePercentSavingsDirective', function () {
        return {
            templateUrl: 'app/components/landingpage/progressbar/single-percent-savings-template.html',
            restrict: 'E',
        };
    });
