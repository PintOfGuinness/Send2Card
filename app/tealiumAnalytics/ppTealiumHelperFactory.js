(function () {
    'use strict';

    angular
        .module('tealiumModule')
        .factory('tealiumHelperFactory', tealiumHelperFactory);

    tealiumHelperFactory.$inject = ['$log', '$q'];

    function tealiumHelperFactory($log, $q) {  /*inject Config to get the webtrends url*/
        return {
            view: view,
            link: link,
            recordEvent: recordEvent
        };

        function loadScript() {
            var deferred = $q.defer();

            if (typeof utag !== 'undefined') {
                deferred.resolve();
            } else {
                var rootUrl = 'www.replacethis.com'; /*Config.get('tealiumRoot');*/
                if (rootUrl) {
                    var head = document.getElementsByTagName('head')[0];
                    var script = document.createElement('script');
                    script.src = rootUrl + 'utag.js';
                    script.type = 'text/javascript';

                    // real browsers
                    script.onload = function () {
                        deferred.resolve();
                    };

                    // Internet explorer
                    script.onreadystatechange = function () {
                        if (this.readyState === 'complete') {
                            deferred.resolve();
                        }
                    };

                    head.appendChild(script);
                } else {
                    deferred.reject();
                }

            }
            return deferred.promise;
        }

        function view(udo) {
            if (true) {  //Config.get('tealiumPublish')  >> true
                loadScript().then(function () {
                    $log.debug('tealium.view - ' + JSON.stringify(udo));

                    //make sure event type and category is blank for views
                    if (udo.eventType) {
                        udo.eventType = 'null';
                    }
                    if (udo.eventCategory) {
                        udo.eventCategory = 'null';
                    }
                    if (udo.eventField) {
                        udo.eventField = 'null';
                    }
                    utag.view(udo);
                });
            } else {
                $log.debug('tealium.view - tealiumPublish = FALSE');
            }
        }

        function link(udo) {
            if (true) {  /*Config.get('tealiumPublish')*/
                loadScript().then(function () {
                    $log.debug('tealium.link - ' + JSON.stringify(udo));
                    utag.link(udo);
                });
            } else {
                $log.debug('tealium.link - tealiumPublish = FALSE');
            }
        }

        function recordEvent(udo) {
            $log.debug('tealium.recordEvent - ' + udo.eventType + udo.eventCategory);
            link(udo);
        }
    }
})();