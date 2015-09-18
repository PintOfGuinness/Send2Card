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

                var progressBar = this;
                // console.dir(displayInformationFactory.screenMode);
                progressBar.progressBarServiceData = progressBarFactory.getServiceData();
                progressBar.screenMode = displayInformationFactory.getDisplayMode();
                progressBar.showProgressBar = configuration.SHOW_PROGRESS_BAR;
                /*                this.mobileMode = screenMode.mobile;
                                this.tabletMode = screenMode.tablet;
                                this.desktopMode = screenMode.desktop;*/

                screenSize.on('xs, sm, md, lg', function (match) {
                    console.log("screenSize");
                    progressBar.screenMode = displayInformationFactory.getDisplayMode();
                });

            },
            controllerAs: 'progressBarController',
            bindToController: true,
            restrict: 'E',
        };
    });
