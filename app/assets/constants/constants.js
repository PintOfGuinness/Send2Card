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
    EMPTY_STRING: "",
    DISPLAY_OFF: 'off',
    DISPLAY_ZEROS: '00',
    DOT: '.',
    EXTRABUCKS: 'ExtraBucks',

    /* IMAGES */
    COUPON_SEND_TO_CARD_IMAGE: "assets/images/sendtocardicon.png",
    COUPON_SENT_TO_CARD_IMAGE: "assets/images/oncard.png",
    COUPON_PRINTED: "assets/images/printedicon.png",
    CVS_HEALTH_ICON: "assets/images/cvshealthicon.png",
    REMEMBER_ME_SUCCESS_ICON: "assets/images/remembermesuccessicon.png",

    /* HTML TEMPLATE VIEWS */
    BCC_CONTENT_TEMPLATE: "components/landingpage/marketing/bcccontent-template.html",
    COUPON_BLOCK_TEMPLATE: "components/landingpage/shared/couponblock/couponblock-template.html",
    DIGITAL_RECEIPT_LANDING_TEMPLATE: "components/landingpage/digitalreceiptlanding/digitalreceiptlanding-template.html",
    VIEW_ALL_COUPONS_TEMPLATE: "components/landingpage/viewallcoupons/viewallcoupons-template.html",

    /* HTML ERROR/NOTIFICATION VIEWS */
    BLANK_VIEW: "components/landingpage/digitalreceiptlanding/notifications/blank.html",

    VIEW_ALL_COUPONS_HEADER: "components/landingpage/digitalreceiptlanding/notifications/viewallcoupons-header.html",
    DIGITAL_RECEIPT_CAMPAIGN_HEADER: "components/landingpage/digitalreceiptlanding/notifications/digitalreceiptcampaign-header.html",    
    EXTRACARE_EMAIL_CAMPAIGN_HEADER: "components/landingpage/digitalreceiptlanding/notifications/extracareemailcampaign-header.html", 
    COUPON_EXPIRED: "components/landingpage/digitalreceiptlanding/notifications/error1.html",   
    TECHNICAL_ERROR: "components/landingpage/digitalreceiptlanding/notifications/error4.html",

    /* REMEMBER ME TEXT */
    REMEMBER_ME_TEXT: "Remember My Card makes finding great deals even easier. Choose it and you can see myWeeklyAd Deals and ExtraCare Offers without signing in. That means more savings and convenience for you"


});
