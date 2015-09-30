'use strict';

/**
 * @ngdoc overview
 * @name drstc
 * @description
 * # drstc
 *
 * Main module of the application.
 */

angular.module('tealiumModule', []);

angular
    .module('drstc', [
    'matchMedia',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.bootstrap',
    'tealiumModule'
  ])
   
