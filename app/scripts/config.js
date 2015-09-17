var app = angular.module('send2CardApp');

app.constant('configuration', {
    ENABLE_PRINT_ACTION: 'true',
    SHOW_PROGRESS_BAR: 'true',
    AUTO_SEND_SINGLE_COUPON: 'false', //TODO
    SHOW_SINGLE_COUPON: 'true',
    SHOW_COUPON_BLOCK: 'true',
    SHOW_BCC: 'true',
    SHOW_MONETATE: 'true', //TODO
    SHOW_READY_TO_USE: 'true'
});
