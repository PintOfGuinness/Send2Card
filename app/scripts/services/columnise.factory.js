'use strict';

/**
 * @ngdoc service
 * @name send2CardApp.ColumniseFactory
 * @description
 * # ColumniseFactory
 * Factory in the send2CardApp.
 */
angular.module('send2CardApp')
    .factory('columniseFactory', function () {
        // Service logic
        // ...

        // Public API here
        return {
           /* columnise: function (inputArray, numberOfcolumns) {
                var length = inputArray.length;
                var columnsArray = [];
                var i = 0;
                while (i < length) {
                    var size = Math.ceil((length - i) / numberOfcolumns--);
                    columnsArray.push(inputArray.slice(i, i += size));
                }
                return columnsArray;
            }*/
/**/
            columnise: function (inputArray, numberOfcolumns) {
                var length = inputArray.length;
                var columnsArray = [];
                /**/
                for (var i=0; i<numberOfcolumns; i++){
                    var column = [];
                    for (var j=i; j<length; j+=numberOfcolumns){
                        column.push(inputArray[j]);
                    }
                    columnsArray.push(column);
                }
                return columnsArray;
                
            }
        };
    });
