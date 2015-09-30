'use strict';

/**
 * @ngdoc service
 * @name send2CardApp.cookieFactory
 * @description
 * # cookieFactory
 * Factory in the send2CardApp.
 */
angular.module('drstc')
    .factory('cookieFactory', function ($cookies) {
        // Public API here
        return {
            createCookieUsingKeyAndValue: createCookieUsingKeyAndValue,
            getCookieValue: getCookieValue
        };

        function createCookieUsingKeyAndValue(key, value) {
            $cookies[key] = value;
            return $cookies;
        }

        function getCookieValue(key) {
            return $cookies[key];
        }
    });
