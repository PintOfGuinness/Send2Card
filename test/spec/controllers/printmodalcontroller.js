'use strict';

describe('Controller: PrintModalController', function () {

    var scope, couponsController;

    beforeEach(inject(function ($rootScope, $controller) {
        scope = $rootScope.$new();
        couponsController = $controller('CouponsController', {
            $scope: scope
        });
    }));


    it('should attach a list of awesomeThings to the scope', function () {
        expect(true).toBe(true);
        expect(scope.phones.length).toBe(3);
    });
});

