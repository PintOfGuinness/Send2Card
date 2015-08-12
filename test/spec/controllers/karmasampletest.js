describe('Karma Test', function () {

    var scope, ctrl;

    beforeEach(module('send2CardApp'));

    beforeEach(inject(function ($controller) {
        scope = {};
        ctrl = $controller('KarmaTestController', {
            $scope: scope
        });
    }));

    it('TEST:: should create "phones" model with 3 phones in the testController', function () {
        expect(scope.phones.length).toBe(3);
        /*console.log(scope);*/
    });

});
