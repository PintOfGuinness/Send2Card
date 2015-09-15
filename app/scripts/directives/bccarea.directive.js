'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:bccAreaDirective
 * @description
 * # bccAreaDirective
 */
angular.module('send2CardApp')
    .directive('bccAreaDirective', function ($cookies, queryParameterFactory, cookieFactory) {


        return {
            controller: function () {
                var cookie;
                this.hideButton = false;
                this.createRememberMeCookie = function () {

                    if (cookieFactory.getCookieValue("ECCardNumber") === undefined) {
                        cookie = cookieFactory.createCookieUsingKeyAndValue("ECCardNumber", queryParameterFactory.getExtraCareCardNumberParameter());
                        console.log("Created your cookie");
                    } else {
                        console.log("Cookie already created you onion");
                    }



                    console.log("sausages = " + cookieFactory.getCookieValue("ECCardNumber"));
                }


                this.hideRememberMeButton = function () {
                    this.hideButton = true;
                }


            },
            controllerAs: 'bccController',
            bindToController: true,
            templateUrl: 'views/bcc-area.html',
            restrict: 'E',

        };
    });
