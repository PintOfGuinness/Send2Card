var app = angular.module('drstc');

app.constant('pageConfiguration', {
    DISPLAY_PROGRESS_BAR: true,
    DISPLAY_BCC: true,    
    DISPLAY_MONETATE: true, //TODO
    ENABLE_EC_OPT_IN: true,
    TEALIUM_ENABLED: false
});

app.constant('digitalReceiptLandingConfiguration', {
    DISPLAY_DIGITAL_RECEIPT_LANDING: true,
    AUTO_SEND_SINGLE_COUPON: true,
    ENABLE_PRINT_ACTION: false
});

app.constant('viewAllCouponsConfiguration', {
    DISPLAY_UNACTIONED_COUPONS: true,
    DISPLAY_ACTIONED_COUPONS: true,
    ENABLE_PRINT_ACTION: true
});
