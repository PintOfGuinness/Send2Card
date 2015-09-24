'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:landingPageDirective
 * @description
 * # landingPageDirective
 */
angular.module('send2CardApp')
    .directive('landingPageDirective', function () {
        return {
            templateUrl: 'views/templates/landingpage-template.html',
            controller: function () {

                //  var vm = this;
                this.displayProgressBar = "chalk";
                console.log(this.displayProgressBar);
                /*                this.displayProgressBar = function () {
                                    console.log("displayProgressBar");
                                }*/
            },
            /*            scope: {
                            displayProgressBar: '&'
                        },*/
            controllerAs: 'landingPageController',
            bindToController: true,
            restrict: 'E'
        };
    });
