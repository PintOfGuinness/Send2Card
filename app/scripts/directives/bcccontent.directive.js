'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:bccAreaDirective
 * @description
 * # bccAreaDirective
 */
angular.module('send2CardApp')
    .directive('bccContentDirective', function ($cookies, queryParameterFactory, cookieFactory, pageConfiguration, constants) {

        return {
            controller: function () {
                
                var vm = this;
                var cookie;
                vm.hideButton = false;
                vm.configuration = pageConfiguration;
                vm.createRememberMeCookie = function () {
                    if (vm.cookieHasAlreadyBeenCreated("ECCardNumber") === false) {
                        cookie = cookieFactory.createCookieUsingKeyAndValue("ECCardNumber", queryParameterFactory.getExtraCareCardNumberParameter());
                    }
                }

                vm.hideRememberMeButton = function () {
                    vm.hideButton = true;
                }

                vm.cookieHasAlreadyBeenCreated = function (key) {
                    if (cookieFactory.getCookieValue("ECCardNumber") === undefined) {
                        return false;
                    } else {
                        vm.hideButton = true;
                        return true;
                    }
                }
            },
            controllerAs: 'bccController',
            bindToController: true,
            templateUrl: constants.BCC_CONTENT_TEMPLATE,
            restrict: 'E',

        };
    });
