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
            controller: function (pageConfiguration) {

                var vm = this;
                var cookie;

                initialise();

                function initialise() {
                    //   initialiseProperties();
                    vm.hideButton = false;
                    vm.configuration = pageConfiguration;
                    vm.hideButton = checkCookieExists();
                }

                function checkCookieExists() {
                    if (cookieFactory.getCookieValue("ECCardNumber") === undefined) {
                        return false;
                    } else {
                        return true;
                    }
                }

                vm.createRememberMeCookie = function () {
                    if (checkCookieExists() === false) {
                        cookie = cookieFactory.createCookieUsingKeyAndValue("ECCardNumber", queryParameterFactory.getExtraCareCardNumberParameter());
                        if (angular.isDefined(cookie)) {
                            vm.hideRememberMeButton();
                        }
                    }
                }

                vm.hideRememberMeButton = function () {
                    vm.hideButton = true;
                }
            },
            controllerAs: 'bccContentController',
            bindToController: true,
            templateUrl: constants.BCC_CONTENT_TEMPLATE,
            restrict: 'E',

        };
    });
