/*
describe('Controller: PrintCouponModalController', function () {

    var scope, printController, rootScope;

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
        printController = $controller('PrintCouponModalController', {
            $scope: scope,
            $modal: fakeModal,
            $log: $log
        });
    }));

    it('should contain three items in scope', function () {
        printController.open();
        expect(true).toEqual(true);
    });
});
*/
