'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:bccAreaDirective
 * @description
 * # bccAreaDirective
 */
angular.module('send2CardApp')
    .directive('bccAreaDirective', function () {
        return {
            templateUrl: 'views/bcc-area.html',
            restrict: 'E',
            link: function postLink(scope, element, attrs) {
                element.text('this is the bccAreaDirective directive');
            }
        };
    });
