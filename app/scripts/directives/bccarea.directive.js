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
                    if (this.cookieHasAlreadyBeenCreated("ECCardNumber") === false) {
                        cookie = cookieFactory.createCookieUsingKeyAndValue("ECCardNumber", queryParameterFactory.getExtraCareCardNumberParameter());
                    }

                    console.log("sausages = " + cookieFactory.getCookieValue("ECCardNumber"));
                }


                this.hideRememberMeButton = function () {
                    this.hideButton = true;
                }

                this.cookieHasAlreadyBeenCreated = function (key) {
                    console.log(cookieFactory.getCookieValue("ECCardNumber"));
                    if (cookieFactory.getCookieValue("ECCardNumber") === undefined) {
                        return false;
                    } else {
                        console.log("Cookie already created");
                        this.hideButton = true;
                        return true;
                    }

                }


            },
            controllerAs: 'bccController',
            bindToController: true,
            templateUrl: 'views/bcc-area.html',
            restrict: 'E',

        };
    });
