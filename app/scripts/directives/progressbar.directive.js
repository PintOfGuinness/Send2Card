'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:progressBarDirective
 * @description
 * # progressBarDirective
 */
angular.module('send2CardApp')
    .directive('progressBarDirective', function () {
        return {
            templateUrl: 'views/templates/progress-bar-template.html',
            controller: function (progressBarFactory, displayInformationFactory, pageConfiguration, screenSize) {

                var vm = this;

                vm.progressBarServiceData = progressBarFactory.getServiceData();
                /* vm.savingsText = progressBarFactory.getProgressBarText();*/
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
