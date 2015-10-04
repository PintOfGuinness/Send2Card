var app = angular.module('drstc');

app.constant('landingPageConfiguration', {
    DISPLAY_CAMPAIGN_LANDING: true,
    DISPLAY_VIEW_ALL_COUPONS: true, //TODO
    DISPLAY_PROGRESS_BAR: true,
    DISPLAY_BCC: true,
    DISPLAY_MONETATE: true, //TODO
    ENABLE_EC_OPT_IN: true,
    TEALIUM_ENABLED: false,
    DISPLAY_SPINNER: false
});

app.constant('campaignLandingConfiguration', {
    AUTO_SEND_SINGLE_COUPON: true,
    ENABLE_PRINT_ACTION: false
});

app.constant('viewAllCouponsConfiguration', {
    DISPLAY_UNACTIONED_COUPONS: true,
    DISPLAY_ACTIONED_COUPONS: true,
    ENABLE_PRINT_ACTION: true
});
