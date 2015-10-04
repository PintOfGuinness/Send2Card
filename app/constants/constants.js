var app = angular.module('drstc');

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
    COUPON_SEND_TO_CARD_IMAGE: "assets/images/icon-send2card.svg",
    COUPON_SENT_TO_CARD_IMAGE: "assets/images/icon-check.svg",
    COUPON_PRINTED: "assets/images/icon-check.svg",
    CVS_HEALTH_ICON: "assets/images/cvshealthicon.png",
    REMEMBER_ME_SUCCESS_ICON: "assets/images/remembermesuccessicon.png",

    /* HTML TEMPLATE VIEWS */
    BCC_CONTENT_TEMPLATE: "app/components/landingpage/marketing/bcccontent-template.html",
    COUPON_BLOCK_TEMPLATE: "app/shared/couponblock/couponblock-template.html",
    DIGITAL_RECEIPT_LANDING_TEMPLATE: "app/components/landingpage/campaignLanding/campaignLanding-template.html",
    VIEW_ALL_COUPONS_TEMPLATE: "app/components/landingpage/viewallcoupons/viewallcoupons-template.html",

    /* HTML ERROR/NOTIFICATION VIEWS */
    BLANK_VIEW: "app/components/landingpage/campaignLanding/notifications/blank.html",

    VIEW_ALL_COUPONS_HEADER: "app/components/landingpage/campaignLanding/notifications/viewallcoupons-header.html",
    DIGITAL_RECEIPT_CAMPAIGN_HEADER: "app/components/landingpage/campaignLanding/notifications/digitalreceiptcampaign-header.html",    
    EXTRACARE_EMAIL_CAMPAIGN_HEADER: "app/components/landingpage/campaignLanding/notifications/extracareemailcampaign-header.html", 
    COUPON_EXPIRED: "app/components/landingpage/campaignLanding/notifications/error1.html",   
    TECHNICAL_ERROR: "app/components/landingpage/campaignLanding/notifications/error4.html",

    /* REMEMBER ME TEXT */
    REMEMBER_ME_TEXT: "Remember My Card makes finding great deals even easier. Choose it and you can see myWeeklyAd Deals and ExtraCare Offers without signing in. That means more savings and convenience for you"


});
