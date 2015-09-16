'use strict';

/**
 * @ngdoc filter
 * @name send2CardApp.filter:categoriseCouponsFilter
 * @function
 * @description
 * # categoriseCouponsFilter
 * Filter in the send2CardApp.
 */
angular.module('send2CardApp')
  .filter('categoriseCouponsFilter', function () {
    return function (input) {
      return 'categoriseCouponsFilter filter: ' + input;
    };
  });
