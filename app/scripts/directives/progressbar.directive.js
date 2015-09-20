'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:progressBarDirective
 * @description
 * # progressBarDirective
 */
angular.module('send2CardApp')
    .directive('progressBarDirective', function (configuration) {
        return {
            templateUrl: 'views/progress-bar-template.html',
            /*            scope: {
                                progressBarServiceData: '='
                        },*/
            controller: function (progressBarFactory, displayInformationFactory, screenSize) {

                var vm = this;
                // console.dir(displayInformationFactory.screenMode);
                vm.progressBarServiceData = progressBarFactory.getServiceData();
                vm.screenMode = displayInformationFactory.getDisplayMode();
                vm.configuration = configuration;

                screenSize.on('xs, sm, md, lg', function (match) {
                    vm.screenMode = displayInformationFactory.getDisplayMode();
                });

            },
            controllerAs: 'progressBarController',
            bindToController: true,
            restrict: 'E',
        };
    });
