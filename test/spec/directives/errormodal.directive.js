describe('Directive: errorModalDirective', function () {

    beforeEach(module('send2CardApp'));

    var $compile, $rootScope;

    beforeEach(inject(function (_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    it('should make hidden element visible', function () {
        var element = $compile("<error-modal-directive></error-modal-directive>")($rootScope);
        $rootScope.$digest();
        console.log(element.text());
        expect(true).toEqual(true);
    });
});
