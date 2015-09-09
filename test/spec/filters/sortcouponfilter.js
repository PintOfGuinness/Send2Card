

'use strict';

describe('Filter: sortCouponFilter', function () {

  // load the filter's module
  beforeEach(module('send2CardApp'));

  it('should order the coupons by expiry date', function () {

      var sortedCoupons = sortCouponFilter(sampleCouponArray);
      expect(sortedCoupons[0].expir_dt).toEqual("2015-09-02");
      expect(sortedCoupons[1].expir_dt).toEqual("2015-09-03");
      expect(sortedCoupons[2].expir_dt).toEqual("2015-10-09");
      expect(sortedCoupons[3].expir_dt).toEqual("2015-10-30");
  });

  var sortCouponFilter;
  var sampleCouponArray;
  beforeEach(inject(function ($filter) {
    sortCouponFilter = $filter('sortCouponsFilter');
    sampleCouponArray = [
                    {
                        "cmpgn_type_cd": "C",
                        "cmpgn_subtype_cd": "O",
                        "cmpgn_id": "26495",
                        "sku_nbr": "48804",
                        "cpn_seq_nbr": "75308583516",
                        "cpn_dsc": "(1) $3 ExtraBucks Rewards for downloading the myCVS app",
                        "web_dsc": "",
                        "cpn_terms_cd": "1",
                        "cpn_terms_txt": "ExtraCare card must be presented to get these savings. Savings applied to total purchase with specified product. Excludes prescriptions, alcohol, milk, lottery, money orders, gift cards, postage stamps, pre-paid cards, and pseudoephedrine. No cash back. Tax charged on pre-coupon price where required. +CRV on beverages applied where applicable. Bearer assumes all sales/use tax liability.",
                        "max_redeem_amt": "3.00",
                        "amt_type_cd": "D",
                        "pct_off_amt": "",
                        "expir_dt": "2015-10-30",
                        "view_actl_dt": "",
                        "prnt_actl_dt": "",
                        "load_actl_dt": "",
                        "redm_actl_dt": "",
                        "new_cpn_ind": "N",
                        "viewable_ind": "Y",
                        "printable_ind": "N",
                        "loadable_ind": "Y",
                        "redeemable_ind": "N",
                        "ever_web_redeemable_ind": "N",
                        "store_nbr": "",
                        "store_name": ""
                    },
                    {
                        "cmpgn_type_cd": "C",
                        "cmpgn_subtype_cd": "B",
                        "cmpgn_id": "27153",
                        "sku_nbr": "43198",
                        "cpn_seq_nbr": "76739116861",
                        "cpn_dsc": "(2) $1 off any Total Home Paper Towel or Bath Tissue (6 roll or more)",
                        "web_dsc": "",
                        "cpn_terms_cd": "1",
                        "cpn_terms_txt": "ExtraCare card must be presented to get these savings. Savings applied to total purchase with specified product. Excludes prescriptions, alcohol, milk, lottery, money orders, gift cards, postage stamps, pre-paid cards, and pseudoephedrine. No cash back. Tax charged on pre-coupon price where required. +CRV on beverages applied where applicable. Bearer assumes all sales/use tax liability.",
                        "max_redeem_amt": "1.00",
                        "amt_type_cd": "D",
                        "pct_off_amt": "",
                        "expir_dt": "2015-09-02",
                        "view_actl_dt": "",
                        "prnt_actl_dt": "",
                        "load_actl_dt": "",
                        "redm_actl_dt": "",
                        "new_cpn_ind": "N",
                        "viewable_ind": "N",
                        "printable_ind": "N",
                        "loadable_ind": "N",
                        "redeemable_ind": "Y",
                        "ever_web_redeemable_ind": "N",
                        "store_nbr": "",
                        "store_name": ""
                    },
                    {
                        "cmpgn_type_cd": "C",
                        "cmpgn_subtype_cd": "C",
                        "cmpgn_id": "27127",
                        "sku_nbr": "43091",
                        "cpn_seq_nbr": "76644930266",
                        "cpn_dsc": "(3) $5 off any Pain Reliever 400-count or larger, including CVS Brand",
                        "web_dsc": "",
                        "cpn_terms_cd": "1",
                        "cpn_terms_txt": "ExtraCare card must be presented to get these savings. Savings applied to total purchase with specified product. Excludes prescriptions, alcohol, milk, lottery, money orders, gift cards, postage stamps, pre-paid cards, and pseudoephedrine. No cash back. Tax charged on pre-coupon price where required. +CRV on beverages applied where applicable. Bearer assumes all sales/use tax liability.",
                        "max_redeem_amt": "5.00",
                        "amt_type_cd": "D",
                        "pct_off_amt": "",
                        "expir_dt": "2015-10-09",
                        "view_actl_dt": "",
                        "prnt_actl_dt": "",
                        "load_actl_dt": "",
                        "redm_actl_dt": "",
                        "new_cpn_ind": "N",
                        "viewable_ind": "N",
                        "printable_ind": "N",
                        "loadable_ind": "N",
                        "redeemable_ind": "Y",
                        "ever_web_redeemable_ind": "N",
                        "store_nbr": "",
                        "store_name": ""
                    },
                    {
                        "cmpgn_type_cd": "C",
                        "cmpgn_subtype_cd": "C",
                        "cmpgn_id": "27119",
                        "sku_nbr": "42887",
                        "cpn_seq_nbr": "76528256930",
                        "cpn_dsc": "(4) Buy TWO Greeting Cards, Get 1 FREE!",
                        "web_dsc": "",
                        "cpn_terms_cd": "1",
                        "cpn_terms_txt": "ExtraCare card must be presented to get these savings. Savings applied to total purchase with specified product. Excludes prescriptions, alcohol, milk, lottery, money orders, gift cards, postage stamps, pre-paid cards, and pseudoephedrine. No cash back. Tax charged on pre-coupon price where required. +CRV on beverages applied where applicable. Bearer assumes all sales/use tax liability.",
                        "max_redeem_amt": "2.50",
                        "amt_type_cd": "D",
                        "pct_off_amt": "",
                        "expir_dt": "2015-09-03",
                        "view_actl_dt": "",
                        "prnt_actl_dt": "",
                        "load_actl_dt": "",
                        "redm_actl_dt": "",
                        "new_cpn_ind": "N",
                        "viewable_ind": "N",
                        "printable_ind": "N",
                        "loadable_ind": "N",
                        "redeemable_ind": "Y",
                        "ever_web_redeemable_ind": "N",
                        "store_nbr": "",
                        "store_name": ""
                    }
    ];
  }));

});


