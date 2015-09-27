'use strict';

/**
 * @ngdoc filter
 * @name send2CardApp.filter:categoriseCouponsFilter
 * @function
 * @description
 * # categoriseCouponsFilter
 * Filter in the send2CardApp.
 */
angular.module('send2CardApp')
    .filter('categoriseCouponsFilter', function ($filter, constants) {
        return function (input, couponNumberFilter, excludeCouponNumberFilter) {
            var output = [];

            if (excludeCouponNumberFilter) {
                output = getAllViewableCouponsByFilter(input, couponNumberFilter);
            } else {
                output = getSingleCouponByFilter(input, couponNumberFilter);
            }

            return output;
        };

        function getAllViewableCouponsByFilter(input, couponNumberFilter) {
            var output = {};
            var actionedCoupons = [];
            var unactionedCoupons = [];

            angular.forEach(input, function (eachCoupon, index) {

                if (input[index].cpn_seq_nbr !== couponNumberFilter) {
                    if (couponViewable(eachCoupon)) {
                        couponState(eachCoupon);
                        couponExpiresSoon(eachCoupon);
                        couponIsNew(eachCoupon);
                        showSoonOverNew(eachCoupon);
                        couponIsExtraBucks(eachCoupon);
                        eachCoupon = $filter('couponTitleFilter')(eachCoupon);
                        setCouponCollapsedDefault(eachCoupon);
                        if (couponActioned(eachCoupon)) {
                            actionedCoupons.push(eachCoupon);
                        } else {
                            unactionedCoupons.push(eachCoupon);
                        }
                    }
                }
            });
            output.actionedCoupons = actionedCoupons;
            output.unactionedCoupons = unactionedCoupons;

            return output;
        }

        function getSingleCouponByFilter(input, couponNumberFilter) {
            var singleCoupon = [];
            if (angular.isDefined(couponNumberFilter)) {
                singleCoupon = $filter('filter')(input, {
                    cpn_seq_nbr: couponNumberFilter
                }, true)[0];

                if (angular.isDefined(singleCoupon)) {
                    singleCoupon = $filter('couponTitleFilter')(singleCoupon);
                    setCouponCollapsedDefault(singleCoupon);
                    couponState(singleCoupon); // ????
                    couponExpiresSoon(singleCoupon);
                }
            } else {
                singleCoupon = undefined;
            };

            return singleCoupon;
        }

        function couponViewable(eachCoupon) {
            if (eachCoupon.viewable_ind === constants.YES) {
                return true;
            } else {
                return false;
            }
        }

        /*   NOTE:  Find out if/how redeemable_ind is used in the logic

        function couponRedeemed(eachCoupon) {
                    if (eachCoupon.redeemable_ind === constants.YES) {
                        return false;
                    } else {
                        return true;
                    }
                }*/

        function couponState(eachCoupon) {
            if (eachCoupon.state == undefined) {
                if (couponLoaded(eachCoupon)) {
                    eachCoupon.state = constants.COUPON_STATE_SENT_TO_CARD;
                } else {
                    if (couponPrinted(eachCoupon)) {
                        eachCoupon.state = constants.COUPON_STATE_PRINTED;
                    } else {
                        eachCoupon.state = constants.COUPON_STATE_DEFAULT;
                    }
                }
            }
        }

        function couponLoaded(eachCoupon) {
            if (eachCoupon.load_actl_dt === constants.EMPTY_STRING) {
                return false;
            } else {
                return true;
            }
        }

        function couponPrinted(eachCoupon) {
            if (eachCoupon.prnt_actl_dt === constants.EMPTY_STRING) {
                return false;
            } else {
                return true;
            }
        }

        function couponExpiresSoon(eachCoupon) {
            var today = new Date();
            var expiresSoonRegion = new Date(today);
            expiresSoonRegion.setDate(today.getDate() + 14);
            var expiryDate = new Date(eachCoupon.expir_dt);

            if (expiryDate < expiresSoonRegion) {
                eachCoupon.expiresSoon = true;
            } else {
                eachCoupon.expiresSoon = false;
            }
        }

        function couponIsNew(eachCoupon) {
            if (eachCoupon.new_cpn_ind === constants.YES) {
                eachCoupon.isNew = true;
            } else {
                eachCoupon.isNew = false;
            }
        }

        function couponIsExtraBucks(eachCoupon) {
            if (eachCoupon.cpn_dsc.indexOf(constants.EXTRABUCKS) > 1) {
                return eachCoupon.isExtraBucks = true;
            } else {
                return eachCoupon.isExtraBucks = false;
            }

        }

        function showSoonOverNew(eachCoupon) {
            if (eachCoupon.expiresSoon === true && eachCoupon.isNew === true) {
                eachCoupon.isNew = false;
            }
        }

        function setCouponCollapsedDefault(eachCoupon) {
            eachCoupon.isCollapsed = true;
        }

        function couponActioned(eachCoupon) {
            if (couponLoaded(eachCoupon) || couponPrinted(eachCoupon)) {
                return true;
            } else {
                return false;
            }
        }
    });
