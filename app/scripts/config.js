var app = angular.module('send2CardApp');

app.constant('pageConfiguration', {
    DISPLAY_PROGRESS_BAR: true,
    DISPLAY_MONETATE: true, //TODO
    ENABLE_EC_OPT_IN: true,
    TEALIUM_ENABLED: false
});

app.constant('digitalReceiptLandingConfiguration', {
    DISPLAY_BCC: true,     
    DISPLAY_DIGITAL_RECEIPT_LANDING: true,
    AUTO_SEND_SINGLE_COUPON: true,
    ENABLE_PRINT_ACTION: false
});

app.constant('viewAllCouponsConfiguration', {
    DISPLAY_COUPONS_AVAILABLE: true,
    DISPLAY_COUPONS_READY_TO_USE: true,
    ENABLE_PRINT_ACTION: true
});
