'use strict';

/**
 * @ngdoc service
 * @name send2CardApp.cookieFactory
 * @description
 * # cookieFactory
 * Factory in the send2CardApp.
 */
angular.module('drstc')
    .factory('progressBarSavingsTextFactory', function ($cookies) {
        // Public API here
        return {
            dollarAmountOrBogo: dollarAmountOrBogo,

        };

        function verifyProgressBarText() {
            // TODO
            // implement logic from Jen's email to determine
            // what is shown re: Percent off or Dollar off..

            /*            •	If only dollar amount or BOGO: "That’s $x in savings!”
                        •	If dollar amount/BOGO plus percent: “That’s over $x in savings!”
                        •	If only one percent: “That’s x% in savings!”
                        •	If multiple percents: “That’s over x% in savings!”
                        o	X = lowest percent*/




        }


    });
