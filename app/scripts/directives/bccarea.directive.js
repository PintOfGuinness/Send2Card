'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:bccAreaDirective
 * @description
 * # bccAreaDirective
 */
angular.module('send2CardApp')
    .directive('bccAreaDirective', function ($cookies, queryParameterFactory, cookieFactory, configuration) {


        return {
            controller: function () {
                var cookie;
                this.hideButton = false;
                this.enableECOptIn = configuration.ENABLE_EC_OPT_IN;
                this.createRememberMeCookie = function () {
                    if (this.cookieHasAlreadyBeenCreated("ECCardNumber") === false) {
                        cookie = cookieFactory.createCookieUsingKeyAndValue("ECCardNumber", queryParameterFactory.getExtraCareCardNumberParameter());
                    }
                }


                this.hideRememberMeButton = function () {
                    this.hideButton = true;
                }

                this.cookieHasAlreadyBeenCreated = function (key) {
                    if (cookieFactory.getCookieValue("ECCardNumber") === undefined) {
                        return false;
                    } else {
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
