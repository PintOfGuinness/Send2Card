var app = angular.module('send2CardApp');

app.constant('constants', {
    COUPON_STATE_DEFAULT: '0',
    COUPON_STATE_SENT_TO_CARD: '1',
    COUPON_STATE_PRINTED: '2',
    COUPON_STATE_CIRCULAR_INSTANT_EXTRABUCKS: '3',

    COUPON_TYPE_PERCENT: 'P',
    COUPON_TYPE_DECIMAL: 'D',

    DISPLAY_SPACE: ' ',
    DISPLAY_OFF: ' ',
    DISPLAY_ZEROS: '00'
});
