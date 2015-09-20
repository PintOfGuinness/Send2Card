'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:progressBarDirective
 * @description
 * # progressBarDirective
 */
angular.module('send2CardApp')
    .directive('progressBarDirective', function (pageConfiguration) {
        return {
            templateUrl: 'views/templates/progress-bar-template.html',
            controller: function (progressBarFactory, displayInformationFactory, screenSize) {

                var vm = this;

                vm.progressBarServiceData = progressBarFactory.getServiceData();
                vm.screenMode = displayInformationFactory.getDisplayMode();
                vm.configuration = pageConfiguration;

                screenSize.on('xs, sm, md, lg', function (match) {
                    vm.screenMode = displayInformationFactory.getDisplayMode();
                });
            },
            controllerAs: 'progressBarController',
            bindToController: true,
            restrict: 'E',
        };
    });
