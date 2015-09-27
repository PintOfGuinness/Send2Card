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
                    initialiseProperties();

                    vm.hideButton = checkCookieExists();
                }

                function initialiseProperties() {
                    vm.hideButton = false;
                    vm.configuration = pageConfiguration;
                    vm.showSuccessMessage = false;
                }

                function checkCookieExists() {
                    if (cookieFactory.getCookieValue("ECCardNumber") === undefined) {
                        return vm.cookieIsPresent = false;
                    } else {
                        return vm.cookieIsPresent = true;
                    }
                }

                vm.createRememberMeCookie = function () {
                    if (checkCookieExists() === false) {
                        cookie = cookieFactory.createCookieUsingKeyAndValue("ECCardNumber", queryParameterFactory.getExtraCareCardNumber());
                        if (angular.isDefined(cookie)) {
                            vm.hideRememberMeButton();
                        }
                    }
                }

                vm.hideRememberMeButton = function () {
                    var rememberMeSection = document.getElementById("rememberMeSection");
                    rememberMeSection.className = ("remember-me-success-border");
                    vm.hideButton = true;
                }

                vm.showRememberMeSuccess = function () {
                    vm.showSuccessMessage = true;
                }

                vm.rememberMeText = constants.REMEMBER_ME_TEXT;
                vm.cvsHealthIcon = constants.CVS_HEALTH_ICON;
                vm.rememberMeSuccessIcon = constants.REMEMBER_ME_SUCCESS_ICON;
            },
            controllerAs: 'bccContentController',
            bindToController: true,
            templateUrl: constants.BCC_CONTENT_TEMPLATE,
            restrict: 'E',

        };
    });
