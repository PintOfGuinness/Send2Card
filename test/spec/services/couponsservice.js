'use strict';

describe('Service: couponsService', function () {

    var couponServiceMock, httpBackend;

    beforeEach(module('send2CardApp'));

    beforeEach(inject(function (couponsService, $httpBackend) {
        couponServiceMock = couponsService;
        httpBackend = $httpBackend;
        httpBackend.when("GET", "data/customer.json").respond([{
            coupon1: "1"
        }, {
            coupon2: "2"
        }]);
        httpBackend.when("POST", "https://rri2eslatp1v.corp.cvscaremark.com:2030/DigitalService/ExtraCare/v1/ECGetCustomerProfile").respond([{
            coupon1: "1"
        }, {
            coupon2: "2"
        }, {
            coupon3: "3"
        }]);
    }));

    it('should call getUnfilteredCouponsFromJSON and return 2 mock coupons', (function () {
        httpBackend.expectGET('data/customer.json');
        couponServiceMock.getUnfilteredCouponsFromJSON(34343).then(function (results) {
            expect(results.data.length).toEqual(2);
            expect(results.data[0].coupon1).toEqual("1");
            expect(results.data[1].coupon2).toEqual("2");
        });
        httpBackend.flush();
    }));

    it('should call getUnfilteredCouponsFromService and return 3 mock coupons', (function () {
        httpBackend.expectPOST('https://rri2eslatp1v.corp.cvscaremark.com:2030/DigitalService/ExtraCare/v1/ECGetCustomerProfile');
        couponServiceMock.getUnfilteredCouponsFromService().then(function (results) {
            expect(results.data.length).toEqual(3);
            expect(results.data[0].coupon1).toEqual("1");
            expect(results.data[1].coupon2).toEqual("2");
            expect(results.data[2].coupon3).toEqual("3");
        });
        httpBackend.flush();
    }));

});
