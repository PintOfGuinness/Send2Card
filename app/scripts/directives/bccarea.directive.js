'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:bccAreaDirective
 * @description
 * # bccAreaDirective
 */
angular.module('send2CardApp')
    .directive('bccAreaDirective', function ($cookies, queryParameterFactory) {

        return {
            controller: function ($scope) {

                this.createRememberMeCookie = function () {
                    console.log("Accessing remember me cookie");
                    $cookies.ECCardNumber = queryParameterFactory.getExtraCareCardNumberParameter();
                    console.log("Card Number = " + $cookies['ECCardNumber']);
                    console.dir($cookies);
                }
            },
            controllerAs: 'bccController',
            bindToController: true,
            templateUrl: 'views/bcc-area.html',
            restrict: 'E',
            scope: {
                cardNumber: '@'
            }

        };
    });
