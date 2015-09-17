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
            controller: function (progressBarFactory) {

                this.progressBarServiceData = progressBarFactory.getServiceData();
                this.showProgressBar = configuration.SHOW_PROGRESS_BAR;
            },
            controllerAs: 'progressBarController',
            bindToController: true,
            restrict: 'E',
        };
    });
