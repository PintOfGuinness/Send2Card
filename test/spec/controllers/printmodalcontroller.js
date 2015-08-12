describe('Controller: PrintCouponModalController', function () {

    var scope, couponsController, rootScope;

    var fakeModal = {
        open: function () {
            return {
                result: {
                    then: function (callback) {
                        callback("item1");
                    }
                }
            };
        }
    };

    beforeEach(module('send2CardApp'));

    beforeEach(inject(function ($controller, $log, $rootScope) {
        rootScope = $rootScope;
        scope = {};
        couponsController = $controller('PrintCouponModalController', {
            $scope: scope,
            $modal: fakeModal,
            $log: $log
        });
    }));

    it('should contain three items in scope', function () {
        expect(scope.items).toEqual(['item1', 'item2', 'item3']);
        expect(scope.items.length).toEqual(3);
        /*console.log(scope);*/
        console.log(rootScope);
    });
});
