'use strict';

/**
 * @ngdoc directive
 * @name send2CardApp.directive:printCouponModalDirective
 * @description
 * # printCouponModalDirective
 */
angular.module('drstc')
    .directive('printCouponModalDirective', function () {
        return {
            restrict: 'E',
            templateUrl: 'app/shared/printcouponmodal/printcoupon-modal.html',
            link: link
        };

        function link(scope, elem, attrs) {
            scope.printCoupon = function () {
                window.print();
            }

            // String reverse
            String.prototype.reverse =
                function () {
                    var splitext = this.split("");
                    var revertext = splitext.reverse();
                    var reversed = revertext.join("");
                    return reversed;
                }

            function eanCheckDigit(s) {
                var result = 0;
                var counter = 0;
                var rs = s.reverse();
                for (counter = 0; counter < rs.length; counter++) {
                    result = result + parseInt(rs.charAt(counter)) * Math.pow(3, ((counter + 1) % 2));
                }
                return (10 - (result % 10)) % 10;
            }

            // Barcode Input Value : (4831 + Last 4 digits of sku_id (Coupon Id) + Last 4 digits of Coupon Seq#)
            var checkDigit = eanCheckDigit("483111051896");
            JsBarcode(document.getElementById("barcode"), "483111051896" + checkDigit, {
                width: 1.5,
                height: 60,
                format: "EAN",
                displayValue: false,
                backgroundColor: "",
                lineColor: "#000"
            });
        }
    });
