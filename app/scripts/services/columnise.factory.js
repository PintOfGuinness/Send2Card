'use strict';

/**
 * @ngdoc service
 * @name send2CardApp.ColumniseFactory
 * @description
 * # ColumniseFactory
 * Factory in the send2CardApp.
 */
angular.module('send2CardApp')
    .factory('columniseFactory', function (screenSize) {
        // Service logic
        // ...

        // Public API here

        var numberOfcolumns;

        return {
            columnise: function (inputArray) {
                var length = inputArray.length;
                var columnsArray = [];

                numberOfcolumns = getNumberOfColumnsByScreenSize();

                /**/
                for (var i = 0; i < numberOfcolumns; i++) {
                    var column = [];
                    for (var j = i; j < length; j += numberOfcolumns) {
                        column.push(inputArray[j]);
                    }
                    columnsArray.push(column);
                }
                return columnsArray;
            }

        };

        function getNumberOfColumnsByScreenSize() {

            if (screenSize.is('xs')) {
                console.log("Screen Size: xs, ms return 1");
                return 1;
            } else if (screenSize.is('sm')) {
                console.log("Screen Size: md, ms return 2");
                return 2;
            } else if (screenSize.is('md, lg')) {
                console.log("Screen Size: lg, ms return 3");
                return 3;
            } else {
                console.log("Screen Size: Default return 1");
                return 1;
            }
        }
    });
