'use strict';

/**
 * @ngdoc service
 * @name send2CardApp.cookieFactory
 * @description
 * # cookieFactory
 * Factory in the send2CardApp.
 */
angular.module('send2CardApp')
    .factory('cookieFactory', function () {
        // Public API here
        return {
            createCookieUsingKeyAndValue: createCookieUsingKeyAndValue
        };

        function createCookieUsingKeyAndValue(key, value) {
            $cookie.key = value;
            return $cookie;
        }

    });
