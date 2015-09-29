(function() {
    'use strict';
    angular
        .module('tealiumModule')
        .factory('tealiumDataFactory', tealiumDataFactory);

    tealiumDataFactory.$inject = ['$log'];  /*inject 'storageHelper' to help determine whether user is logged in or not. Inject 'Config' to get the environment*/

    function tealiumDataFactory($log) {
        return {
            getDefault: getDefault
        };

        function getDefault() {
            /*$log.debug('INFO: Tealium UDO - getDefault()');*/
            
            var date = new Date();
            var defaultUdo = {
                pageCategory: 'Send2Card',                   //Friendly category for the page
               /* environment: Config.get('tealiumRoot'),   */          //Distinguishes between production/staging/dev/UAT environments  PP e.g.://tags.tiqcdn.com/utag/cvs/physicianportal/dev/
                
                siteName: 'Send2Card',                       //Identify current site
                country: 'US',                                      //2-digit country code
                language: 'EN',                                     //2-digit language code
                platform: isMobile.any() ? 'mobile' : 'desktop',  //Distinguishes the site platform between desktop/mobile/app/tablet
                device: 'null',                                     //Device the page is being accessed on
                /*stateLoggedIn: storageHelper.isLoggedIn() ? 'Logged In' : 'Anonymous',  */ //User logged in state
                serverTimestamp: date,                        //Server time in YYYY:MM:DD-HH:MM:SS

                //THESE WILL BE SET BY THE PAGE:

                //pageName: 'null',                                //Friendly name for the page
                //physicianRegistered: 'null',                      //Physician registration pages
                //staffMemberRegistered:'null',                     //Staff registration pages
                //errorMessage: 'null',
                //crxFlagPhysician: '',
                //crxFlagStaff: '',
                //crxFlagCustomercare: '',
                //crxFlagProfile : 'null',
                //crxFlagPatient: undefined,
                //crxFlagEmailCampaignsCountAll: undefined,
                //crxSystemsentUrlCountAll: undefined,
                //crxInactiveNpiCountAll: undefined,
                //crxSuccessfulSearchCountAll: 'null',
                //crxUnsuccessfulSearchCountAll: 'null',
                //crxUpdatesCountAll: '',
                //crxEmailTriggersCountAll: 'null',
                //rxDashOrdersIpTot: 'null',
                //rxDashOrdersIpInprogress: 'null',
                //rxDashOrdersIpShipped: 'null',
                //eventType: undefined,       //unique event type for capturing onpage user interactions - set by utag.link
                //eventCategory: undefined,   //event category for grouping onpage user interactions - set by utag.link
                //eventTime: undefined,
                //eventField: 'null'


            };

            return defaultUdo;
        }
    }

    var isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };


})();