'use strict';

/**
 * @ngdoc filter
 * @name send2CardApp.filter:CouponFilter
 * @function
 * @description
 * # CouponFilter
 *  *
 * Filter in the send2CardApp.
 */
angular.module('send2CardApp')
  .filter('couponFilter', function ($filter) {
    return function (input, couponNumberFilter, excludeCouponNumberFilter) {
      var output = [];

      if (excludeCouponNumberFilter) {
        output = getAllViewableCouponsByFilter(input, couponNumberFilter);
      } else {
        output = getSingleCouponByFilter(input, couponNumberFilter);
      }

      return output;
    };

    function getAllViewableCouponsByFilter(input, couponNumberFilter){
      var output = {};

      var actionedCoupons = [];
      var unactionedCoupons = [];

      var actionedSavings = 0;
      var unactionedSavings = 0;
      var totalSavings = 0;

      angular.forEach(input, function (eachCoupon, index) {
        totalSavings += parseFloat(input[index].max_redeem_amt);

        if (input[index].cpn_seq_nbr !== couponNumberFilter) {
          if (couponViewable(eachCoupon)) {
            setCouponCollapsedDefault(eachCoupon);
            if (couponActioned(eachCoupon)) {
              actionedCoupons.push(eachCoupon);
              actionedSavings += parseFloat(input[index].max_redeem_amt);
            } else {
              unactionedCoupons.push(eachCoupon);
              unactionedSavings += parseFloat(input[index].max_redeem_amt);
            }
          }
        }
      });
      output.actionedCoupons = actionedCoupons;
      output.unactionedCoupons = unactionedCoupons;
      output.actionedSavings = actionedSavings;
      output.unactionedSavings = unactionedSavings;
      output.totalSavings=totalSavings;


      return output;
    }

    function getSingleCouponByFilter(input, couponNumberFilter) {
      var output = [];
      if (angular.isDefined(couponNumberFilter)) {
        output = $filter('filter')(input, {
          cpn_seq_nbr: couponNumberFilter
        }, true)[0];

        if (angular.isDefined(output)) {
          setCouponCollapsedDefault(output);
          couponExpiresSoon(output);
        }
      } else {
        output = undefined;
      };

      function couponRedeemed(eachCoupon) {
        if (eachCoupon.redeemable_ind === "N") {
          return false;
        } else {
          return true;
        }
      }
      return output;
    }

    function setCouponCollapsedDefault(coupon) {
      coupon.isCollapsed = true;
    }

    function couponViewable(eachCoupon) {
      var viewable = false;

      if (!couponRedeemed(eachCoupon)) {
        viewable = true;
        filterCoupon(eachCoupon);
      } else {
        viewable = false;
      }

      return viewable;
    }

    function showSoonOverNew(eachCoupon) {
      if (eachCoupon.expiresSoon === true && eachCoupon.isNew === true) {
        eachCoupon.isNew = false;
      }
    }

    function filterCoupon(eachCoupon) {
      if (eachCoupon.state == undefined) {
        if (couponLoaded(eachCoupon)) {
          eachCoupon.state = 1;
        } else {
          if (couponPrinted(eachCoupon)) {
            eachCoupon.state = 2
          } else {
            eachCoupon.state = 0;
          }
        }
      }
      couponExpiresSoon(eachCoupon);
      couponIsNew(eachCoupon);
      showSoonOverNew(eachCoupon);
    }

    function couponRedeemed(eachCoupon) {
      if (eachCoupon.redeemable_ind === "Y") {
        return false;
      } else {
        return true;
      }
    }

    function couponLoaded(eachCoupon) {
      if (eachCoupon.load_actl_dt === "") {
        return false;
      } else {
        return true;
      }
    }

    function couponPrinted(eachCoupon) {
      if (eachCoupon.prnt_actl_dt === "") {
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

      if (eachCoupon.viewable_ind === "Y") {
        eachCoupon.isNew = true;
      } else {
        eachCoupon.isNew = false;
      }

    }

    function couponActioned(eachCoupon) {
      if (eachCoupon.load_actl_dt === "" && eachCoupon.prnt_actl_dt === "") {
        return false;
      } else {
        return true;
      }
    }

  });
