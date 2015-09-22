'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:landingPageDirective
 * @description
 * # landingPageDirective
 */
angular.module('send2CardApp')
  .directive('landingPageDirective', function () {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        element.text('this is the landingPageDirective directive');
      }
    };
  });
