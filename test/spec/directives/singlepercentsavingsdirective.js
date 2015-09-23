'use strict';

describe('Directive: singlePercentSavingsDirective', function () {

    // load the directive's module
    beforeEach(module('send2CardApp'));

    var element,
        scope;

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    it('should make hidden element visible', inject(function ($compile) {
        element = angular.element('<single-percent-saving-directive></single-percent-saving-directive>');
        element = $compile(element)(scope);
        expect(element.text()).toBe('this is the singlePercentSavingDirective directive');
    }));
});
