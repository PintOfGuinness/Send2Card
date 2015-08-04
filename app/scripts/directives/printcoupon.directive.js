'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:printCouponDirective
 * @description
 * # printCouponDirective
 */
angular.module('send2CardApp')
    .directive('printCouponDirective', function () {
        return {
            templateUrl: 'views/print-modal.html',
            restrict: 'EA',
            link: function postLink(scope, element, attrs) {


/*                scope.$watch(attrs.printModal, function (value) {
                    if (value) element.modal('show');
                    else element.modal('hide');
                });*/

            }
        };
    });
