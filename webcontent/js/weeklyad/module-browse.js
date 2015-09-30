"use strict";

var CVSJS = CVSJS || {};

CVSJS.Promo = CVSJS.Promo || {};

CVSJS.Promo.facebookBlocked = true;

var FB;


//This will change the brackets within templates to be <@ @>, safe for JSP
_.templateSettings = {
	interpolate: /\<\@\=(.+?)\@\>/gim,
	evaluate: /\<\@(.+?)\@\>/gim,
	escape: /\<\@\-(.+?)\@\>/gim
};

// ie8 and below don't support "indexOf" so we need to build it
if(!Array.indexOf){
	Array.prototype.indexOf = function(obj){
		for(var i=0; i<this.length; i++){
			if(this[i]===obj){
				return i;
			}
		}
		return -1;
	}
}

//--------------------------------------------------------------------------------------------------------------------
//------------------- CONFIGURATION ----------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------

CVSJS.Promo.catSections = [];

CVSJS.Promo.Data = {
	stores: [],
	favstores: [],
	mystore: {},
	categories: [],
	shoppinglist: {},
	sneakpeek: {},
	shoplistextracare: [],
	browseextracare: [],
	adblocks: [],
	prevpurchases: {},
	eventdisclaimer: "",
	pushoffers: [],
	browseprevpurchasesfull: [],
	browseprevpurchasespartial: []
};

CVSJS.Promo.Defaults = {
	sectionName: 'home',
	prevPurchases: {
		numDaysHistory: 186
	},
	pagerParams: {
		itemsPerPage: 10,
		currentPage: 1,
		startIndex: 0,
		totalItems: 0
	},
	descSort: 'asc',
	imageLoadDelayMilliSec: 200,
	loadDelayMilliSec: 200,
	browsePageScrollPosition: 0,
	overrideEb: false,
	windowParams: {
		yOffset: 0,
		freezeHeaderHeight: 0,
		freezeHeaderAdjust: -15
	},
	noImageAvailableSmall: '/webcontent/images/weeklyad/browse/no-image-available-v4.png',
	noImageAvailableLarge: '/webcontent/images/weeklyad/browse/no-image-available-v5.png',
	noImageAvailableMedium: '/webcontent/images/weeklyad/browse/no-image-available-v6.png',
	imagePath: '/webcontent/images/weeklyad/cvsppcontent'
}
CVSJS.Promo.Globals = {
	isPersonalized: false,
	sessionTimeout: 0,
	pingPingTimeout: 0,
	hasBeenRedirected: false,
	shoppingListCache: {},
	mobileFilterCurrentSelection: null,
	history: []
}
CVSJS.Promo.ErrorMsgs = {
	sPrevPurchase: 			"we were unable to retrieve your past purchase data",
	sAdBlkNavGrp:			"we were unable to retrieve your deal information",
	sAdBlkDetails:			"we were unable to retrieve deal details",
	sExtraCareCoupons:		"we were unable to retrieve your ExtraCare coupons",
	sExtraCareDeals:		"we were unable to retrieve your ExtraCare deals",
	sExtraCarePrintCoupon:	"we were unable to print your ExtraCare coupon",
	sExtraCareSendCoupon:	"we were unable to send your ExtraCare coupon to your card",
	sSearchStore:			"we were unable to process your store search",
	sAddStoreFavorite:		"we were unable to add your store favorite",
	sGetFavoriteStores:		"we were unable to retrieve your favorite stores",
	sGetShopList:			"we were unable to retrieve your shopping list",
	sAddItem:				"we were unable to add the item",
	sAddItemTooMany:		"the maximum number of items has been added to your list",
	sRemoveItem:			"we were unable to remove the item",
	sUpdateQty: 			"we were unable to update the quantity",
	sEmailList:				"we were unable to email your list",
	sEditItem:				"we were unable to complete your edit request",
	sLoadDisclaimer:		"we were unable to show necessary disclaimer information",
	solTryAgain:			"Please try again.",
	solReloadPage:			"You may need to reload the page.",
	solContact:				"Please contact support to address this issue",
	solNothing:				""
}

CVSJS.Promo.ErrorMsgs.build = function( context, solution, errCode ){
	var usrCode
	if(errCode && errCode != "99"){
		if(errCode === "999"){ //timeout
			usrCode = "[E1]";
		}else if(errCode === "500"){
			usrCode = "[E2]";
		}else{
			usrCode = "[E3]";
		}
		return "Sorry, " + context + ". " + solution + " " + usrCode;
	}
	//session timeout
	return "";
}

//--------------------------------------------------------------------------------------------------------------------
//------------------- SERVICES ---------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------

CVSJS.Promo.Services = {
	URL: {
		//Prev Purchases
		getPrevPurchases: "/atg/commerce/gifts/CvsInStoreListService/getPastPurchase",

		//Browse
		getCategoryAdBlocks: "/cvs/weeklyad/CvsWeeklyAdBrowseServices/getAdBlockByNavigationGroup", //not logged in
		getAdBlockDetails: "/cvs/weeklyad/CvsWeeklyAdBrowseServices/getAdBlockDetails",

		getPushOffPrevPurchases: "/cvs/weeklyad/CvsPersonalizationServices/getOrderedPpAndPushOfferBlocks", //?eventid=v1&adVersionCode=v3 - logged in + ec card
		getOrderedCategoryAdBlocks: "/cvs/weeklyad/CvsPersonalizationServices/getOrderedAdBlocksByPropensity", //?navgrpid=v1&version=v2&eventid=v3 - logged in + ec card

		//ExtraCare services
		getExtraCareCoupons: "/cvs/weeklyad/CvsWeeklyAdBrowseServices/getExtracareCoupons", //ExtraCare tied + Logged In, extracare tied + remembered = show login modal
		printExtraCareCoupon: "/cvs/extracare/CvsECProfileService/printOffer", //?couponSeqNumber=10000005023
		sendExtraCareCoupon: "/cvs/extracare/CvsECProfileService/sendToCard", //?couponSeqNumber=10000005023
		getExtraCareAdBlocks: "/cvs/weeklyad/CvsWeeklyAdBrowseServices/getExtraCareAdBlocks", //?navgrpid=103201&version=B&eventid=100805

		//Store Locator
		getStores: "/cvs/store/CvsStoreLocatorServices/getSearchStore",
		setFavoriteStore: "/cvs/store/CvsStoreLocatorServices/getAddStoreToFavoriteList",
		getFavoriteStores: "/cvs/store/CvsStoreLocatorServices/getFavoriteStores",
		getStoreDetails: "/cvs/store/CvsStoreLocatorServices/getStoreIdDetails",
		getStoreInfoById: "/cvs/store/CvsStoreLocatorServices/getStoreInfoById",

		//Shopping List
		getShoppingList: "/atg/commerce/gifts/CvsInStoreListService/getShoppingLists",
		addItemToShoppingList: "/atg/commerce/gifts/CvsInStoreListService/addItemToList", //?Id=101558&type=0&qt=1&eventId=7623487
		deleteItemFromShoppingList: "/atg/commerce/gifts/CvsInStoreListService/removeItemsFromShoppingList", //?gi=gi2540013
		deleteAllFromShoppingList: "/atg/commerce/gifts/CvsInStoreListService/removeAllItemsFromShoppingList",
		updateItemQtyInShoppingList: "/atg/commerce/gifts/CvsInStoreListService/updateItemQuantity", //?gi=gi2540011&qt=5

		emailShoppingList: "/atg/commerce/gifts/CvsInStoreListService/emailShoppingList", //?email=me@tahsin.com

		addItemToNotesList: "/atg/commerce/gifts/CvsInStoreListService/addItemToList", //?type=2&note=shopping list
		editItemInNotesList: "/atg/commerce/gifts/CvsInStoreListService/editItemNote", //?gi=gi2132445&note=edit shopping list
		deleteItemFromNotesList: "/atg/commerce/gifts/CvsInStoreListService/removeItemsFromShoppingList", //?gi=gi2132445

		addItemToSneakPeekList: "/atg/commerce/gifts/CvsInStoreListService/addItemToList",  //?Id=101558&type=0&qt=1&eventId=7623487
		deleteItemFromSneakPeekList: "/atg/commerce/gifts/CvsInStoreListService/removeItemsFromShoppingList", //?gi=gi2540013
		updateItemQtyInSneakPeekList: "/atg/commerce/gifts/CvsInStoreListService/updateItemQuantity", //?gi=gi2540011&qt=5

		getDisclaimer: "/cvs/weeklyad/CvsWeeklyAdBrowseServices/getEventDisclaimer", //?eventId=gi2540011
	},

	//Store Locator
	getBingResults: function( queryData, callback ){
		var returnData = "";
		var countryRegion = 'US';
		var intRegex = /^\d+$/;
		var searchString = $.trim(queryData);
		if(intRegex.test(searchString)){
			if(searchString.length < 6){
				var trimmedStr = searchString.replace(/^0+/, "");
				if(trimmedStr.length === 3){
					searchString = trimmedStr;
				}
			}

			// setup "did you mean store #xxxx" search option
			if (searchString.length <= 5) {
				var checkStoreId = this.getStoreDetails(searchString);
				if (checkStoreId && checkStoreId.sm != null) {
					var suggestStoreId = 'Did you mean Store <strong>#' + trimmedStr + '</strong>? <a class="searchtermlink" href="#" data-storeid="' + trimmedStr + '" title="View details for this store">View details for this store.</a>';
					$('#suggestStoreId').html(suggestStoreId).show();
				}
			}

			if(searchString.length === 1 || searchString.length === 2){
				if(searchString.length === 1){
					searchString = "0000" + searchString;
				}else if(searchString.length === 2){
					searchString = "000" + searchString;
				}
			}else if(searchString.length === 3){
				searchString = "00" + searchString;
				countryRegion = "PR";
			}else if(searchString.length === 4){
				searchString = "0" + searchString;
			}
		}
		var bingprotocol = window.location.protocol;
		var restprotocol = "http:";
		if (bingprotocol != null && bingprotocol != "" && bingprotocol === "https:"){
			restprotocol = "https:";
		}

		if(CVSJS.Header.Details){
			if(CVSJS.Header.Details.bk){
				var bingURL = restprotocol+"//dev.virtualearth.net/REST/v1/Locations?query=" + encodeURIComponent(searchString) + "," + countryRegion + "&output=json&key=" + CVSJS.Header.Details.bk + "&$filter=Cvs_Store_Flag%20Eq%20'Y'" + "&jsonp=?";

				$.getJSON( bingURL, function( data ){
					if(data && data.resourceSets.length > 0 && data.statusCode == "200"){
						return callback(data.resourceSets[0].resources, searchString, data.resourceSets[0].estimatedTotal);
					}else{
						return callback([], searchString, 0);
					}
				}).fail(function(){
					return callback([], searchString, 0);
				});
			}
		}
	},
	getStores: function( reqData ){
		var data = CVSJS.Services.getJSON( this.URL.getStores, reqData );
		CVSJS.Promo.Session.timerReset();
		if(data && data.sd){
			CVSJS.Promo.Data.stores = data.sd;
		}else if(data && data.error){
			CVSJS.Promo.Data.stores=[];
		}else{
			CVSJS.Promo.Data.stores=[];
		}
	},
	setFavoriteStore: function( reqData ){
		var data = CVSJS.Services.getJSON( this.URL.setFavoriteStore, reqData );
		CVSJS.Promo.Session.timerReset();
		if(data && data.sd){
			CVSJS.Promo.Data.mystore = data.sd;
			return CVSJS.Promo.Data.mystore.id;
		}else if(data && data.error){
			CVSJS.Promo.Helper.growl(data.error, CVSJS.Promo.ErrorMsgs.build(CVSJS.Promo.ErrorMsgs.sAddStoreFavorite, CVSJS.Promo.ErrorMsgs.solTryAgain, data.error));
		}
	},
	getFavoriteStores: function( reqData ){
		var data = CVSJS.Services.getJSON( this.URL.getFavoriteStores, reqData );
		CVSJS.Promo.Session.timerReset();
		if(data && data.sd){
			CVSJS.Promo.Data.favstores = data.sd;
			CVSJS.Promo.Data.mystore = _.find(data.sd, function(store){ return store.id === data.ds; });
		}else if(data && data.error){
			CVSJS.Promo.Helper.growl(data.error, CVSJS.Promo.ErrorMsgs.build(CVSJS.Promo.ErrorMsgs.sGetFavoriteStores, CVSJS.Promo.ErrorMsgs.solTryAgain, data.error));
		}
	},
	getStoreDetails: function(storeId) {
		var data = CVSJS.Services.getJSON(this.URL.getStoreDetails, {storeId: storeId});
		CVSJS.Promo.Session.timerReset();
		return data;
	},
	getStoreInfoById: function(storeId) {
		var data = CVSJS.Services.getJSON(this.URL.getStoreInfoById, {si: storeId});
		CVSJS.Promo.Session.timerReset();
		return data;
	},
	showSuggestStoreId: function() {
		$('#suggestStoreId').show();
		return false;
	},
	hideSuggestStoreId: function() {
		$('#suggestStoreId').hide();
		return false;
	},

	//Browse Page Categories
	getCategories: function( reqData ){
		if(CVSJS.Header.Details.ng && CVSJS.Header.Details.ng[0]){
			CVSJS.Promo.Data.categories = CVSJS.Header.Details.ng;
		}else{
			CVSJS.Promo.Helper.growl("", CVSJS.Promo.ErrorMsgs.build(CVSJS.Promo.ErrorMsgs.sAdBlkNavGrp, CVSJS.Promo.ErrorMsgs.solReloadPage, "01"));
		}
	},

	//Browse Page (1 call of this per category)
	getCategoryAdBlocks: function( reqData, callback ){
		CVSJS.Services.getAsyncJSON(CVSJS.Promo.Services.URL.getCategoryAdBlocks, { navgrpid: reqData.navgrpid, version: CVSJS.Header.Details.sd.cv, eventid: CVSJS.Header.Details.ei }, "GET", false, function(unOrderedAdBlockData){

			CVSJS.Promo.Session.timerReset();

			if(unOrderedAdBlockData && unOrderedAdBlockData.error){
				CVSJS.Promo.Helper.growl(unOrderedAdBlockData.error, CVSJS.Promo.ErrorMsgs.build(CVSJS.Promo.ErrorMsgs.sAdBlkNavGrp, CVSJS.Promo.ErrorMsgs.solReloadPage, unOrderedAdBlockData.error));
				return;
			}

			if((CVSJS.Header.Flags.userIsSignedIn() || CVSJS.Header.Flags.userIsCookied()) && CVSJS.Header.Flags.userHasECCard() && CVSJS.Header.Flags.personalizationEnabled() && unOrderedAdBlockData.ab.il) {
				CVSJS.Services.getAsyncJSON(CVSJS.Promo.Services.URL.getOrderedCategoryAdBlocks, { version: CVSJS.Header.Details.sd.cv, eventid: CVSJS.Header.Details.ei, abl: unOrderedAdBlockData.ab.il }, "POST", true, function(orderData){
					if(orderData && orderData.error){
						console.log("Error in getOrderedCategoryAdBlocks");
						return;
					}

					if(unOrderedAdBlockData && unOrderedAdBlockData.ab && unOrderedAdBlockData.ab.nb && orderData && orderData.ab){
						var orderedBlockData = [], blockToPush;
						//order the ad blocks by propensity
						$.each(orderData.ab, function(index, value) {
							//find the adblock in the data list and push it to the ordered list
							blockToPush = _.find(unOrderedAdBlockData.ab.nb, function(adblock){ return adblock.vb == value; });
							orderedBlockData.push(blockToPush);
						});

						callback(orderedBlockData);
					}
				});
			}

			callback(unOrderedAdBlockData.ab.nb);
		});
	},

	//ExtraCare Coupons
	getExtraCareCoupons: function( callback ){
		CVSJS.Services.getAsyncJSON(this.URL.getExtraCareCoupons, {}, "POST", false, function(data){

			CVSJS.Promo.Session.timerReset();

			if(data && data.error){
				CVSJS.Promo.Helper.growl(data.error, CVSJS.Promo.ErrorMsgs.build(CVSJS.Promo.ErrorMsgs.sExtraCareCoupons, CVSJS.Promo.ErrorMsgs.solTryAgain, data.error));
			}else if (data && data.ec) {
				callback(data.ec);
			}else if (data && data.ec == null) {
				callback([]);
			}
		});
	},

	printExtraCareCoupon: function( reqData ){
		var data = CVSJS.Services.getJSON(this.URL.printExtraCareCoupon, reqData);

		CVSJS.Promo.Session.timerReset();

		if(data && data.error){
			CVSJS.Promo.Helper.growl(data.error, CVSJS.Promo.ErrorMsgs.build(CVSJS.Promo.ErrorMsgs.sExtraCarePrintCoupon, CVSJS.Promo.ErrorMsgs.solTryAgain, data.error));
			return false;
		}else if (data) {
			return true;
		}
	},

	sendExtraCareCoupon: function( reqData, callback ){
		var data = CVSJS.Services.getJSON(this.URL.sendExtraCareCoupon, reqData);

		CVSJS.Promo.Session.timerReset();

		if(data && data.error){
			CVSJS.Promo.Helper.growl(data.error, CVSJS.Promo.ErrorMsgs.build(CVSJS.Promo.ErrorMsgs.sExtraCareSendCoupon, CVSJS.Promo.ErrorMsgs.solTryAgain, data.error));
			return false;
		}else if (data) {
			return true;
		}
	},

	getExtraCareAdBlocks: function(callback) {
		var ei = CVSJS.Header.Details.ei, //eventid
			id, //navgroup id
			reqData = {},
			version = CVSJS.Header.Details.sd.cv;

		id = _.find(CVSJS.Header.Details.ng, function(obj) {
			if (obj.nt == 4) {
				return true;
			}
		}).id;

		reqData = {
			navgrpid: id,
			eventid: ei,
			version: version
		};

		CVSJS.Services.getAsyncJSON(this.URL.getExtraCareAdBlocks, reqData, 'POST', false, function(data) {
			CVSJS.Promo.Session.timerReset();

			if (data && data.error) {
				CVSJS.Promo.Helper.growl(data.error, CVSJS.Promo.ErrorMsgs.build(CVSJS.Promo.ErrorMsgs.sExtraCareDeals, CVSJS.Promo.ErrorMsgs.solTryAgain, data.error));
			} else {
				callback(data);
				CVSJS.Promo.Events.trigger('render:complete');
			}
		});
	},

	//Prev Purchases
	getPrevPurchases: function( reqData, callback ){
		var data = CVSJS.Services.getJSON(this.URL.getPrevPurchases, reqData);

		CVSJS.Promo.Session.timerReset();

		if(data && data.error){
			CVSJS.Promo.Helper.growl(data.error, CVSJS.Promo.ErrorMsgs.build(CVSJS.Promo.ErrorMsgs.sPrevPurchase, CVSJS.Promo.ErrorMsgs.solTryAgain, data.error));
			return false;
		}else if (data && data.data.prevpurchases) {
			return callback(data.data.prevpurchases);
		}else{
			return false;
		}
	},

	//Ad Block Details
	getAdBlockDetails: function( reqData, callback ){
		CVSJS.Services.getAsyncJSON(this.URL.getAdBlockDetails, { adblocknumber : reqData.adblocknumber, version : CVSJS.Header.Details.sd.cv, eventid : CVSJS.Header.Details.ei, versionblkid : reqData.versionblkid, storeid : CVSJS.Header.Details.sd.id }, "GET", false, function( data ){

			CVSJS.Promo.Session.timerReset();

			if(data && data.error){
				CVSJS.Promo.Helper.growl(data.error, CVSJS.Promo.ErrorMsgs.build(CVSJS.Promo.ErrorMsgs.sAdBlkDetails, CVSJS.Promo.ErrorMsgs.solTryAgain, data.error));
				callback({});
			}else if(data && data.ad){
				callback(data.ad);
			}else{
				callback("");
			}
		});
	},

	//Push Offers/Prev Purchases
	getPushOffPrevPurchases: function( callback, renderFullPp ){
		var data = CVSJS.Services.getJSON("/cvs/weeklyad/CvsPersonalizationServices/getOrderedPpAndPushOfferBlocks", { requestFullPpListInSession: renderFullPp || false, eventid : CVSJS.Header.Details.ei, adVersionCode : CVSJS.Header.Details.sd.cv, pushOfferNavGroupId: 1, ppreq : CVSJS.Header.Details.au[0] } );

		CVSJS.Promo.Session.timerReset();

		if(data && data.error){
			CVSJS.Promo.Helper.growl(data.error, CVSJS.Promo.ErrorMsgs.build(CVSJS.Promo.ErrorMsgs.sPrevPurchase, CVSJS.Promo.ErrorMsgs.solTryAgain, data.error));
		}else if(data && (data.po || data.ppf || data.ppp)){
			if(data.po){
				CVSJS.Promo.Data.pushoffers = data.po;
			}

			if(data.ppf){
				CVSJS.Promo.Data.browseprevpurchasesfull = data.ppf;
			}

			if(data.ppp && data.ppf){
				var uniquePp = _.uniq(data.ppp, false);
				_.each(uniquePp, function(skunum){
					CVSJS.Promo.Data.browseprevpurchasespartial.push(_.findWhere(data.ppf, { sn : skunum }));
				});
			}

			callback(CVSJS.Promo.Data.pushoffers, CVSJS.Promo.Data.browseprevpurchasesfull, CVSJS.Promo.Data.browseprevpurchasespartial);
		}
	},

	//Shopping List
	getShoppingList: function( reqData ){
		var data = CVSJS.Services.getJSON(this.URL.getShoppingList, reqData );

		CVSJS.Promo.Session.timerReset();

		if(data && data.error){
			CVSJS.Promo.Helper.growl(data.error, CVSJS.Promo.ErrorMsgs.build(CVSJS.Promo.ErrorMsgs.sGetShopList, CVSJS.Promo.ErrorMsgs.solTryAgain, data.error));
		}else if(data){
			if(data.sl){
				CVSJS.Promo.Data.shoppinglist = _.reject(data.sl.items, function(item){ return (item.ss && item.ss == 1); });
				CVSJS.Promo.Data.sneakpeek = _.filter(data.sl.items, function(item){ return (item.ss && item.ss == 1); });
				CVSJS.Promo.Data.notes = data.sl.notes;
			}

			if(data.ec){
				CVSJS.Promo.Data.shoplistextracare = data.ec;
			}
		}
	},
	updateItemQtyInShoppingList: function( reqData ){
		var data = CVSJS.Services.getJSON(this.URL.updateItemQtyInShoppingList, reqData );

		CVSJS.Promo.Session.timerReset();

		if(data && data.error){
			CVSJS.Promo.Helper.growl(data.error, CVSJS.Promo.ErrorMsgs.build(CVSJS.Promo.ErrorMsgs.sUpdateQty, CVSJS.Promo.ErrorMsgs.solTryAgain, data.error));
			return false;
		}else{
			return data;
		}

	},
	deleteItemFromShoppingList: function( reqData ){
		var data = CVSJS.Services.getJSON(this.URL.deleteItemFromShoppingList, reqData );

		CVSJS.Promo.Session.timerReset();

		if(data && data.error){
			CVSJS.Promo.Helper.growl(data.error, CVSJS.Promo.ErrorMsgs.build(CVSJS.Promo.ErrorMsgs.sRemoveItem, CVSJS.Promo.ErrorMsgs.solTryAgain, data.error));
			return false;
		}else{
			return data;
		}
	},
	deleteAllFromShoppingList: function( reqData ){
		var data = CVSJS.Services.getJSON(this.URL.deleteAllFromShoppingList, reqData );

		CVSJS.Promo.Session.timerReset();

		if(data && data.error){
			CVSJS.Promo.Helper.growl(data.error, CVSJS.Promo.ErrorMsgs.build(CVSJS.Promo.ErrorMsgs.sRemoveItem, CVSJS.Promo.ErrorMsgs.solTryAgain, data.error));
			return false;
		}else{
			return data;
		}
	},
	addItemToShoppingList: function( reqData ){
		var data = CVSJS.Services.getJSON(this.URL.addItemToShoppingList, reqData );

		CVSJS.Promo.Session.timerReset();

		if(data && data.error){
			if(data.error == "02"){
				CVSJS.Promo.Helper.growl(data.error, CVSJS.Promo.ErrorMsgs.build(CVSJS.Promo.ErrorMsgs.sAddItemTooMany, CVSJS.Promo.ErrorMsgs.solNothing, data.error));
			}else{
				CVSJS.Promo.Helper.growl(data.error, CVSJS.Promo.ErrorMsgs.build(CVSJS.Promo.ErrorMsgs.sAddItem, CVSJS.Promo.ErrorMsgs.solTryAgain, data.error));
			}
			return false;
		}else if(data && data.gi){
			return data.gi;
		}
		return "";
	},
	emailShoppingList: function( reqData ){
		var data = CVSJS.Services.getJSON(this.URL.emailShoppingList, reqData );

		CVSJS.Promo.Session.timerReset();

		return data;
	},
	addItemToNotesList: function( reqData ){
		var data = CVSJS.Services.getJSON(this.URL.addItemToNotesList, reqData );

		CVSJS.Promo.Session.timerReset();

		if(data && data.error){
			if(data.error == "02"){
				CVSJS.Promo.Helper.growl(data.error, CVSJS.Promo.ErrorMsgs.build(CVSJS.Promo.ErrorMsgs.sAddItemTooMany, CVSJS.Promo.ErrorMsgs.solNothing, data.error));
			}else{
				CVSJS.Promo.Helper.growl(data.error, CVSJS.Promo.ErrorMsgs.build(CVSJS.Promo.ErrorMsgs.sAddItem, CVSJS.Promo.ErrorMsgs.solTryAgain, data.error));
			}
			return false;
		}else if(data && data.gi){
			return data.gi;
		}
		return false;
	},
	editItemInNotesList: function( reqData ){
		var data = CVSJS.Services.getJSON(this.URL.editItemInNotesList, reqData );

		CVSJS.Promo.Session.timerReset();

		if(data && data.error){
			CVSJS.Promo.Helper.growl(data.error, CVSJS.Promo.ErrorMsgs.build(CVSJS.Promo.ErrorMsgs.sEditItem, CVSJS.Promo.ErrorMsgs.solTryAgain, data.error));
			return false;
		}else{
			return data;
		}
	},
	deleteItemFromNotesList: function( reqData ){
		var data = CVSJS.Services.getJSON(this.URL.deleteItemFromNotesList, reqData );

		CVSJS.Promo.Session.timerReset();

		if(data && data.error){
			CVSJS.Promo.Helper.growl(data.error, CVSJS.Promo.ErrorMsgs.build(CVSJS.Promo.ErrorMsgs.sRemoveItem, CVSJS.Promo.ErrorMsgs.solTryAgain, data.error));
			return false;
		}else{
			return data;
		}
	},
	updateItemQtyInSneakPeekList: function( reqData ){
		var data = CVSJS.Services.getJSON(this.URL.updateItemQtyInSneakPeekList, reqData );

		CVSJS.Promo.Session.timerReset();

		if(data && data.error){
			CVSJS.Promo.Helper.growl(data.error, CVSJS.Promo.ErrorMsgs.build(CVSJS.Promo.ErrorMsgs.sUpdateQty, CVSJS.Promo.ErrorMsgs.solTryAgain, data.error));
			return false;
		}else{
			return data;
		}
	},
	deleteItemFromSneakPeekList: function( reqData ){
		var data = CVSJS.Services.getJSON(this.URL.deleteItemFromSneakPeekList, reqData );

		CVSJS.Promo.Session.timerReset();

		if(data && data.error){
			CVSJS.Promo.Helper.growl(data.error, CVSJS.Promo.ErrorMsgs.build(CVSJS.Promo.ErrorMsgs.sRemoveItem, CVSJS.Promo.ErrorMsgs.solTryAgain, data.error));
			return false;
		}else{
			return data;
		}
	},
	getDisclaimer: function( reqData ){
		var data = CVSJS.Services.getJSON(this.URL.getDisclaimer, reqData, "GET" );
		if(data && data.error){
			CVSJS.Promo.Helper.growl(data.error, CVSJS.Promo.ErrorMsgs.build(CVSJS.Promo.ErrorMsgs.sLoadDisclaimer, CVSJS.Promo.ErrorMsgs.solReloadPage, data.error));
			return "";
		}else if(data && data.ed){
			CVSJS.Promo.Data.eventdisclaimer = data.ed;
		}
	}
};

//--------------------------------------------------------------------------------------------------------------------
//------------------- ROUTER -----------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------

//Each of these routes acts like a page load for that particular route.
CVSJS.Promo.Router = Backbone.Router.extend({
	routes: {
		"Browse(/:categorypage)": "browse",
		"ShoppingList": "shoppinglist",
		"PreviousPurchases": "prevpurchases",
		'ExtraCare': 'extracare',
		'YourDeals': 'yourdeals',
		"Detail/:blocknum": "detail",
		'ExtraCareEC':'extracare',
		'YourDealsEC': 'yourdeals',
		"*path": "defaultpage"
	},
	defaultpage: function(){
		// Personilized User should always go to Your Deals
		// Non-personilized user or guest should alwasy go to Browse
		CVSJS.Promo.appRouter.navigate( "Browse", { trigger: true });

	},
	checkRedirect: function() {
		var quickTipsCookie = CVSJS.Helper.getCookieValue('CVS_WEEKLYAD_RELOAD');
		if(quickTipsCookie == 'true') {
			CVSJS.Promo.Globals.hasBeenRedirected = true;
			CVSJS.Promo.Helper.setCookie('CVS_WEEKLYAD_RELOAD', 'false', 2000);
		} else {
			if( (CVSJS.Header.Flags.userIsSignedIn() && CVSJS.Header.Flags.userHasECCard()) || (CVSJS.Header.Flags.userIsCookied() && CVSJS.Header.Flags.userHasECCard()) || CVSJS.Header.Flags.userIsEcOptedIn() ){
				if(CVSJS.Promo.Globals.hasBeenRedirected == false) {
					this.navigate( "YourDeals", { trigger: true });
					CVSJS.Promo.Globals.hasBeenRedirected = true;
				}
			} else {
				this.navigate( "Browse", { trigger: true });
			}
		}
		return false;
	},
	browse: function(categorypage) {
		this.loadBrowse(categorypage);
		CVSJS.Promo.Session.keepAlive();
	},
	shoppinglist: function() {
		CVSJS.Promo.Defaults.sectionName = 'shoppinglist';
		this.loadGlobal();
		this.loadShoppingList();
		this.showPage("#dPgShoppingList");
		this.showPageSection("#dShoppingListSection");
		CVSJS.Promo.Session.keepAlive();
	},
	detail: function(blocknum) {
		CVSJS.Promo.Defaults.sectionName = 'dealdetails'
		this.loadGlobal();
		this.showPage("#dPgDetail");
		this.showPageSection("#dDetailSection");
		this.loadDetail(blocknum);
		CVSJS.Promo.Session.keepAlive();
	},
	prevpurchases: function() {
		CVSJS.Promo.Defaults.sectionName = 'previouspurchases';
		this.loadGlobal();
		this.loadPrevPurchases();
		this.showPage("#dPgPrevPurchases");
		this.showPageSection("#dPrevPurchasesSection");
		CVSJS.Promo.Session.keepAlive();
	},

	extracare: function() {
		CVSJS.Promo.Defaults.sectionName = 'extracare';
		this.loadGlobal();
		this.loadExtraCare();
		$("#dExtraCareBccSlot").show();
		this.showPage("#dPgBrowse");
		this.showPageSection('.extracare-page');
		CVSJS.Promo.Helper.lazyLoad();

		CVSJS.Promo.Events.trigger('slider:contentloaded');
		CVSJS.Promo.Session.keepAlive();
	},

	yourdeals: function() {
		CVSJS.Promo.Defaults.sectionName = 'yourdeals';
		this.loadGlobal();
		this.loadYourDeals();
		$("#dYourDealsBccSlot").show();
		this.showPage("#dPgBrowse");
		this.showPageSection('.your-deals-page');
		CVSJS.Promo.Helper.lazyLoad();
		CVSJS.Promo.Session.keepAlive();
	},

	showPage: function(pgToShowId){
		var togglePage = function(pgId, navId, headId){
			if(pgToShowId === pgId){
				$(pgId).show();
				$(navId).show();
				$(headId).show();
			} else {
				$(pgId).hide();
				$(navId).hide();
				$(headId).hide();
			}
		}

		togglePage("#dPgShoppingList", "#dNavShoppingList");
		togglePage("#dPgBrowse", "#dNavBrowse", "#dHeadBrowse");
		togglePage("#dPgDetail", "#dNavDetail");
		togglePage("#dPgPrevPurchases", "#dNavPrevPurchases");

		var scrollCallback = function($ebEl) {
			if (CVSJS.Promo.blockNum && $ebEl) {
				var slider = $ebEl.parent().siblings('.slider-container'),
					block = slider.find('.bn-' + CVSJS.Promo.blockNum);

				if (block) {
					var previousBlocks = block.parents('.adblockcont').prevAll('.adblockcont').length,
						left = (previousBlocks) ? previousBlocks * block.parents('.adblockcont').width() : 0;

					slider.find('.item-container').data('scrollLeft', left);
				}
			}

			CVSJS.Promo.Events.trigger('slider:refresh');
		};

		//@FIND-SCROLL
		// If evNavigate is set, scroll down to the correct adblock (set focus)
		if (CVSJS.Promo.ebNavigate && !CVSJS.Promo.Defaults.overrideEb && (CVSJS.Promo.Globals.fromShoppingList || CVSJS.Promo.blockNum)) {
			var $ebEl = $('.extracare-page').find(CVSJS.Promo.ebNavigate), //ExtraBuck
				additionalOffset = 0;

			if (_.isObject(CVSJS.Promo.ebNavigate)) { //anywhere else
				$ebEl = CVSJS.Promo.ebNavigate.$el;
				additionalOffset = CVSJS.Promo.ebNavigate.additionalOffset;
			}

			if ($ebEl && $ebEl.length > 0) {
				//do eb navigate
				_.defer(function(){
					$('html, body').scrollTop($ebEl.offset().top - (CVSJS.Promo.Defaults.windowParams.freezeHeaderHeight - CVSJS.Promo.Defaults.windowParams.freezeHeaderAdjust) + additionalOffset);
					scrollCallback($ebEl);

					_.defer(function(){
						$('html, body').scrollTop($ebEl.offset().top - (CVSJS.Promo.Defaults.windowParams.freezeHeaderHeight - CVSJS.Promo.Defaults.windowParams.freezeHeaderAdjust) + additionalOffset);
						scrollCallback($ebEl);
					});
				});
			} else {
				_.defer(function(){
					$('html, body').scrollTop($("#dExtraBucksContainer").offset().top - (CVSJS.Promo.Defaults.windowParams.freezeHeaderHeight - CVSJS.Promo.Defaults.windowParams.freezeHeaderAdjust) + additionalOffset);
					scrollCallback($ebEl);

					_.defer(function(){
						$('html, body').scrollTop($("#dExtraBucksContainer").offset().top - (CVSJS.Promo.Defaults.windowParams.freezeHeaderHeight - CVSJS.Promo.Defaults.windowParams.freezeHeaderAdjust) + additionalOffset);
						scrollCallback($ebEl);
					});
				});
			}

			CVSJS.Promo.ebNavigate = null;
			CVSJS.Promo.Defaults.browsePageScrollPosition = null;
		} else if ((CVSJS.Promo.Defaults.sectionName == 'browse' || CVSJS.Promo.Defaults.sectionName == 'extracare' || CVSJS.Promo.Defaults.sectionName == 'yourdeals') && CVSJS.Promo.Defaults.browsePageScrollPosition) {
			$('html, body').animate({scrollTop: CVSJS.Promo.Defaults.browsePageScrollPosition}, 350, scrollCallback);
			CVSJS.Promo.Defaults.browsePageScrollPosition = null;
			CVSJS.Promo.Defaults.overrideEb = false;
			CVSJS.Promo.ebNavigate = false;
		} else if (_.isFunction(CVSJS.Promo.Defaults.browsePageScrollPosition)) {
			CVSJS.Promo.Defaults.browsePageScrollPosition();
		} else {
			$('html, body').animate({scrollTop: 0}, 350, scrollCallback);
		}
	},

	//Can pass in 'all' as an option, a selector as a string (e.g., '.myClass'), or an array of string selectors (e.g., ['.myClass', '.myClass2']);
	showPageSection: function(sectionSelectors) {
		var showAll = false;
		if (sectionSelectors === 'all') {
			showAll = true;
		} else if (typeof sectionSelectors === 'string') {
			sectionSelectors = [sectionSelectors];
		}

		var $sections = $('.categorycont.category-block');
		if (showAll) {
			$sections.show();
		} else {
			$sections.hide();
			$(sectionSelectors.join(', ')).show();
		}
	},

	loadGlobal: function(){
		CVSJS.Promo.Session.keepAlive();
		//Clear the details page so we don't have unnecessary HTML/data hanging around.
		$("#dPgDetail").empty();
		CVSJS.Promo.Data.blockdetails = "";
		CVSJS.Promo.myAdBlockDetailsModel = "";
		CVSJS.Promo.detailMainBlock = "";
		CVSJS.Promo.detailSKUBlockList = "";

		$("#dBrowseBccSlot, #dYourDealsBccSlot, #dExtraCareBccSlot, #dBccAdSlots, #dLoading, #dStoreResultsLoading, #dPgDetailNoDeals ").hide(); //Hide Browse BCC Slot
		this.setFreezeHeader(); // Sets up header Freeze functionality

		if(CVSJS.Promo.Defaults.sectionName == "browse") {
			$("#dDesktopFilter,  #dMobileFilter").show();
		} else {
			$("#dDesktopFilter, #dMobileFilter").hide();
		}

		if(CVSJS.Promo.Defaults.sectionName == "dealdetails" || CVSJS.Promo.Defaults.sectionName == "shoppinglist") {
			$("#dMobileTopRow, #dSelectNav").addClass("hidden-important");
			$('#dSelectNav').removeClass('no-top-row');
		} else if (CVSJS.Promo.Defaults.sectionName == "previouspurchases") {
			$('#dMobileTopRow').addClass('hidden-important');
			$('#dSelectNav').addClass('no-top-row').removeClass('hidden-important');
		} else {
			$("#dMobileTopRow, #dSelectNav").removeClass("hidden-important");
			$('#dSelectNav').removeClass('no-top-row');
		}

		$("#dSpecificDisclaimer").empty();
		//The login redirect URL controlled by JSP needs to have the correct success URL for each load of a backbone page
		var loginRedirectURL = window.location.href.toString().split(window.location.host)[1];
		loginRedirectURL = loginRedirectURL.replace(/\#.*/,'');
		loginRedirectURL += "#YourDeals"; // Logged in users land on Your Deals page
		$("#loginSuccInp").val( loginRedirectURL );
		$('body').attr('class', CVSJS.Promo.Defaults.sectionName);
		CVSJS.Promo.Helper.setSignedInStatusClass(CVSJS.Header.Flags.userIsSignedIn());
		$(document).unbind('scroll');
		if ($('body').not('.browse')) {
			CVSJS.Promo.Helper.unfreezeHeader(CVSJS.Promo.Defaults.windowParams);
		}

		var quickTipsCookie = CVSJS.Helper.getCookieValue('CVS_WEEKLYAD_QUICKTIPS_SEEN');
		if(quickTipsCookie == 'false' || quickTipsCookie == null) {
			if ( $('body').data('is-desktop') ) {
				CVSJS.Promo.Helper.showQuickTips();
			}
		}

		$("#weeklyAd a").on("click", function(){
			return false;
		})

	},

	loadAdContent: function(page){
		var page = page || 'browse';

		$("#sCategoryBrowseFilter option").removeAttr("selected");
		$("#sCategoryBrowseFilter>option:eq(0)").attr("selected", true);

		if(CVSJS.Header.Flags.noDealsAvailable()){
			//There are no deals
			$("#dPgBrowseNoDeals").show();
			$("#dBrowseBccSlot").hide();
			$('#dDesktopFilter').hide();
			$('#sMobileFilter').hide();

			$('#dNavShoppingList, #dPgShoppingList, #headerFreeze, #dheaderBccSlot, .bccSlot, #dMobileTopRow, #dSelectNav, #uBrowseSubNav').attr("style", "display: none !important;");

			CVSJS.Promo.Helper.updateShoppingListItemCount(CVSJS.Promo.myShoppingListColl.length + CVSJS.Promo.mySneakPeekListColl.length);
		}else{
			CVSJS.Promo.Services.getCategories(); //each category gets it's ad blocks when the view renders

			CVSJS.Promo.categoryColl = new CVSJS.Promo.cCategories(CVSJS.Promo.Data.categories);

			CVSJS.Promo.pageBrowse = CVSJS.Promo.pageBrowse || new CVSJS.Promo.vBrowse();

			//If logged in or EC Opted In, call Prev Purchase/Push Offers service
			if(!CVSJS.Promo.Globals.isPersonalized && (CVSJS.Header.Flags.userIsSignedIn() || CVSJS.Header.Flags.userIsCookied() || CVSJS.Header.Flags.userIsEcOptedIn()) && CVSJS.Header.Flags.userHasECCard()){

				if(CVSJS.Header.Flags.userIsEcOptedIn()){
					CVSJS.Promo.Services.getPushOffPrevPurchases(function(pushoffers, browseprevpurchasesfull, browseprevpurchasespartial){
						CVSJS.Promo.Globals.isPersonalized = true;

						if(browseprevpurchasespartial.length <=0) {
							CVSJS.Promo.prevPurchaseSection.renderempty();
						} else {
							if(browseprevpurchasesfull && browseprevpurchasesfull.length > 0 && CVSJS.Promo.prevPurchaseSection){
								CVSJS.Promo.Data.browseprevpurchasespartial = browseprevpurchasespartial;
								CVSJS.Promo.Data.browseprevpurchasesfull = browseprevpurchasesfull;
								if(browseprevpurchasesfull.length > 0 && CVSJS.Promo.prevPurchaseSection){
									CVSJS.Promo.prevPurchaseSection.render6mosinitial();
								}else{
									CVSJS.Promo.prevPurchaseSection.renderempty();
								}
							}else{
								CVSJS.Promo.prevPurchaseSection.$el.hide();
							}
						}

						if(pushoffers && pushoffers.length > 0 && CVSJS.Promo.pushOffersSection){
							CVSJS.Promo.Data.pushoffers = pushoffers;
							CVSJS.Promo.pushOffersSection.render();
						}else{
							CVSJS.Promo.pushOffersSection.$el.hide();
						}
					});
				}/*else if(CVSJS.Header.Flags.userIsCookied()){
					CVSJS.Promo.Services.getPushOffPrevPurchases(function(pushoffers, browseprevpurchasesfull, browseprevpurchasespartial){
						CVSJS.Promo.Globals.isPersonalized = true;

						if(browseprevpurchasesfull && browseprevpurchasesfull.length > 0 && CVSJS.Promo.prevPurchaseSection){
							CVSJS.Promo.Data.browseprevpurchasesfull = browseprevpurchasesfull;
							CVSJS.Promo.prevPurchaseSection.rendersignin();
						}else{
							CVSJS.Promo.prevPurchaseSection.$el.hide();
						}

						if(pushoffers && pushoffers.length > 0 && CVSJS.Promo.pushOffersSection){
							CVSJS.Promo.Data.pushoffers = pushoffers;
							CVSJS.Promo.pushOffersSection.render();
						}else{
							CVSJS.Promo.pushOffersSection.$el.hide();
						}
					});
				}*/
				// SMP () CR #ENH03785 code changes - start
				//Display previous purchase information to cookied user also
				else if(CVSJS.Header.Flags.userIsSignedIn() || CVSJS.Header.Flags.userIsCookied()){
				// SMP () CR #ENH03785 code changes - end
					CVSJS.Promo.Services.getPushOffPrevPurchases(function(pushoffers, browseprevpurchasesfull, browseprevpurchasespartial){
						CVSJS.Promo.Globals.isPersonalized = true;

						if(browseprevpurchasespartial.length <=0) {
							CVSJS.Promo.prevPurchaseSection.renderempty();
						} else {
							if(browseprevpurchasesfull && browseprevpurchasesfull.length > 0 && CVSJS.Promo.prevPurchaseSection){
								CVSJS.Promo.Data.browseprevpurchasespartial = browseprevpurchasespartial;
								CVSJS.Promo.Data.browseprevpurchasesfull = browseprevpurchasesfull;
								if(browseprevpurchasesfull.length > 0 && CVSJS.Promo.prevPurchaseSection){
									CVSJS.Promo.prevPurchaseSection.render6mosinitial();
								}else{
									CVSJS.Promo.prevPurchaseSection.renderempty();
								}
							}else{
								CVSJS.Promo.prevPurchaseSection.$el.hide();
							}
						}

						if(pushoffers && pushoffers.length > 0 && CVSJS.Promo.pushOffersSection){
							CVSJS.Promo.Data.pushoffers = pushoffers;
							CVSJS.Promo.pushOffersSection.render();
						}else{
							CVSJS.Promo.pushOffersSection.$el.hide();
						}
					});
				}
			}

			CVSJS.Promo.Globals.setDealDetailsHeight = function() {
				//Check for adjustment of dealdetails links/text
				var $arrEl = $("div.dealdetails:not(.heightset)");
				$arrEl.each(function(idx){
					//there are certain instances when the element is not on the page yet
					var counter = 0,
					$this = $(this);

					while($this.height() > 41 && $this.height() != 0){
						if(counter >=40 ) {
							$this.css("height", "36px").addClass("heightset");
							break;
						}

						var $dealdetailscontainer = $this.find(".dealdetailstext"),
						dealdetailstext = $dealdetailscontainer.text();

						dealdetailstext = dealdetailstext.substring(0,dealdetailstext.length-5) + "...";
						$dealdetailscontainer.html(dealdetailstext);
						counter++;
					}

					//if the height is 0, that means the adblock is no on the page yet, so don't actually attach a heightset to it.
					if ($this.height() != 0 ) {
						$this.css("height", "36px").addClass("heightset");
					}
				});
			}

			CVSJS.Promo.Globals.setDealDetailsHeight();

			//Lazy loading of adblocks and images, with delay equal to default
			$(window).on('scroll', function(e) {
				CVSJS.Promo.Helper.lazyLoad();

				if (CVSJS.Promo.Globals.setDealDetailsHeight) {
					CVSJS.Promo.Globals.setDealDetailsHeight();
				}

			}, CVSJS.Promo.Defaults.imageLoadDelayMilliSec);

			CVSJS.Promo.Helper.updateShoppingListItemCount(CVSJS.Promo.myShoppingListColl.length + CVSJS.Promo.mySneakPeekListColl.length);
		}
	},

	loadBrowse: function(categorypage){
		CVSJS.Promo.Defaults.sectionName = 'browse';
		this.loadGlobal();
		this.loadAdContent();
		$("#dBrowseBccSlot").show();
		this.showPage("#dPgBrowse");
		this.showPageSection('.browse-page');
		CVSJS.Promo.Helper.lazyLoad();

		// Setting the correct option in select list and show the correct category section
		if(categorypage) {
			var selectList = $('body').data('is-desktop') ? document.getElementById("sCategoryBrowseFilter") : document.getElementById("sMobileFilter"),
				textProp = (typeof selectList.options[0].innerText === 'undefined') ? 'textContent' : 'innerText',
				i = 0; //after the loop, i will be the index of the selected category

			for (var l = selectList.options.length; i < l; i++) {
				if ($.trim(categorypage) == $.trim(selectList.options[i][textProp].replace(/ *\([^)]*\) */g, ""))) {
					break;
				}
			}

			var selectedCategoryValue = selectList.options[i].value;
			if (selectedCategoryValue == "all") {
				this.showPageSection('.browse-page');
			} else {
				this.showPageSection("#" + selectedCategoryValue);
			}
		}
	},

	setFreezeHeader: function() {
		//Header Freeze
		if (CVSJS.Promo.Defaults.windowParams.yOffset === 0) {
			CVSJS.Promo.Defaults.windowParams.yOffset = $("#headerFreeze").offset().top;
		}

		if (CVSJS.Promo.Defaults.windowParams.freezeHeaderHeight === 0) {
			//@TODO - Tarif - See if this actually affects mobile? I don't think it does.
			// if ($(window).width() < 640 || window.location.href.indexOf("m.cvs.com") >= 0) {
			// 	CVSJS.Promo.Defaults.windowParams.freezeHeaderHeight = $("#category-nav-wrapper").height();
			// }else{
				// console.warn('setting the height!', $("#headerFreeze").height());
				CVSJS.Promo.Defaults.windowParams.freezeHeaderHeight = $("#headerFreeze").height();
			// }
		} else {
			CVSJS.Promo.Defaults.windowParams.freezeHeaderAdjust = -15; //@TODO - What does this -15 represent?
		}

		$(window).on('scroll', function() {
			if ($(window).scrollTop() > CVSJS.Promo.Defaults.windowParams.yOffset) {
				CVSJS.Promo.Helper.freezeHeader(CVSJS.Promo.Defaults.windowParams);
			} else {
				CVSJS.Promo.Helper.unfreezeHeader(CVSJS.Promo.Defaults.windowParams);
			}
		});
		// Tablet
		// $(window).on('touchmove', function() {
		// 	if ($(window).scrollTop() > CVSJS.Promo.Defaults.windowParams.yOffset) {
		// 		CVSJS.Promo.Helper.freezeHeader(CVSJS.Promo.Defaults.windowParams);
		// 	} else {
		// 		CVSJS.Promo.Helper.unfreezeHeader(CVSJS.Promo.Defaults.windowParams);
		// 	}
		// });

	},
	loadExtraCare: function() {
		this.loadAdContent();
	},
	loadYourDeals: function() {
		this.loadAdContent();
	},
	loadShoppingList: function(){
		if(CVSJS.Header.Flags.noDealsAvailable()){
			$("#dPgBrowseNoDeals").show();

			$('#dNavShoppingList, #dPgShoppingList, #headerFreeze, #dheaderBccSlot, .bccSlot, #dMobileTopRow, #dSelectNav, #uBrowseSubNav').attr("style", "display: none !important;");
		} else {
			$("#dBccAdSlots").show(); //show bcc ad slots
			//Populate the Shopping List Data object
			//We'll do it on app load, but won't do it again if the user is going directly to Shopping List
			if(!CVSJS.Promo.appLoadedShoppingListData){
				CVSJS.Promo.Services.getShoppingList({ userrequested : 1 });
			}

			CVSJS.Promo.appLoadedShoppingListData = false;

			//Initialize collections
			CVSJS.Promo.myShoppingListColl.reset(CVSJS.Promo.Data.shoppinglist);
			CVSJS.Promo.mySneakPeekListColl.reset(CVSJS.Promo.Data.sneakpeek);
			if(CVSJS.Promo.myNotesListColl){
				CVSJS.Promo.myNotesListColl.reset(CVSJS.Promo.Data.notes);
			}else{
				CVSJS.Promo.myNotesListColl = new CVSJS.Promo.cNotesListItems(CVSJS.Promo.Data.notes);
			}
			if(CVSJS.Promo.myShopListExtraCareListColl){
				CVSJS.Promo.myShopListExtraCareListColl.reset(CVSJS.Promo.Data.shoplistextracare);
			}else{
				CVSJS.Promo.myShopListExtraCareListColl = new CVSJS.Promo.cExtraCareListItems(CVSJS.Promo.Data.shoplistextracare);
			}

			CVSJS.Promo.navShoppingList = CVSJS.Promo.navShoppingList || new CVSJS.Promo.vPageSpecificNavigationHeader({template:"#tmplNavShoppingList", el:$("#dNavShoppingList")});
			if(CVSJS.Promo.pageShoppingList){
				CVSJS.Promo.pageShoppingList.render();
			}else{
				CVSJS.Promo.pageShoppingList = new CVSJS.Promo.vShoppingList();
			}

			if(CVSJS.Header.Flags.showPrevPurchases()){
				$("#dNavShoppingList").find("#btnAddPrevPurch").show();
			}else{
				$("#dNavShoppingList").find("#btnAddPrevPurch").hide();
			}

			CVSJS.Promo.Helper.updateShoppingListItemCount(CVSJS.Promo.myShoppingListColl.length + CVSJS.Promo.mySneakPeekListColl.length);
		}
	},
	loadPrevPurchases: function(){

		CVSJS.Promo.Data.prevpurchases = CVSJS.Promo.Services.getPrevPurchases({dy: CVSJS.Promo.Defaults.prevPurchases.numDaysHistory}, function(result) { return result; });

		// Initialize collections
		if (CVSJS.Promo.Data.prevpurchases && CVSJS.Promo.Data.prevpurchases.items && CVSJS.Promo.Data.prevpurchases.items.length > 0) {
			CVSJS.Promo.myPrevPurchasesOriginalColl = CVSJS.Promo.myPrevPurchasesOriginalColl || new CVSJS.Promo.cPrevPurchasesItems(CVSJS.Promo.Data.prevpurchases.items);
			CVSJS.Promo.myPrevPurchasesFilteredColl = CVSJS.Promo.myPrevPurchasesFilteredColl || new CVSJS.Promo.cPrevPurchasesItems(CVSJS.Promo.Data.prevpurchases.items);
			CVSJS.Promo.myPrevPurchasesDateFilterOptions = CVSJS.Promo.myPrevPurchasesDateFilterOptions || CVSJS.Promo.Data.prevpurchases.fbd;
		}
		else {
			CVSJS.Promo.myPrevPurchasesOriginalColl = CVSJS.Promo.myPrevPurchasesFilteredColl = CVSJS.Promo.myPrevPurchasesDateFilterOptions = null;
		}

		// render page elements
		CVSJS.Promo.navPrevPurchases = CVSJS.Promo.navPrevPurchases || new CVSJS.Promo.vPageSpecificNavigationHeader({template:"#tmplNavPrevPurchases", el:$("#dNavPrevPurchases")});
		CVSJS.Promo.pagePrevPurchases = CVSJS.Promo.pagePrevPurchases || new CVSJS.Promo.vPrevPurchases();

		CVSJS.Promo.Helper.updateShoppingListItemCount(CVSJS.Promo.myShoppingListColl.length + CVSJS.Promo.mySneakPeekListColl.length);
	},
	loadDetail: function(blocknum){
		this.loadAdContent();
		if(CVSJS.Header.Flags.noDealsAvailable()){
			//There are no deals
			$("#dPgDetailNoDeals").show();
			$("#dPgBrowseNoDeals").hide();
			$('#dNavShoppingList, #dPgShoppingList, #headerFreeze, #dheaderBccSlot, .bccSlot, #dMobileTopRow, #dSelectNav, #uBrowseSubNav').attr("style", "display: none !important;");
		}else{

			//Show the loading animation overlay
			$("#dLoading").show(); //@TODO - Add to Extracare page

			CVSJS.Promo.Services.getCategories();

			if(CVSJS.Promo.Data.categories.length > 0){
				CVSJS.Promo.categoryColl = new CVSJS.Promo.cCategories(CVSJS.Promo.Data.categories);
			}

			CVSJS.Promo.navDetail = CVSJS.Promo.navDetail || new CVSJS.Promo.vPageSpecificNavigationHeader({template:"#tmplNavDetail", el:$("#dNavDetail")});

			//load the data for the page into CVSJS.Promo.Data.blockdetails
			CVSJS.Promo.Services.getAdBlockDetails( { adblocknumber : blocknum }, function( blockdetails ){
				CVSJS.Promo.Data.blockdetails = blockdetails;
				if(blockdetails){
					var disclaimerHTML = "";
					if(blockdetails.el){
						disclaimerHTML += "<div>" + blockdetails.el + "</div>";
					}
					if(blockdetails.dd){
						disclaimerHTML += "<div>" + blockdetails.dd + "</div>";
					}
					if(blockdetails.sd){
						disclaimerHTML += "<div>" + blockdetails.sd + "</div>";
					}
					if(blockdetails.dc){
						disclaimerHTML += "<div>" + blockdetails.dc + "</div>";
					}
					$("#dSpecificDisclaimer").html(disclaimerHTML);


					CVSJS.Promo.pageDetail = new CVSJS.Promo.vDetail({ model: new CVSJS.Promo.mAdBlockDetails(blockdetails) });

					//Hide the loading animation overlay
					$("#dLoading").hide();

					//Lazy loading of images, with 0 delay
					CVSJS.Promo.Helper.lazyLoadImages($("#dPgDetail"));

					//Lazy loading of images, with delay equal to default
					$(window).on('scroll', function(e) {
						CVSJS.Promo.Helper.lazyLoadImages($("#dPgDetail"));
					}, CVSJS.Promo.Defaults.loadDelayMilliSec);
				}else{
					//Hide the loading animation overlay
					$("#dLoading").hide();
					$("#dPgDetailNoDeals").show();

				}
			});

			//If this is the sneak peek page, change the button text
			if(CVSJS.Helper.URLContains("issneakpeek=true")){
				$("#btnSneakPeekDeals .center").html("<span class='red-arrow-left'>Back to This Week's Ad</span>");
				$("#btnSneakPeekDeals").attr("title", "Back to This Week's Ad");
			}else{
				$("#btnSneakPeekDeals .center").html("Sneak Peek Deals");
				$("#btnSneakPeekDeals").attr("title", "Sneak Peek Deals");
			}
		}

		CVSJS.Promo.Helper.updateShoppingListItemCount(CVSJS.Promo.myShoppingListColl.length + CVSJS.Promo.mySneakPeekListColl.length);
	}
});

//--------------------------------------------------------------------------------------------------------------------
//------------------- MODELS -----------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------

//Model for a single item in shopping list
CVSJS.Promo.mShoppingListItem = Backbone.Model.extend({});

//Model for a single item in notes list
CVSJS.Promo.mNotesItem = Backbone.Model.extend({});

//Model for a single item in extra care list
CVSJS.Promo.mExtraCareItem = Backbone.Model.extend({});

//Model for a single item in sneak peek list
CVSJS.Promo.mSneakPeekItem = Backbone.Model.extend({});

//Model for a single store
CVSJS.Promo.mStore = Backbone.Model.extend({});

//Model for a single item in previous purchases list
CVSJS.Promo.mPrevPurchasesItem = Backbone.Model.extend({});

//Model for a single category
CVSJS.Promo.mCategory = Backbone.Model.extend({});

//Model for a single ad block
CVSJS.Promo.mAdBlock = Backbone.Model.extend({
	initialize: function() {
		var shortDescription = "";
		if(this.attributes.bl){
			shortDescription += this.attributes.bl;
		}
		if(this.attributes.bd){
			shortDescription += " " + this.attributes.bd;
		}
		if(this.attributes.el){
			shortDescription += " " + this.attributes.el;
		}
		if(this.attributes.ex){
			shortDescription += " " + this.attributes.ex;
		}
		if(shortDescription.length > 44){
			shortDescription = shortDescription.substring(0,44) + "...";
		}
		this.attributes.bdshort = shortDescription;
	}
});

//Model for a single ad block badge
CVSJS.Promo.mAdBlockBadge = Backbone.Model.extend({});

//Model for a single ad block banner
CVSJS.Promo.mAdBlockBanner = Backbone.Model.extend({});

//Model for a single ad with details
CVSJS.Promo.mAdBlockDetails = Backbone.Model.extend({});

//Model for long description of deal
CVSJS.Promo.mAdBlockDesc = Backbone.Model.extend({});

//Model for a single sku in ad block details
CVSJS.Promo.mSKU = Backbone.Model.extend({});

//--------------------------------------------------------------------------------------------------------------------
//------------------- COLLECTIONS ------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------

//Collection of categories
CVSJS.Promo.cCategories = Backbone.Collection.extend({
	model: CVSJS.Promo.mCategory
});

//Collection of ad blocks
CVSJS.Promo.cAdBlocks = Backbone.Collection.extend({
	model: CVSJS.Promo.mAdBlock
});

//Collection of skus from Ad Block Details
CVSJS.Promo.cSKUListItems = Backbone.Collection.extend({
	model: CVSJS.Promo.mSKU,
	comparator: function(model) {
		return model.get('sd');
	}
});

//Collection of shopping list items
CVSJS.Promo.cShoppingListItems = Backbone.Collection.extend({
	model: CVSJS.Promo.mShoppingListItem,
	comparator: function(model) {
		return model.get('al');
	},
	sortdirection: "asc"
});

//Collection of notes list items
CVSJS.Promo.cNotesListItems = Backbone.Collection.extend({
	model: CVSJS.Promo.mNotesItem
});

//Collection of extra care list items
CVSJS.Promo.cExtraCareListItems = Backbone.Collection.extend({
	model: CVSJS.Promo.mExtraCareItem
});

//Collection of sneak peek list items
CVSJS.Promo.cSneakPeekListItems = Backbone.Collection.extend({
	model: CVSJS.Promo.mSneakPeekItem,
	comparator: function(model) {
		return model.get('al');
	},
	sortdirection: "asc"
});

//Collection of stores
CVSJS.Promo.cStores = Backbone.Collection.extend({
	model: CVSJS.Promo.mStore
});

//Collection of previous purchase items
CVSJS.Promo.cPrevPurchasesItems = Backbone.Collection.extend({
	model: CVSJS.Promo.mPrevPurchasesItem,
	comparator: function(model) {
		return model.get('ds');
	}
});
CVSJS.Promo.cPrevPurchasesItemsSorted = Backbone.Collection.extend({
	model: CVSJS.Promo.mPrevPurchasesItem,
});


//--------------------------------------------------------------------------------------------------------------------
//------------------- EVENTS -----------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------

CVSJS.Promo.Events = _.extend( {}, Backbone.Events );

//When the shopping list changes (items added or deleted), this goes and gets the count from the shopping list collection
//and applies the appropriate wording
CVSJS.Promo.Events.on("shoppinglistchanged", function() {
	CVSJS.Promo.Helper.updateShoppingListItemCount(CVSJS.Promo.myShoppingListColl.length + CVSJS.Promo.mySneakPeekListColl.length);
});


//--------------------------------------------------------------------------------------------------------------------
//------------------- VIEWS ------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------

//------------------- GLOBAL - STORE LOCATOR -------------------------------

//View for the MyStore area of the page
CVSJS.Promo.vMyStore = Backbone.View.extend({
	initialize: function () {
		this.template = CVSJS.Promo.TemplateCache.get("#tmplMyStore");
		this.render();
	},
	render: function() {
		var sAddr = this.model.get("ad");
		if(sAddr && sAddr.length > 30){
			sAddr = sAddr.substring(0,29) + "...";
		}
		this.model.set({shortaddress: sAddr});
		var renderedTemplate = this.template({ store: this.model.toJSON() });
		this.$el.html( renderedTemplate );

		$('.dSLStoreSelectorTitle').html('SHOPPING LIST FOR myCVS<span class="registered">&reg;</span> STORE:');
		this.$el.find('span.mycvs-wrapper').show();

		return this;
	}
});

//Desktop overlay with search functionality
CVSJS.Promo.vStoreSearchOverlay = Backbone.View.extend({
	el: CVSJS.OverlayCont,
	initialize: function ( evElem ) {
		this.template = CVSJS.Promo.TemplateCache.get("#tmplStoreSearchOverlay");
		CVSJS.Promo.Services.getFavoriteStores();

		CVSJS.Promo.myFavStoresColl = new CVSJS.Promo.cStores(CVSJS.Promo.Data.favstores);
		CVSJS.Promo.myStoreModel = new CVSJS.Promo.mStore(CVSJS.Promo.Data.mystore);

		this.render( evElem );
	},
	render: function( evElem ) {
		var thisView = this;
		showOverlay($(evElem), function(){}, function(){
			thisView.undelegateEvents();
		});
		var renderedTemplate = this.template({ store: CVSJS.Promo.myStoreModel.toJSON() });
		this.$el.html( renderedTemplate );
		CVSJS.Promo.storeList = new CVSJS.Promo.vStoreList({ collection: CVSJS.Promo.myFavStoresColl });
		this.$(".storedt").hide(); //hiding the distance on favorite stores
		this.$("#dSearchResultsHdr").hide();
		return this;
	},
	renderError: function(){
		this.clearError();
		this.$("#dSearchResultsHdr").hide();
		this.$("#dStoreList").hide();
		this.$("#dStoreResultsLoading").hide();
		var renderedTemplate = CVSJS.Promo.TemplateCache.get("#tmplErrStoreModal");
		this.$el.prepend( renderedTemplate );
		return this;
	},
	renderNoResults: function(){
		this.clearError();
		this.$("#dSearchResultsHdr").hide();
		this.$("#dFavStoresHdr").hide();
		this.$("#dStoreResultsLoading").hide();
		this.$(".storeselectorerror").show().html("<div class='storeselectorerror'>Sorry, there are currently no stores that match the location and/or services you selected.</div>");
		return this;
	},
	clearError: function(){
	   this.$(".storeselectorerror").empty().hide();
	   this.$("#formerrorswrapper").remove();
	},
	toggleFindStoreBtn: function(){
		var actionBtn=$("#btnFindStores");
		if(actionBtn.is(":disabled")){
			actionBtn.removeAttr("disabled");
		}else{
			actionBtn.attr("disabled","disabled");
		}
	},
	showSpinner: function(){
		this.$("#suggestBoxHolderCont").hide();
		this.$("#dStoreResultsLoading").show();
		this.$("#dSearchResultsHdr").hide();
		this.$("#dFavStoresHdr").hide();
		this.$("#dStoreList").hide();
	},
	showSearchResults: function(){
		this.$("#suggestBoxHolderCont").hide();
		this.$("#dStoreResultsLoading").hide();
		this.$("#dSearchResultsHdr").show();
		this.$("#dFavStoresHdr").hide();
		this.$("#dStoreList").show();
	},
	events: {
		"click #btnFindStores" 	: "findstores",
		"keyup #iSearch" 		: "checkforenter",
		"click .searchtermlink" : "selectsearchterm",
		"click .closesuggest" 	: "hidesuggestsearch",
		"click #aStartOver"		: "startover"
	},
	findstores: function( ev, lat, long ){
		this.showSpinner();

		this.clearError();
		this.hidesuggestsearch();
		var $targetEl;
		if(ev.target){
			$targetEl = $(ev.target);
		}else if(window.event.srcElement){
			$targetEl = $(window.event.srcElement);
		}else{
			$targetEl = $(ev.target);
		}

		if($targetEl && $.trim(this.$("#iSearch").val()) === ""){
			if(($targetEl.attr("id") === "btnFindStores" || $targetEl.attr("id") === "iSearch") || $targetEl.hasClass("findlink")){ //hasClass test is for Chrome
				this.renderError();
			}
		}else{
			this.toggleFindStoreBtn(); // Disabling the Find Store button
			if( lat && long ){
				//We have lat/long from a clicked link in the suggest box
				CVSJS.Promo.Services.getStores({ latitude: lat, longitude: long });

				if(CVSJS.Promo.Data.stores.length > 0){
					this.$('#dSearchResultsHdrTxt').html('<span>Search Results For:</span><br/>');
					CVSJS.Promo.storeListColl = new CVSJS.Promo.cStores(CVSJS.Promo.Data.stores);
					CVSJS.Promo.storeList = new CVSJS.Promo.vStoreList({ collection: CVSJS.Promo.storeListColl });
					CVSJS.Promo.storeList.render();
					this.showSearchResults();
				}else{
		 			this.renderNoResults();
		 		}
			}else{
				var currentView = this;
				//We only have a search term, send it to bing to get results
				CVSJS.Promo.Services.getBingResults(currentView.$("#iSearch").val(), function(bingResults, searchTerm, totalPlaces){
					if (totalPlaces > 1)
					{
						var matchedaddress = false;
						var appendHTML = "";

						//This tests to see if Bing came back with a place name or an address, if so we use it
				 		for(var i=0;i < bingResults.length;i++)	{
				 			if((i+1) < bingResults.length && bingResults[i].name==bingResults[i+1].name){
				 				matchedaddress = true;
				 				break;
							}
				 		}

				 		for(var i=0;i<bingResults.length;i++)	{
				 			if(matchedaddress){
			 					if(bingResults[i].address.countryRegion === "United States" || bingResults[i].address.countryRegion === "Puerto Rico"){
				 					var address="";
				 					if(bingResults[i].address.formattedAddress != null){
				 						address = address + bingResults[i].address.formattedAddress;
				 					}
				 					if(bingResults[i].address.adminDistrict2 != null && address != ''){
										address = address + ', ' + bingResults[i].address.adminDistrict2;
									}else if(bingResults[i].address.adminDistrict != null){
				 						address = address+', ' + bingResults[i].address.adminDistrict;
				 					}
									appendHTML += "<li class=\"searchtermlink\"><a href='#' data-latitude='" + bingResults[i].point.coordinates[0] + "' data-longitude='" + bingResults[i].point.coordinates[1] + "' title='" + address + "'>" + address + "</a></li>";
								}
			 				} else {
			 					if(bingResults[i].address.countryRegion === "United States" || bingResults[i].address.countryRegion === "Puerto Rico"){
				 					appendHTML += "<li class=\"searchtermlink\"><a href='#' data-latitude='" + bingResults[i].point.coordinates[0] + "' data-longitude='" + bingResults[i].point.coordinates[1] + "' title='" + bingResults[i].name + "'>" + bingResults[i].name + "</a></li>";
				 				}
			 				}
			 			}

				 		if(appendHTML != ""){
				 			currentView.$("#suggestions ul").html(appendHTML);
				 			currentView.$("#suggestBoxHolderCont").show();
				 			currentView.$("#dStoreResultsLoading").hide();
				 		}else{
				 			currentView.renderNoResults();
				 		}
					}else if (totalPlaces === 1){
						var validResult = false;
						if(bingResults[0].address){
							if(bingResults[0].address.postalCode){
								if(bingResults[0].address.postalCode != $("#iSearch").val()){
									$("#iSearch").val(bingResults[0].address.formattedAddress);
								}
								validResult = true;
							}else if(bingResults[0].name != "United States" && bingResults[0].name != "Puerto Rico"){
								$("#iSearch").val(bingResults[0].address.formattedAddress);
								validResult = true;
							}
						}
						if( validResult ){
							CVSJS.Promo.Services.getStores({ latitude: bingResults[0].point.coordinates[0], longitude: bingResults[0].point.coordinates[1] });

							if(CVSJS.Promo.Data.stores.length > 0){
								currentView.$('#dSearchResultsHdrTxt').html('<span>Search Results For:</span><br/>');
								CVSJS.Promo.storeListColl = new CVSJS.Promo.cStores(CVSJS.Promo.Data.stores);
								CVSJS.Promo.storeList = new CVSJS.Promo.vStoreList({ collection: CVSJS.Promo.storeListColl });
								CVSJS.Promo.storeList.render();
								currentView.showSearchResults();
					 		}else{
					 			currentView.renderNoResults();
					 		}
						}else{
							currentView.renderNoResults();
						}
					}else{
						currentView.renderNoResults();
					}
				});
			}

			this.toggleFindStoreBtn(); // Enabling the Find Store button

		}
		return false;
	},
	hidesuggestsearch: function(){
		this.$("#suggestBoxHolderCont").hide();
		return false;
	},
	selectsearchterm: function(ev){
		this.clearError();
		this.showSpinner();
		var $targetEl;
		if(ev.target){
			$targetEl = $(ev.target);
		}else if(window.event.srcElement){
			$targetEl = $(window.event.srcElement);
		}else{
			$targetEl = $(ev.target);
		}
		this.$('#dSearchResultsHdrTxt').html('<span>Search Results For:</span><br/>');
		if ($targetEl.data("storeid")) {
			var storeId = $targetEl.data("storeid");
			var storeDetails = CVSJS.Promo.Services.getStoreDetails(storeId);
			if (storeDetails) {
				CVSJS.Promo.Services.hideSuggestStoreId();
				CVSJS.Promo.Data.stores = [];
				CVSJS.Promo.Data.stores.push(storeDetails.sm);
				CVSJS.Promo.storeListColl = new CVSJS.Promo.cStores(CVSJS.Promo.Data.stores);
				CVSJS.Promo.storeList = new CVSJS.Promo.vStoreList({ collection: CVSJS.Promo.storeListColl });
				CVSJS.Promo.storeList.render();
				this.$('#dChooseFavMsg').html('Details for CVS Store #' + storeId);
				if (this.$('#dSearchResultsHdr').css('display') === 'block'){
					this.$('#dSearchResultsHdrTxt').html('Details for CVS Store #' + storeId);
				}else{
					this.$('#dSearchResultsHdrTxt').html('<span>Search Results For:</span><br/>');
				}
				this.$('.storedistance').hide();
				this.showSearchResults();
			}
		} else {
			this.$("#iSearch").val($targetEl.html());
			this.findstores( ev, $targetEl.data("latitude"), $targetEl.data("longitude") );
		}
		this.hidesuggestsearch();
		return false;
	},
	checkforenter: function(ev){
		if(ev.keyCode === 13){
			this.findstores(ev);
		}
	},
	startover: function(ev){
		var renderedTemplate = this.template({ store: CVSJS.Promo.myStoreModel.toJSON() });
		this.$el.html( renderedTemplate );
		CVSJS.Promo.storeList = new CVSJS.Promo.vStoreList({ collection: CVSJS.Promo.myFavStoresColl });
		this.$(".storedt").hide(); //hiding the distance on favorite stores
		this.$("#dSearchResultsHdr").hide();
		this.$("#dFavStoresHdr").show();

		return false;
	}
});

// View for store information
CVSJS.Promo.vStoreInformationOverlay = Backbone.View.extend({
	el: CVSJS.OverlayCont,
	initialize: function ( evElem ) {
		this.template = CVSJS.Promo.TemplateCache.get("#tmplStoreInformationOverlay");
		var storeDetails = this.storeDetails(CVSJS.Promo.Data.mystore.id);
		CVSJS.Promo.myStoreModel = new CVSJS.Promo.mStore(storeDetails);
		this.render( evElem );
		$("#uiTabsWrapStoreInfo").tabs();
	},
	render: function( evElem ) {
		var thisView = this;
		showOverlay($(evElem), function(){}, function(){
			thisView.undelegateEvents();
		});
		var myStoreModelJSON = CVSJS.Promo.myStoreModel.toJSON();

		var storeServices = this.storeServicesList(myStoreModelJSON);
		var storeServicesIcons = this.storeServicesIcons(myStoreModelJSON);

		var storePhotoHours = this.getStorePhotoHours(myStoreModelJSON);
		var pharmacyHours = this.getPharmacyHours(myStoreModelJSON);
		var minuteClinicHours = this.getMinuteClinicHours(myStoreModelJSON);

		var renderedTemplate = this.template({ store: CVSJS.Promo.myStoreModel.toJSON(), servicesicons: storeServicesIcons, services: storeServices, storephotohours: storePhotoHours, pharmacyhours: pharmacyHours, minuteclinichours: minuteClinicHours});
		this.$el.html( renderedTemplate );
		return this;
	},
	storeDetails: function(storeId) {
		var storeInfo = CVSJS.Promo.Services.getStoreInfoById(storeId);
		return storeInfo;
	},
	storeServicesList: function(storeModel) {
		var serviceList = "";
		_.each(storeModel.sm.ss, function(service, index){
			if(service == 1){
				switch(index) {
					case 0:
						serviceList += "<span class='blue bold'>24-Hour Pharmacy, </span>";
						break;
					case 1:
						serviceList += "<span class='blue bold'>Drive-Thru Pharmacy, </span>";
						break;
					case 2:
						serviceList += "<span class='blue bold'>MinuteClinic, </span>";
						break;
					case 3:
						serviceList += "Photo, ";
						break;
					case 4:
						serviceList += "Accepts SNAP, ";
						break;
					case 5:
						serviceList += "Accepts WIC, ";
						break;
					case 6:
						serviceList += "Pharmacy, ";
						break;
					case 7:
						serviceList += "Immunizations, ";
						break;
					case 8:
						serviceList += "24-Hour Store";
						break;
				}
			}

		});
		serviceList = serviceList.replace(/,\s*$/, "");
		return serviceList;
	},
	storeServicesIcons: function(storeModel) {
		var serviceIcons = "<ul id='uServiceIcons'>";
		var serviceShow = false;
		_.each(storeModel.sm.ss, function(service, index){
			if(service == 1){
				switch(index) {
					case 0:
						// 24 hours
						serviceIcons += "<li><img alt='24 hour Pharmacy' src='/webcontent/images/weeklyad/common/24-hr-small-icon.png'></li>";
						serviceShow = true;
						break;
					case 1:
						// Drive thru
						serviceIcons += "<li><img alt='Drive thru pharmacy' src='/webcontent/images/weeklyad/common/drive-thru-icon-small.png'></li>";
						serviceShow = true;
						break;
					case 2:
						// MC
						serviceIcons += "<li><img alt='MinuteClinic' src='/webcontent/images/weeklyad/common/minute-clinic-small-icon.png'></li>";
						serviceShow = true;
						break;
				}
			}

		});

		serviceIcons = serviceIcons.replace(/,\s*$/, "");
		serviceIcons += "</ul>";
		if(serviceShow) {
			return serviceIcons;
		}
	},
	getStorePhotoHours: function(storeModel){
		if(storeModel.sm.sph.length == 0) {
			return null;
		}else {
			var hours = "";
			_.each(storeModel.sm.sph, function(hour){
				hours += hour +"<br>";
			});
			return hours;
		}
	},
	getPharmacyHours: function(storeModel){
		if(storeModel.sm.pph.length == 0) {
			return null;
		}else {
			var hours = "";
			_.each(storeModel.sm.pph, function(hour){
				hours += hour +"<br>";
			});
			return hours;
		}
	},
	getMinuteClinicHours: function(storeModel){
		if(storeModel.sm.mnh.length == 0) {
			return null;
		}else {
			var hours = "";
			_.each(storeModel.sm.mnh, function(hour){
				hours += hour +"<br>";
			});
			return hours;
		}
	}
});


//View for the list of stores
CVSJS.Promo.vStoreList = Backbone.View.extend({
	el: "#dStoreList",
	initialize: function () {
		this.render();
	},
	render: function() {
		var els = [];
		this.collection.each( function( store ) {
			var storeEntry = new CVSJS.Promo.vStoreEntry({ model: store });
			els.push( storeEntry.el );
		});

		this.$el.html( els );
		return this;
	}
});

//View for a single store in the list of stores
CVSJS.Promo.vStoreEntry = Backbone.View.extend({
	attributes: { "class": "storedetails" },
	initialize: function (storeData) {
		this.template = CVSJS.Promo.TemplateCache.get("#tmplStore");
		this.render();
	},
	render: function() {
		var renderedTemplate = this.template({ store: this.model.toJSON() });
		this.$el.html( renderedTemplate );
		if(this.model.id === CVSJS.Promo.Data.mystore.id){
			this.$el.prepend("<div class='currentstoremsg'><span class='mycvs'>myCVS</span></div>");
			this.$(".storedt").hide();
		}
		return this;
	},
	events: {
		"click .shopstorelink" : "selectstore"
	},
	selectstore: function(ev){
		ev.preventDefault();
		if(CVSJS.Promo.Services.setFavoriteStore({ storeId: this.model.id })){
			CVSJS.Promo.myStoreModel = this.model;
			CVSJS.Promo.Helper.setCookie('CVS_WEEKLYAD_RELOAD', 'true', 2000);
			location.reload();
		}
	}
});


//View for the header across "pages"
CVSJS.Promo.vWeeklyAdHeader = Backbone.View.extend({
	initialize: function () {
		CVSJS.Promo.Services.getCategories();
		CVSJS.Promo.categoryColl = new CVSJS.Promo.cCategories(CVSJS.Promo.Data.categories);

		CVSJS.Promo.appRouter.on('route', _.bind(this.handleSelectLists, this));

		this.render();
		this.renderFilters();
	},

	render: function() {
		//Show user's selected store
	    CVSJS.Promo.myStoreView = new CVSJS.Promo.vMyStore({ model: CVSJS.Promo.myStoreModel, el: this.$el.find(".dStoreSelectorAddr") });

	    $('#dSubHeaderOuter').attr("name", "event-"+CVSJS.Header.Details.ei);
	    if(CVSJS.Header.Details.es && CVSJS.Header.Details.es[0] && CVSJS.Header.Details.es[1]) {
			this.$("#sCurrentAdText").html( CVSJS.Header.Details.es[0] + " &ndash; " + CVSJS.Header.Details.es[1] );
			this.$("#sMobileDates").html( CVSJS.Header.Details.es[0] + " &ndash; " + CVSJS.Header.Details.es[1] );
		}

		if(CVSJS.Header.Flags.showSneakPeek()){ //if show sneak peak, set to show for desktop
			$("#iCurrentAd").show();
			$("#lSneekPeek").css("display", "inline");

			if(CVSJS.Header.Details.ep && CVSJS.Header.Details.ep[0] && CVSJS.Header.Details.ep[1]){
				this.$("#sSneakPeekText").html( CVSJS.Header.Details.ep[0] + " &ndash; " + CVSJS.Header.Details.ep[1] );
			}
		}

		var fbTmpl = CVSJS.Promo.TemplateCache.get("#tmplFacebookShare");

		if(CVSJS.Helper.URLContains("issneakpeek=true")){
			this.$("#lFacebookShare").html(fbTmpl({ sneakpeekparm: "%3Fissneakpeek%3Dtrue" }));
		}else{
			this.$("#lFacebookShare").html(fbTmpl({ sneakpeekparm: "" }));
		}

		if(CVSJS.Helper.URLContains("issneakpeek=true")){
			//SneakPeek Active
			this.$("#lSneekPeek").addClass('active');
			this.$("#iSneakPeek").attr("checked", "checked");
		}else{
			//Current Deals
			this.$("#lCurrentAd").addClass("active");
			this.$("#iCurrentAd").attr("checked", "checked");
		}

		if (!CVSJS.Header.Flags.showSneakPeek()) { //hide everything
			$('#aCurrentAdMobile, #aSneakPeekMobile').hide();
		} else if (CVSJS.Helper.URLContains("issneakpeek=true")) { //show current ad
			this.$('#aSneakPeekMobile').hide();
			this.$('#aCurrentAdMobile').show();

			this.$("#sMobileDates").html(CVSJS.Header.Details.ep[0] + " - " + CVSJS.Header.Details.ep[1]);
		} else { //show sneak peak
			this.$('#aSneakPeekMobile').show();
			this.$('#aCurrentAdMobile').hide();
		}

		return this;
	},

	renderFilters: function() {
		var els = [];
		var catFilterOption, catNt;
		var totalCount = 0;

		//can be added as a collection, but not necessarily.
		CVSJS.Promo.categoryColl.each( function( category ) {
			var blkCount = 0, arrContainers = [];
			if(category.get("cc")){
				arrContainers = category.get("cc").split('|');
				blkCount = arrContainers[0];
			}

			// Category Cannot equal to push offers(2), prepurchases(3) or extrabucks(4)
			switch(category.get("nt")){
				case "2":
				case "3":
				case "4":
					break;
				default:
					if (blkCount) {
						totalCount = totalCount + parseInt(blkCount);
						catFilterOption = new CVSJS.Promo.vBrowseFilter({ model: category, count: blkCount });
						els.push( catFilterOption.el );
					}
			}
		});
		catFilterOption = new CVSJS.Promo.vBrowseFilter({ model:null , count: null, totalCount: totalCount});
		els.unshift(catFilterOption.el);

		var innerText,
			textProp = (typeof els[0].innerText === 'undefined') ? 'textContent' : 'innerText', //feature detection. firefox does not support innerText, instead it uses textContent
			mobileEls = [];
		for (var i = 0, l = els.length; i < l; i++) {
			mobileEls[i] = els[i].cloneNode(true);
			innerText = mobileEls[i][textProp];

			//@TODO - Uncomment if All Categories comes back
			// After cloning the desktop nodes, replace the all categories text to show all text for mobile
			// if (innerText.trim().replace(/ *\([^)]*\) */g, "") === 'All Categories') {
			// 	mobileEls[i][textProp] = 'Show All ' + mobileEls[i][textProp].slice(mobileEls[i][textProp].lastIndexOf(' '));
			// }
		}

		this.$el.find("#sCategoryBrowseFilter").html(els);
		this.$el.find("#sMobileFilter").html(mobileEls);

		return this;
	},

	events:{
		"click #aOpenStoreListCont" : "openselectstore",
		"click #aOpenStoreInfoCont" : "openstoreinfo",
		"click #dShoppingListButton" : "gotoshoppinglist",
		"click .aGlobalDisclaimer" : "showglobaldisclaimer",
		"click #iCurrentAd, #aCurrentAdMobile, #iSneakPeek, #aSneakPeekMobile" : "gotosneakpeek",
		"click #aGlobalQuickTips" : "showQuickTips",
		'click #sMenu': 'doToggleMenu',
		//'touchstart #sMenu': 'doToggleMenu',
		'click #sLogo': 'goHome',
		'click #sStore': 'gotoshoppinglist',
		'click .shoppinglist-number-block': 'gotoshoppinglist',
		'change #sMobileNav': 'doRoutePage',
		'change #sMobileFilter': 'doFilterUpdate',
		'change #sCategoryBrowseFilter': 'doFilterUpdate',
		'click #dNavWeeklyList li': 'preventEbNav'
		//'touchstart #sMobileNav': 'focusonselect',
		//'touchstart #sMobileFilter': 'focusonselect'
	},

	preventEbNav: function() {
		CVSJS.Promo.ebNavigate = null;
		CVSJS.Promo.Defaults.browsePageScrollPosition = null;
		CVSJS.Promo.ebNavigate = false;
	},

	focusonselect: function(e) {
		$("select").blur();
		$(e.currentTarget.id).focus();
		return false;
	},

	openselectstore: function(ev){
		CVSJS.Promo.Session.keepAlive();
		var storeSearchOverlay = new CVSJS.Promo.vStoreSearchOverlay(ev.target);
		return false;
	},

	openstoreinfo: function(ev){
		CVSJS.Promo.Session.keepAlive();
		var storeInformationOverlay= new CVSJS.Promo.vStoreInformationOverlay(ev.target);
		return false;
	},

	gotoshoppinglist: function(){
		CVSJS.Promo.appRouter.navigate(CVSJS.Promo.URL.shoppinglist, {trigger: true});
		return false;
	},

	gotosneakpeek: function(e){

		if( e.target.id == "iCurrentAd" && !(CVSJS.Helper.URLContains("issneakpeek=true")) ) {
			// If clicked current add and not on sneak peak do nothing
		} else if ( e.target.id == "iSneakPeek" && CVSJS.Helper.URLContains("issneakpeek=true")) {
			// if clicked on sneakpeak and in sneak peak do nothing
		} else {

		 if (CVSJS.Helper.URLContains("issneakpeek=true")){
		 	CVSJS.Helper.redirect(CVSJS.Promo.URL.browsefull);
		 } else {
		 	CVSJS.Helper.redirect(CVSJS.Promo.URL.sneakpeek);
		 }

		}
		return false;
	},

	goHome: function() {
		CVSJS.Promo.appRouter.navigate(CVSJS.Promo.URL.browse, {trigger: true});
	},

	showglobaldisclaimer: function(ev){
		CVSJS.Promo.Session.keepAlive();
		var disclaimerOverlay = new CVSJS.Promo.vGlobalDisclaimerOverlay(ev.target);
		return false;
	},

	showQuickTips: function() {
		CVSJS.Promo.Helper.showQuickTips();
		return false;
	},

	doToggleMenu: function(ev) {
		CVSJS.Promo.Session.keepAlive();
		if ($('#nWeeklyAdMenu').hasClass('open')) {
			CVSJS.Promo.Events.trigger('mobilemenu:close');
		} else {
			CVSJS.Promo.Events.trigger('mobilemenu:open');
		}
		$('#nWeeklyAdMenu, #nWeeklyAdMenu ul').scrollTop(0);
	},

	doRoutePage: function(ev) {
		var $el = $(ev.currentTarget),
			el = ev.currentTarget;

		$el.blur();
		if(el.value == 'prevpurchases') {
			this.gotoprevpurch();
			$el.find('option:selected').attr('selected', false);
			$el.find('option').removeAttr('selected');

			window.setTimeout(function() {
				$el.find('option[value="' + CVSJS.Promo.Globals.mobileFilterCurrentSelection + '"]').attr('selected', 'selected');
				$el.find('option[value="' + CVSJS.Promo.Globals.mobileFilterCurrentSelection + '"]').attr('selected', true);
			}, 2000);

			return false;
		} else {
			CVSJS.Promo.appRouter.navigate(CVSJS.Promo.URL[ev.currentTarget.value], {trigger: true});
			CVSJS.Promo.Globals.mobileFilterCurrentSelection = ev.currentTarget.value;
		}
	},

	doFilterUpdate: function(ev) {
		CVSJS.Promo.Session.keepAlive();
		var $filter = $(ev.currentTarget),
			selectedCat = $.trim($filter.find('option:selected').text()).replace(/ *\([^)]*\) */g, "");

		$filter.blur();
		CVSJS.Promo.appRouter.navigate("Browse/" + selectedCat, {trigger: true});
	},

	handleSelectLists: function(route, params) {
		if(route != 'defaultpage' || route != 'browse'){
			this.setSelectNav(route);
			this.setSelectFilter(route, params);
		}
	},

	setSelectNav: function(route, params) {
		if (route == "defaultpage") { route = "browse"; }
		var $mobileNav = $('#sMobileNav');
		$mobileNav.val(route);
		CVSJS.Promo.Globals.mobileFilterCurrentSelection = route;

		//$mobileNav.find('option:selected').removeAttr('selected');
		$mobileNav.find('option:selected').attr('selected', false);
		$mobileNav.find('option[value="' + route + '"]').attr('selected', true);

		// Desktop
		$("#dNavWeeklyList li").removeClass("active");
		$("#dNavWeeklyList li." + route).addClass("active");
	},

	setSelectFilter: function(route, params) {
		// Setting the correct option in select list and show the correct category section
		if(params.length && params[0]) {
			var categorypage = params[0],
				categoryOptions = $("#sCategoryBrowseFilter option");

			var optionTexts = $.map(categoryOptions, function(option){
				var optionText = $.trim($(option).text().replace(/ *\([^)]*\) */g, ""));
				if(optionText == $.trim(categorypage)) {
					$(option, this).attr('selected', true);
					$('#sMobileFilter').find('[value="' + $(option).val() + '"]').attr('selected', true);
				}
			});
		}
	},
	gotoprevpurch: function(){
		if(CVSJS.Header.Flags.userIsEcOptedIn()){
			if(CVSJS.Header.Flags.userHasECCard()){
				CVSJS.Promo.appRouter.navigate(CVSJS.Promo.URL.prevpurchases, {trigger: true});//take user to prev purchases
			}
		}else if(CVSJS.Header.Flags.userIsSignedIn()){
			if(CVSJS.Header.Flags.userHasECCard()){
				CVSJS.Promo.appRouter.navigate(CVSJS.Promo.URL.prevpurchases, {trigger: true});//take user to prev purchases
			}else{
				CVSJS.Promo.linkExtraCareCardOverlay = new CVSJS.Promo.vLinkExtraCareCardOverlay($('#dMobilePreviousPurchase'));
			}
		}else if(CVSJS.Header.Flags.userIsCookied()){
			CVSJS.Promo.mobileMenu.openMenu();
			if(CVSJS.Header.Flags.userHasECCard()){
				$("#signInOverlayPrevPurchasesHasAcct").click(); //modal to login
			}else{
				$("#signInOverlayPrevPurchasesHasAcct").click(); //modal to login and attach card
			}
			CVSJS.Promo.Helper.setCookie('CVS_WEEKLYAD_RELOAD', 'true', 2000);
			window.setTimeout(function() {
				if (CVSJS.Helper.URLContains("issneakpeek=true")){
				 	$("#slideOutWrap #loginSuccInp").val( "/weeklyad/browse/browse-home.jsp?issneakpeek=true&redirect=false#PreviousPurchases" );
				 	$(".signinoverlaywrapper #loginSuccInp").val( "/weeklyad/browse/browse-home.jsp?issneakpeek=true&redirect=false#PreviousPurchases" );
				} else {
				 	$("#slideOutWrap #loginSuccInp").val( "/weeklyad/browse/browse-home.jsp?redirect=false#PreviousPurchases" );
				 	$(".signinoverlaywrapper #loginSuccInp").val( "/weeklyad/browse/browse-home.jsp?redirect=false#PreviousPurchases" );
				}
			}, 4000);
		}else{
			window.setTimeout(function() {
				if (CVSJS.Helper.URLContains("issneakpeek=true")){
				 	$("#slideOutWrap #loginSuccInp").val( "/weeklyad/browse/browse-home.jsp?issneakpeek=true&redirect=false#PreviousPurchases" );
				 	$(".signinoverlaywrapper #loginSuccInp").val( "/weeklyad/browse/browse-home.jsp?issneakpeek=true&redirect=false#PreviousPurchases" );
				} else {
				 	$("#slideOutWrap #loginSuccInp").val( "/weeklyad/browse/browse-home.jsp?redirect=false#PreviousPurchases" );
				 	$(".signinoverlaywrapper #loginSuccInp").val( "/weeklyad/browse/browse-home.jsp?redirect=false#PreviousPurchases" );
				}
			}, 4000);
			CVSJS.Promo.mobileMenu.openMenu();
			$("#signInOverlayPrevPurchasesNoAcct").click(); //modal to login or create acct
			//Scroll down if within the mobile app
			var unetAppReq = CVSJS.Helper.getCookieValue('UNET_APP_REQ');
			if( unetAppReq == "yes"){
				$("#loginPopup").focus(function(){
					$("#slideOutWrap").scrollTop(50);
				});
			}
		}
		return false;
	}
});

////------------------- BROWSE PAGE - CATEGORY FILTER OPTION

CVSJS.Promo.vBrowseFilter = Backbone.View.extend({
	tagName: "option",
	initialize: function () {
		this.template = CVSJS.Promo.TemplateCache.get("#tmplBrowseFilterOptions");
		this.render();
	},

	render: function () {
		var person;
		if(this.options.totalCount)	{
			person = {nl:"All Categories"};
			this.$el.attr("value", "all");
			var renderedTemplate = $.trim(this.template({ item: person, count: this.options.totalCount}));
		} else {
			if(this.options.count > 0) {
				this.$el.attr("value", "catID-" + this.model.id);
				person = this.model.toJSON();
				var renderedTemplate = $.trim(this.template({ item: person, count: this.options.count }));
			}
		}
		this.$el.html( renderedTemplate );
		return this;
	}
});

CVSJS.Promo.vMobileMenu = Backbone.View.extend({
	el: '#nWeeklyAdMenu',

	events: {
		'click #aStoreInfoLink': 'showStoreModal',
		'click #aChangeStoreLink': 'showChangeStoreModal',
		'click .aGlobalDisclaimer': 'showGlobalDisclaimer',
		'click #dPageOverlay': 'closeMenu',
		'click #dMobilePreviousPurchase': 'gotoprevpurch',
		'click a': 'closeMenu',
		'click li': 'preventEbNav',
		'touchstart #aStoreInfoLink': 'showStoreModal',
		'touchstart #aChangeStoreLink': 'showChangeStoreModal',
		'touchstart .aGlobalDisclaimer': 'showGlobalDisclaimer',
		//'touchstart #dPageOverlay': 'closeMenu'
		//'click a': 'closeMenu'
	},

	initialize: function() {
		CVSJS.Promo.Events.on('mobilemenu:close', this.closeMenu);
		CVSJS.Promo.Events.on('mobilemenu:open', this.openMenu);
		CVSJS.Promo.appRouter.on('route', this.closeMenu);

		this.renderStore();
		this.renderCounts();
	},

	preventEbNav: function() {
		CVSJS.Promo.ebNavigate = null;
		CVSJS.Promo.Defaults.browsePageScrollPosition = null;
		CVSJS.Promo.ebNavigate = false;
	},

	gotoprevpurch: function(ev){
		if(CVSJS.Header.Flags.userIsEcOptedIn()){
			if(CVSJS.Header.Flags.userHasECCard()){
				CVSJS.Promo.appRouter.navigate(CVSJS.Promo.URL.prevpurchases, {trigger: true});//take user to prev purchases
			}
		}else if(CVSJS.Header.Flags.userIsSignedIn()){
			if(CVSJS.Header.Flags.userHasECCard()){
				CVSJS.Promo.appRouter.navigate(CVSJS.Promo.URL.prevpurchases, {trigger: true});//take user to prev purchases
			}else{
				ev.stopImmediatePropagation();
				CVSJS.Promo.linkExtraCareCardOverlay = new CVSJS.Promo.vLinkExtraCareCardOverlay($('#dMobilePreviousPurchase'));
			}
		}else if(CVSJS.Header.Flags.userIsCookied()){
			ev.stopImmediatePropagation();
			if(CVSJS.Header.Flags.userHasECCard()){
				$("#signInOverlayPrevPurchasesHasAcct").click(); //modal to login
			}else{
				$("#signInOverlayPrevPurchasesHasAcct").click(); //modal to login and attach card
			}
			CVSJS.Promo.Helper.setCookie('CVS_WEEKLYAD_RELOAD', 'true', 2000);
			window.setTimeout(function() {
				if (CVSJS.Helper.URLContains("issneakpeek=true")){
				 	$("#slideOutWrap #loginSuccInp").val( "/weeklyad/browse/browse-home.jsp?issneakpeek=true&redirect=false#PreviousPurchases" );
				 	$("#signinoverlaywrapper #loginSuccInp").val( "/weeklyad/browse/browse-home.jsp?issneakpeek=true&redirect=false#PreviousPurchases" );
				} else {
				 	$("#slideOutWrap #loginSuccInp").val( "/weeklyad/browse/browse-home.jsp?redirect=false#PreviousPurchases" );
				 	$("#signinoverlaywrapper #loginSuccInp").val( "/weeklyad/browse/browse-home.jsp?redirect=false#PreviousPurchases" );
				}
			}, 4000);
		}else{
			ev.stopImmediatePropagation();
			window.setTimeout(function() {
				if (CVSJS.Helper.URLContains("issneakpeek=true")){
				 	$("#slideOutWrap #loginSuccInp").val( "/weeklyad/browse/browse-home.jsp?issneakpeek=true&redirect=false#PreviousPurchases" );
				 	$("#signinoverlaywrapper #loginSuccInp").val( "/weeklyad/browse/browse-home.jsp?issneakpeek=true&redirect=false#PreviousPurchases" );
				} else {
				 	$("#slideOutWrap #loginSuccInp").val( "/weeklyad/browse/browse-home.jsp?redirect=false#PreviousPurchases" );
				 	$("#signinoverlaywrapper #loginSuccInp").val( "/weeklyad/browse/browse-home.jsp?redirect=false#PreviousPurchases" );
				}
			}, 4000);
			$("#signInOverlayPrevPurchasesNoAcct").click(); //modal to login or create acct
			//Scroll down if within the mobile app
			var unetAppReq = CVSJS.Helper.getCookieValue('UNET_APP_REQ');
			if( unetAppReq == "yes"){
				$("#loginPopup").focus(function(){
					$("#slideOutWrap").scrollTop(50);
				});
			}
		}
		return false;
	},

	// closeMenu: _.throttle(function() {
	// 	var ev, callback;
	// 	if (arguments[0] && arguments[0].currentTarget && arguments[0].preventDefault) {
	// 		ev = arguments[0];
	// 	} else if (arguments[0] && _.isFunction(arguments[0])) {
	// 		callback = arguments[0];
	// 	}

	// 	CVSJS.Promo.Session.keepAlive();
	// 	$('#hWeeklyAdMobile').removeClass('open');
	// 	$('#nWeeklyAdMenu').removeClass('open');
	// 	$('#nWeeklyAdMenu, #nWeeklyAdMenu ul').scrollTop(0);
	// 	$('#responsiveMainwrapper').removeClass('open');
	// 	$('#dPageOverlay').removeClass('open');
	// 	$('#m-responsiveFooter').removeClass('open');

	// 	setTimeout(function() {
	// 		$('body, html').height('inherit');
	// 		$('body, html').removeClass('menu-no-scroll');

	// 		if (callback) {
	// 			callback();
	// 		}
	// 	}, 200);

	// 	if (ev) {
	// 		return false;
	// 	}
	// }, 200),

	closeMenu: function(callback) {
		CVSJS.Promo.Session.keepAlive();
		$('#hWeeklyAdMobile').removeClass('open');
		$('#nWeeklyAdMenu').removeClass('open');
		$('#nWeeklyAdMenu, #nWeeklyAdMenu ul').scrollTop(0);
		$('#responsiveMainwrapper').removeClass('open');
		$('#dPageOverlay').removeClass('open');
		$('#m-responsiveFooter').removeClass('open');

		$('body').removeClass('noscroll');

		$('body, html').height('inherit');
		$('body, html').removeClass('menu-no-scroll');

		if (callback && _.isFunction(callback)) {
			setTimeout(callback, 200);
		}
	},

	openMenu: _.throttle(function(callback) {
		CVSJS.Promo.Session.keepAlive();
		$('#hWeeklyAdMobile').addClass('open');
		$('#nWeeklyAdMenu').addClass('open');
		$('#responsiveMainwrapper').addClass('open');
		$('#m-responsiveFooter').addClass('open');
		$('#nWeeklyAdMenu, #nWeeklyAdMenu ul').scrollTop(0);

		setTimeout(function() {
			$('#dPageOverlay').addClass('open');
			$('body, html').height($(window).height());
			$('body, html').addClass('menu-no-scroll');

			if (callback && _.isFunction(callback)) {
				callback();
			}
		}, 200);
	}, 200),

	showStoreModal: function(ev) {
		ev.stopImmediatePropagation();

		CVSJS.Promo.Session.keepAlive();
		var storeInformationOverlay= new CVSJS.Promo.vStoreInformationOverlay(ev.target);
		return false;
	},

	showChangeStoreModal: function(ev) {
		ev.stopImmediatePropagation();

		CVSJS.Promo.Session.keepAlive();
		var storeInformationOverlay= new CVSJS.Promo.vStoreSearchOverlay(ev.target);
		return false;
	},

	showGlobalDisclaimer: function(ev) {
		ev.stopImmediatePropagation();

		var storeInformationOverlay= new CVSJS.Promo.vGlobalDisclaimerOverlay(ev.target);
		return false;
	},

	renderStore: function(ev) {
		var template = CVSJS.Promo.TemplateCache.get('#tmplMenuStore'),
			renderedTemplate = template({store: CVSJS.Promo.myStoreModel});

		$('#dStoreSection').html(renderedTemplate);
	},

	renderCounts: function(ev) {
		var $subNav = $('#uBrowseSubNav'),
			template = CVSJS.Promo.TemplateCache.get('#tmplBrowseSubNav'),
			els = [],
			total = 0;

		CVSJS.Promo.categoryColl.each(function(catModel) {
			var blkCount;
			if (catModel.get('cc')){
				blkCount = catModel.get('cc').split('|')[0];
			}

			switch(catModel.get("nt")){
				case "2":
				case "3":
				case "4":
					break;
				default:
					if (catModel.get('cc')) {
						els.push(template({catModel: catModel}));
						total += (+blkCount);
					}
			}
		});

		if (total) {
			$subNav.prev().text($subNav.prev().text() + ' (' + total + ')');
		}

		$subNav.html(els);
	}
});

//View for specific page header navigation
CVSJS.Promo.vPageSpecificNavigationHeader = Backbone.View.extend({
	initialize: function () {
		this.template = CVSJS.Promo.TemplateCache.get(this.options.template);
		this.render();
	},
	render: function() {
		this.$el.html(this.template());

		if(CVSJS.Header.Details.au && CVSJS.Header.Details.au[0] === "0"){
			this.$("#btnAddPrevPurch").hide();
		}

		return this;
	},
	events: {
		"click .liCategory" : "selectcategory",
		"click #btnAddPrevPurch": "gotoprevpurch",
		"click #btnBackToBrowse": "gotobrowse",
		"click #btnBackToList": "gotolist",
		"click .email-list" : "emaillist",
		"click .print-list" : "printlist",
		"click .clear-list" : 'clearlist'
	},
	selectcategory: function(ev){
		$.each(this.$(".liCategory"), function( idx, categoryLink ) {
			$(categoryLink).removeClass("active");
		});

		$(ev.target).addClass("active");

		var categoryName = $(ev.target).data("categoryName");

		CVSJS.Promo.appRouter.navigate( "#" + categoryName, { trigger: true, replace: false });
	},
	gotoprevpurch: function(ev){
		if(CVSJS.Header.Flags.userIsEcOptedIn()){
			if(CVSJS.Header.Flags.userIsSignedIn())
				{
				CVSJS.Promo.linkExtraCareCardOverlay = new CVSJS.Promo.vLinkExtraCareCardOverlay(ev.target);
				}
			else
				{
				CVSJS.Promo.Helper.setCookie('CVS_WEEKLYAD_RELOAD', 'true', 2000);
				$("#signInOverlayPrevPurchasesHasAcct").click(); //modal to login
				}
		}else if(CVSJS.Header.Flags.userIsSignedIn()){
			if(CVSJS.Header.Flags.userHasECCard()){
				CVSJS.Promo.appRouter.navigate(CVSJS.Promo.URL.prevpurchases, {trigger: true});//take user to prev purchases
			}else{
				CVSJS.Promo.linkExtraCareCardOverlay = new CVSJS.Promo.vLinkExtraCareCardOverlay(ev.target);
			}
		}else if(CVSJS.Header.Flags.userIsCookied()){
			CVSJS.Promo.Helper.setCookie('CVS_WEEKLYAD_RELOAD', 'true', 2000);
			if(CVSJS.Header.Flags.userHasECCard()){
				$("#signInOverlayPrevPurchasesHasAcct").click(); //modal to login
			}else{
				$("#signInOverlayPrevPurchasesHasAcct").click(); //modal to login and attach card
			}
		}else{
			CVSJS.Promo.Helper.setCookie('CVS_WEEKLYAD_RELOAD', 'true', 2000);
			$("#signInOverlayPrevPurchasesNoAcct").click(); //modal to login or create acct
			//Scroll down if within the mobile app
			var unetAppReq = CVSJS.Helper.getCookieValue('UNET_APP_REQ');
			if( unetAppReq == "yes"){
				$("#loginPopup").focus(function(){
					$("#slideOutWrap").scrollTop(50);
				});
			}
		}
		return false;
	},

	gotobrowse: function(ev){
		CVSJS.Promo.Helper.setCookie('CVS_WEEKLYAD_RELOAD', 'true', 2000);
		window.history.back();
		return;
//
//		var lastLocation = '',
//			$el = $(ev.currentTarget);
//		//this scenario isn't in the latest prototype/creatives but it's worth keeping here.
//		if ((CVSJS.Promo.myShoppingListColl.size() == 0 && CVSJS.Promo.mySneakPeekListColl.size() == 0) || CVSJS.Promo.Defaults.sectionName == 'shoppinglist') {
//			window.history.back();
//			return;
//		}
//
//		//if the page that the user came from satisfies the condition act as a true back button
//		if (CVSJS.Promo.Globals.history[1]) {
//			var tempLocation = CVSJS.Promo.Globals.history[1];
//			lastLocation = tempLocation.substring(tempLocation.lastIndexOf('#') + 1).toLowerCase();
//		}
//
//		if (lastLocation == 'shoppinglist' || lastLocation == 'previouspurchases') {
//			window.history.back();
//			return;
//		}
//
//		if (typeof CVSJS.Promo.Globals.history[1] == 'undefined') {
//			CVSJS.Promo.Globals.history = window['localStorage'] ? window.localStorage['history'].split(',') : CVSJS.Promo.Globals.history;
//			CVSJS.Promo.appRouter.navigate(CVSJS.Promo.URL['shoppinglist'], {trigger: true});
//			return;
//		}
//
//		var page, pageSelector, item,
//			bypass = false,
//			listCollection = CVSJS.Promo.myShoppingListColl,
//			blockNum = location.hash.substring(location.hash.lastIndexOf('/') + 1),
//			block = $('.bn-' + blockNum);
//
//		if (CVSJS.Helper.URLContains("issneakpeek=true")) {
//			listCollection = CVSJS.Promo.mySneakPeekListColl;
//		}
//
//		item = listCollection.where({bk: parseInt(blockNum)});
//
//		page = CVSJS.Promo.lastMajorPage;
//		if (item && CVSJS.Promo.Globals.fromShoppingList) {
//			page = CVSJS.Promo.Globals.shoppingListCache[blockNum];
//		}
//
//		if (page == 'yourdeals') {
//			pageSelector = '.your-deals-page';
//		} else if (page == 'browse') {
//			pageSelector = '.browse-page';
//		} else if (page == 'extracare') {
//			pageSelector = '.extracare-page';
//		} else if (page == 'previouspurchases') {
//			page = 'prevpurchases';
//			pageSelector = '#dPgPrevPurchases';
//		}
//
//		//page = (item) ? item.get('addedFrom') : CVSJS.Promo.lastMajorPage; //if there is no data on where that item was added from - just go back to the lastMajorPage, this scenario would exist if the user refreshes the page and memory is then gone
//		if ($(pageSelector).find('.bn-' + blockNum).length) {
//			block = $(pageSelector).find('.bn-' + blockNum);
//		} else {
//			block = $(pageSelector).find('#sku-' + item[0].get('sk'));
//		}
//
//		CVSJS.Promo.ebNavigate = {page: page, $el: block, additionalOffset: -277};
//		CVSJS.Promo.appRouter.navigate(CVSJS.Promo.URL[page], {trigger: true});
//		return false;
	},
	gotolist: function(){
		CVSJS.Promo.appRouter.navigate(CVSJS.Promo.URL.shoppinglist, {trigger: true});
		return false;
	},
	emaillist: function(ev){
		CVSJS.Promo.Session.keepAlive();
		if(CVSJS.Header.Flags.userIsSignedIn()){
			CVSJS.Promo.emailShoppingListOverlay = new CVSJS.Promo.vEmailShoppingListOverlay(ev.currentTarget);
		}else{
			$("#signInOverlayEmail").click(); //modal to login or create acct
		}
		return false;
	},
	printlist: function(){
		CVSJS.Promo.Session.keepAlive();
		window.print();
		return false;
	},
	clearlist: function(ev){
		CVSJS.Promo.Session.keepAlive();
		CVSJS.Promo.clearAllOverlay = new CVSJS.Promo.vClearAllOverlay(ev.target);
		return false;
	}
});

//View for the Disclaimer at the bottom of the page
CVSJS.Promo.vGlobalDisclaimer = Backbone.View.extend({
	el: "#dGlobalDisclaimer",
	initialize: function () {
		this.render();
	},
	render: function () {
		if(CVSJS.Promo.Data.eventdisclaimer){
			this.$el.html( CVSJS.Promo.Data.eventdisclaimer );
		}
		return this;
	}
});

CVSJS.Promo.vBackToTop = Backbone.View.extend({
	el: '#dBackToTop',

	events: {
		'click #dBackToTopInnerContainer': 'doScrollUp',
		'touchstart #dBackToTopInnerContainer': 'doScrollUp'
	},

	isOpen: false,

	initialize: function() {
		$(window).scroll(_.bind(function(ev) {
			var scrollTop = $(window).scrollTop();
			if (scrollTop > 0 && !this.isOpen) {
				this.toggleBackToTop();
			} else if (scrollTop == 0 && this.isOpen) {
				this.toggleBackToTop();
			}
		}, this));
		// $(window).on('touchmove', _.bind(function(ev) {
		// 	var scrollTop = $(window).scrollTop();
		// 	if (scrollTop > 0 && !this.isOpen) {
		// 		this.toggleBackToTop();
		// 	} else if (scrollTop == 0 && this.isOpen) {
		// 		this.toggleBackToTop();
		// 	}
		// }, this));

	},

	doScrollUp: function(ev) {
		$(window).scrollTop(0);

		//on iphone the first scroll brings the top header of the browser down, the second will actually scroll the page up
		if ((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i))) {
			$(window).scrollTop(1);
		}

	},

	toggleBackToTop: function() {
		$('#dBackToTop').toggleClass('open');
		this.isOpen = !this.isOpen;
	}
});

//------------------- PAGE SPECIFIC VIEWS ---------------------------------------

//------------------- BROWSE PAGE - HOME

//View for the home page content below the navigation
CVSJS.Promo.vBrowse = Backbone.View.extend({
	el: "#dPgBrowse",
	initialize: function () {
		this.template = CVSJS.Promo.TemplateCache.get("#tmplPageBrowse");
		this.render();
	},

	render: function () {
		var renderedTemplate = this.template();
		this.$el.html( renderedTemplate );

		CVSJS.Promo.categorySectionList = new CVSJS.Promo.vCategorySectionList({ collection: CVSJS.Promo.categoryColl });
		CVSJS.Promo.disclaimerFooter = new CVSJS.Promo.vGlobalDisclaimer();

		return this;
	}
});

//------------------- BROWSE PAGE - CATEGORY SECTION LIST

CVSJS.Promo.vCategorySectionList = Backbone.View.extend({
	el: "#dCategorySectionList",
	initialize: function () {
		this.render();
	},
	render: function () {
		var els = [], catSection, catList, catRow;
		this.collection.each( function( category, idx ) {
			var blkCount = 0, arrContainers = [];
			if(category.get("cc")){
				arrContainers = category.get("cc").split('|');
				blkCount = arrContainers[0];
			}
			switch(category.get("nt")){ //@NOTE: This are category sections
				case "2": //Push Offers
					CVSJS.Promo.pushOffersSection = new CVSJS.Promo.vPushOffersSectionItem({ model: category });
					els.push( CVSJS.Promo.pushOffersSection.el );
					break;
				case "3": //Prev Purchase
					CVSJS.Promo.prevPurchaseSection = new CVSJS.Promo.vPrevPurchasesSectionItem({ model: category });
					els.push( CVSJS.Promo.prevPurchaseSection.el );
					break;
				case "4": //ExtraBucks
					//Make a call to get these ad blocks
					if(blkCount !== 0){
						catSection = new CVSJS.Promo.vExtraBucksSectionItem({ model: category });

						els.push(catSection.el);
					}
					break;
				default:
					if(blkCount !== 0){
						CVSJS.Promo.catSections[idx] = new CVSJS.Promo.vCategorySectionItem({model: category, count: blkCount });
						els.push( CVSJS.Promo.catSections[idx].el );
					}
			}
		});

		this.$el.html(els);

		return this;
	}
});

//------------------- BROWSE PAGE - PREV PURCHASES SECTION ITEM

CVSJS.Promo.vPrevPurchasesSectionItem = Backbone.View.extend({
	tagName: "div",
	attributes: { "class": "categorycont category-block your-deals-page" },
	initialize: function () {
		this.isRendered = false;
		this.template = CVSJS.Promo.TemplateCache.get("#tmplPrevPurchaseSection");
	},
	events: {
		"click #iPrevPurchase6Months" : "render6mos",
		"click #iPrevPurchase18Months" : "render18mos",
		"click #aPrevPurchaseSignIn" : "showsigninmodal",
	},
	render: function(){
		this.$el.hide();
	},
	renderempty: function (message, avoidRedirect) {
		var renderedTemplate = this.template({ item: this.model.toJSON() }),
			availableMessage = message || false,
			message = message || 'Sorry, you currently have no previous purchases to show.';

		this.$el.html( renderedTemplate );
		var emptyBlockContent = this.$(".blocklist");
		if(emptyBlockContent.size() > 0 && emptyBlockContent.height() < 20 && emptyBlockContent.find(".dPrevPurcText").size() > 0){
			emptyBlockContent.find(".dPrevPurcText").height(20);
		}

		//If there is 6 mos data, just display it. otherwise, delegate to 18mos, otherwise, display error :(
		if (CVSJS.Promo.Data.browseprevpurchasespartial.length && !avoidRedirect) {
			$('#iPrevPurchase6Months').trigger('click');

			this.$(".blocklist").hide();
		} else if (CVSJS.Promo.Data.browseprevpurchasesfull.length && !avoidRedirect) {
			$('#iPrevPurchase18Months').trigger('click');

			this.$(".blocklist").hide();
		} else {
			this.$(".blocklist").html("<div class='dPrevPurcText'>" + message + "</div>");
			if(!availableMessage) {
				this.$("#iPrevPurchase6Months").prop('disabled', true);
				this.$("#iPrevPurchase18Months").prop('disabled', true);
			}
			this.$(".blocklist").show();
		}

		return this;
	},
	rendersignin: function () {
		var renderedTemplate = this.template({ item: this.model.toJSON() });
		this.$el.html( renderedTemplate );
		this.$(".blocklist").html("<div class='dPrevPurcText'>You have " + CVSJS.Promo.Data.browseprevpurchasesfull.length + " deals on things you've bought. <span><a id='aPrevPurchaseSignIn' href='' title='Sign in to see your deals'>Sign in to see your deals</a>.</span></div>");
		var emptyBlockContent=this.$(".blocklist");  //s
		if(emptyBlockContent.size() > 0 && emptyBlockContent.height() < 20 && emptyBlockContent.find(".dPrevPurcText").size() > 0){
			emptyBlockContent.find(".dPrevPurcText").height(20);
		}
		this.isRendered = true;
		return this;
	},
	render6mosinitial: function () {
		if(CVSJS.Header.Flags.userIsEcOptedIn()){
			if (!CVSJS.Promo.Data.browseprevpurchasespartial.length) {
				this.renderempty('Sorry, you currently have no previous purchases in the last 6 months to show.', true);
			} else {
				var renderedTemplate = this.template({ item: this.model.toJSON() });
				this.$el.html( renderedTemplate );
				this.$("#iPrevPurchase6Months").prop('disabled', false);
				this.$("#iPrevPurchase18Months").prop('disabled', false);
				// CVSJS.Promo.prePurchasePartColl = new CVSJS.Promo.cAdBlocks( CVSJS.Promo.Data.browseprevpurchasespartial );
				// var adBlockList = new CVSJS.Promo.vCategoryBlockList({ collection: CVSJS.Promo.prePurchasePartColl, el: this.$el.find(".blocklist"), catnavtype: this.model.get("nt") }).render();
				this.render18months();
				this.render6months();
				$(".blocklist-more").hide();
				this.$(".blocklist").hide();
				CVSJS.Promo.Helper.lazyLoadImages($("#dPgBrowse"));
			}
		}
		// SMP () CR #ENH03785 code changes - start
		//Display previous purchase information to cookied user also
		else if(CVSJS.Header.Flags.userIsSignedIn() || CVSJS.Header.Flags.userIsCookied()){
			// SMP () CR #ENH03785 code changes - end
			if (!CVSJS.Promo.Data.browseprevpurchasespartial.length) {
				this.renderempty('Sorry, you currently have no previous purchases in the last 6 months to show.', true);
			} else {
				var renderedTemplate = this.template({ item: this.model.toJSON() });
				this.$el.html( renderedTemplate );
				this.$("#iPrevPurchase6Months").prop('disabled', false);
				this.$("#iPrevPurchase18Months").prop('disabled', false);
				// CVSJS.Promo.prePurchasePartColl = new CVSJS.Promo.cAdBlocks( CVSJS.Promo.Data.browseprevpurchasespartial );
				// var adBlockList = new CVSJS.Promo.vCategoryBlockList({ collection: CVSJS.Promo.prePurchasePartColl, el: this.$el.find(".blocklist"), catnavtype: this.model.get("nt") }).render();
				this.render18months();
				this.render6months();
				$(".blocklist-more").hide();
				this.$(".blocklist").hide();
				CVSJS.Promo.Helper.lazyLoadImages($("#dPgBrowse"));
			}
		}
		this.isRendered = true;
		return this;
	},
	render6mos: function () {
		CVSJS.Promo.Session.keepAlive();
		if(CVSJS.Header.Flags.userIsEcOptedIn()){
			if (!CVSJS.Promo.Data.browseprevpurchasespartial.length) {
				this.renderempty('Sorry, you currently have no previous purchases in the last 6 months to show.', true);
			} else {
				//CVSJS.Promo.prePurchasePartColl = new CVSJS.Promo.cAdBlocks( CVSJS.Promo.Data.browseprevpurchasespartial );
				//var adBlockList = new CVSJS.Promo.vCategoryBlockList({ collection: CVSJS.Promo.prePurchasePartColl, el: this.$el.find(".blocklist"), catnavtype: this.model.get("nt") }).render();
				$(".blocklist-6mon").show();
				$(".blocklist-more").hide();
				this.$(".blocklist").hide();
				CVSJS.Promo.Helper.lazyLoadImages($("#dPgBrowse"));
			}
		}
		// SMP () CR #ENH03785 code changes - start
		//Display previous purchase information to cookied user also
		else if(CVSJS.Header.Flags.userIsSignedIn() || CVSJS.Header.Flags.userIsCookied()){
		// SMP () CR #ENH03785 code changes - end
			if (!CVSJS.Promo.Data.browseprevpurchasespartial.length) {
				this.renderempty('Sorry, you currently have no previous purchases in the last 6 months to show.', true);
			} else {
				//CVSJS.Promo.prePurchasePartColl = new CVSJS.Promo.cAdBlocks( CVSJS.Promo.Data.browseprevpurchasespartial );
				//var adBlockList = new CVSJS.Promo.vCategoryBlockList({ collection: CVSJS.Promo.prePurchasePartColl, el: this.$el.find(".blocklist"), catnavtype: this.model.get("nt") }).render();
				$(".blocklist-6mon").show();
				$(".blocklist-more").hide();
				this.$(".blocklist").hide();
				CVSJS.Promo.Helper.lazyLoadImages($("#dPgBrowse"));
			}
		}
		this.isRendered = true;

		$('#iPrevPurchase6Months').attr('checked', true);
		$('#iPrevPurchase18Months').attr('checked', false);

		return this;
	},
	render6months: function () {
		CVSJS.Promo.prePurchasePartColl = new CVSJS.Promo.cAdBlocks( CVSJS.Promo.Data.browseprevpurchasespartial );
		var adBlockList = new CVSJS.Promo.vCategoryBlockList({ collection: CVSJS.Promo.prePurchasePartColl, el: this.$el.find(".blocklist-6mon"), catnavtype: this.model.get("nt") }).render();
		CVSJS.Promo.Helper.lazyLoadImages($("#dPgBrowse"));
		this.isRendered = true;
	},
	render18mos: function () {
		CVSJS.Promo.Session.keepAlive();

		// Change the radio button right away so the user knows what's crackalackin'
		$('#iPrevPurchase18Months').attr('checked', true);
		$('#iPrevPurchase6Months').attr('checked', false);

		// Save the scope for use within the doRender function
		var self = this;
		// Everything that should be called only after the 18 months has been loaded.
		function doRender() {
			if(CVSJS.Header.Flags.userIsEcOptedIn()){
				if (!CVSJS.Promo.Data.browseprevpurchasesfull.length) {
					self.renderempty('Sorry, you currently have no previous purchases in the last 18 months to show.', true);
				} else {
					CVSJS.Promo.prePurchaseFullColl = new CVSJS.Promo.cAdBlocks( CVSJS.Promo.Data.browseprevpurchasesfull );
					$(".blocklist-6mon").hide();
					self.$(".blocklist").hide();
					var adBlockList = new CVSJS.Promo.vCategoryBlockList({ collection: CVSJS.Promo.prePurchaseFullColl, el: self.$el.find(".blocklist-more"), catnavtype: self.model.get("nt") }).render();
					$(".blocklist-more").show();
					CVSJS.Promo.Helper.lazyLoadImages($("#dPgBrowse"));
				}
			}
			// SMP () CR #ENH03785 code changes - start
			//Display previous purchase information to cookied user also
			else if(CVSJS.Header.Flags.userIsSignedIn() || CVSJS.Header.Flags.userIsCookied()){
			// SMP () CR #ENH03785 code changes - end
				if (!CVSJS.Promo.Data.browseprevpurchasesfull.length) {
					self.renderempty('Sorry, you currently have no previous purchases in the last 18 months to show.', true);
				} else {
					CVSJS.Promo.prePurchaseFullColl = new CVSJS.Promo.cAdBlocks( CVSJS.Promo.Data.browseprevpurchasesfull );
					$(".blocklist-6mon").hide();
					self.$(".blocklist").hide();
					var adBlockList = new CVSJS.Promo.vCategoryBlockList({ collection: CVSJS.Promo.prePurchaseFullColl, el: self.$el.find(".blocklist-more"), catnavtype: self.model.get("nt") }).render();
					$(".blocklist-more").show();
					CVSJS.Promo.Helper.lazyLoadImages($("#dPgBrowse"));
				}
			}
			self.isRendered = true;
		}
		// Create a "Loading..." modal because the page freezes during the 18mo request
		CVSJS.Promo.Helper.showLoadingModal();
		// Give the radio buttons time to update before hogging the page processing
		setTimeout(function () {
			// Call the push off method again, but with the doRender as a callback
			// and with the get full pp flag set to true.
			CVSJS.Promo.Services.getPushOffPrevPurchases(doRender, true);
			// Remove the "Loading..." modal after the above line completes.
			CVSJS.Promo.Helper.removeLoadingModal();
		}, 250);

		return self;
	},
	render18months: function () {
		CVSJS.Promo.prePurchaseFullColl = new CVSJS.Promo.cAdBlocks( CVSJS.Promo.Data.browseprevpurchasesfull );
		var adBlockList = new CVSJS.Promo.vCategoryBlockList({ collection: CVSJS.Promo.prePurchaseFullColl, el: this.$el.find(".blocklist-more"), catnavtype: this.model.get("nt") }).render();

	},
	showsigninmodal: function(ev){
		ev.preventDefault();
		$("#signInOverlayPrevPurchasesHasAcctBrowse").click();
	}
});

//------------------- BROWSE PAGE - PUSH OFFERS SECTION ITEM

CVSJS.Promo.vPushOffersSectionItem = Backbone.View.extend({
	tagName: "div",
	attributes: { "class": "categorycont category-block your-deals-page" },
	initialize: function () {
		this.isRendered = false;
		this.template = CVSJS.Promo.TemplateCache.get("#tmplPushOffersSection");
		if(this.model && this.model.get("rl")){
			this.rowlimit = parseInt(this.model.get("rl"), 10);
		}else{
			this.rowlimit = 1;
		}
	},
	render: function () {
		var renderedTemplate = this.template({ item: this.model.toJSON() });
		this.$el.html( renderedTemplate );
		var adBlockList = new CVSJS.Promo.vCategoryBlockList({ collection: new CVSJS.Promo.cAdBlocks( CVSJS.Promo.Data.pushoffers ), el: this.$el.find(".blocklist"), catnavtype: this.model.get("nt") }).render();
		var myview = this;
		_.defer(function(){
			var rowHeight = myview.rowlimit * parseInt(myview.$(".expandinglist").find(".adblockcont").eq(0).height(),10);
			myview.$(".expandinglist").css("max-height", rowHeight + "px");
		});

		if(CVSJS.Header.Details.au[3]){
			this.$("#sUserName").html("for " + CVSJS.Header.Details.au[3]);
		}
		this.isRendered = true;
		return this;
	}
});


//------------------- BROWSE PAGE - EXTRABUCKS SECTION ITEM

CVSJS.Promo.vExtraBucksSectionItem = Backbone.View.extend({
	tagName: "div",
	attributes: { "class": "categorycont category-block extracare-page"},
	initialize: function () {
		this.template = CVSJS.Promo.TemplateCache.get("#tmplExtrabucksSection");
		this.render();
	},
	render: function () {
		var view = this;
		var renderedTemplate = view.template({ item: view.model.toJSON() });

		var catList = new CVSJS.Promo.vExtraBucksSectionList();

		//Added EC opted in flag for displaying EC savings & rewards--ITPR007726 - CR03451 - Extracare COOKIE OPT-IN
		if((CVSJS.Header.Flags.userIsSignedIn() || CVSJS.Header.Flags.userIsCookied() || CVSJS.Header.Flags.userIsEcOptedIn()) && CVSJS.Header.Flags.userHasECCard()){
			CVSJS.Promo.Services.getExtraCareCoupons(function(extraCareOfferData){
				CVSJS.Promo.Data.browseextracare = extraCareOfferData;
				CVSJS.Promo.myBrowseExtraCareListColl = new CVSJS.Promo.cExtraCareListItems(CVSJS.Promo.Data.browseextracare); //all table rows
				var extraCareList = new CVSJS.Promo.vExtraCareSectionTable({ collection: CVSJS.Promo.myBrowseExtraCareListColl, model: view.model });
			});
		}

		view.$el.html(renderedTemplate);
		view.$el.find('#dExtraBucksContainer').html(catList.el);
	}
});

//------------------- BROWSE PAGE - EXTRABUCKS SECTION LIST

//This is the table that encompasses all of the extrabucks-section-list-item rows
CVSJS.Promo.vExtraBucksSectionList = Backbone.View.extend({
	attributes: {
		"id": 'dExtraBucksSectionList',
		"class": 'blocklist borderMod'
	},

	initialize: function() {
		this.catRows = [];
		this.catRowsEls = [];
		 $('li.extracare').on('click', _.bind(this.select, this));
	},

	select: function() {
	
		CVSJS.Promo.Services.getExtraCareAdBlocks(_.bind(function(data){
			//get the array of the section items (array of arrays)
			_.each(data.ab, _.bind(function(val, key) {
				if (key != 'il') {
					var row = new CVSJS.Promo.vExtraBucksSectionListItem({collection: new CVSJS.Promo.cAdBlocks(val)});
					this.catRows.push(row);
					this.catRowsEls.push(row.el);
				}
			}, this));

			this.render();

			CVSJS.Promo.Events.trigger('slider:contentloaded');
		}, this));
	},

	render: function() {
		this.$el.html(this.catRowsEls);

		return this;
	}
});

//------------------- BROWSE PAGE - EXTRABUCKS SECTION LIST ITEM

//@TODO - Tarif: Clean this view please :)
//This is the ENTIRE row (including leadblock, slider + adblocks)
CVSJS.Promo.vExtraBucksSectionListItem = Backbone.View.extend({
	attributes: {
		"class": 'extrabucks-section-list-item'
	},

	initialize: function() {
		this.template = CVSJS.Promo.TemplateCache.get('#tmplExtraBucksSectionListItem');

		this.render();
	},

	render: function() {
		this.$el.html(this.template());

		// this.model = CVSJS.Promo.mAdBlock;
		var block = this.collection.at(0),
			adBlocks = this.collection.clone().remove(block);

		// create block for model

		var blockcolor = '',
			catnavtype = '4',
			addBlocksColl = new CVSJS.Promo.cAdBlocks(adBlocks.models);
		// var leaderBlock = new CVSJS.Promo.vLeaderBlock({model: block, createAnchor: this.options.createAnchors, bgcolor: blockcolor}).render(); //first one from ad block data

		var leaderBlock = new CVSJS.Promo.vLeaderBlock({model: block, createAnchor: false, bgcolor: blockcolor}); //first one from ad block data
		var adBlockList = new CVSJS.Promo.vCategoryBlockList({collection: addBlocksColl, el: this.$('.adblock-list'), catnavtype: catnavtype, createAnchors: true, leaderblockmodel: block}).render();
		this.slider = new CVSJS.Promo.vSlider({collection: addBlocksColl, el: this.$('.slider-container')}); //@TODO - make this work the way backbone wants things to work

		// var adBlockList = new CVSJS.Promo.vCategoryBlockList({ collection: new CVSJS.Promo.cAdBlocks(adBlockData), el: this.$el.find(".blocklist"), catnavtype: this.model.get("nt"), createAnchors: true }).render();
		// this.$el.html(this.template());
		this.$('.leader-block-container').html(leaderBlock.el);
		leaderBlock.changeLeaderBlocks(); //Run this so that leaderblocks look correct on mobile

		return this;
	}
});

//------------------- BROWSE PAGE - EXTRACARE LIST

CVSJS.Promo.vExtraCareSectionTable = Backbone.View.extend({
el: "#dExtraCareTable",
	initialize: function () {
		this.template = CVSJS.Promo.TemplateCache.get("#tmplBrowseExtraCare");
		this.render();
	},
	events: {
		"click #aExtraCareSignIn" : "showsigninmodal"
	},
	render: function() {
		var renderedTemplate = this.template({ item: this.model.toJSON() });
		this.$el.html( renderedTemplate );

		if(CVSJS.Header.Details.au[3]){
			this.$("#sUserName").html("for " + CVSJS.Header.Details.au[3]);
		}
		if(CVSJS.Header.Flags.userIsEcOptedIn()){
			if(this.collection.length > 0){
				var els = [];
				this.collection.each( function( item ) {
					var extracareRow = new CVSJS.Promo.vExtraCareSectionRow({ model: item });
					els.push( extracareRow.el );
				});
				this.$("#tblExtraCareDataGrid").append( els );
			}else{
				this.$("#tblExtraCareDataGrid").append( CVSJS.Promo.TemplateCache.get("#tmplBrowseExtraCareTableRowNoItems") );
			}
		}
		/*else if(CVSJS.Header.Flags.userIsCookied()){
			this.$("#tblExtraCareDataGrid").append( CVSJS.Promo.TemplateCache.get("#tmplBrowseExtraCareListTableRowLogin") );
		}*/
		// SMP () CR #ENH03785 code changes - start
		//Display previous purchase information to cookied user also
		else if(CVSJS.Header.Flags.userIsSignedIn() || CVSJS.Header.Flags.userIsCookied()){
		// SMP () CR #ENH03785 code changes - end
			if(this.collection.length > 0){
				var els = [];
				this.collection.each( function( item ) {
					var extracareRow = new CVSJS.Promo.vExtraCareSectionRow({ model: item });
					els.push( extracareRow.el );
				});
				this.$("#tblExtraCareDataGrid").append( els );
			}else{
				this.$("#tblExtraCareDataGrid").append( CVSJS.Promo.TemplateCache.get("#tmplBrowseExtraCareTableRowNoItems") );
			}
		}
		return this;
	},
	showsigninmodal: function(ev){
		ev.preventDefault();
		$("#signInOverlayECOffersBrowse").click();

		window.setTimeout(function() {
			if (CVSJS.Helper.URLContains("issneakpeek=true")){
			 	$("#cvs-overlay #loginSuccInp").val( "/weeklyad/browse/browse-home.jsp?issneakpeek=true&redirect=false#ExtraCare" );
			} else {
			 	$("#cvs-overlay #loginSuccInp").val( "/weeklyad/browse/browse-home.jsp?redirect=false#ExtraCare" );
			}
		}, 4000);
	}
});

CVSJS.Promo.vExtraCareSectionRow = Backbone.View.extend({
	tagName: "tr",
	className: "tExtraCareTableRow",
	initialize: function () {
		this.template = CVSJS.Promo.TemplateCache.get("#tmplBrowseExtraCareTableRow");
		this.render();
		this.isRendered = true;
	},
	render: function() {
		var renderedTemplate = this.template({ item: this.model.toJSON() });
		this.$el.append( renderedTemplate );

		//unlocked coupons
		if(this.model.get("pt") && this.model.get("pt") == "1"){
			//setup print offer
			this.$(".ecprint").html("<a class='btnECPrint' href='' title='Print'>Print</a>");
		}else if(this.model.get("pt") && this.model.get("pt") == "0" && this.model.get("pn")){
			//already printed
			this.$(".ecprint").html("<a class='btnECPrint' href=''title='Print'>Print</a> <span class='ecprinted'>" + this.model.get("pn") + "</span>");
		}

		if(this.model.get("sc") && this.model.get("sc") == "1"){
			//setup send to card
			this.$(".ecsendtocard").html("<a class='btnECSendCard' href='' title='Send to Card'>Send to Card</a>");
		}else if(this.model.get("sc") && this.model.get("sc") == "0" && this.model.get("se")){
			//already sent
			this.$(".ecsendtocard").html("<div class='ecSaveSentCard'>" + this.model.get("se") + "</div>");
		}
		return this;
	},
	events: {
		"click .btnECSendCard" : "sendtocard",
		"click .btnECPrint" : "printoffer"
	},
	sendtocard: function(){
		//call service
		var seqnum = this.model.get("sn");
		if(CVSJS.Promo.Services.sendExtraCareCoupon({ couponSeqNumber: seqnum })){
			//if returns successfully, change status
			var date = new Date();
			var strDateMonth = "" + (date.getMonth() + 1);
			var strDateDay = "" + date.getDate();
			if(date.getMonth() + 1 < 10){
				strDateMonth = "0" + strDateMonth;
			}
			if(date.getDate() < 10){
				strDateDay = "0" + strDateDay;
			}
			var dateString = strDateMonth + '/' + strDateDay + '/' +  date.getFullYear();
			this.$(".ecsendtocard").html("<div class='ecSaveSentCard'>Sent to ExtraCare Card " + dateString + "</div>");
			this.$(".ecprint").hide();
		}
		return false;
	},
	printoffer: function(){
		//call service
		var seqnum = this.model.get("sn");
		if(CVSJS.Promo.Services.printExtraCareCoupon({ couponSeqNumber: seqnum })){
			//if returns successfully, change status and open window
			window.open("/weeklyad/common/ec_print_coupon.jsp?ec=" + seqnum,"_blank")
			var date = new Date();
			var strDateMonth = "" + (date.getMonth() + 1);
			var strDateDay = "" + date.getDate();
			if(date.getMonth() + 1 < 10){
				strDateMonth = "0" + strDateMonth;
			}
			if(date.getDate() < 10){
				strDateDay = "0" + strDateDay;
			}
			var dateString = strDateMonth + '/' + strDateDay + '/' +  date.getFullYear();
			var currentStatus = this.$(".ecprint").html();
			if(currentStatus.indexOf("Printed") > 0){
				currentStatus = currentStatus.substring(0,currentStatus.indexOf("Printed"));
			}
			this.$(".ecprint").html("<span class='ecprintstatus'>" + currentStatus + "</span><span class='ecprinted'>Printed on " + dateString + "</span>" );
		}
		return false;
	}
});

CVSJS.Promo.vSlider = Backbone.View.extend({
	scrollLeftPosition: 0,

	events: {
		'click .left-button ': 'doLeftClick',
		'click .right-button': 'doRightClick'
	},

	initialize: function() {
		CVSJS.Promo.Events.on('slider:contentloaded', this.fixArrows, this);
		CVSJS.Promo.Events.on('slider:refresh', this.scrollTo, this);

		this.$('.item-container').animate({
			scrollLeft: 0
		}, 400);
	},

	getMaxScrollPosition: function($container) {
		return $container[0].scrollWidth - $container[0].clientWidth;
	},

	getWidthOfOneChild: function() {
		return this.$('.item-container').children()[0].clientWidth;
	},

	getWidthOfContainer: function() {
		return this.$('.item-container').width() - 100;
	},

	doLeftClick: function(ev) {
		var $items = this.$('.item-container'),
			$scroller = $($items[0]);

		this.scrollLeftPosition -= this.getWidthOfContainer();
		// this.scrollLeftPosition -= this.getWidthOfOneChild();
		if (this.scrollLeftPosition <= 0) {
			this.scrollLeftPosition = 0;
			this.hideLeftButton();
		}

		this.maxWidth = this.getMaxScrollPosition($items);
		if (this.scrollLeftPosition < this.maxWidth) {
			this.showRightButton();
		}

		$scroller.animate({
			scrollLeft: this.scrollLeftPosition
		}, 400);
	},

	doRightClick: function(ev) {
		var $scroller = this.$('.item-container');

		this.scrollLeftPosition += this.getWidthOfContainer();
		// this.scrollLeftPosition += this.getWidthOfOneChild();
		this.maxWidth = this.getMaxScrollPosition($scroller);
		if (this.scrollLeftPosition > this.maxWidth) {
			this.scrollLeftPosition = this.maxWidth;
			this.hideRightButton();
		}

//		var futureSlide = this.getWidthOfContainer() + this.scrollLeftPosition;
//		if (futureSlide > this.maxWidth) {
//			this.hideRightButton();
//		}

		$scroller.animate({
			scrollLeft: this.scrollLeftPosition
		}, 400);

		this.showLeftButton();
	},

	fixArrows: function() {
		var $scroller = this.$('.item-container');
		this.maxWidth = this.getMaxScrollPosition($scroller);

		if ($('body').data('is-mobile')) {
			this.hideButtons();
			return;
		}
		this.showButtons();

		if (this.maxWidth < 7) { //this really should be this.maxWidth === 0 but since there's padding on the right of 6 pixels, fix it
			this.hideButtons();
		} else if (this.scrollLeftPosition <= 0) {
			this.hideLeftButton();
		} else if (this.scrollLeftPosition >= this.maxWidth) {
			this.hideRightButton();
		}
	},

	scrollTo: function() {
		var $scroller = this.$('.item-container'),
			position = $scroller.data('scrollLeft') || 0;

		this.scrollLeftPosition = position; //scrollLeftPosition needs to stay updated
		$scroller.scrollLeft(this.scrollLeftPosition);
		this.fixArrows();
	},

	hideLeftButton: function(ev) {
		this.$('.left-button').hide();
		this.showArrow();
	},
	showLeftButton: function(ev) {
		this.$('.left-button').show();
		this.hideArrow();
	},
	hideRightButton: function(ev) {
		this.$('.right-button').hide();
	},
	showRightButton: function(ev) {
		this.$('.right-button').show();
	},
	hideButtons: function(ev) {
		this.$('.left-button').hide();
		this.$('.right-button').hide();
	},
	showButtons: function(ev) {
		this.$('.left-button').show();
		this.$('.right-button').show();
	},
	hideArrow: function(ev){
		this.$el.parent().find('.arrow-right').hide();
	},
	showArrow: function(ev) {
		this.$el.parent().find('.arrow-right').show();
	}
});

//------------------- BROWSE PAGE - CATEGORY SECTION ITEM

CVSJS.Promo.vCategorySectionItem = Backbone.View.extend({
	tagName: "div",
	attributes: { "class": "categorycont category-block browse-page" },
	initialize: function () {
		this.template = CVSJS.Promo.TemplateCache.get("#tmplCategorySection");
		this.isRendered = false;
		this.renderempty();
	},
	renderempty: function () {
		var renderedTemplate = this.template({ item: this.model.toJSON(), count: this.options.count });
		this.$el.html( renderedTemplate );
		this.$el.attr("id", "catID-" + this.model.get('id'));
		var adEmptyBlockList = new CVSJS.Promo.vCategoryBlockList({ el: this.$el.find(".blocklist"), arrContainers: this.model.get("cc") }).renderempty();
		return this;
	},
	render: function() {
		var view = this;
		CVSJS.Promo.Services.getCategoryAdBlocks( { navgrpid: view.model.id }, function( adBlockData ){
			var adBlockList = new CVSJS.Promo.vCategoryBlockList({ collection: new CVSJS.Promo.cAdBlocks( adBlockData ), el: view.$el.find(".blocklist"), catnavtype: view.model.get("nt") }).render();
		});
		this.isRendered = true;
	}
});

//------------------- BROWSE PAGE - CATEGORY SECTION BLOCK LIST

CVSJS.Promo.vCategoryBlockList = Backbone.View.extend({
	initialize: function () {
	},

	renderempty: function() {
		var view = this, els = [];
		if(view.options.arrContainers){
			var arrContainers = view.options.arrContainers.split('|');
			var arrContainersIndex = 1;
			var totalBlocks = arrContainers[0];
			var containerBreakPoint = -1;
			if(arrContainers[arrContainersIndex]){
				containerBreakPoint = arrContainers[arrContainersIndex];
			}
			for(var idx=1; idx <= totalBlocks; idx++){
				els.push( "<div class='adblockcont'><div class='blockloading'>Loading...</div></div>" );
				if(idx == containerBreakPoint+1){
					arrContainersIndex += 1;
					if(arrContainers[arrContainersIndex]){
						containerBreakPoint = containerBreakPoint + arrContainers[arrContainersIndex];
					}else{
						containerBreakPoint = -1;
					}
				}
			}
		}
		view.$el.html( els );
	},

	render: function () {

		var view = this, els = [], adBlock, currentEBLinkNum = "0", currentBlockNum = "0", currentSONum = "0", lastEBLinkNum = "0", lastSONum = "0", continueInsertNewLines = false, blockcolor = "";
		if(this.options.leaderblockmodel) {
			var leaderBlockModelChangedAttributes = this.options.leaderblockmodel.changedAttributes();
			this.$el.parent().attr("style", "background:url('"+leaderBlockModelChangedAttributes.gradient1+"');");
		}

		view.collection.each( function( block ) {
			if(view.options.catnavtype !== "3"){
				currentEBLinkNum = block.get("en");
				currentBlockNum = block.get("bn");
				currentSONum = block.get("so");

				if(currentEBLinkNum === currentBlockNum && currentSONum === "0"){
					//Leader Block
					if(block && block.get("lb") && block.get("lb")[0]){
						blockcolor = CVSJS.Promo.Defaults.imagePath + "/gradient/" + block.get("lb")[0] + ".jpg";
					}
				}else if(lastEBLinkNum != currentEBLinkNum && lastSONum !== "0" && currentSONum !== "0"){
					//New container without Leader Block
					blockcolor = "";
				}
			}

			if(block.get("so") === "0"){
				adBlock = new CVSJS.Promo.vLeaderBlock({ model: block, createAnchor: view.options.createAnchors, bgcolor: blockcolor });
				els.push( adBlock.el );
			}else{
				adBlock = new CVSJS.Promo.vAdBlock({ model: block, bgcolor: blockcolor });
				els.push( adBlock.el );
			}

			if(lastEBLinkNum !== currentEBLinkNum){
				lastEBLinkNum = currentEBLinkNum;
			}

			lastSONum = currentSONum;
		});
		view.$el.html( els );
		CVSJS.Promo.Helper.lazyLoadImages(view.$el);
		return this;
	}
});


//------------------- BROWSE PAGE - CATEGORY SECTION INDIVIDUAL AD BLOCK

CVSJS.Promo.vLeaderBlock = Backbone.View.extend({
	tagName: "div",
	attributes: { "class": "adblockcont LeaderBlock" },
	mobileTextInserted: false,

	initialize: function () {
		this.render();

		CVSJS.Promo.Events.on('is-mobile', _.bind(this.changeLeaderBlocks, this));
		CVSJS.Promo.Events.on('is-desktop', _.bind(this.changeLeaderBlocks, this));
	},

	render: function() {
		//this.$el.attr("style", "background-image: url(\'" + this.options.bgcolor + "\')");
		var currModel = this.model;
		var imgURL = CVSJS.Promo.Defaults.noImageAvailableLarge;

		if(currModel.get("in")){
			imgURL = CVSJS.Promo.Defaults.imagePath + "/blk/" + currModel.get("ad") + "/leader/" + currModel.get("in") + ".jpg";
		}
		currModel.set("imgURL", imgURL);

		var currentEBLinkNum = currModel.get('en');
		if (currentEBLinkNum !== '0') {
			this.$el.attr('id', 'en-' + currentEBLinkNum);
		}

		var arrGradient = [];
		if(currModel.get("lb") && currModel.get("lb")[0]){
			arrGradient = currModel.get("lb");
			currModel.set("gradient1", CVSJS.Promo.Defaults.imagePath + "/gradient/" + arrGradient[0] + ".jpg");
		}

		this.template = CVSJS.Promo.TemplateCache.get("#tmplLeaderBlock");
		var renderedTemplate = this.template({ item: currModel.toJSON() });
		this.$el.html( renderedTemplate );

		if(this.options.createAnchor){
			this.$el.find("div").eq(0).attr("id","containerID-" + currModel.get("en"));
		}

		return this;
	},

	changeLeaderBlocks: function() {
		if ($('body').data('is-mobile')) {
			this.$('.mobile-text').show();
			this.$('.imgAd').hide();
		} else {
			this.$('.mobile-text').hide();
			this.$('.imgAd').show();
		}
	}
});

//------------------- BROWSE PAGE - CATEGORY SECTION INDIVIDUAL AD BLOCK

CVSJS.Promo.vAdBlock = Backbone.View.extend({
	tagName: "div",
	attributes: { "class": "adblockcont" },
	initialize: function () {
		this.render();
	},
	render: function() {
		var currModel = this.model;

		this.$el.attr("style", "background-image: url(\'" + this.options.bgcolor + "\')");

		var imgURL = CVSJS.Promo.Defaults.noImageAvailableMedium;

		if(currModel.get("in") && currModel.get("sn")){
			imgURL = CVSJS.Promo.Defaults.imagePath + "/sku/large/" + currModel.get("in") + ".png";
		}else if(currModel.get("in")){
			imgURL = CVSJS.Promo.Defaults.imagePath + "/blk/" + currModel.get("ad") + "/medium/" + currModel.get("in") + ".png";
		}
		currModel.set("imgURL", imgURL);

		this.template = CVSJS.Promo.TemplateCache.get("#tmplAdBlock");
		var renderedTemplate = this.template({ item: currModel.toJSON() });
		this.$el.html( renderedTemplate );

		//Build the banner model & view
		var bannerTemplate = currModel.get("t2");
		if(bannerTemplate){
			var gradient1Path = "";
			var gradient2Path = "";
			if(bannerTemplate[5]){
				gradient1Path = CVSJS.Promo.Defaults.imagePath + "/gradient/" + bannerTemplate[5] + ".jpg"
			}
			if(bannerTemplate[6]){
				gradient2Path = CVSJS.Promo.Defaults.imagePath + "/gradient/" + bannerTemplate[6] + ".jpg"
			}
			var bannerTemplateValue = CVSJS.Promo.Helper.formatDecimalValue(bannerTemplate[1],bannerTemplate[0]);
			var bannerTemplateValue2 = "";
			if(bannerTemplate[0] == "EBQ1" || bannerTemplate[0] == "EBQ2" || bannerTemplate[0] == "EBQ3" || bannerTemplate[0] == "EBEQ1" || bannerTemplate[0] == "EBEQ2" || bannerTemplate[0] == "EBEQ3"){
				bannerTemplateValue2 = "&nbsp;" + bannerTemplate[2];
			}else{
				bannerTemplateValue2 = "&nbsp;" + CVSJS.Promo.Helper.formatDecimalValuePlain(bannerTemplate[2],bannerTemplate[0]);
			}
			//var adBlockBannerMod = new CVSJS.Promo.mAdBlockBanner({ type: bannerTemplate[0], v1: bannerTemplateValue, fontcolor1: bannerTemplate[2], fontcolor2: bannerTemplate[3], gradient1: gradient1Path, gradient2: gradient2Path });
			var adBlockBannerMod = new CVSJS.Promo.mAdBlockBanner({ type: bannerTemplate[0], v1: bannerTemplateValue, v2: bannerTemplateValue2, fontcolor1: bannerTemplate[3], fontcolor2: bannerTemplate[4], gradient1: gradient1Path, gradient2: gradient2Path });
			var adBlockBanner = new CVSJS.Promo.vAdBlockBanner({ model: adBlockBannerMod, el: this.$el.find(".banner") });
		}

		//If badge template is RETL2  and banner Template id is not null, do not show the badge
		//Build the badge model & view
		var badgeComponents = currModel.get("t1");
		var showBadge = true;
		if(badgeComponents && badgeComponents[0] == "RETL2" && bannerTemplate && (typeof bannerTemplate[0] != "undefined" && bannerTemplate[0] != "" && bannerTemplate[0] != null)){
			showBadge = false;
		}
		if(badgeComponents && badgeComponents[0] && showBadge){
			//Construct the Badge model
			var adBlockBadgeMod = CVSJS.Promo.Helper.buildBadgeModel(badgeComponents);
			//Construct the Badge view
			var adBlockBadge = new CVSJS.Promo.vAdBlockBadge({ model: adBlockBadgeMod, el: this.$el.find(".badge") });
		}

		var isModelInShoppingList = false;

		if(currModel.get("sn")){
			if(CVSJS.Helper.URLContains("issneakpeek=true")){
				isModelInShoppingList = (CVSJS.Promo.mySneakPeekListColl.findWhere({sk : parseInt(currModel.get("sn"),10) }) || CVSJS.Promo.mySneakPeekListColl.findWhere({sn : parseInt(currModel.get("sn"),10) }));
			}else{
				isModelInShoppingList = (CVSJS.Promo.myShoppingListColl.findWhere({sk : parseInt(currModel.get("sn"),10) }) || CVSJS.Promo.myShoppingListColl.findWhere({sn : parseInt(currModel.get("sn"),10) }));
			}

			if (isModelInShoppingList) {
				this.model.set("gi", isModelInShoppingList.get("gi"));
				this.$('.btnAddtoList').addClass('hidden').removeClass('show');
				this.$('.btnAddedtoList').removeClass('hidden').addClass('show');
				this.$('.aRemoveFromList').removeClass('hidden').addClass('show');

				CVSJS.Promo.Helper.showAddedtoList(false, currModel.get("sn"));
			}
		}else{
			if(CVSJS.Helper.URLContains("issneakpeek=true")){
				isModelInShoppingList = CVSJS.Promo.mySneakPeekListColl.findWhere({vb : currModel.get("vb"), st : 1 }) || CVSJS.Promo.mySneakPeekListColl.findWhere({vb : currModel.get("vb"), ad : currModel.get("ad") });
			}else{
				isModelInShoppingList = CVSJS.Promo.myShoppingListColl.findWhere({vb : currModel.get("vb"), st : 1 }) || CVSJS.Promo.myShoppingListColl.findWhere({vb : currModel.get("vb"), ad : currModel.get("ad") });
			}
		}


		if(isModelInShoppingList){
			if( !(isModelInShoppingList.get("sn")) || !(isModelInShoppingList.get("sk"))) {
				this.model.set("gi", isModelInShoppingList.get("gi"));
				this.$('.btnAddtoList').addClass('hidden').removeClass('show');
				this.$('.btnAddedtoList').removeClass('hidden').addClass('show');
				this.$('.aRemoveFromList').removeClass('hidden').addClass('show');

				CVSJS.Promo.Helper.showAddedtoList(currModel.get("vb"), false);
			}
		}

		return this;
	},
	events: {
		"click .btnAddtoList" : "addlist",
		"click .btnAddedtoList" : "added",
		"click .aRemoveFromList": "deleteitem",
		"click .dealdetailsmorelink": 'storeScrollPosition'
	},
	addlist: function(e){
		var currModel = this.model;
//		CVSJS.Promo.Globals.shoppingListCache[+currModel.get('bn')] = CVSJS.Promo.Defaults.sectionName;

		if(currModel.get("sn")){
			var giftItemId = CVSJS.Promo.Services.addItemToShoppingList( { Id : currModel.get("sn"), type : "0", qt : "1", eventId : CVSJS.Header.Details.ei } )
			if ( giftItemId ) {
				this.model.set("sk", currModel.get("sn"));
				this.model.set("gi", giftItemId);

				if(CVSJS.Helper.URLContains("issneakpeek=true")){
					CVSJS.Promo.mySneakPeekListColl.add(this.model);
				}else{
					CVSJS.Promo.myShoppingListColl.add(this.model);
				}

				this.$('.btnAddtoList').addClass('hidden').removeClass('show');
				this.$('.btnAddedtoList').removeClass('hidden').addClass('show');
				this.$('.aRemoveFromList').removeClass('hidden').addClass('show');

				//$("#dPgPrevPurchases").find("#sku-" + currModel.get("sn") + " td:nth-child(5)").find(".addList").removeClass("secondaryR addList").addClass("added").html("Added to List");

				$("#dPgPrevPurchases").find("#sku-" + currModel.get("sn") ).find(".addList").addClass('hidden').removeClass('show');
				$("#dPgPrevPurchases").find("#sku-" + currModel.get("sn") ).find(".btnAddedtoList").removeClass('hidden').addClass('show');
				$("#dPgPrevPurchases").find("#sku-" + currModel.get("sn") ).find(".aRemoveFromList").removeClass('hidden').addClass('show');

				CVSJS.Promo.Helper.showAddedtoList(false, currModel.get("sn"));
			}
		}else{
			var giftItemId = CVSJS.Promo.Services.addItemToShoppingList( { Id : currModel.get("bn"), version : currModel.get("vb"), type : "1", qt : "1", eventId : CVSJS.Header.Details.ei, eventDate : currModel.get("ad") } );
			if (giftItemId) {
				this.model.set("gi", giftItemId);
				if(CVSJS.Helper.URLContains("issneakpeek=true")){
					CVSJS.Promo.mySneakPeekListColl.add(this.model);
				}else{
					CVSJS.Promo.myShoppingListColl.add(this.model);
				}

				this.$('.btnAddtoList').addClass('hidden').removeClass('show');
				this.$('.btnAddedtoList').removeClass('hidden').addClass('show');
				this.$('.aRemoveFromList').removeClass('hidden').addClass('show');

				CVSJS.Promo.Helper.showAddedtoList(currModel.get("vb"), false);
			}
		}

		return false;
	},
	deleteitem: function(){
		var currModel = this.model;

		var isModelInShoppingList = false;

		var sNumber = (currModel.get("sn")) ? currModel.get("sn") : currModel.get("sk");


		if(sNumber) {

			if(CVSJS.Helper.URLContains("issneakpeek=true")){
				isModelInShoppingList = (CVSJS.Promo.mySneakPeekListColl.findWhere({sk : sNumber }) || CVSJS.Promo.mySneakPeekListColl.findWhere({sn : sNumber }));
			}else{
				isModelInShoppingList = (CVSJS.Promo.myShoppingListColl.findWhere({sk : sNumber }) || CVSJS.Promo.myShoppingListColl.findWhere({sn : sNumber }));
			}


			if(!isModelInShoppingList) {
				if(CVSJS.Helper.URLContains("issneakpeek=true")){
					isModelInShoppingList = (CVSJS.Promo.mySneakPeekListColl.findWhere({sk : parseInt(sNumber,10) }) || CVSJS.Promo.mySneakPeekListColl.findWhere({sn : parseInt(sNumber,10) }));
				}else{
					isModelInShoppingList = (CVSJS.Promo.myShoppingListColl.findWhere({sk : parseInt(sNumber,10) }) || CVSJS.Promo.myShoppingListColl.findWhere({sn : parseInt(sNumber,10) }));
				}
			}


			if (isModelInShoppingList) {
				var giftId = isModelInShoppingList.get("gi");
				currModel.set("gi", isModelInShoppingList.get("gi"));


				if(CVSJS.Helper.URLContains("issneakpeek=true")){
					if(CVSJS.Promo.Services.deleteItemFromSneakPeekList({ gi: giftId })){
						var sneakPeekListItem = CVSJS.Promo.mySneakPeekListColl.findWhere({gi: giftId});
						CVSJS.Promo.mySneakPeekListColl.remove(sneakPeekListItem);
					}
				} else {
					if(CVSJS.Promo.Services.deleteItemFromShoppingList({ gi: giftId })){
						var shoppingListItem = CVSJS.Promo.myShoppingListColl.findWhere({gi: giftId});
						CVSJS.Promo.myShoppingListColl.remove(shoppingListItem);
					}
				}


				this.$('.addList').removeClass('hidden').addClass('show');
				this.$('.btnAddedtoList').addClass('hidden').removeClass('show');
				this.$('.aRemoveFromList').addClass('hidden').removeClass('show');

				$("#dPgPrevPurchases").find("#sku-" + sNumber ).find(".addList").removeClass('hidden').addClass('show');
		 		$("#dPgPrevPurchases").find("#sku-" + sNumber ).find(".btnAddedtoList").addClass('hidden').removeClass('show');
		 		$("#dPgPrevPurchases").find("#sku-" + sNumber ).find(".aRemoveFromList").addClass('hidden').removeClass('show');

		 		CVSJS.Promo.Helper.showAddtoList(false, sNumber);
			}

		} else {

			if(CVSJS.Helper.URLContains("issneakpeek=true")){
				isModelInShoppingList = ( CVSJS.Promo.mySneakPeekListColl.where({vb : currModel.get("vb") }) );
				// If there is 2 of the same vb it was removing the incorrect vb. This finds a vb without an SN or SK.
				var modelObject = _.filter(isModelInShoppingList, function(isModelInShoppingList) {
					if("sk" in isModelInShoppingList.attributes || "sn" in isModelInShoppingList.attributes) {
					} else {
						return isModelInShoppingList;
					}
				});

			}else{
				isModelInShoppingList = CVSJS.Promo.myShoppingListColl.where({vb : currModel.get("vb") });
				// If there is 2 of the same vb it was removing the incorrect vb. This finds a vb without an SN or SK.
				var modelObject = _.filter(isModelInShoppingList, function(isModelInShoppingList) {
					if("sk" in isModelInShoppingList.attributes || "sn" in isModelInShoppingList.attributes) {
					} else {
						return isModelInShoppingList;
					}
				});
			}
			giftId = modelObject[0].attributes.gi;

			if (isModelInShoppingList) {
				var giftId = modelObject[0].attributes.gi;
				currModel.set("gi", giftId);


				if(CVSJS.Helper.URLContains("issneakpeek=true")){
					if(CVSJS.Promo.Services.deleteItemFromSneakPeekList({ gi: giftId })){
						var sneakPeekListItem = CVSJS.Promo.mySneakPeekListColl.findWhere({gi: giftId});
						CVSJS.Promo.mySneakPeekListColl.remove(sneakPeekListItem);
					}
				} else {
					if(CVSJS.Promo.Services.deleteItemFromShoppingList({ gi: giftId })){
						var shoppingListItem = CVSJS.Promo.myShoppingListColl.findWhere({gi: giftId});
						CVSJS.Promo.myShoppingListColl.remove(shoppingListItem);
					}
				}

				this.$('.addList').removeClass('hidden').addClass('show');
				this.$('.btnAddedtoList').addClass('hidden').removeClass('show');
				this.$('.aRemoveFromList').addClass('hidden').removeClass('show');

				CVSJS.Promo.Helper.showAddtoList(currModel.get("vb"), false);
			}
		}
		return false;

	},
	added: function(e) {
		return false;
	},

	storeScrollPosition: function() {
		CVSJS.Promo.Defaults.browsePageScrollPosition = $(window).scrollTop();

		//store scroll position for the slider
		this.$el.parents('.item-container').data('scrollLeft', this.$el.parents('.item-container').scrollLeft());
	}
});

//------------------- BROWSE PAGE - CATEGORY SECTION INDIVIDUAL AD BLOCK BADGE

CVSJS.Promo.vAdBlockBadge = Backbone.View.extend({
	tagName: "div",
	attributes: { "class": "dTeardropContainer" },
	initialize: function () {
		this.template = CVSJS.Promo.TemplateCache.get("#tmplBadge" + this.model.get("type"));
		this.render();
	},
	render: function() {
		if(this.model.get("type") == "BAGB1"){
			var renderedTemplate = this.template();
			this.$el.html( renderedTemplate );
			this.$el.addClass(this.model.get("type"));
		}else{
			var v1 = this.model.get("v1");
			if(this.template && v1 && v1[0]){
				var renderedTemplate = this.template({ item: this.model.toJSON() });
				this.$el.html( renderedTemplate );
				this.$el.addClass(this.model.get("type"));
			}
		}

		return this;
	}
});

//------------------- BROWSE PAGE - CATEGORY SECTION INDIVIDUAL AD BLOCK BANNER

CVSJS.Promo.vAdBlockBanner = Backbone.View.extend({
	tagName: "div",
	attributes: { "class": "dBannerContainer" },
	initialize: function () {
		this.template = CVSJS.Promo.TemplateCache.get("#tmplBrowseBanner" + this.model.get("type"));
		this.render();
	},
	render: function() {
		var v1 = this.model.get("v1");
		if(this.template && v1 && v1 != ""){
			var renderedTemplate = this.template({ item: this.model.toJSON() });
			this.$el.html( renderedTemplate );
			this.$el.addClass(this.model.get("type"));
		}

		return this;
	}
});

//------------------- DETAIL PAGE

//View for the home page content below the navigation
CVSJS.Promo.vDetail = Backbone.View.extend({
	el: "#dPgDetail",
	initialize: function () {
		this.template = CVSJS.Promo.TemplateCache.get("#tmplPageDetail");
		this.render();
	},
	render: function () {
		this.$el.html( this.template() );
		CVSJS.Promo.myAdBlockDetailsModel = this.model;
		this.$("#sEventDate").html(this.model.get("ad"));
		CVSJS.Promo.detailMainBlock = new CVSJS.Promo.vDetailMain({ model: this.model });
		CVSJS.Promo.detailSKUBlockList = new CVSJS.Promo.vDetailSKUBlockList({ collection: new CVSJS.Promo.cSKUListItems(this.model.get("sku")), sotdata: this.model.get("t1") });

		_.defer(function(){
			//Adjusting the height of the main block so that all the sku blocks line up nicely
			var mainBlock = $("#dealdetail-wrap .dmblock");
			var skuBlock = $("#dealdetail-wrap .dsblock");
			var mainBlockHeight = mainBlock.innerHeight();
			var skuBlockHeight = skuBlock.innerHeight();
			var skuBlockBorderWidth = parseInt(skuBlock.css('margin-bottom'),10)-1;
			if( mainBlockHeight >= 334 && (mainBlockHeight % skuBlockHeight) > 0){
				var blockIncrements = Math.floor(mainBlockHeight / skuBlockHeight) + 1;
				$(".deal-info").css("height",(blockIncrements * (skuBlockHeight + skuBlockBorderWidth)) + "px");
			}
		});

		return this;
	},
	events: {
		"click .catFilter" : "openfilteroverlay"
	},
	openfilteroverlay: function(ev){
		ev.preventDefault();
		CVSJS.Promo.filterByCategoryOverlay = new CVSJS.Promo.vFilterByCategoryOverlay(ev.target);
	}

});

//View for the details of main adblock
CVSJS.Promo.vDetailMain = Backbone.View.extend({
	el: "#dMainBlock",
	initialize: function () {
		this.template = CVSJS.Promo.TemplateCache.get("#tmplDetailMainBlock");
		this.render();
	},
	render: function () {
		var currModel = this.model;

		if(currModel.get("in")){
			currModel.set("imgURL", CVSJS.Promo.Defaults.imagePath + "/blk/" + currModel.get("ed") + "/large/" + currModel.get("in") + ".png");
		}else{
			currModel.set("imgURL", CVSJS.Promo.Defaults.noImageAvailableLarge);
		}

		var showECButton = false;
		if(currModel.get("ec") && currModel.get("ec") != "00" && currModel.get("ec") != "1"){
			showECButton = true;
		}

		//Build the long description model & view
		var descType = currModel.get("t1");
		var descTemplateId;
		if(descType){
			descTemplateId = descType[0];
			if(descType && descType[0] && (descTemplateId.indexOf("BAGB") < 0 || (descTemplateId.indexOf("RETL2") >= 0 && currModel.get("t2") && currModel.get("t2")[0]))){
				var descMod = CVSJS.Promo.Helper.buildDescModel(descType);
				var descTemplate = CVSJS.Promo.TemplateCache.get("#tmplDetailDesc" + descTemplateId);
				currModel.set("sl", descTemplate({ item: descMod.toJSON() }));
			}
		}

		var renderedTemplate = this.template({ item: currModel.toJSON() });
		this.$el.append( renderedTemplate );

		//Build the banner model & view
		var bannerTemplate = currModel.get("t2");

		if(bannerTemplate){
			var gradient1Path = "";
			var gradient2Path = "";
			if(bannerTemplate[2]){
				gradient1Path = CVSJS.Promo.Defaults.imagePath + "/gradient/" + bannerTemplate[2] + ".jpg"
			}
			if(bannerTemplate[3]){
				gradient2Path = CVSJS.Promo.Defaults.imagePath + "/gradient/" + bannerTemplate[3] + ".jpg"
			}
			var adBlockBannerMod = new CVSJS.Promo.mAdBlockBanner({ v1: bannerTemplate[0], fontcolor: bannerTemplate[1], gradient1: gradient1Path, gradient2: gradient2Path });
			var adBlockBanner = new CVSJS.Promo.vMainBlockBanner({ model: adBlockBannerMod, eblinknum: currModel.get("en"), showMoreECSavingsButton: showECButton });
		}

		if(CVSJS.Header.Details.pt && CVSJS.Header.Details.pt === 1){
			//Disable performance testing items by not inserting them in the page
		}else{
			var fbTmpl = CVSJS.Promo.TemplateCache.get("#tmplFacebookDetailMainBlock");
			if(CVSJS.Helper.URLContains("issneakpeek=true")){
				this.$(".dDealDetailsFB").html(fbTmpl({ item: currModel.toJSON(), sneakpeekparm: "%3Fissneakpeek%3Dtrue" }));
			}else{
				this.$(".dDealDetailsFB").html(fbTmpl({ item: currModel.toJSON(), sneakpeekparm: "" }));
			}


		}

		return this;
	},
	events: {
		"click #btnDealRestrictions" : "showspecificdisclaimer"
	},
	showspecificdisclaimer: function(ev){
		var disclaimerOverlay = new CVSJS.Promo.vSpecificDisclaimerOverlay(ev.target);
		return false;
	}
});


//------------------- BROWSE PAGE - CATEGORY SECTION INDIVIDUAL AD BLOCK BANNER

CVSJS.Promo.vMainBlockBanner = Backbone.View.extend({
	el: "#dDetailMainBanner",
	attributes: { "class": "dBannerContainer" },
	initialize: function () {
		this.template = CVSJS.Promo.TemplateCache.get("#tmplDetailMainBanner");
		this.render();
	},
	render: function() {
		var currModel = this.model;

		var renderedTemplate = this.template({ item: currModel.toJSON() });
		this.$el.html( renderedTemplate );
		if(!this.options.showMoreECSavingsButton){
			this.$(".extrabucksnavigate").hide();
		}
		return this;
	},
	events: {
		"click .extrabucksnavigate" : "gotobrowseextrabucks"
	},
	gotobrowseextrabucks: function(e){
		//@QUICK-FIND
		CVSJS.Promo.ebNavigate = "#en-" + this.options.eblinknum + '.LeaderBlock';
		CVSJS.Promo.blockNum = location.hash.substring(location.hash.lastIndexOf('/') + 1);
		CVSJS.Promo.appRouter.navigate("ExtraCare", {trigger: true});

		return false;
	}
});

CVSJS.Promo.vDetailSKUBlockList = Backbone.View.extend({
	el: "#dSKUBlockList",
	initialize: function () {
		this.render();
	},
	render: function () {
		var currView = this;
		if(currView.collection.length > 0){
			this.$el.empty();
			var els = [];
			var skuBlock;
			currView.collection.each( function( item ) {
				skuBlock = new CVSJS.Promo.vDetailSKUBlock({ model: item, sotdata: currView.options.sotdata });
				els.push( skuBlock.el );
			});
			currView.$el.html( els );
		}

		return currView;
	},
	renderempty: function () {
		return this;
	}
});

CVSJS.Promo.vDetailSKUBlock = Backbone.View.extend({
	tagName: "div",
	attributes: { "class": "dblock dsblock" },
	initialize: function () {
		this.template = CVSJS.Promo.TemplateCache.get("#tmplDetailSKUBlock");
		this.render();
	},
	render: function () {

		var currModel = this.model;

		//Build the long description model & view
		var descType = this.options.sotdata;
		var descTemplateId;
		if(descType){
			descTemplateId = descType[0];
			if(descType && descType[0] && (descTemplateId.indexOf("BAGB") < 0 && descTemplateId.indexOf("RETL2") < 0)){
				var descMod = CVSJS.Promo.Helper.buildDescModel(descType);
				var descTemplate = CVSJS.Promo.TemplateCache.get("#tmplDetailDesc" + descTemplateId);
				currModel.set("od", descTemplate({ item: descMod.toJSON() }));
			}
		}

		var imgURL = CVSJS.Promo.Defaults.noImageAvailableSmall;

		if(currModel.get("in")){
			imgURL = CVSJS.Promo.Defaults.imagePath + "/sku/small/" + currModel.get("in") + ".png";
		}
		currModel.set("imgURL", imgURL);

		if(currModel.get("sd")){
			var skudesc = currModel.get("sd");
			//trim the string
			if(skudesc && skudesc.length > 70){
				skudesc = skudesc.substring(0,69) + "...";
			}
			//set
			currModel.set("sd", skudesc);
		}

		var renderedTemplate = this.template({ item: currModel.toJSON() });
		this.$el.html( renderedTemplate );
		var isModelInShoppingList = false;
		//have to parseInt because ShoppingList services returns them as integers
		if(currModel.get("sn")){
			if(CVSJS.Helper.URLContains("issneakpeek=true")){
				isModelInShoppingList = (CVSJS.Promo.mySneakPeekListColl.findWhere({sk : parseInt(currModel.get("sn"),10) }) || CVSJS.Promo.mySneakPeekListColl.findWhere({sn : currModel.get("sn") }));
			}else{
				isModelInShoppingList = (CVSJS.Promo.myShoppingListColl.findWhere({sk : parseInt(currModel.get("sn"),10) }) || CVSJS.Promo.myShoppingListColl.findWhere({sn : currModel.get("sn") }));
			}

			if (isModelInShoppingList) {
				this.model.set("gi", isModelInShoppingList.get("gi"));
				this.$('.btnAddtoList').addClass('hidden').removeClass('show');
				this.$('.btnAddedtoList').removeClass('hidden').addClass('show');
				this.$('.aRemoveFromList').removeClass('hidden').addClass('show');
			}
		}

		return this;
	},
	events: {
		"click .btnAddtoList" : "addlist",
		"click .btnAddedtoList" : "added",
		"click .aRemoveFromList": "deleteitem"
	},
	addlist: function(e){
		var currModel = this.model;

		if(currModel.get("sn")){
			var giftItemId = CVSJS.Promo.Services.addItemToShoppingList( { Id : this.model.get("sn"), version : CVSJS.Promo.pageDetail.model.get("vb"), type : "0", qt : "1", eventId : CVSJS.Header.Details.ei } );
			if ( giftItemId ) {
				this.model.set("sk", currModel.get("sn"));
				this.model.set("gi", giftItemId);

				if(CVSJS.Helper.URLContains("issneakpeek=true")){
					CVSJS.Promo.mySneakPeekListColl.add(this.model);
				}else{
					CVSJS.Promo.myShoppingListColl.add(this.model);
				}


				this.$('.btnAddtoList').addClass('hidden').removeClass('show');
				this.$('.btnAddedtoList').removeClass('hidden').addClass('show');
				this.$('.aRemoveFromList').removeClass('hidden').addClass('show');


				$("#dPgPrevPurchases").find("#sku-" + currModel.get("sn") ).find(".addList").addClass('hidden').removeClass('show');
				$("#dPgPrevPurchases").find("#sku-" + currModel.get("sn") ).find(".btnAddedtoList").removeClass('hidden').addClass('show');
				$("#dPgPrevPurchases").find("#sku-" + currModel.get("sn") ).find(".aRemoveFromList").removeClass('hidden').addClass('show');

				CVSJS.Promo.Helper.showAddedtoList(false, currModel.get("sn"));
			}
		}

		return false;
	},
	deleteitem: function(){
		var currModel = this.model;

		var isModelInShoppingList = false;

		var sNumber = (currModel.get("sn")) ? currModel.get("sn") : currModel.get("sk");

		if(sNumber) {

			if(CVSJS.Helper.URLContains("issneakpeek=true")){
				isModelInShoppingList = (CVSJS.Promo.mySneakPeekListColl.findWhere({sk : sNumber }) || CVSJS.Promo.mySneakPeekListColl.findWhere({sn : sNumber }));
			}else{
				isModelInShoppingList = (CVSJS.Promo.myShoppingListColl.findWhere({sk : sNumber }) || CVSJS.Promo.myShoppingListColl.findWhere({sn : sNumber }));
			}

			if(!isModelInShoppingList) {
				if(CVSJS.Helper.URLContains("issneakpeek=true")){
					isModelInShoppingList = (CVSJS.Promo.mySneakPeekListColl.findWhere({sk : parseInt(sNumber,10) }) || CVSJS.Promo.mySneakPeekListColl.findWhere({sn : parseInt(sNumber,10) }));
				}else{
					isModelInShoppingList = (CVSJS.Promo.myShoppingListColl.findWhere({sk : parseInt(sNumber,10) }) || CVSJS.Promo.myShoppingListColl.findWhere({sn : parseInt(sNumber,10) }));
				}
			}

			if (isModelInShoppingList) {
				var giftId = isModelInShoppingList.get("gi");
				currModel.set("gi", isModelInShoppingList.get("gi"));


				if(CVSJS.Helper.URLContains("issneakpeek=true")){
					if(CVSJS.Promo.Services.deleteItemFromSneakPeekList({ gi: giftId })){
						var sneakPeekListItem = CVSJS.Promo.mySneakPeekListColl.findWhere({gi: giftId});
						CVSJS.Promo.mySneakPeekListColl.remove(sneakPeekListItem);
					}
				} else {
					if(CVSJS.Promo.Services.deleteItemFromShoppingList({ gi: giftId })){
						var shoppingListItem = CVSJS.Promo.myShoppingListColl.findWhere({gi: giftId});
						CVSJS.Promo.myShoppingListColl.remove(shoppingListItem);
					}
				}

				this.$('.btnAddtoList').removeClass('hidden').addClass('show');
				this.$('.btnAddedtoList').addClass('hidden').removeClass('show');
				this.$('.aRemoveFromList').addClass('hidden').removeClass('show');

				$("#dPgPrevPurchases").find("#sku-" + sNumber ).find(".addList").removeClass('hidden').addClass('show');
		 		$("#dPgPrevPurchases").find("#sku-" + sNumber ).find(".btnAddedtoList").addClass('hidden').removeClass('show');
		 		$("#dPgPrevPurchases").find("#sku-" + sNumber ).find(".aRemoveFromList").addClass('hidden').removeClass('show');

		 		CVSJS.Promo.Helper.showAddtoList(false, sNumber);
		 	}

		} else {

			if(CVSJS.Helper.URLContains("issneakpeek=true")){
				isModelInShoppingList = CVSJS.Promo.mySneakPeekListColl.findWhere({vb : currModel.get("vb") });
			}else{
				isModelInShoppingList = CVSJS.Promo.myShoppingListColl.findWhere({vb : currModel.get("vb") });
			}

			if (isModelInShoppingList) {
				var giftId = isModelInShoppingList.get("gi");
				currModel.set("gi", isModelInShoppingList.get("gi"));


				if(CVSJS.Helper.URLContains("issneakpeek=true")){
					if(CVSJS.Promo.Services.deleteItemFromSneakPeekList({ gi: giftId })){
						var sneakPeekListItem = CVSJS.Promo.mySneakPeekListColl.findWhere({gi: giftId});
						CVSJS.Promo.mySneakPeekListColl.remove(sneakPeekListItem);
					}
				} else {
					if(CVSJS.Promo.Services.deleteItemFromShoppingList({ gi: giftId })){
						var shoppingListItem = CVSJS.Promo.myShoppingListColl.findWhere({gi: giftId});
						CVSJS.Promo.myShoppingListColl.remove(shoppingListItem);
					}
				}

				this.$('.btnAddtoList').removeClass('hidden').addClass('show');
				this.$('.btnAddedtoList').addClass('hidden').removeClass('show');
				this.$('.aRemoveFromList').addClass('hidden').removeClass('show');

				CVSJS.Promo.Helper.showAddtoList(currModel.get("vb"), false);
			}
		}
		return false;
	},
	added: function(e) {
		return false;
	}
});

//Desktop overlay to filter by category
CVSJS.Promo.vFilterByCategoryOverlay = Backbone.View.extend({
	el: CVSJS.OverlayCont,
	initialize: function ( evElem ) {
		this.template = CVSJS.Promo.TemplateCache.get("#tmplFilterByCategoryOverlay");
		this.render( evElem );
	},
	render: function( evElem ) {
		var currView = this;
		showOverlay($(evElem), function(){}, function(){
			currView.undelegateEvents();
		});

		var renderedTemplate = currView.template();
		currView.$el.html( renderedTemplate );

		var tempHTML = "<option value=''>All Categories</option>";

		if(CVSJS.Promo.Data.blockdetails && CVSJS.Promo.Data.blockdetails.fc){
			var arrCategories = CVSJS.Promo.Data.blockdetails.fc;
			var arrCategoryNames = [];

			$.each(arrCategories, function(index, objCategory) {
				$.each(objCategory, function(catName, arrSubCategories) {
					arrCategoryNames.push(catName);
				});
			});

			arrCategoryNames.sort();

			$.each(arrCategoryNames, function(index, catName) {
				tempHTML += "<option value='" + catName + "'>" + catName + "</option>";
			});
		}

		currView.$("#iselCategory").append(tempHTML);

		currView.buildsubcategories("");

		return currView;
	},
	events: {
		"click #btnSubmit" : "filterskus",
		"change #iselCategory" : "categorychanged"
	},
	filterskus: function(){
		CVSJS.Promo.Session.keepAlive();
		var selectedCategory = this.$("#iselCategory").find(":selected").val();
		var selectedSubCategory = this.$("#iselSubCategory").find(":selected").val();
		var arrOriginalSKUs = CVSJS.Promo.myAdBlockDetailsModel.get("sku");
		var arrFilteredSKUs = "";

		if(selectedSubCategory){
			arrFilteredSKUs = _.filter(arrOriginalSKUs, function(sku) {
				  return sku.sw === selectedSubCategory;
			});

			CVSJS.Promo.detailSKUBlockList.collection = new CVSJS.Promo.cSKUListItems(arrFilteredSKUs);
		}else if(selectedCategory){
			arrFilteredSKUs = _.filter(arrOriginalSKUs, function(sku) {
				  return sku.cw === selectedCategory;
			});

			CVSJS.Promo.detailSKUBlockList.collection = new CVSJS.Promo.cSKUListItems(arrFilteredSKUs);
		}else{
			CVSJS.Promo.detailSKUBlockList.collection = new CVSJS.Promo.cSKUListItems(arrOriginalSKUs);
		}

		CVSJS.Promo.detailSKUBlockList.render();

		$("#overlayClose").trigger("click");
		$("#closeSlideout").trigger("click");
		CVSJS.Promo.Helper.lazyLoadImages($("#dPgDetail"));
	},
	categorychanged: function(ev){
		CVSJS.Promo.Session.keepAlive();
		var selectedCategory = $(ev.target).find(":selected").val();
		//selectedCategory = selectedCategory.replace('&','&amp;');
		selectedCategory = selectedCategory.replace(unescape('%AE'),'&reg;');
		selectedCategory = selectedCategory.replace(unescape('%A9'),'&copy;');
		selectedCategory = selectedCategory.replace(unescape('%u2122'),'&trade;');
		this.buildsubcategories(selectedCategory)
	},
	buildsubcategories: function(selectedCategory){
		var tempHTML = "<option value=''>All Subcategories</option>";

		var arrCategories = CVSJS.Promo.Data.blockdetails.fc;
		var arrSubCategoryNames = [];

		$.each(arrCategories, function(x, objCategory) {
			if(selectedCategory && objCategory[selectedCategory]){
				arrSubCategoryNames = objCategory[selectedCategory];
			}
		});

		arrSubCategoryNames.sort();

		$.each(arrSubCategoryNames, function(y, subCategoryName){
			tempHTML += "<option value='" + subCategoryName + "'>" + subCategoryName + "</option>";
		})

		$("#iselSubCategory").html(tempHTML);
	}
});

//------------------- SHOPPING LIST PAGE

//View for the shopping list
CVSJS.Promo.vShoppingList = Backbone.View.extend({
	el: "#dPgShoppingList",
	initialize: function () {
		this.template = CVSJS.Promo.TemplateCache.get("#tmplPageShoppingList");
		this.render();
	},
	render: function () {
		this.$el.html( this.template() );

		CVSJS.Promo.shoppingListTable = new CVSJS.Promo.vShoppingListTable({collection: CVSJS.Promo.myShoppingListColl});
		CVSJS.Promo.shoppingListTable.render(true);

		CVSJS.Promo.spListTable = new CVSJS.Promo.vSneakPeekListTable({collection: CVSJS.Promo.mySneakPeekListColl});
		CVSJS.Promo.spListTable.render(true);

		//For remembered or logged in users
		//For Ec Cookied User
		if(CVSJS.Header.Flags.userIsEcOptedIn())
		{
		//Display EC List alone
			CVSJS.Promo.ecListTable = new CVSJS.Promo.vShoppingListExtraCareTable({collection: CVSJS.Promo.myShopListExtraCareListColl});
			CVSJS.Promo.ecListTable.render();
		}
		else if( CVSJS.Header.Flags.userIsSignedIn() ){
			CVSJS.Promo.notesListTable = new CVSJS.Promo.vNotesListTable({collection: CVSJS.Promo.myNotesListColl});
			CVSJS.Promo.notesListTable.render();

			CVSJS.Promo.ecListTable = new CVSJS.Promo.vShoppingListExtraCareTable({collection: CVSJS.Promo.myShopListExtraCareListColl});
			CVSJS.Promo.ecListTable.render();
		}else if( CVSJS.Header.Flags.userIsCookied() ){
			CVSJS.Promo.notesListTable = new CVSJS.Promo.vNotesListTable();
			CVSJS.Promo.notesListTable.render();

			CVSJS.Promo.ecListTable = new CVSJS.Promo.vShoppingListExtraCareTable();
			CVSJS.Promo.ecListTable.render();
		}
	},
	events: {
		"click #aClearAll" : "clearlist"
	},
	clearlist: function(ev){
		CVSJS.Promo.Session.keepAlive();
		CVSJS.Promo.clearAllOverlay = new CVSJS.Promo.vClearAllOverlay(ev.target);
		return false;
	}
});

//Desktop overlay to email the shopping list
CVSJS.Promo.vEmailShoppingListOverlay = Backbone.View.extend({
	el: CVSJS.OverlayCont,
	initialize: function ( evElem ) {
		this.template = CVSJS.Promo.TemplateCache.get("#tmplEmailShoppingListOverlay");
		this.render( evElem );
	},
	render: function( evElem ) {
		showOverlay($(evElem), function(){});
		var renderedTemplate = this.template();
		this.$el.html( renderedTemplate );

		Recaptcha.create($("#dRecaptchaLoc").attr("data-key"), "recaptchaLoc", {
            theme: "custom",
            custom_theme_widget: 'recaptcha_widget',
            callback: Recaptcha.focus_response_field
       });

		return this;
	},
	events: {
		"click #btnSend" : "emaillist"
	},
	emaillist: function(){
		var inputEmail = $.trim($("#emailShoppingListAddr").val());
		var inputCaptcha = $('#recaptcha_response_field').val();
		var captchaChallenge=$('#recaptcha_challenge_field').val();
		var validateEmail = function(email){
			var re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
			//' So this doesn't mess up syntax highlighting '
		    return re.test(email);
		}

		if(validateEmail(inputEmail)){
			if(CVSJS.Promo.Services.emailShoppingList({ email: inputEmail, captcha: inputCaptcha, challenge: captchaChallenge })){
				this.undelegateEvents();
				$("#overlayClose").click();
				$("#closeSlideout").click();
			}
		}
	}
});

//Desktop overlay to link an extracare card
CVSJS.Promo.vLinkExtraCareCardOverlay = Backbone.View.extend({
	el: CVSJS.OverlayCont,
	initialize: function ( evElem ) {
		this.template = CVSJS.Promo.TemplateCache.get("#tmplLinkExtraCareOverlay");
		this.render( evElem );
	},
	render: function( evElem ) {
		showOverlay($(evElem), function(){});
		var renderedTemplate = this.template();
		this.$el.html( renderedTemplate );
		return this;
	},
	events: {
		"click #btnContinue" : "gotoextracare"
	},
	gotoextracare: function(){
		CVSJS.Helper.redirect(CVSJS.Promo.URL.attacheccard);
	}
});


//Desktop overlay to confirm clear all
CVSJS.Promo.vClearAllOverlay = Backbone.View.extend({
	el: CVSJS.OverlayCont,
	initialize: function ( evElem ) {
		this.template = CVSJS.Promo.TemplateCache.get("#tmplClearAllOverlay");
		this.render( evElem );
	},
	render: function( evElem ) {
		showOverlay($(evElem), function(){});
		var renderedTemplate = this.template();
		this.$el.html( renderedTemplate );
		return this;
	},
	events: {
		"click #btnClearList" : "clearall",
		"click #btnClearCancel" : "cancelclearall"
	},
	clearall: function(){
		if(CVSJS.Promo.Services.deleteAllFromShoppingList()){
			//Get new data, reset collections, and render page
			CVSJS.Promo.Services.getShoppingList();

			//Initialize collections
			CVSJS.Promo.myShoppingListColl.reset(CVSJS.Promo.Data.shoppinglist);
			CVSJS.Promo.mySneakPeekListColl.reset(CVSJS.Promo.Data.sneakpeek);
			CVSJS.Promo.myNotesListColl.reset(CVSJS.Promo.Data.notes);

			CVSJS.Promo.pageShoppingList.render();

			CVSJS.Promo.Events.trigger("shoppinglistchanged");

			$("#dPgPrevPurchases").find(".addList").removeClass('hidden').addClass('show');
			$("#dPgPrevPurchases").find(".btnAddedtoList").addClass('hidden').removeClass('show');
			$("#dPgPrevPurchases").find(".aRemoveFromList").addClass('hidden').removeClass('show');

			$("#dPgBrowse a.btnAddtoList").removeClass('hidden').addClass('show');
			$("#dPgBrowse a.btnAddedtoList").addClass('hidden').removeClass('show');
			$("#dPgBrowse a.aRemoveFromList").addClass('hidden').removeClass('show');

			this.undelegateEvents();
			$("#overlayClose").trigger("click");
			$("#closeSlideout").trigger("click");
		}
	},
	cancelclearall: function(){
		CVSJS.Promo.Session.keepAlive();
		$("#overlayClose").trigger("click");
		$("#closeSlideout").trigger("click");
	}
});

//------------------- SHOPPING LIST CONTENT

//View for an individual row/item in the shopping list table
CVSJS.Promo.vShoppingListRow = Backbone.View.extend({
	tagName: "tr",
	initialize: function () {
		this.template = CVSJS.Promo.TemplateCache.get("#tmplShoppingListRow");
		this.render(true);
	},
	render: function() {
		var currModel = this.model;
		if(currModel){
			var imgURL = CVSJS.Promo.Defaults.noImageAvailableSmall;
			var imgPath = currModel.get("ip");

			if(imgPath && imgPath.indexOf('/') >= 0){
				imgURL = CVSJS.Promo.Defaults.imagePath + "/blk/" + imgPath;
			}else if(imgPath){
				imgURL = CVSJS.Promo.Defaults.imagePath + "/sku/small/" + imgPath + ".png";
			}

			currModel.set("imgURL", imgURL);

			if(this.options.adjustModelData){
				//Adjusting the offer description based on offer type
				currModel = CVSJS.Promo.Helper.adjustSaleOfferTypeColumnData(currModel);
			}

			var renderedTemplate = this.template({ item: currModel.toJSON() });
			this.$el.html( renderedTemplate );

			//Now render the quantity drop down field
			var renderedInputTemplate = CVSJS.Promo.TemplateCache.get("#tmplSelectQty");
			this.$el.find(".selectCol").append( renderedInputTemplate );
			this.$el.find(".qtyinput").prop('selectedIndex', currModel.get("qt")-1);
		}
		return this;
	},
	events: {
		"click .deleteicon" : "deleteitem",
		"change .qtyinput" : "updateqty",
		'click .spShopListOfferDetailsLink': 'doDealDetailsClick'
	},
	deleteitem: function(){
		var currModel = this.model;
		if(CVSJS.Promo.Services.deleteItemFromShoppingList({ gi: currModel.get("gi") })){
			if(currModel.get("sk")) {
				$("#dPgPrevPurchases").find("#sku-" + currModel.get("sk") ).find(".addList").removeClass('hidden').addClass('show');
				$("#dPgPrevPurchases").find("#sku-" + currModel.get("sk") ).find(".btnAddedtoList").addClass('hidden').removeClass('show');
				$("#dPgPrevPurchases").find("#sku-" + currModel.get("sk") ).find(".aRemoveFromList").addClass('hidden').removeClass('show');

				CVSJS.Promo.Helper.showAddtoList(false, currModel.get("sk"));
			} else {
				CVSJS.Promo.Helper.showAddtoList(currModel.get("vb"), false);
			}

			CVSJS.Promo.myShoppingListColl.remove(currModel);
			this.remove();

			if(CVSJS.Promo.myShoppingListColl.length === 0){
				CVSJS.Promo.shoppingListTable.renderempty();
			}
		}
		return false;

	},
	updateqty: function(ev){
		if(CVSJS.Promo.Services.updateItemQtyInShoppingList({ gi: this.model.get("gi"), qt: parseInt($(ev.target).find(":selected").text()) })){
			this.model.set("qt", $(ev.target).find(":selected").text());
		}
		return false;
	},

	doDealDetailsClick: function() {
		CVSJS.Promo.Globals.fromShoppingList = true;
	}
});

//View for the list of items in the shopping list page
CVSJS.Promo.vShoppingListTable = Backbone.View.extend({
	el: "#dShoppingList",
	initialize: function () {
		this.template = CVSJS.Promo.TemplateCache.get("#tmplShoppingListTable");
	},
	render: function(adjustSOTData) {
		this.$el.html( this.template() );

		if(this.collection.length > 0){
			var els = [];
			this.collection.each( function( item ) {
				var shopListRow = new CVSJS.Promo.vShoppingListRow({ model: item, adjustModelData: adjustSOTData });
				els.push( shopListRow.el );
			});
			this.$("#tblShoppingList").append( els );
		}else{
			this.renderempty();
		}

		var $aisleheader = this.$("#thSLAisle");
		if(this.collection.sortdirection === "asc"){
			$aisleheader.addClass('asc');
			$aisleheader.removeClass('desc');
		}else{
			$aisleheader.removeClass('asc');
			$aisleheader.addClass('desc');
		}
		return this;
	},
	events: {
		"click #thSLAisle" : "sortbyaisle"
	},
	renderempty: function(){
		this.$("#tblShoppingList").append( CVSJS.Promo.TemplateCache.get("#tmplShoppingListRowNoItems") );
	},
	sortbyaisle: function(e){
		CVSJS.Promo.Session.keepAlive();
		if(this.collection.sortdirection === "desc"){
			this.collection.sort();
			this.collection.sortdirection = "asc";
		}else{
			this.collection.sort();
			this.collection.models.reverse();
			this.collection.sortdirection = "desc";
		}
		this.render(false);
	}
});

//View for an individual row in the notes list table
CVSJS.Promo.vNotesListRow = Backbone.View.extend({
	tagName: "tr",
	initialize: function () {
		//If the data for this model changes, the view re-renders
		this.listenTo(this.model, 'change', this.render);
		this.template = CVSJS.Promo.TemplateCache.get("#tmplNotesListRow");
		this.render();
	},
	render: function() {
		var renderedTemplate = this.template({ note: this.model.toJSON() });
		this.$el.html( renderedTemplate );
		return this;
	},
	events: {
		"click .deleteicon" : "deleteitem",
		"click .editnotelink" : "edit",
		"click .savenotelink" : "save"
	},
	deleteitem: function(){
		if(CVSJS.Promo.Services.deleteItemFromNotesList({ gi: this.model.get("gi"), type: 2 })){
			CVSJS.Promo.myNotesListColl.remove(this.model);
			this.remove();
		}
		return false;
	},
	edit: function(){
		CVSJS.Promo.Session.keepAlive();
		//apply the edit row template instead to the row, allows for editing
		var editTemplate = CVSJS.Promo.TemplateCache.get("#tmplNotesListRowEdit");
		var renderedTemplate = editTemplate({ note: this.model.toJSON() });
		this.$el.empty().append( renderedTemplate );
		this.$input = this.$('.notestextfield');
		this.$input.focus();
		return false;
	},
	save: function(){
		if(CVSJS.Promo.Services.editItemInNotesList({ gi: this.model.get("gi"), note: this.$input.val() })){
			this.model.set("nt", this.$input.val());
			this.render();
		}
		return false;
	}
});

//View for an individual row in the notes list table in add mode
CVSJS.Promo.vNotesListRowAdd = Backbone.View.extend({
	tagName: "tr",
	initialize: function () {
		this.template = CVSJS.Promo.TemplateCache.get("#tmplNotesListRowAdd");
		this.render();
	},
	render: function() {
		var renderedTemplate = this.template();
		this.$el.empty().append( renderedTemplate );
		this.$input = this.$('.notestextfield');
		this.$input.focus();
		return this;
	},
	events: {
		"click .deleteicon" : "deleteitem",
		"click .savenewnotelink" : "save",
		"keypress .notestextfield"  : "saveonenter",
	},
	deleteitem: function(){
		CVSJS.Promo.Session.keepAlive();
		if(CVSJS.Promo.myNotesListColl.length === 0){
			CVSJS.Promo.notesListTable.render();
		}else{
			//Using prepend so it appears above all the existing rows
			CVSJS.Promo.notesListTable.addNotesRowOpen = false;
			this.remove();
		}
	},
	save: function(){
		if(this.$input.val() !== "" && this.$input.val().length <= 256){
			var noteText = this.$input.val();
			noteText = noteText.replace("(","");
			noteText = noteText.replace(")","");
			noteText = noteText.replace("<","");
			noteText = noteText.replace(">","");
			noteText = noteText.replace("/","");
			noteText = noteText.replace("\"","");

			var d = new Date();
			var newid = d.getTime();

			var giftId = CVSJS.Promo.Services.addItemToNotesList({ note: noteText, type: 2 });
			if(giftId){
				//Create a new model for the note and start populating it's data
				var newNote = new CVSJS.Promo.mNotesItem({
					id: "" + newid,
					gi: giftId,
					nt: noteText
				});

				CVSJS.Promo.myNotesListColl.add(newNote);
				CVSJS.Promo.notesListTable.render();
			} else {
				//Show some error
				this.remove();
			}
		} else {
			//Throw some error
			this.remove();
		}

		return false;
	},
	saveonenter: function(ev) {
		if (ev.keyCode === 13) {
			this.save();
		}
	}
});

//View for the list of notes in the notes list
CVSJS.Promo.vNotesListTable = Backbone.View.extend({
	el: "#dNotesList",
	initialize: function () {
		if(this.collection){
			//This view listens for the add or remove event on the collection and then re-renders itself
			this.listenTo(this.collection, "remove", this.render);
			this.listenTo(this.collection, "add", this.render);
		}

		this.template = CVSJS.Promo.TemplateCache.get("#tmplNotesListTable");
	},
	render: function() {
		this.addNotesRowOpen = false;
		//Add the template to the rendered el
		this.$el.html( this.template() );

		if(CVSJS.Header.Flags.userIsCookied()){
			this.$("a.addnotelink").text("Sign In to See Notes");
		}

		if(this.collection){
			var els = [];
			if(this.collection.length > 0){
				this.collection.each( function( note ) {
					var noteRow = new CVSJS.Promo.vNotesListRow({ model: note });
					els.push( noteRow.el );
				});
				this.$("#tblNotesList").append( els );
			}else{
				this.renderempty();
			}
		}
		return this;
	},
	events: {
		"click .addnotelink" : "add"
	},
	add: function(){
		if(CVSJS.Header.Flags.userIsSignedIn()){
			if(!this.addNotesRowOpen){
				var newNoteRow = new CVSJS.Promo.vNotesListRowAdd();

				if(this.collection.length === 0){
					this.$("#tblNotesList").html( newNoteRow.el );
				}else{
					//Using prepend so it appears above all the existing rows
					this.$("#tblNotesList").prepend( newNoteRow.el );
					this.addNotesRowOpen = true;
				}
			}
		}else{
			$("#signInOverlayNotesAdd").click(); //modal to login or create acct
		}

		return false;
	},
	renderempty: function(){
		this.addNotesRowOpen = false;
		this.$("#tblNotesList").append( CVSJS.Promo.TemplateCache.get("#tmplNotesListRowNoItems") );
	}
});


//------------------- EXTRA CARE LIST CONTENT

//View for an individual row/item in the extra care list table
CVSJS.Promo.vShoppingListExtraCareTableRow = Backbone.View.extend({
	tagName: "tr",
	initialize: function () {
		this.template = CVSJS.Promo.TemplateCache.get("#tmplShoppingListExtraCareTableRow");
		this.render();
	},
	render: function() {
		var renderedTemplate = this.template({ item: this.model.toJSON() });
		this.$el.html( renderedTemplate );
		return this;
	}
});

//View for the list of items in the extra care list
CVSJS.Promo.vShoppingListExtraCareTable = Backbone.View.extend({
	el: "#dExtraCareList",
	initialize: function () {
		this.template = CVSJS.Promo.TemplateCache.get("#tmplShoppingListExtraCare");
	},
	render: function() {
		//Add the template to the rendered el
		this.$el.html( this.template() );

		//Added to show EC Saing & rewards for EC cookie
		if(CVSJS.Header.Flags.userIsEcOptedIn()){
			this.$("#tblExtraCareList").append(CVSJS.Promo.TemplateCache.get("#tmplShoppingListExtraCareTableHead"));

			if(this.collection && this.collection.length > 0){
				var els = [];
				this.collection.each( function( item ) {
					//Each item is built up into an array which is then appended to the DOM
					var ecListRow = new CVSJS.Promo.vShoppingListExtraCareTableRow({ model: item });
					els.push( ecListRow.el );
				});

				this.$("#tblExtraCareList").append( els );
			}else{
				this.renderempty();
			}
		}
		else
			{

		//Added to show Ec sign in link for cookied user
		if(CVSJS.Header.Flags.userIsCookied()){
			$('#aSignInEc').show();
		}else{
			$('#aSignInEc').hide();
		}
		// SMP () CR #ENH03785 code changes - start
		//Display previous purchase information to cookied user also
		if(CVSJS.Header.Flags.userIsSignedIn() || CVSJS.Header.Flags.userIsCookied()){
		// SMP () CR #ENH03785 code changes - end
			this.$("#tblExtraCareList").append(CVSJS.Promo.TemplateCache.get("#tmplShoppingListExtraCareTableHead"));

			if(this.collection && this.collection.length > 0){
				var els = [];
				this.collection.each( function( item ) {
					//Each item is built up into an array which is then appended to the DOM
					var ecListRow = new CVSJS.Promo.vShoppingListExtraCareTableRow({ model: item });
					els.push( ecListRow.el );
				});

				this.$("#tblExtraCareList").append( els );
			}else{
				this.renderempty();
			}
		}

			}

		return this;
	},
	events: {
		"click #aSignInEc" : "signinEc"
	},
	signinEc: function(ev){
		if(CVSJS.Header.Flags.userIsCookied()){
			$("#signInOverlayEcOffers").click(); //modal to login to see offers
		}
		return false;
	},
	renderempty: function(){
		this.$("#tblExtraCareList").append( CVSJS.Promo.TemplateCache.get("#tmplShoppingListExtraCareTableRowNoItems") );
	}
});


//------------------- CONTENT - SNEAK PEEK LIST

//View for an individual row/item in the sneak peek list table
CVSJS.Promo.vSneakPeekListRow = Backbone.View.extend({
	tagName: "tr",
	initialize: function () {
		this.template = CVSJS.Promo.TemplateCache.get("#tmplSneakPeekListRow");
		this.render();
	},
	render: function() {
		var currModel = this.model;
		if(currModel){
			var imgURL = CVSJS.Promo.Defaults.noImageAvailableSmall;
			var imgPath = currModel.get("ip");

			if(imgPath && imgPath.indexOf('/') >= 0){
				imgURL = CVSJS.Promo.Defaults.imagePath + "/blk/" + imgPath;
			}else if(imgPath){
				imgURL = CVSJS.Promo.Defaults.imagePath + "/sku/small/" + imgPath + ".png";
			}

			currModel.set("imgURL", imgURL);

			if(this.options.adjustModelData){
				//Adjusting the offer description based on offer type
				currModel = CVSJS.Promo.Helper.adjustSaleOfferTypeColumnData(currModel);
			}

			var renderedTemplate = this.template({ item: currModel.toJSON() });
			this.$el.append( renderedTemplate );

			//Now render the quantity drop down field
			var renderedInputTemplate = CVSJS.Promo.TemplateCache.get("#tmplSelectQty");
			this.$el.find(".selectCol").append(renderedInputTemplate);
			this.$el.find(".qtyinput").prop('selectedIndex', currModel.get("qt")-1);
		}
		return this;
	},
	events: {
		"click .deleteicon" : "deleteitem",
		"change .qtyinput" : "updateqty"
	},
	deleteitem: function(){
		var currModel = this.model;

		if(CVSJS.Promo.Services.deleteItemFromSneakPeekList({ gi: currModel.get("gi") })){
			CVSJS.Promo.mySneakPeekListColl.remove(currModel);

			if(CVSJS.Promo.mySneakPeekListColl.length === 0){
				CVSJS.Promo.spListTable.renderempty();
			}


			var sNum = (currModel.get("sn")) ? currModel.get("sn") : currModel.get("sk");
			if(sNum) {
				CVSJS.Promo.Helper.showAddtoList(false, sNum);
				$("#dPgPrevPurchases").find("#sku-" + sNum ).find(".addList").removeClass('hidden').addClass('show');
				$("#dPgPrevPurchases").find("#sku-" + sNum ).find(".btnAddedtoList").addClass('hidden').removeClass('show');
				$("#dPgPrevPurchases").find("#sku-" + sNum ).find(".aRemoveFromList").addClass('hidden').removeClass('show');
			} else {
				CVSJS.Promo.Helper.showAddtoList(currModel.get("vb"), false);
			}

			this.remove();
		}

		return false;
	},
	updateqty: function(ev){
		if(CVSJS.Promo.Services.updateItemQtyInSneakPeekList({ gi: this.model.get("gi"), qt: parseInt($(ev.target).find(":selected").text()) })){
			this.model.set("qt", $(ev.target).find(":selected").text());
		}
		return false;
	}
});

//View for the list of items in the sneak peek list
CVSJS.Promo.vSneakPeekListTable = Backbone.View.extend({
	el: "#dSneakPeekList",
	initialize: function () {
		this.template = CVSJS.Promo.TemplateCache.get("#tmplSneakPeekListTable");
	},
	events: {
		"click #thSPAisle" : "sortbyaisle"
	},
	render: function(adjustSOTData) {
		this.$el.html( this.template() );

		if(this.collection.length > 0){
			var els = [];
			this.collection.each( function( item ) {
				var spListRow = new CVSJS.Promo.vSneakPeekListRow({ model: item, adjustModelData: adjustSOTData });
				els.push( spListRow.el );
			});
			this.$("#tblSneakPeekList").append( els );
		}
		else {
			this.renderempty();
		}

		var $aisleheader = this.$("#thSPAisle");
		if(this.collection.sortdirection === "asc"){
			$aisleheader.addClass('asc');
			$aisleheader.removeClass('desc');
		}else{
			$aisleheader.removeClass('asc');
			$aisleheader.addClass('desc');
		}

		return this;
	},
	renderempty: function(){
		this.$("#tblSneakPeekList").append( CVSJS.Promo.TemplateCache.get("#tmplSneakPeekListRowNoItems") );
	},
	sortbyaisle: function(e){
		CVSJS.Promo.Session.keepAlive();
		if(this.collection.sortdirection === "desc"){
			this.collection.sort();
			this.collection.sortdirection = "asc";
		}else{
			this.collection.sort();
			this.collection.models.reverse();
			this.collection.sortdirection = "desc";
		}
		this.render(false);
	}
});

//------------------- PREVIOUS PURCHASES PAGE

//View for the shopping list
CVSJS.Promo.vPrevPurchases = Backbone.View.extend({
	el: "#dPgPrevPurchases",
	initialize: function () {
		this.template = CVSJS.Promo.TemplateCache.get("#tmplPagePrevPurchases");
		this.render();
	},
	events: {
		"change #filter-date-prev-purchases": "updateContent",
		"change #filter-category-prev-purchases": "updateContent",
		"change #filter-itemcount-prev-purchases": "updateContent"
	},
	render: function () {
		//Add the template to el
		this.$el.html( this.template() );

		// if we have previous purchase to show...show 'em!
		if (CVSJS.Promo.myPrevPurchasesOriginalColl != null) {

			// sort the collection
			CVSJS.Promo.myPrevPurchasesOriginalColl.sort();

			// update the pager params
			CVSJS.Promo.Defaults.pagerParams.totalItems = CVSJS.Promo.myPrevPurchasesOriginalColl.length;

			//Creating a view for the shopping list table
			CVSJS.Promo.prevPurchasesTable = new CVSJS.Promo.vPrevPurchasesTable();
			CVSJS.Promo.prevPurchasesTable.render();

			var renderedFilterDateTemplate = CVSJS.Promo.TemplateCache.get("#tmplFilterDatePrevPurchases");
			this.$el.find("#dFilterPrevPurchases").append(renderedFilterDateTemplate);

			var renderedFilterCategoryTemplate = CVSJS.Promo.TemplateCache.get("#tmplFilterCategoryPrevPurchases");
			this.$el.find("#dFilterPrevPurchases").append(renderedFilterCategoryTemplate);

			var renderedFilterItemcountTemplate = CVSJS.Promo.TemplateCache.get("#tmplFilterItemcountPrevPurchases");
			this.$el.find("#dFilterPrevPurchases").append(renderedFilterItemcountTemplate);

			// build the categories filter dropdown list
			CVSJS.Promo.vPrevPurchasesFilter.LoadDates();

			// build the categories filter dropdown list
			CVSJS.Promo.vPrevPurchasesFilter.LoadCategories(CVSJS.Promo.myPrevPurchasesOriginalColl);

			// build the paginator
			CVSJS.Promo.prevPurchasesPager = new CVSJS.Promo.vPager({el: $('#dPagerPrevPurchases, #dPagerBottomPrevPurchases'), collection: CVSJS.Promo.myPrevPurchasesOriginalColl});

		}
		else { // otherwise...toss up a message to the user
			this.$el.find('.dSortBar').hide();
			this.$el.find('#dPrevPurchases').html('<div class="dPrevPurcText">Sorry, you currently have no previous purchases to show.</div>');
		}

		return this;

	},
	updateContent: function() {
		CVSJS.Promo.Defaults.pagerParams.currentPage = 1;
		CVSJS.Promo.Defaults.pagerParams.startIndex = 0;
		CVSJS.Promo.Defaults.pagerParams.itemsPerPage = parseInt($("#filter-itemcount-prev-purchases").children("option").filter(":selected").val(), 10);

		CVSJS.Promo.vPrevPurchasesFilter.UpdateContent(CVSJS.Promo.myPrevPurchasesOriginalColl);
	}
});

CVSJS.Promo.vPrevPurchasesTable = Backbone.View.extend({
	el: "#dPrevPurchases",
	initialize: function () {
		this.template = CVSJS.Promo.TemplateCache.get("#tmplPrevPurchasesTable");
	},
	render: function() {
		this.$el.html(this.template());
		CVSJS.Promo.prevPurchasesTableHeader = new CVSJS.Promo.vPrevPurchasesTableHeader();
		CVSJS.Promo.prevPurchasesTableHeader.render();
		CVSJS.Promo.prevPurchasesTableBody = new CVSJS.Promo.vPrevPurchasesTableBody({collection: CVSJS.Promo.myPrevPurchasesOriginalColl });
		CVSJS.Promo.prevPurchasesTableBody.render(true);
		return this;
	}
});

//View for the list of items in the previous purchases page
CVSJS.Promo.vPrevPurchasesTableHeader = Backbone.View.extend({
	el: "#tblPrevPurchases",
	initialize: function () {
		this.template = CVSJS.Promo.TemplateCache.get("#tmplPrevPurchasesTableHeader");
	},
	events: {
		"click #thDescription": "sortByDescription"
	},
	render: function() {
		this.$el.find('thead').append(this.template());
		this.$el.find('#thDescription').attr('class', CVSJS.Promo.Defaults.descSort);
		return this;
	},
	sortByDescription: function(e) {
		CVSJS.Promo.Session.keepAlive();
		if( $('#tblPrevPurchases').find('tr').length >2 ){
			this.$('#thDescription').toggleClass('asc desc');
			CVSJS.Promo.myPrevPurchasesSortedColl = new CVSJS.Promo.cPrevPurchasesItemsSorted(CVSJS.Promo.myPrevPurchasesFilteredColl.models.reverse());
			CVSJS.Promo.prevPurchasesTableBody = new CVSJS.Promo.vPrevPurchasesTableBody({collection: CVSJS.Promo.myPrevPurchasesSortedColl});
			CVSJS.Promo.prevPurchasesTableBody.render(false);
		}
	}
});

CVSJS.Promo.vPrevPurchasesTableBody = Backbone.View.extend({
	el: "#tblPrevPurchases",
	initialize: function () {
	},
	render: function(adjustSOTData) {
		if (this.collection != null) {
			var rows = [];
			_.each(this.collection.slice(CVSJS.Promo.Defaults.pagerParams.startIndex, CVSJS.Promo.Defaults.pagerParams.startIndex + CVSJS.Promo.Defaults.pagerParams.itemsPerPage), function(item) {
				var prevpurchasesRow = new CVSJS.Promo.vPrevPurchasesRow({ model: item, adjustModelData: adjustSOTData  });
				rows.push( prevpurchasesRow.render().el );
			});
			this.$el.find('tbody').html(rows);
		}
		else {
			$('.dSortBar .pager').hide(); // hide the filter/pagination bar
			this.$el.find('tbody').html('<tr><td colspan="5"><div class="message error">Sorry, there are no items that match your selected search parameters. Please adjust your parameters to search again.</div></td></tr>');
		}
		return this;
	}
});

//View for an individual row/item in the previous purchases table
CVSJS.Promo.vPrevPurchasesRow = Backbone.View.extend({
	tagName: "tr",
	initialize: function () {
		this.template = CVSJS.Promo.TemplateCache.get("#tmplPrevPurchasesRow");
	},
	events: {
		"click .addList": "addlist",
		"click .added": "added",
		"click .aRemoveFromList": "deleteitem"
	},
	render: function() {
		var imgURL = CVSJS.Promo.Defaults.noImageAvailableSmall;
		var currModel = this.model;

		if(currModel.get("ip")){
			imgURL = CVSJS.Promo.Defaults.imagePath + "/sku/small/" + currModel.get("ip") + ".png";
		}

		this.model.set("imgURL", imgURL);

		if(this.options.adjustModelData){
			//Adjusting the offer description based on offer type
			currModel = CVSJS.Promo.Helper.adjustSaleOfferTypeColumnData(currModel);
		}

		var renderedTemplate = this.template({ item: currModel.toJSON() });
		this.$el.attr('id', 'sku-' + currModel.attributes.sk).append(renderedTemplate);

		if (CVSJS.Promo.myShoppingListColl.length > 0) {

			var isModelInShoppingList = CVSJS.Promo.myShoppingListColl.findWhere({sk : parseInt(currModel.get("sk"), 10)}) || CVSJS.Promo.myShoppingListColl.findWhere({sn : parseInt(currModel.get("sk"), 10)});
			if (isModelInShoppingList) {
				currModel.set("gi", isModelInShoppingList.get("gi"));
				this.$el.find(".addList").addClass('hidden').removeClass('show');
				this.$el.find(".btnAddedtoList").removeClass('hidden').addClass('show');
				this.$el.find(".aRemoveFromList").removeClass('hidden').addClass('show');
			}
		}

		return this;
	},
	addlist: function(e){
		var modelSku = this.model.get("sk");

//		CVSJS.Promo.Globals.shoppingListCache['sku' + modelSku] = CVSJS.Promo.Defaults.sectionName;

		if(CVSJS.Promo.prePurchasePartColl) {
			var adBlockModelPart = (CVSJS.Promo.prePurchasePartColl.findWhere({sn : modelSku }) || CVSJS.Promo.prePurchasePartColl.findWhere({sk : modelSku }) );
		}
		if(CVSJS.Promo.prePurchaseFullColl) {
			var adBlockModelFull = (CVSJS.Promo.prePurchaseFullColl.findWhere({sn : modelSku }) || CVSJS.Promo.prePurchaseFullColl.findWhere({sk : modelSku }) );
		}

		var adBlockModel = (adBlockModelPart) ? adBlockModelPart : adBlockModelFull;

		if(adBlockModel) {
			var giftItemId = CVSJS.Promo.Services.addItemToShoppingList( { Id : modelSku, type : "0", qt : "1", eventId : CVSJS.Header.Details.ei } );
			if (giftItemId) {

				if(adBlockModelPart) {
					adBlockModelPart.set("gi", giftItemId);
				}
				if (adBlockModelFull) {
					adBlockModelFull.set("gi", giftItemId);
				}
				this.model.set("gi", giftItemId);

				if(CVSJS.Helper.URLContains("issneakpeek=true")){
					CVSJS.Promo.mySneakPeekListColl.add(this.model);
				}else{
					CVSJS.Promo.myShoppingListColl.add(this.model);
				}

				this.$('.addList').addClass('hidden').removeClass('show');
				this.$('.btnAddedtoList').removeClass('hidden').addClass('show');
				this.$('.aRemoveFromList').removeClass('hidden').addClass('show');


				CVSJS.Promo.Helper.showAddedtoList(false, modelSku);
			}

		} else {
			var giftItemId = CVSJS.Promo.Services.addItemToShoppingList( { Id : modelSku, type : "0", qt : "1", eventId : CVSJS.Header.Details.ei } );
			if (giftItemId) {
				this.model.set("sn", this.model.get("sn"));
				this.model.set("gi", giftItemId);

				if(CVSJS.Helper.URLContains("issneakpeek=true")){
					CVSJS.Promo.mySneakPeekListColl.add(this.model);
				}else{
					CVSJS.Promo.myShoppingListColl.add(this.model);
				}

				this.$('.addList').addClass('hidden').removeClass('show');
				this.$('.btnAddedtoList').removeClass('hidden').addClass('show');
				this.$('.aRemoveFromList').removeClass('hidden').addClass('show');
			}
		}

		return false;
	},
	deleteitem: function () {
		var currModel = this.model;

		var isModelInShoppingList = false;

		if(CVSJS.Helper.URLContains("issneakpeek=true")){
				isModelInShoppingList = (CVSJS.Promo.mySneakPeekListColl.findWhere({sk : currModel.attributes.sk }) || CVSJS.Promo.mySneakPeekListColl.findWhere({sn : currModel.attributes.sk }));
			}else{
				isModelInShoppingList = (CVSJS.Promo.myShoppingListColl.findWhere({sk : currModel.attributes.sk }) || CVSJS.Promo.myShoppingListColl.findWhere({sn : currModel.attributes.sk }));
			}

			if(!isModelInShoppingList) {
				if(CVSJS.Helper.URLContains("issneakpeek=true")){
					isModelInShoppingList = (CVSJS.Promo.mySneakPeekListColl.findWhere({sk : parseInt(currModel.attributes.sk,10) }) || CVSJS.Promo.mySneakPeekListColl.findWhere({sn : parseInt(currModel.attributes.sk,10) }));
				}else{
					isModelInShoppingList = (CVSJS.Promo.mySneakPeekListColl.findWhere({sk : parseInt(currModel.attributes.sk,10) }) || CVSJS.Promo.mySneakPeekListColl.findWhere({sn : parseInt(currModel.attributes.sk,10) }));
				}
			}



		if (isModelInShoppingList) {
			var giftId = isModelInShoppingList.get("gi");
			currModel.set("gi", isModelInShoppingList.get("gi"));


			if(CVSJS.Helper.URLContains("issneakpeek=true")){
				if(CVSJS.Promo.Services.deleteItemFromSneakPeekList({ gi: currModel.get("gi") })){
					var sneakPeekListItem = CVSJS.Promo.mySneakPeekListColl.findWhere({gi: giftId});
					CVSJS.Promo.mySneakPeekListColl.remove(sneakPeekListItem);
				}
			} else {
				if(CVSJS.Promo.Services.deleteItemFromShoppingList({ gi: currModel.get("gi") })){
					var shoppingListItem = CVSJS.Promo.myShoppingListColl.findWhere({gi: giftId});
					CVSJS.Promo.myShoppingListColl.remove(shoppingListItem);
				}
			}

			this.$('.addList').removeClass('hidden').addClass('show');
			this.$('.btnAddedtoList').addClass('hidden').removeClass('show');
			this.$('.aRemoveFromList').addClass('hidden').removeClass('show');
		} else {
			var giftId = currModel.get("gi");

			if(CVSJS.Helper.URLContains("issneakpeek=true")){
				if(CVSJS.Promo.Services.deleteItemFromSneakPeekList({ gi: giftId })){
					var sneakPeekListItem = CVSJS.Promo.mySneakPeekListColl.findWhere({gi: giftId});
					CVSJS.Promo.mySneakPeekListColl.remove(sneakPeekListItem);
				}
			} else {
				if(CVSJS.Promo.Services.deleteItemFromShoppingList({ gi: giftId })){
					var shoppingListItem = CVSJS.Promo.myShoppingListColl.findWhere({gi: giftId});
					CVSJS.Promo.myShoppingListColl.remove(shoppingListItem);
				}

			}


			this.$('.addList').removeClass('hidden').addClass('show');
			this.$('.btnAddedtoList').addClass('hidden').removeClass('show');
			this.$('.aRemoveFromList').addClass('hidden').removeClass('show');
		}

		CVSJS.Promo.Helper.showAddtoList(false, currModel.get("sk"));
		return false;
	},
	added: function(e) {
		return false;
	}
});


//View for the previous purchases filter
CVSJS.Promo.vPrevPurchasesFilter = {
	LoadDates: function() {
    	var newDateList = [], options = '';

		// 	loop through array and build select field options
		for (var i = 0; i<CVSJS.Promo.myPrevPurchasesDateFilterOptions.length; i++) {
			var selected = (parseInt(CVSJS.Promo.myPrevPurchasesDateFilterOptions[i].k, 10) === CVSJS.Promo.Defaults.prevPurchases.numDaysHistory) ? ' selected="selected"' : '';
			options = options + '<option value="' + CVSJS.Promo.myPrevPurchasesDateFilterOptions[i].k + '"' + selected + '>' + CVSJS.Promo.myPrevPurchasesDateFilterOptions[i].v + '</option>';
		}

		// add options to select field
		$('#filter-date-prev-purchases').html(options);
	},
	LoadCategories: function(collection) {
		if (collection != undefined) {
			var newCategoryList = [], options = '';

			options = options + '<option value="All">All Categories</option>';

			// loop through collection and build select field options
			collection.each(function(item) {
				if (item.attributes.cg instanceof Array) { // item category field is an array of categories - loop through them
					$.each(item.attributes.cg, function() {
						if (newCategoryList.indexOf(this) == -1) {
							newCategoryList.push(this);

						}
					});
				}
				else if (newCategoryList.indexOf(item.attributes.cg) == -1) {
					newCategoryList.push(item.attributes.cg);
				}
			});

			newCategoryList.sort()

			$.each(newCategoryList, function(index, catName){
				options = options + '<option value="' + catName + '">' + catName + '</option>';
			});

			// add options to select field
			$('#filter-category-prev-purchases').html(options);
		}
	},
	FilterByDate: function(collection, callback) {
		CVSJS.Promo.Session.keepAlive();
		// Wrap this function in a function to pass to a timeout.
		function doFilter() {
			// only run it if we have a collection
			if (collection != undefined) {

				// setup variables
				var filteredCollection = [];

				// get the selected values of the filter dropdown field
				var selDateVal = parseInt($("#filter-date-prev-purchases").children("option").filter(":selected").val(), 10);

			  	// fix for "all dates" option
				if (selDateVal == 'All') {
				    selDateVal = 1000;
				}

				// if the selected date is further back than the current number of days history that we have gathered...
				// hit the webservice to request the new dataset and update the original collection
				if (selDateVal > CVSJS.Promo.Defaults.prevPurchases.numDaysHistory) {
					CVSJS.Promo.Defaults.prevPurchases.numDaysHistory = selDateVal;
					CVSJS.Promo.Data.prevpurchases = CVSJS.Promo.Services.getPrevPurchases({dy: CVSJS.Promo.Defaults.prevPurchases.numDaysHistory}, function(result) {
						if (result) {
							return result;
						}
					});
					CVSJS.Promo.myPrevPurchasesOriginalColl.reset(CVSJS.Promo.Data.prevpurchases.items);
					CVSJS.Promo.myPrevPurchasesOriginalColl.sort();

					// assign the new collection dataset to the local collection var
					collection = CVSJS.Promo.myPrevPurchasesOriginalColl;

					// update the category drop-down to reflect all categories from the new collection
					CVSJS.Promo.vPrevPurchasesFilter.LoadCategories(collection);
				}

				// get the unix timestamp for cutoff date - required to do the math in next step
				var dateCutoff = new Date(CVSJS.Promo.Helper.DateCutoffInMs(selDateVal));

				collection.each(function(item) {
					if (selDateVal == 1000) { // selected value is 'all' so just push the item into the array
						filteredCollection.push(item.attributes);
					}else if (item.attributes.pd >= dateCutoff) { // selected value is a date range, so only push those within it into the array
						filteredCollection.push(item.attributes);
					}
				});

				// return the filtered collection
				return callback(true, filteredCollection);
			} else {
				return callback(false, null);
			}
		}

		// get the selected values of the filter dropdown field
		var selDateVal = parseInt($("#filter-date-prev-purchases").children("option").filter(":selected").val(), 10);

	  	// fix for "all dates" option
		if (selDateVal == 'All') {
		    selDateVal = 1000;
		}

		// if the selected date is further back than the current number of days history that we have gathered...
		// hit the webservice to request the new dataset and update the original collection
		if (selDateVal > CVSJS.Promo.Defaults.prevPurchases.numDaysHistory) {
			// Show the "Loading..." dialog.
			CVSJS.Promo.Helper.showLoadingModal();
		}

		// Call the doRender function after giving the modal time to do it's thing.
		setTimeout(function () {
			var result = doFilter();
			//console.log("got result");
			// Remove the "Loading..." dialog after the request completes.
			CVSJS.Promo.Helper.removeLoadingModal();
			//console.log("returning");
			return result;
		}, 10);
	},
	FilterByCategory: function(collection, callback) {
		CVSJS.Promo.Session.keepAlive();
		// only run it if we have a collection
		if (collection != undefined) {
			// setup variables
			var filteredCollection = [];

			// get the selected values of the filter dropdown field
			var selCategoryVal = $("#filter-category-prev-purchases").children("option").filter(":selected").val();

			//selCategoryVal = selCategoryVal.replace('&','&amp;');
			selCategoryVal = selCategoryVal.replace(unescape('%AE'),'&reg;');
			selCategoryVal = selCategoryVal.replace(unescape('%A9'),'&copy;');
			selCategoryVal = selCategoryVal.replace(unescape('%u2122'),'&trade;');

			collection.each(function(item) {
				if (selCategoryVal == 'All') { // selected value is 'all' so just push the item into the array
					filteredCollection.push(item.attributes);
				}
				else if (item.attributes.cg instanceof Array) { // item category field is an array of categories?loop through them?
					$.each(item.attributes.cg, function() {
						if (this == selCategoryVal) { // looks like we have a match?push it!
							filteredCollection.push(item.attributes);
							return false;
						}
					});
				}
				else if (item.attributes.cg == selCategoryVal) { // item category field is a string and we have a match?push it!
					filteredCollection.push(item.attributes);
				}
			});

			// return the filtered models
			return callback(true, filteredCollection);
		}
		else {
			return callback(false, null);
		}
	},
	UpdateContent: function(collection) {
		// only run it if we have a collection
		if (collection != undefined) {

			var sortedCollection = null;

			// first filter the collection by date
			CVSJS.Promo.vPrevPurchasesFilter.FilterByDate(collection, function(status, dateResults) {
				if (status) { // looks good so far, let's continue to filter by category

					// reassign the filtered collection with the new filtered models
					CVSJS.Promo.myPrevPurchasesFilteredColl.reset(dateResults);
					CVSJS.Promo.myPrevPurchasesFilteredColl.sort();

					// now filter the collection by category
					CVSJS.Promo.vPrevPurchasesFilter.FilterByCategory(CVSJS.Promo.myPrevPurchasesFilteredColl, function(status, categoryResults) {

						if (status) { // looks good to go, let's render the new table

							if (categoryResults.length === 0) {

								// update the pager params
								CVSJS.Promo.Defaults.pagerParams.totalItems = 0;

								// rebuild the paginator
								CVSJS.Promo.prevPurchasesPager = new CVSJS.Promo.vPager({el: $('#dPagerPrevPurchases, #dPagerBottomPrevPurchases'), collection: null});
								if(CVSJS.Promo.prevPurchasesTableBody){
									CVSJS.Promo.prevPurchasesTableBody.undelegateEvents();
								}
								CVSJS.Promo.prevPurchasesTableBody = new CVSJS.Promo.vPrevPurchasesTableBody({collection: null});
								CVSJS.Promo.prevPurchasesTableBody.render(true);
							}else{
								// reassign the filtered collection with the new filtered models
								CVSJS.Promo.myPrevPurchasesFilteredColl.reset(categoryResults);
								CVSJS.Promo.myPrevPurchasesFilteredColl.sort();

								if ($('#thDescription').is('.desc')) {
									sortedCollection = new CVSJS.Promo.cPrevPurchasesItemsSorted(CVSJS.Promo.myPrevPurchasesFilteredColl.models.reverse());
								}

								// update the pager params
								CVSJS.Promo.Defaults.pagerParams.totalItems = (sortedCollection) ? sortedCollection.length : CVSJS.Promo.myPrevPurchasesFilteredColl.length;

								// rebuild the paginator
								CVSJS.Promo.prevPurchasesPager.render((sortedCollection) ? sortedCollection: CVSJS.Promo.myPrevPurchasesFilteredColl);

								// rebuild the table of items
								if(CVSJS.Promo.prevPurchasesTableBody){
									CVSJS.Promo.prevPurchasesTableBody.undelegateEvents();
								}
								CVSJS.Promo.prevPurchasesTableBody = new CVSJS.Promo.vPrevPurchasesTableBody({collection: (sortedCollection) ? sortedCollection : CVSJS.Promo.myPrevPurchasesFilteredColl});
								CVSJS.Promo.prevPurchasesTableBody.render(true);
							}
						}
					});
				}
			});
		}
	}
};

//View for the pagination sections
CVSJS.Promo.vPager = Backbone.View.extend({
	initialize: function () {
		this.template = CVSJS.Promo.TemplateCache.get("#tmplPager");
		this.render();
	},
	events: {
		"click .pagelink" : "gotopage",
		"click .next-btn" : "gotonextpage",
		"click .back-btn" : "gotoprevpage"
	},
	render: function(myCollection) {

		if (this.collection == null && (myCollection == null || myCollection == undefined)) {
			this.$el.hide();
		}
		else {

			if (this.$el.is(':hidden')) {
				this.$el.show();
			}

			// setup variables
			var collection = (myCollection != null || myCollection != undefined) ? myCollection : this.collection;
			var startIndex = parseInt(CVSJS.Promo.Defaults.pagerParams.startIndex, 10);
			var itemsPerPage = parseInt(CVSJS.Promo.Defaults.pagerParams.itemsPerPage, 10);
			var totalItems = parseInt(CVSJS.Promo.Defaults.pagerParams.totalItems, 10);
			var currentPage = parseInt(CVSJS.Promo.Defaults.pagerParams.currentPage, 10);
			var pageInfo = {
				startItem: startIndex + 1,
				endItem: (startIndex + itemsPerPage > totalItems) ? totalItems : startIndex + itemsPerPage,
				totalItems: totalItems,
				totalPages: CVSJS.Promo.Helper.getTotalPages(collection, itemsPerPage),
				currentPage: currentPage
			};

			// render the template and add it to the page
			this.$el.empty();
			var renderedTemplate = this.template({pageInfo: pageInfo});
			this.$el.append( renderedTemplate );

			// build pager link listing and add it to the page
			var pagerLinkList = '';

			if (pageInfo.totalPages > 6) {
				if (pageInfo.currentPage <= 4) {
					for(var x = 1; x <= 4; x++) {
						pagerLinkList += this.getPageLinkItem(x, pageInfo.currentPage, pageInfo.totalPages);
					}
					pagerLinkList += this.getPageLinkBreak();
					pagerLinkList += this.getPageLinkItem(pageInfo.totalPages, pageInfo.currentPage, pageInfo.totalPages);
				}else if (pageInfo.currentPage >= (pageInfo.totalPages - 3)) {
					pagerLinkList += this.getPageLinkItem(1, pageInfo.currentPage, pageInfo.totalPages);
					pagerLinkList += this.getPageLinkBreak();
					for(var x = (pageInfo.totalPages - 3); x <= pageInfo.totalPages; x++) {
						pagerLinkList += this.getPageLinkItem(x, pageInfo.currentPage, pageInfo.totalPages);
					}
				}else{
					pagerLinkList += this.getPageLinkItem(1, pageInfo.currentPage, pageInfo.totalPages);
					pagerLinkList += this.getPageLinkBreak();
					for(var x = pageInfo.currentPage; x <= (pageInfo.currentPage + 2); x++) {
						pagerLinkList += this.getPageLinkItem(x, pageInfo.currentPage, pageInfo.totalPages);
					}
					pagerLinkList += this.getPageLinkBreak();
					pagerLinkList += this.getPageLinkItem(pageInfo.totalPages, pageInfo.currentPage, pageInfo.totalPages);
				}
			}else{
				for(var x = 1; x <= pageInfo.totalPages; x++) {
					pagerLinkList += this.getPageLinkItem(x, pageInfo.currentPage, pageInfo.totalPages);
				}
			}

			this.$(".pagelinklist").append(pagerLinkList);

			// handle button visibility
			if(currentPage === CVSJS.Promo.Helper.getTotalPages(collection, itemsPerPage)){
				this.$(".next-btn").hide();
			}else{
				this.$(".next-btn").show();
			}

			if(currentPage === 1){
				this.$(".back-btn").hide();
			}else{
				this.$(".back-btn").show();
			}

		}

		return this;
	},
	getPageLinkItem: function(iterator, currentPage, totalPages) {
		return '<a class="pagelink' + CVSJS.Promo.Helper.getActiveClass(iterator, currentPage) + CVSJS.Promo.Helper.getFirstLastClass(iterator, currentPage, totalPages) + '" title="' + iterator + '">' + iterator + '</a>';
	},
	getPageLinkNext: function() {
		return '<a class="next-btn" href="#" title="Next">Next</a>';
	},
	getPageLinkBreak: function() {
		return '<span class="ellipse">...</span>';
	},
	getPageLinkPrev: function() {
		return '<a class="back-btn" href="#" title="Previous">Previous</a>';
	},
	gotopage: function(ev){
		CVSJS.Promo.Session.keepAlive();
		CVSJS.Promo.Defaults.pagerParams.currentPage = parseInt((ev.target) ? $(ev.target).text() : $(window.event.srcElement).text());
		CVSJS.Promo.Defaults.pagerParams.startIndex = ((CVSJS.Promo.Defaults.pagerParams.currentPage - 1) * CVSJS.Promo.Defaults.pagerParams.itemsPerPage);
		CVSJS.Promo.vPrevPurchasesFilter.UpdateContent(CVSJS.Promo.myPrevPurchasesOriginalColl);
		return false;
	},
	gotonextpage: function(ev){
		CVSJS.Promo.Session.keepAlive();
		if ((CVSJS.Promo.Defaults.pagerParams.currentPage + 1) <= CVSJS.Promo.Helper.getTotalPages(CVSJS.Promo.myPrevPurchasesOriginalColl, CVSJS.Promo.Defaults.pagerParams.itemsPerPage)) {
			CVSJS.Promo.Defaults.pagerParams.currentPage = CVSJS.Promo.Defaults.pagerParams.currentPage + 1;
			CVSJS.Promo.Defaults.pagerParams.startIndex = ((CVSJS.Promo.Defaults.pagerParams.currentPage - 1) * CVSJS.Promo.Defaults.pagerParams.itemsPerPage);
			CVSJS.Promo.vPrevPurchasesFilter.UpdateContent(CVSJS.Promo.myPrevPurchasesOriginalColl);
		}
		return false;
	},
	gotoprevpage: function(ev){
		CVSJS.Promo.Session.keepAlive();
		if ((CVSJS.Promo.Defaults.pagerParams.currentPage - 1) >= 1) {
			CVSJS.Promo.Defaults.pagerParams.currentPage = CVSJS.Promo.Defaults.pagerParams.currentPage - 1;
			CVSJS.Promo.Defaults.pagerParams.startIndex = ((CVSJS.Promo.Defaults.pagerParams.currentPage - 1) * CVSJS.Promo.Defaults.pagerParams.itemsPerPage);
			CVSJS.Promo.vPrevPurchasesFilter.UpdateContent(CVSJS.Promo.myPrevPurchasesOriginalColl);
		}
		return false;
	}
});



//Desktop overlay to show the disclaimer
CVSJS.Promo.vSpecificDisclaimerOverlay = Backbone.View.extend({
	el: CVSJS.OverlayCont,
	initialize: function ( evElem ) {
		this.render( evElem );
	},
	render: function( evElem ) {
		showOverlay($(evElem), function(){});
		var disclaimerText="<div><div style='margin-bottom:10px;'>" + $("#dSpecificDisclaimer").html() + "</div>" ;
		disclaimerText+="<div>" + CVSJS.Promo.Data.eventdisclaimer + "</div></div>";
		this.$el.html(disclaimerText);
		return this;
	}
});

//Desktop overlay to show the disclaimer
CVSJS.Promo.vGlobalDisclaimerOverlay = Backbone.View.extend({
	el: CVSJS.OverlayCont,
	initialize: function ( evElem ) {
		this.render( evElem );
	},
	render: function( evElem ) {
		showOverlay($(evElem), function(){});
		this.$el.html( "<div>" + CVSJS.Promo.Data.eventdisclaimer + "</div>" );
		return this;
	}
});

//Desktop overlay to show quicktips
CVSJS.Promo.vGlobalQuickTipsOverlay = Backbone.View.extend({
	el: "body",
	initialize: function () {
		if ($('#dQuickTipsContainer').length == 0) {
		    //Add it to the dom
		    this.template = CVSJS.Promo.TemplateCache.get("#tmplQuickTips");
			this.render();
		}
	},
	render: function() {
		this.$el.append( this.template() );
		return this;
	},
	events: {
		"click #overlayClose" : "removequicktips"
	},
	removequicktips: function() {
		$("#dQuickTipsContainer").remove();
		CVSJS.Promo.Helper.setCookie('CVS_WEEKLYAD_QUICKTIPS_SEEN', 'true', 2000);
	}
});

//Session timeout overlay
CVSJS.Promo.vSessionTimerOverlay = Backbone.View.extend({
	el: CVSJS.OverlayCont,
	initialize: function ( evElem ) {
		this.renderwarningstate( evElem );
	},
	events: {
		"click #btnContinue" : "gotocurrentpage",
		"click #btnSignIn" : "gotobrowse"
	},
	renderwarningstate: function( evElem ){
		var currview = this;
		showOverlay($(evElem), function(){}, function(){
			currview.undelegateEvents();
			$("#overlayClose").show();
			$("#closeSlideout").show();
		});

		//Hide the close button
		$("#overlayClose").hide();
		$("#closeSlideout").hide();

		window.clearTimeout(CVSJS.Promo.Globals.viewTimeout);

		var viewTimeout = window.setTimeout(function(){
			currview.rendersignedoutstate();
		},CVSJS.Promo.Session.timeoutAfterWarnMilliSec);
		return this;
	},
	rendersignedoutstate: function(){
		this.$("#dPreemptTimeout").hide();
		this.$("#dPastTimeout").show();

		//Hide the close button
		$("#overlayClose").hide();
		$("#closeSlideout").hide();

		//If the user is remembered or guest
		if(CVSJS.Header.Flags.userIsSignedIn()){

			this.$("#dPastTimeout").html($("#cvsLoginOverlay").html());

			this.$(".createAcnt").hide();
			this.$(".vert-line").hide();
			this.$(".text-red").text("Your Session Has Expired").next().hide().next().text("For your security, this session has expired due to inactivity. Sign In to go back to myWeekly Ad.");
		}
	},
	gotocurrentpage: function(){
		window.clearTimeout(CVSJS.Promo.Globals.viewTimeout);
		$("#overlayClose").show();
		$("#closeSlideout").show();
		$("#overlayClose").trigger("click");
		$("#closeSlideout").trigger("click");
		this.undelegateEvents();
		CVSJS.Promo.Session.keepAlive();
		return false;
	},
	gotobrowse: function(){
		$("#overlayClose").show();
		$("#closeSlideout").show();
		$("#overlayClose").trigger("click");
		$("#closeSlideout").trigger("click");
		if(CVSJS.Helper.URLContains(CVSJS.Promo.URL.browsefull)){
			window.location.reload(true); //refresh
		}else{
			CVSJS.Promo.appRouter.navigate(CVSJS.Promo.URL.browse, {trigger: true});
			window.location.reload(true); //refresh
		}
		return false;
	}
});

//Session timeout overlay
CVSJS.Promo.vSessionEndedOverlay = Backbone.View.extend({
	el: CVSJS.OverlayCont,
	initialize: function ( evElem, timeoutImmediate ) {
		this.render( evElem );
	},
	events: {
		"click #btnSignIn" : "gotobrowse"
	},
	render: function( evElem ){
		var currview = this;
		showOverlay($(evElem), function(){}, function(){
			currview.undelegateEvents();
		});
		return this;
	},
	gotobrowse: function(){
		$("#overlayClose").show();
		$("#closeSlideout").show();
		$("#overlayClose").trigger("click");
		$("#closeSlideout").trigger("click");
		if(CVSJS.Helper.URLContains(CVSJS.Promo.URL.browsefull)){
			window.location.reload(true); //refresh
		}else{
			CVSJS.Promo.appRouter.navigate(CVSJS.Promo.URL.browse, {trigger: true});
			window.location.reload(true); //refresh
		}
		return false;
	}
});

//Add to shopping list tooltip
CVSJS.Promo.vShoppingListTooltip = Backbone.View.extend({
	el: '#dShoppingListTooltip',

	initialize: function() {
		this.collection.on('add', _.bind(this.showTooltip, this));
	},

	showTooltip: function() {
		var $tooltip = $('#dShoppingListTooltip');

		if($('html').hasClass('ie8')) {
			var ie = true;
		}
		if(ie) {
			$tooltip.show();
		} else {
			$tooltip.fadeIn();
		}

		if (this.tooltipTimeout) {
			clearTimeout(this.tooltipTimeout);
		}

		this.tooltipTimeout = setTimeout(function() {
			//$tooltip.fadeOut();
			if(ie) {
				$tooltip.hide();
			} else {
				$tooltip.fadeOut();
			}
		}, 2000);
	}
});

//session functions
CVSJS.Promo.Session = {
		warnMilliSec: 570000, //570000 = 9m 30s
		timeoutAfterWarnMilliSec: 29000,
		// The date when keepAlive was last called.
		whenKeepAliveWasLastCalled: null,
		// The frequency that ping.ping should be called, in minutes.
		pingPingFrequency: 8,
		// Ping ping timer buffer in milliseconds,
		// because the difference is always off by a few milliseconds.
		pingPingMillisecondsBuffer: 10000, // Ten seconds.
		keepAlive: function () {
			// Update last called date.
			CVSJS.Promo.Session.whenKeepAliveWasLastCalled = new Date();
			// Set ping ping timer if not set.
			if (!CVSJS.Promo.Globals.pingPingTimeout) {
				CVSJS.Promo.Session.pingTimerReset();
				CVSJS.Services.sessionKeepAlive(function (success) {
					if (success) {
						CVSJS.Promo.Session.timerReset();
					}
				});
			}
		},
		timerReset: function(){
			window.clearTimeout(CVSJS.Promo.Globals.sessionTimeout);
			CVSJS.Promo.Globals.sessionTimeout = window.setTimeout(function(){
				$("#aSessionTimeoutOverlay").trigger("click");
				CVSJS.Promo.sessionTimerOverlay = new CVSJS.Promo.vSessionTimerOverlay( $("#aSessionTimeoutOverlay") );
			}, CVSJS.Promo.Session.warnMilliSec);
		},
		pingTimerReset: function () {
			var pingFrequencyMilliseconds = CVSJS.Promo.Session.pingPingFrequency * 60 * 1000;
			window.clearTimeout(CVSJS.Promo.Globals.pingPingTimeout);
			CVSJS.Promo.Globals.pingPingTimeout = window.setTimeout(function () {
				var now = new Date();
				var difference = now - CVSJS.Promo.Session.whenKeepAliveWasLastCalled + CVSJS.Promo.Session.pingPingMillisecondsBuffer;
				if (difference > pingFrequencyMilliseconds) {
					// It's been too long since the last action so don't do anything.
				} else {
					CVSJS.Services.sessionKeepAlive(function (success) {
						if (success) {
							CVSJS.Promo.Session.timerReset();
							// Call this function again.
							CVSJS.Promo.Session.pingTimerReset();
						}
					});
				}
				CVSJS.Promo.Globals.pingPingTimeout = 0;
			}, pingFrequencyMilliseconds);
		}
	}

//Caching of templates for quick retrieval
CVSJS.Promo.TemplateCache = CVSJS.Promo.TemplateCache || {
	get: function(selector){
		if (!this.templates){ this.templates = {}; }
		var template = this.templates[selector];
		if (!template){
			template = $(selector).html();
			if(template){
				template = _.template(template); //precompile the template, for underscore.js templates
				this.templates[selector] = template;
			}
		}
		return template;
	}
}

// miscellaneous helper functions
CVSJS.Promo.Helper = {
	loadingDialog: null,
	loadingModal: null,
	showLoadingModal: function () {
		CVSJS.Promo.Helper.loadingDialog = CVSJS.Promo.Helper.loadingDialog || $("<div/>", {
			html: "<strong>Loading...</strong>",
			css: {
				position: "fixed",
				top: "50%",
				left: "46%",
				"background-color": "gold",
				color: "black",
				padding: "15px",
				"z-index": 1000001
			}
		});
		CVSJS.Promo.Helper.loadingModal = CVSJS.Promo.Helper.loadingModal || $("<div/>", {
			css: {
				position: "fixed",
				top: 0,
				left: 0,
				height: "100%",
				width: "100%",
				"z-index": 1000000,
				"background-color": "#000000",
				filter: "alpha(opacity=60)",
				opacity: "0.6",
				"-moz-opacity": "0.6"
			}
		});

		CVSJS.Promo.Helper.loadingDialog.appendTo("body");
		CVSJS.Promo.Helper.loadingModal.appendTo("body");
	},
	removeLoadingModal: function () {
		if (CVSJS.Promo.Helper.loadingDialog) {
			CVSJS.Promo.Helper.loadingDialog.remove();
			CVSJS.Promo.Helper.loadingDialog = null;
		}
		if (CVSJS.Promo.Helper.loadingModal) {
			CVSJS.Promo.Helper.loadingModal.remove();
			CVSJS.Promo.Helper.loadingModal = null;
		}
	},
	growl: function(code, message, sticky, life){
		if(code && code != "99"){
			var _sticky = false, _life = 5000;

			if(sticky){
				_sticky = sticky;
			}

			if(life){
				_life = life;
			}

			$.jGrowl(message, { sticky: _sticky, life: _life });
		}else{
			//Use the overlay instead of the growl for timeouts.
			if(CVSJS.Header.Flags.userIsSignedIn()){
				//If the user is remembered or guest
				$("#aSignInOverlaySessionEnded").trigger("click");
			}else{
				$("#aSessionEndedOverlay").trigger("click");
				CVSJS.Promo.sessionEndedOverlay = new CVSJS.Promo.vSessionEndedOverlay( $("#aSessionEndedOverlay") );
			}
			//Hide the close button
			$("#overlayClose").hide();
			$("#closeSlideout").hide();
		}
	},
	getTotalPages: function(collection, itemsPerPage){
		if (collection.length % itemsPerPage > 0) {
			return parseInt(collection.length / itemsPerPage) + 1;
		} else {
			return collection.length / itemsPerPage;
		}
	},
	FormatDate: function(date) {
		if (date != undefined) {
			var d = {}
			d.year = date.getFullYear();
			d.month = date.getMonth();
			d.date = date.getDate();

			// fix issue for zero being used for december
			if (d.month === 0) {
				d.month = 12;
				d.year = d.year - 1;
			}
			return d;
		}
		else {
			return null;
		}
	},
	DaysSince: function (inputDate) {
		if (inputDate != undefined) {
			var then = Date.parse(inputDate);
			var now = new Date();
			now = Date.parse(now);
			return Math.floor((now - then)/86400000);
		}
		else {
			return null;
		}
	},
	DateCutoffInMs: function(days) {
		if (days != undefined) {
			var now = new Date();
			now = Date.parse(now);
			var daysInMilliseconds = days*86400000;
			return Math.floor(parseInt(now) - daysInMilliseconds);
		}
		else {
			return null;
		}
	},
	addToListButton: function() {
		return '<span class="secondaryR addList">Add Item to List</span>';
	},
	getActiveClass: function(iterator, currentItem) {
		return (iterator === currentItem) ? ' active' : '';
	},
	getFirstLastClass: function(iterator, currentItem, totalItems) {
		var output = '';
		if (iterator === 1) { output += ' first'; }
		if (iterator === totalItems) { output += ' last'; }
		return output;
	},
	lazyLoad: function(){
		this.lazyLoadCategories();
		this.lazyLoadImages($("#dPgBrowse"));
	},
	lazyLoadCategories: function(){
		if($("#dPgBrowse").is(":visible")){
			var catSectionsNextLazyLoadArray = [];
			_.each(CVSJS.Promo.catSections, function(catSection, idx){
				if(catSection){
					if(catSection.$el.isVisible(true) && !catSection.isRendered){
						catSection.render();

						//render the section before
						if(CVSJS.Promo.catSections[idx-1] && !CVSJS.Promo.catSections[idx-1].isRendered){
							CVSJS.Promo.catSections[idx-1].render();
						}
						//render the section after
						if(CVSJS.Promo.catSections[idx+1] && !CVSJS.Promo.catSections[idx+1].isRendered){
							CVSJS.Promo.catSections[idx+1].render();
						}
					}
				}
			});
		}
	},
	lazyLoadImages: function($container){
		if($container.is(":visible")){
			$container.find(".imgAd.noImg").filter(function (idx) {

				if($(this).isVisible(true)){
					var image = $(this).data("imgUrl");
					$(this).attr("src", image).removeClass("noImg");
				}
			});
		}
	},
	setSignedInStatusClass: function(status) {
		if (status) {
			$('body').removeClass('not-signedin').addClass('signedin');
		}
		else {
			$('body').removeClass('signedin').addClass('not-signedin');
		}
	},
	freezeHeader: function(windowParams) {
			$("#headerFreeze").css({
				'top': 0,
				'position': 'fixed'
			});
			$("#headerFreeze").addClass('freezeHeaderBg');
			if(CVSJS.Promo.Defaults.sectionName == 'browse') {
				$("#headerFreeze").addClass('browsepage');
			}
			$("#dPromoApp").css({
				"padding-top": windowParams.freezeHeaderHeight
			});

			CVSJS.Promo.Defaults.windowParams.freezeHeaderHeight = $("#headerFreeze").height();
	},
	unfreezeHeader: function(windowParams) {
		if ($('body').is('.browse') ) {
			if ($(window).width() < 640 || window.location.href.indexOf("m.cvs.com") >= 0){
				$('#dHeadBrowse').show();
			}
		}
		$("#headerFreeze").css({
			'top': windowParams.yOffset,
			'position': ''
		});
		$("#headerFreeze").removeClass('freezeHeaderBg');
		$("#headerFreeze").removeClass('browsepage');
		$("#dPromoApp").css({
			"padding-top": ''
		});
	},
	adjustSaleOfferTypeColumnData: function(thisModel) {
		//Adjusting the offer description based on offer type
		if(thisModel.get("t1")){
			var descType = thisModel.get("t1");
			var descMod;
			var descTemplate;

			if(descType){
				var descTemplateId = descType[0];
				if(descTemplateId){
					descTemplate = CVSJS.Promo.TemplateCache.get("#tmplDetailDesc" + descTemplateId);
					if(descTemplateId.indexOf("BAGB") >= 0){
						var addSavingsText = "", offerText = "", longDesc = "", rowType = "";

						if(thisModel.get("st")){
							if(thisModel.get("st") === 0){
								rowType = "sku";
							}else if(thisModel.get("st") === 1){
								rowType = "block";
							}
						}else{
							rowType = "sku";
						}

						if(rowType === "sku"){
							if(thisModel.get("ot")){
								addSavingsText += thisModel.get("ot");
							}
							if(thisModel.get("as")){
								addSavingsText += "<br><br>" + thisModel.get("as");
							}
							offerText = thisModel.get("of");
							longDesc = thisModel.get("ds");
						}else if(rowType === "block"){
							descMod = CVSJS.Promo.Helper.buildDescModel(descType);
							offerText = descTemplate({ item: descMod.toJSON() });
							addSavingsText = thisModel.get("as");
							longDesc = thisModel.get("ot");
						}
						thisModel.set("as", addSavingsText);
						thisModel.set("ot", offerText);
						thisModel.set("ds", longDesc);
					}else {
						descMod = CVSJS.Promo.Helper.buildDescModel(descType);
						thisModel.set("ot", descTemplate({ item: descMod.toJSON() }));
					}
				}

			}
		}

		return thisModel;
	},
	buildDescModel: function(descArray){
		var descMod = new CVSJS.Promo.mAdBlockDesc({ type: descArray[0] });
		var typeId = descArray[0];

		for(var x = 1; x<=5; x++){
			descMod.set("v" + x, descArray[x]);
			if((typeId == "BOGO3" || typeId == "BOGO4") && x == 3){
				descMod.set("v" + x, [CVSJS.Promo.Helper.formatDecimalValuePlain(descArray[x], typeId)]);
			}
			if((typeId == "RETL1" || typeId.indexOf("DOFF") >= 0) && x == 1 || typeId == "RETL2"){
				descMod.set("v" + x, [CVSJS.Promo.Helper.formatDecimalValuePlain(descArray[x], typeId)]);
			}
			if((typeId == "SALE1" || typeId == "SALE2" || typeId == "SALE3") && x == 1){
				descMod.set("v" + x, [CVSJS.Promo.Helper.formatDecimalValuePlain(descArray[x], typeId)]);
			}
			if((typeId == "SALE4" || typeId == "SALE5") && x == 2){
				descMod.set("v" + x, [CVSJS.Promo.Helper.formatDecimalValuePlain(descArray[x], typeId)]);
			}
			if((typeId == "BAGB3" || typeId == "BAGB4") && x == 1){
				descMod.set("v" + x, [CVSJS.Promo.Helper.formatDecimalValuePlain(descArray[x], typeId)]);
			}
		}

		return descMod;
	},
	buildBadgeModel: function(badgeArray){
		var adBlockBadgeMod = new CVSJS.Promo.mAdBlockBadge();

		if(badgeArray && badgeArray[0]){
			var badgeTemplateId = badgeArray[0];
			adBlockBadgeMod.set("type", badgeTemplateId);

			for(var x = 1; x<=5; x++){

				if(badgeArray[x]){
					adBlockBadgeMod.set("v" + x, [badgeArray[x]]);
					if(badgeTemplateId == "BOGO3" || badgeTemplateId == "BOGO4"){
						if(x == 3){
							adBlockBadgeMod.set("v" + x, [CVSJS.Promo.Helper.formatDecimalValue(badgeArray[x], badgeTemplateId)]);
						}
					}else if(badgeTemplateId == "BAGB3" || badgeTemplateId == "BAGB4" || badgeTemplateId == "RETL1" || badgeTemplateId == "RETL2"){
						adBlockBadgeMod.set("v" + x, [CVSJS.Promo.Helper.formatDecimalValue(badgeArray[x], badgeTemplateId)]);
					}else if(badgeArray[x].indexOf('.') >= 0){
						var arrBadgePrice = badgeArray[x].split(".");

						if(arrBadgePrice[1] && arrBadgePrice[1].length == 1){
							arrBadgePrice[1] += "0";
						}else if(arrBadgePrice[1] && arrBadgePrice[1].length == 2 && arrBadgePrice[1].substring(0,1) == "0"){
							arrBadgePrice[1] = arrBadgePrice[1].substring(1,2);
						}

						adBlockBadgeMod.set("v" + x, arrBadgePrice);
					}
				}
			}
		}

		return adBlockBadgeMod;
	},
	formatDecimalValue: function(decimalValue, templateId){
		var returnPrice = "<span class='sBDollarSign3'>&#36;</span>" + decimalValue;
		if(templateId == "SALE3" || templateId == "DOFF3"){
			returnPrice = decimalValue;
		}
		if(templateId == "BOGO3" || templateId == "BOGO4" ||templateId == "BAGB3"){
			returnPrice = "<span class='sBDollarSign4'>&#36;</span>" + decimalValue;
		}
		if(decimalValue.indexOf('.')){
			var priceComponents = decimalValue.split(".");
			if(priceComponents[1] && priceComponents[1].length == 1){
				priceComponents[1] += "0";
			}else if(priceComponents[1] && priceComponents[1].length == 2 && priceComponents[1].substring(0,1) == "0"){
				priceComponents[1] = priceComponents[1].substring(1,2);
			}
			if(priceComponents && parseInt(priceComponents[0],10) == 0 && parseInt(priceComponents[1],10) > 0){
				//use cents symbol for second part
				returnPrice = priceComponents[1] + "<span class='sBCentSymbol'>&#162;</span>";
			}else if(priceComponents && parseInt(priceComponents[0],10) > 0 && parseInt(priceComponents[1],10) > 0){
				//use dollar symbol and superscript for second part
				returnPrice = priceComponents[0] + "<span class='sBTxtSup1'>" + priceComponents[1] + "</span>";
			}else if(priceComponents && parseInt(priceComponents[0],10) > 0 && parseInt(priceComponents[1],10) == 0){
				//use dollar symbol and no second part
				returnPrice = "<span class='sBDollarSign3'>&#36;</span>" + priceComponents[0];
				if(templateId == "BOGO3" || templateId == "BOGO4" || templateId == "BAGB3" || templateId == "BAGB4" ){
					returnPrice = "<span class='sBDollarSign4'>&#36;</span>" + priceComponents[0];
				}
			}
		}
		return returnPrice;
	},
	formatDecimalValuePlain: function(decimalValue, templateId){
		if(decimalValue){
			var returnPrice = "&#36;" + decimalValue;
			if(templateId == "SALE3" || templateId == "DOFF3"){
				returnPrice = decimalValue;
			}

			if(decimalValue.indexOf('.')){
				var priceComponents = decimalValue.split(".");
				if(priceComponents[1] && priceComponents[1].length == 1){
					//value looks like 0.1, append a 0
					priceComponents[1] += "0";
				}else if(priceComponents[1] && priceComponents[1].length == 2 && priceComponents[1].substring(0,1) == "0"){
					//cents looks like 01, use only the last digit
					priceComponents[1] = priceComponents[1].substring(1,2);
				}
				if(priceComponents && parseInt(priceComponents[0],10) == 0 && parseInt(priceComponents[1],10) > 0){
					//use cents symbol for second part
					returnPrice = priceComponents[1] + "&#162;";
				}else if(priceComponents && parseInt(priceComponents[0],10) > 0 && parseInt(priceComponents[1],10) > 0){
					//use dollar symbol and superscript for second part
					returnPrice = "&#36;" + priceComponents[0] + "." + priceComponents[1];
				}else if(priceComponents && parseInt(priceComponents[0],10) > 0 && parseInt(priceComponents[1],10) == 0){
					//use dollar symbol and no second part
					returnPrice = "&#36;" + priceComponents[0];
				}
			}
			return returnPrice;
		}
	},
	updateShoppingListItemCount: function(itemsInCart) {
		if(itemsInCart > 0 ) {
			$("#dShoppingListButton").addClass("red");
			$(".sShoppingCartItemCount").html(itemsInCart);
			$('.shoppinglist-number-block-mobile').show();
			$('#sShoppingListNumContainer').show();
		} else {
			$("#dShoppingListButton").removeClass("red");
			$('.shoppinglist-number-block-mobile').hide();
			$('#sShoppingListNumContainer').hide();
		}
	},
	setCookie: function(cname, cvalue,exdays) {
		if(exdays) {
			var d = new Date();
			d.setTime(d.getTime()+(exdays*24*60*60*1000));
			var expires = "expires="+d.toGMTString();
		}
		document.cookie = cname + "=" + cvalue + "; " + expires + " ; path=/";
	},
	showQuickTips: function() {
		if($('#dQuickTipsContainer').length == 0) {
			CVSJS.Promo.Session.keepAlive();
			var quicktipsOverlay = new CVSJS.Promo.vGlobalQuickTipsOverlay();

			var cssVal;
			if ($(window).height() < 570 ) {
				cssVal = 0;
			} else {
				cssVal = ($(window).height() - $('#dQuickTipsOverlay').height()) / 2;
			}
			$("#dQuickTipsOverlay").css({ top: cssVal });
			$("#dQuickTipsContainer").on("click", function(){
				$("#overlayClose").trigger("click");
			});
		}
	},

	isMobileDesktop: function() {
		var width = window.innerWidth,
			$body = $('body');


		if (width <= 640) {
			if ($body.data('is-mobile')) {
				return;
			}

			$body.data('is-mobile', true);
			$body.data('is-desktop', false);

			CVSJS.Promo.Events.trigger('is-mobile');
		} else {
			if ($body.data('is-desktop')) {
				return;
			}

			$body.data('is-mobile', false);
			$body.data('is-desktop', true);

			CVSJS.Promo.Events.trigger('is-desktop');
		}
	},

	showAddedtoList: function(vb, sn) {
		if(vb) {
			// $(".dAdLinks-" + vb).find(".addtolist").find(".btnAddtoList").hide();
			// $(".dAdLinks-" + vb).find(".addtolist").find(".btnAddedtoList").show();
			// $(".dAdLinks-" + vb).find(".addtolist").find(".aRemoveFromList").show();

			$(".dAdLinks-" + vb).find(".addtolist").find(".btnAddtoList").addClass('hidden').removeClass('show');
			$(".dAdLinks-" + vb).find(".addtolist").find(".btnAddedtoList").removeClass('hidden').addClass('show');
			$(".dAdLinks-" + vb).find(".addtolist").find(".aRemoveFromList").removeClass('hidden').addClass('show');
		}
		if(sn) {
			$(".dAdSn-" + sn).find(".addtolist").find(".btnAddtoList").addClass('hidden').removeClass('show');
			$(".dAdSn-" + sn).find(".addtolist").find(".btnAddedtoList").removeClass('hidden').addClass('show');
			$(".dAdSn-" + sn).find(".addtolist").find(".aRemoveFromList").removeClass('hidden').addClass('show');
		}
	},

	showAddtoList: function(vb, sn) {
		if(vb) {
			$(".dAdLinks-" + vb).find(".addtolist").find(".btnAddtoList").removeClass('hidden').addClass('show');
			$(".dAdLinks-" + vb).find(".addtolist").find(".btnAddedtoList").addClass('hidden').removeClass('show');
			$(".dAdLinks-" + vb).find(".addtolist").find(".aRemoveFromList").addClass('hidden').removeClass('show');
		}
		if(sn) {
			$(".dAdSn-" + sn).find(".addtolist").find(".btnAddtoList").removeClass('hidden').addClass('show');
			$(".dAdSn-" + sn).find(".addtolist").find(".btnAddedtoList").addClass('hidden').removeClass('show');
			$(".dAdSn-" + sn).find(".addtolist").find(".aRemoveFromList").addClass('hidden').removeClass('show');
		}

	}
};

//--------------------------------------------------------------------------------------------------------------------
//------------------- APP OBJECT - HANDLES INITIALIZATION OF THE PAGE AND OTHER THINGS -------------------------------
//--------------------------------------------------------------------------------------------------------------------

//Object for the app, maybe specific page context, has some controlling functions and values
CVSJS.Promo.App = {
	initialize: function() {
		CVSJS.Promo.Helper.isMobileDesktop();


		//---------- DATA LOAD

		//If we have a cookied store selection, let's use that
		if(CVSJS.Header.Details && CVSJS.Header.Details.sd){
			CVSJS.Promo.Data.mystore = CVSJS.Header.Details.sd;
		}

		if(CVSJS.Helper.URLContains(CVSJS.Promo.URL.shoppinglist)){
			CVSJS.Promo.Services.getShoppingList({ isshoppinglistonly : 1 });
			CVSJS.Promo.appLoadedShoppingListData = true;
		}else{
			CVSJS.Promo.Services.getShoppingList();
		}

		if(CVSJS.Header.Details.ei){
			CVSJS.Promo.Services.getDisclaimer( { eventid : CVSJS.Header.Details.ei } );
		}

		//---------- OBJECTS
		CVSJS.Promo.myStoreModel = new CVSJS.Promo.mStore(CVSJS.Header.Details.sd);
		CVSJS.Promo.myShoppingListColl = new CVSJS.Promo.cShoppingListItems(CVSJS.Promo.Data.shoppinglist);
		CVSJS.Promo.mySneakPeekListColl = new CVSJS.Promo.cSneakPeekListItems(CVSJS.Promo.Data.sneakpeek);
		if(CVSJS.Promo.Data.shoplistextracare){
			CVSJS.Promo.myShopListExtraCareListColl = new CVSJS.Promo.cExtraCareListItems(CVSJS.Promo.Data.shoplistextracare);
		}


		//create the view to handle the back to top button
		CVSJS.Promo.backtoTop = new CVSJS.Promo.vBackToTop();
		//create the tool tip for shopping list
		CVSJS.Promo.shoppingListTooltip = new CVSJS.Promo.vShoppingListTooltip({collection: CVSJS.Promo.myShoppingListColl});
		CVSJS.Promo.shoppingListTooltip = new CVSJS.Promo.vShoppingListTooltip({collection: CVSJS.Promo.mySneakPeekListColl});

		//---------- EVENTS

		//Something is added or removed from the shopping/sneak peek list
		CVSJS.Promo.myShoppingListColl.on("add", function() {
			var model = arguments[0],
				id = model.get('bn') || model.get('bk');

			CVSJS.Promo.Globals.shoppingListCache[+id] = CVSJS.Promo.Defaults.sectionName;
			CVSJS.Promo.Events.trigger("shoppinglistchanged");
		});

		CVSJS.Promo.mySneakPeekListColl.on("add", function() {
			var model = arguments[0],
				id = model.get('bn') || model.get('bk');

			CVSJS.Promo.Globals.shoppingListCache[+id] = CVSJS.Promo.Defaults.sectionName;
			CVSJS.Promo.Events.trigger("shoppinglistchanged");
		});

		CVSJS.Promo.myShoppingListColl.on("remove", function() {
			var model = arguments[0],
				id = model.get('bn') || model.get('bk');

			CVSJS.Promo.Globals.shoppingListCache[+id] = '';
			CVSJS.Promo.Events.trigger("shoppinglistchanged");
		});

		CVSJS.Promo.mySneakPeekListColl.on("remove", function() {
			var model = arguments[0],
				id = model.get('bn') || model.get('bk');

			CVSJS.Promo.Globals.shoppingListCache[+id] = '';
			CVSJS.Promo.Events.trigger("shoppinglistchanged");
		});

		CVSJS.Promo.Events.on('render:complete', function() {
			CVSJS.Promo.Globals.setDealDetailsHeight();
		});

		//---------- ROUTER

		//Create a router to handle page navigation
		CVSJS.Promo.appRouter = new CVSJS.Promo.Router();
		CVSJS.Promo.appRouter.on('route', function() {
			if (CVSJS.Promo.Globals.history.length > 9 && _.isArray(CVSJS.Promo.Globals.history)) {
				CVSJS.Promo.Globals.history.pop();
			}

			CVSJS.Promo.Globals.history.unshift(location.href);
			if (CVSJS.Promo.Globals.history.length > 1 && window['localStorage']) {
				window.localStorage['history'] = CVSJS.Promo.Globals.history;
			}

			if (arguments[0] == 'browse' || arguments[0] == 'extracare' || arguments[0] == 'yourdeals') {
				CVSJS.Promo.lastMajorPage = arguments[0];
			}

			if (arguments[0] != 'shoppinglist' && (arguments[0] != 'detail' || !CVSJS.Promo.Globals.fromShoppingList)) {
				CVSJS.Promo.Globals.fromShoppingList = false;
			}
		});

		// Create the header for the weekly ad
		CVSJS.Promo.weeklyAdHeader = new CVSJS.Promo.vWeeklyAdHeader({el:$("#dWeeklyAdHeader")});

		//Setup the history to track page views
		Backbone.history.start();
		var quickTipsCookie = CVSJS.Helper.getCookieValue('CVS_WEEKLYAD_RELOAD');
		if( !(CVSJS.Helper.URLContains("#Detail")) ) {
			if(!(CVSJS.Helper.URLContains("redirect=false")) ){
				if( quickTipsCookie == 'false' ) {
					CVSJS.Promo.appRouter.checkRedirect();
				} else {
					CVSJS.Promo.Helper.setCookie('CVS_WEEKLYAD_RELOAD', 'false', 2000);
				}
			}
		}
		//Set any global html

		$("#dGlobalDisclaimer").html(CVSJS.Promo.Data.eventdisclaimer);

		//create the mobile menu, depends on the router, so create it after the router
		CVSJS.Promo.mobileMenu = new CVSJS.Promo.vMobileMenu();

	}
};

//Kick off the page
$(document).ready( function() {
	var isIE = function isIE() {
	  var myNav = navigator.userAgent.toLowerCase();
	  return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
	}

	CVSJS.Promo.App.initialize();

	$(window).resize(function(ev) {
		CVSJS.Promo.Helper.isMobileDesktop();
		CVSJS.Promo.Globals.setDealDetailsHeight();
		CVSJS.Promo.Events.trigger('slider:contentloaded');
	});

//	$('body').on('touchscroll touchstart click', '#exposeMask', function(ev) {
//		$("#closeSlideout").trigger("click");
//
//		return false;
//	});

	if (isIE() == '8') {
		$('html').addClass('ie8');
	}
});