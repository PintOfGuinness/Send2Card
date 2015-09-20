var app = angular.module('send2CardApp');

app.constant('pageConfiguration', {
    DISPLAY_PROGRESS_BAR: 'true',
    DISPLAY_BCC: 'true', //TODO
    DISPLAY_MONETATE: 'true', //TODO
    ENABLE_EC_OPT_IN: 'true'
});

app.constant('digitalReceiptLandingConfiguration', {
    DISPLAY_DIGITAL_RECEIPT_LANDING: 'true',
    AUTO_SEND_SINGLE_COUPON: 'true',
    ENABLE_PRINT_ACTION: 'true'
});

app.constant('viewAllCouponsConfiguration', {
    DISPLAY_COUPONS_AVAILABLE: 'true',
    DISPLAY_COUPONS_READY_TO_USE: 'true',
    AUTO_SEND_SINGLE_COUPON: 'false',
    ENABLE_PRINT_ACTION: 'true'
});
