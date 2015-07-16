'use strict';

/**
 * @ngdoc overview
 * @name send2CardApp
 * @description
 * # send2CardApp
 *
 * Main module of the application.
 */
angular
  .module('send2CardApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
/*  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/coupons.html',
        controller: 'CouponsCtrl',

      })
      .otherwise({
        redirectTo: '/'
      });
  });*/
