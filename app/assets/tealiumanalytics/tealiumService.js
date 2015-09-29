(function () {
    angular
        .module('tealiumModule')
        .service('tealiumService', tealiumService);

    tealiumService.$inject = ['tealiumDataFactory', 'tealiumHelperFactory'];

    function tealiumService(tealiumDataFactory, tealiumHelperFactory) {

        return {
            recordPageView: recordPageView,
            recordPageLink: recordPageLink,
            recordErrorMessage: recordErrorMessage,
            recordCustomPageLink: recordCustomPageLink,
        };

        function recordPageView(pageName) {
            var udo = tealiumDataFactory.getDefault();
            udo.pageName = pageName;

            tealiumHelperFactory.view(udo);
            console.log("UDO:");
            console.dir(udo);
            return udo;
        }

        function recordErrorMessage(errorMessage) {
            var udo = tealiumDataFactory.getDefault();

            if (errorMessage !== 'null') {
                udo.errorMessage = errorMessage;
            }

            tealiumHelperFactory.view(udo);
            console.log("UDO:");
            console.dir(udo);
            return udo;
        }

        function recordPageLink(pageName, eventType, eventCategory, eventField) {
            var udo = tealiumDataFactory.getDefault();
            udo.pageName = pageName;
            if (eventType !== 'null') {
                udo.eventType = eventType;
            }

            if (eventCategory !== 'null') {
                udo.eventCategory = eventCategory;
            }

            if (eventField !== 'null') {
                udo.eventField = eventField;
            }

            tealiumHelperFactory.recordEvent(udo);
            console.log("UDO:");
            console.dir(udo);
            return udo;
        }

        function recordCustomPageLink(pageName, crxFlagProfile, crxEmailTriggersCountAll, eventType, eventCategory, eventField) {
            var udo = tealiumDataFactory.getDefault();

            udo.pageName = pageName;

            if (crxFlagProfile !== 'null') {
                udo.crxFlagProfile = crxFlagProfile;
            }
            if (crxEmailTriggersCountAll !== 'null') {
                udo.crxEmailTriggersCountAll = crxEmailTriggersCountAll;
            }

            if (eventType !== 'null') {
                udo.eventType = eventType;
            }

            if (eventCategory !== 'null') {
                udo.eventCategory = eventCategory;
            }

            if (eventField !== 'null') {
                udo.eventField = eventField;
            }

            tealiumHelperFactory.recordEvent(udo);
            console.log("UDO:");
            console.dir(udo);
            return udo;
        }

    }
})();
