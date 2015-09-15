'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:bccAreaDirective
 * @description
 * # bccAreaDirective
 */
angular.module('send2CardApp')
    .directive('bccAreaDirective', function ($cookies) {
        return {
            controller: function () {

                this.createRememberMeCookie = function () {
                    console.log("Accessing remember me cookie");
                    console.log("Card Number = " + scope.cardNumber);
                    $cookies.ECCardNumber = 'Sausages';
                    console.log($cookies['ECCardNumber']);
                    console.dir($cookies);

                }

            },
            controllerAs: 'bccController',
            bindToController: true,
            templateUrl: 'views/bcc-area.html',
            restrict: 'E',
            /*
                        link: function postLink(scope, element, attrs) {}*/
            scope: {
                cardNumber: '='
            }

        };
    });
