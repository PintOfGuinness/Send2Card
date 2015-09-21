var app = angular.module('send2CardApp');

app.constant('constants', {

    /* SERVICE RESPONSE */
    YES: "Y",
    NO: "N",
    EMPTY_STRING: "",
    
    /*PAGE*/
    PAGE_NAME: "EXTRACARE COUPON LANDING PAGE",
    
    /* COUPON */
    COUPON_STATE_DEFAULT: 0,
    COUPON_STATE_SENT_TO_CARD: 1,
    COUPON_STATE_PRINTED: 2,
    COUPON_STATE_CIRCULAR_INSTANT_EXTRABUCKS: 3,

    /* COUPON TITLE */
    COUPON_TYPE_PERCENT: 'P',
    COUPON_TYPE_DECIMAL: 'D',
    DISPLAY_SPACE: ' ',
    DISPLAY_OFF: 'off',
    DISPLAY_ZEROS: '00',
    DOT: '.',

    /* IMAGES */
    COUPON_SEND_TO_CARD_IMAGE: "images/sendtocardicon.png",
    COUPON_SENT_TO_CARD_IMAGE: "images/oncard.png",
    COUPON_PRINTED: "images/printedicon.png",

    /* HTML TEMPLATE VIEWS */
    BCC_CONTENT_TEMPLATE: "views/templates/bcccontent-template.html",
    COUPON_BLOCK_TEMPLATE: "views/templates/couponblock-template.html",
    DIGITAL_RECEIPT_LANDING_TEMPLATE: "views/templates/digitalreceiptlanding-template.html",
    VIEW_ALL_COUPONS_TEMPLATE: "views/templates/viewallcoupons-template.html",

    /* HTML ERROR/NOTIFICATION VIEWS */
    BLANK_VIEW: "views/notifications/blank.html",    
    VIEW_ALL_COUPONS_HEADER: "views/notifications/header1.html",
    TECHNICAL_ERROR: "views/notifications/error1.html"
});
