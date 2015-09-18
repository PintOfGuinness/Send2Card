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
            controller: function (progressBarFactory, displayInformationFactory) {
                console.dir(displayInformationFactory.screenMode);
                this.progressBarServiceData = progressBarFactory.getServiceData();
                var screenMode = displayInformationFactory.getDisplayMode();
                this.showProgressBar = configuration.SHOW_PROGRESS_BAR;
                this.mobileMode = screenMode.mobile;
                this.tabletMode = screenMode.tablet;
                this.desktopMode = screenMode.desktop;

            },
            controllerAs: 'progressBarController',
            bindToController: true,
            restrict: 'E',
        };
    });
