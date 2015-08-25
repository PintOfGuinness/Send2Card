"use strict";

//This will change the brackets within templates to be <@ @>, safe for JSP
_.templateSettings = {
	interpolate: /\<\@\=(.+?)\@\>/gim,
	evaluate: /\<\@(.+?)\@\>/gim,
	escape: /\<\@\-(.+?)\@\>/gim
};

var CVSJS = CVSJS || {};
CVSJS.Promo = CVSJS.Promo || {};
CVSJS.Promo.Data = {
	stores: [],
	favstores: [],
	mystore: {},
	usrgeoloc: {}
}
CVSJS.Promo.Defaults = {
	suggestStoreID: null
}

CVSJS.Promo.Services = {
	URL: {
		getStores: "/cvs/store/CvsStoreLocatorServices/getSearchStore",
		setFavoriteStore: "/cvs/store/CvsStoreLocatorServices/getAddStoreToFavoriteList",
		getFavoriteStores: "/cvs/store/CvsStoreLocatorServices/getFavoriteStores",
		getStoreDetails: "/cvs/store/CvsStoreLocatorServices/getStoreIdDetails"
	},
	getBingResults: function( queryData, callback ){

		var returnData = "";
		var countryRegion = 'US';
		var intRegex = /^\d+$/;
		var searchString = $.trim(queryData);
		var trimmedStr = "";
		
		CVSJS.Promo.Defaults.suggestStoreID = null;
		if(intRegex.test(searchString)){

			if(searchString.length < 6){
				trimmedStr = searchString.replace(/^0+/, "");
				if(trimmedStr.length === 3){
					searchString = trimmedStr;
				}
			}

			// setup "did you mean store #xxxx" search option
			if (searchString.length <= 5) {
				var checkStoreId = this.getStoreDetails(searchString);
				if (checkStoreId && checkStoreId.sm != null) {
					var suggestStoreId = 'Did you mean Store <strong>#' + trimmedStr + '</strong>? <a class="searchtermlink" href="#" data-storeid="' + trimmedStr + '">View details for this store.</a>';
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
				});
			}
		}
		else {
			return callback([], searchString, 0);
		}
		
	},
	getStores: function( reqData ){
		var data = CVSJS.Services.getJSON( this.URL.getStores, reqData );
		if(data && data.sd){
			CVSJS.Promo.Data.stores = data.sd;
		}
		else {
			CVSJS.Promo.Data.stores = {};
		}
	},
	setFavoriteStore: function( reqData ){
		var data = CVSJS.Services.getJSON( this.URL.setFavoriteStore, reqData );
		if(data && data.sd){
			CVSJS.Promo.Data.mystore = data.sd;
			return CVSJS.Promo.Data.mystore.id;
		}
	},
	getFavoriteStores: function( reqData ){
		var data = CVSJS.Services.getJSON( this.URL.getFavoriteStores, reqData );
		if(data && data.sd){
			CVSJS.Promo.Data.mystore = _.find(data.sd, function(store){ return store.id === data.ds; });
			CVSJS.Promo.Data.favstores = data.sd;
		}
	},
	getStoreDetails: function(storeId) {
		return CVSJS.Services.getJSON(this.URL.getStoreDetails, {storeId: storeId});
	},
	showSuggestStoreId: function() {
		$('#suggestStoreId').show();
		return false;
	},
	hideSuggestStoreId: function() {
		$('#suggestStoreId').hide();
		return false;
	}
};

//Model for a single store
CVSJS.Promo.mStore = Backbone.Model.extend({
	indx: 0
});

//Collection of stores
CVSJS.Promo.cStores = Backbone.Collection.extend({
	model: CVSJS.Promo.mStore
});

//View for the pagination intro
CVSJS.Promo.vPaginationIntro = Backbone.View.extend({
	initialize: function () {
		_.bindAll( this, "render" );
		this.template = CVSJS.Promo.TemplateCache.get("#tmplPaginationIntro");
		this.render();
	},
	render: function() {
		this.pageInfo = {
			totalItems: CVSJS.Promo.storeList.collection.length,
			plural: CVSJS.Promo.storeList.collection.length===1 ? "" : "s", 
			searchTerm: $("#iSearch").val()
		}
		var renderedTemplate = this.template({pageInfo: this.pageInfo});
		this.$el.html( renderedTemplate );
				
		return this;
	}
});

//View for the pagination sections
CVSJS.Promo.vPagination = Backbone.View.extend({
	initialize: function () {
		_.bindAll( this, "render" );
		this.template = CVSJS.Promo.TemplateCache.get("#tmplPagination");
		this.render();
	},
	events: {
		"click .pagelink" : "gotopage",
		"click .next-btn" : "gotonextpage",
		"click .back-btn" : "gotoprevpage"
	},
	render: function() {
		var startIndex = CVSJS.Promo.storeList.startIndex;
		var numItemsPerPage = CVSJS.Promo.storeList.numItemsPerPage;
		var totalItems = CVSJS.Promo.storeList.collection.length;
		var currentPage = CVSJS.Promo.storeList.currentPage;
		this.pageInfo = {
			startItem: startIndex + 1,
			endItem: startIndex + numItemsPerPage > totalItems ? totalItems : startIndex + numItemsPerPage,
			totalItems: totalItems,
			totalPages: CVSJS.Promo.Helper.getTotalPages(),
			currentPage: currentPage
		}
		this.$el.empty();
		var renderedTemplate = this.template({pageInfo: this.pageInfo});
		this.$el.append( renderedTemplate );
		
		var pageHTML = "";
		for(var x=1;x<=this.pageInfo.totalPages;x++){
			pageHTML += "<a class=\"";
			if (x===this.pageInfo.currentPage){
				pageHTML += "bold ";
			} else {
				pageHTML += "underline ";
			}
			pageHTML += "pagelink\" href=\"#\">" + x + "</a> ";
		}
		this.$(".pagelinklist").append( pageHTML );
		
		if(currentPage === CVSJS.Promo.Helper.getTotalPages()){
			this.$(".next-btn").hide();
		} else {
			this.$(".next-btn").show();
		}
		
		if(currentPage === 1){
			this.$(".back-btn").hide();
		} else {
			this.$(".back-btn").show();
		}
		
		return this;
	},
	gotopage: function(ev){
		CVSJS.Promo.storeList.currentPage = parseInt($(ev.target).html());
		CVSJS.Promo.storeList.render();
		CVSJS.Promo.listPagination1.render();
		CVSJS.Promo.listPagination2.render();
		return false;
	},
	gotonextpage: function(ev){
		if(CVSJS.Promo.storeList.currentPage+1 <= CVSJS.Promo.Helper.getTotalPages()){
			CVSJS.Promo.storeList.currentPage = CVSJS.Promo.storeList.currentPage + 1;
			CVSJS.Promo.storeList.render();
			CVSJS.Promo.listPagination1.render();
			CVSJS.Promo.listPagination2.render();
		}
		return false;
	},
	gotoprevpage: function(ev){
		if(CVSJS.Promo.storeList.currentPage-1 >= 1){
			CVSJS.Promo.storeList.currentPage = CVSJS.Promo.storeList.currentPage - 1;
			CVSJS.Promo.storeList.render();
			CVSJS.Promo.listPagination1.render();
			CVSJS.Promo.listPagination2.render();
		}
		return false;
	}
});

//View for the list of stores
CVSJS.Promo.vStoreList = Backbone.View.extend({
	el: "#dStoreList",
	initialize: function () {
		_.bindAll( this, "render" );
	},
	numItemsPerPage: 9, //default value
	currentPage: 1,
	startIndex: 0,
	render: function() {
		this.startIndex = this.numItemsPerPage * this.currentPage - this.numItemsPerPage;
		var els = [];
		
		this.$(".results").html((this.startIndex + 1) + "-" + (this.startIndex + this.numItemsPerPage) + " of " + this.collection.length + " Results");
		
		for(var x=this.startIndex;x<(this.startIndex + this.numItemsPerPage);x++){
			var currModel = this.collection.at(x);
			var storeEntry = new CVSJS.Promo.vStoreEntry({ model: currModel, storeIndex: x+1 });
			els.push( storeEntry.render().el );
		}
		this.$el.html( els );
		return this;
	}
});

//View for a single store in the list of stores
CVSJS.Promo.vStoreEntry = Backbone.View.extend({
	initialize: function (storeData) {
		if(storeData.model) {
			_.bindAll( this, "render" );
			this.template = CVSJS.Promo.TemplateCache.get("#tmplStore");
			this.model = storeData.model;
			this.model.set("indx", storeData.storeIndex);
			this.render();
		}
	},
	render: function() {
		if(this.model) {
			var renderedTemplate = this.template({ store: this.model.toJSON() });
			this.$el.html( renderedTemplate );
			if( this.model.get("wf") && this.model.get("wf") != "Y" ){
				this.$(".nodealstext").show();
				this.$(".shopstorelink").hide();
			}
		}	

		if(CVSJS.Promo.Data.mystore){
			if(this.model) {
				if(this.model.id === CVSJS.Promo.Data.mystore.id){
					this.$(".storedistance").before("<div><span class='mycvs'>myCVS</span></div>");
					this.$(".storedistance").hide();
				}
			}	
		}
		return this;
	},
	events: {
		"click .shopstorelink" : "selectstore"
	},
	selectstore: function(ev){
		if(CVSJS.Promo.Services.setFavoriteStore({ storeId: this.model.id })){
			if(CVSJS.Helper.URLContains("#Detail/")){
				var dealDetailDetails = window.location.href.substring(window.location.href.indexOf("#Detail/"));
				CVSJS.Helper.redirect(CVSJS.Promo.URL.dealdetails + dealDetailDetails);
			}else if(CVSJS.Helper.URLContains("?redirect=false")){
				var ecPath = window.location.href.substring(window.location.href.indexOf("?redirect=false"));
				CVSJS.Helper.redirect(CVSJS.Promo.URL.dealdetails + ecPath);
			}else{
				CVSJS.Helper.redirect(CVSJS.Promo.URL.browsefull);
			}
		}
	}
});

//View for the search box
CVSJS.Promo.vSearch = Backbone.View.extend({
	el: "#dSearchSection",
	initialize: function () {
		_.bindAll( this, "render" );
		this.template = CVSJS.Promo.TemplateCache.get("#tmplSearch");
		this.render();
	},
	render: function() {
		var renderedTemplate = this.template();
		this.$el.html( renderedTemplate );
		
		if(CVSJS.Header.Flags.userIsSignedIn()){
			this.$el.find("#dNowChooseStore").html("Select the store you want to shop. We'll remember it next time.");
		}
		return this;
	},
	renderError: function(){
		var renderedTemplate = CVSJS.Promo.TemplateCache.get("#tmplErrResults");
		this.$el.prepend( renderedTemplate );
		$("#storeLoading").hide();
		return this;
	},
	renderNoResults: function(){
		var renderedTemplate = CVSJS.Promo.TemplateCache.get("#tmplNoResults");
		$('#dStoreList').html( renderedTemplate );
		if (CVSJS.Promo.storeListColl) {
			CVSJS.Promo.storeListColl.reset();
		}
		if ($('.content-block').is(':hidden')) {
			$('.content-block').show();
		}
		return this;
	},
	clearError: function(){
		this.$("#formerrorswrapper").remove();
	},
	events: {
		"click #btnFindStores" : "findstores",
		"keyup #iSearch" : "checkforenter",
		"click .searchtermlink" : "selectsearchterm",
		"click .closesuggest" : "hidesuggestsearch"
	},
	findstores: function( ev, lat, long ){
		if($("#storeLoading").size()>0 && $("#storeLoading").is(":hidden"))$("#storeLoading").show();
		$(".pagination").hide();
		$(".content-block").hide();
		this.clearError();
		this.hidesuggestsearch();
		CVSJS.Promo.Services.hideSuggestStoreId();

		if(ev && ev.target && $.trim($("#iSearch").val()) === ""){
			var $Target = $(ev.target);
			if(($Target.attr("id") === "btnFindStores" || $Target.attr("id") === "iSearch") || $Target.hasClass("findlink")){ //hasClass test is for Chrome
				this.renderError();
				return false;
			}
		}else{
			if( lat && long ){

				//We have lat/long from a clicked link in the suggest box
				CVSJS.Promo.Services.getStores({ latitude: lat, longitude: long });
				$("#storeLoading").hide();
				if(CVSJS.Promo.Data.stores.length > 0){
		 			$("#suggestBoxHolderCont").hide();
		 			$(".pagination").show();
		 			$(".content-block").show();
		 			
		 			if(ev == "geolocation"){
		 				$("#iSearch").val(CVSJS.Promo.Data.stores[0].ci + ", " + CVSJS.Promo.Data.stores[0].st);
		 			}
		 			CVSJS.Promo.App.renderResults();
		 		}else{
		 			this.renderNoResults();
		 		}
			}else{
				var currentView = this;

				//We only have a search term, send it to bing to get results
				CVSJS.Promo.Services.getBingResults($("#iSearch").val(), function(bingResults, searchTerm, totalPlaces){
					$("#storeLoading").hide();
					$("#iSearch").val(searchTerm);

					if(totalPlaces > 1)
					{
						var matchedaddress = false;
						var appendHTML = "";

						if (CVSJS.Promo.Defaults.suggestStoreID != null) {
							appendHTML += CVSJS.Promo.Defaults.suggestStoreID;
						}

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
									appendHTML += "<li class=\"searchtermlink\"><a href='#' data-latitude='" + bingResults[i].point.coordinates[0] + "' data-longitude='" + bingResults[i].point.coordinates[1] + "'>" + address + "</a></li>";
								}	
			 				} else {
			 					if(bingResults[i].address.countryRegion === "United States" || bingResults[i].address.countryRegion === "Puerto Rico"){
				 					appendHTML += "<li class=\"searchtermlink\"><a href='#' data-latitude='" + bingResults[i].point.coordinates[0] + "' data-longitude='" + bingResults[i].point.coordinates[1] + "'>" + bingResults[i].name + "</a></li>";
				 				}
			 				}
			 			}
						
				 		if(appendHTML != ""){
				 			currentView.$("#suggestions ul").html(appendHTML);
				 			currentView.$("#suggestBoxHolderCont").show();
				 		}else{
				 			$(".pagination").hide();
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
							$("#storeLoading").hide();
							if (CVSJS.Promo.Defaults.suggestStoreID != null) {
								currentView.$("#suggestions ul").html(CVSJS.Promo.Defaults.suggestStoreID);
								currentView.$("#suggestBoxHolderCont").show();
							}
							else {
								currentView.$("#suggestBoxHolderCont").hide();
							}

							if(CVSJS.Promo.Data.stores.length > 0){
								$(".pagination").show();
								$(".content-block").show();
					 			CVSJS.Promo.App.renderResults();
					 		}else{
								$(".pagination").hide();
					 			currentView.renderNoResults();
					 		}
						}else{
							currentView.renderNoResults();
						}
					}
				});
			}

		}
	},
	geosearch: function(){
		if(!$.isEmptyObject(CVSJS.Header.Details) && CVSJS.Header.Details.au[7] && CVSJS.Header.Details.au[7] != "null,null"){
			var splitStr = CVSJS.Header.Details.au[7].split(',');
			CVSJS.Promo.Data.usrgeoloc.lt = splitStr[0];
			CVSJS.Promo.Data.usrgeoloc.lg = splitStr[1];
			CVSJS.Promo.searchBoxSection.findstores( "geolocation", CVSJS.Promo.Data.usrgeoloc.lt, CVSJS.Promo.Data.usrgeoloc.lg );
		}else if (window.navigator.geolocation) {
			window.navigator.geolocation.getCurrentPosition(
				function(position) {
					if(!CVSJS.Promo.Data.usrgeoloc.lt && !CVSJS.Promo.Data.usrgeoloc.lg) {
						CVSJS.Promo.Data.usrgeoloc.lt = position.coords.latitude;
						CVSJS.Promo.Data.usrgeoloc.lg = position.coords.longitude;
					}
					CVSJS.Promo.searchBoxSection.findstores( "geolocation", CVSJS.Promo.Data.usrgeoloc.lt, CVSJS.Promo.Data.usrgeoloc.lg );
				},
				function(error) {
					//console.warn(error);
				},
				{"enableHighAccuracy":"false", "maximumAge":"0", "timeout":"5000"}
			);
		}
	},
	hidesuggestsearch: function(){
		this.$("#suggestBoxHolderCont").hide();
		return false;
	},
	selectsearchterm: function(ev){
		var $Target = $(ev.target);
		if ($Target.data("storeid")) {
			var storeId = $Target.data("storeid");
			var storeDetails = CVSJS.Promo.Services.getStoreDetails(storeId);
			if (storeDetails && storeDetails != null) {
				CVSJS.Promo.Services.hideSuggestStoreId();
				$(".pagination").show();
				$("#dStoreList").empty().parent().show();
				CVSJS.Promo.Data.stores = [];
				CVSJS.Promo.Data.stores.push(storeDetails.sm);
				CVSJS.Promo.App.renderResults();
				$('#dPaginationIntro').html('Details for CVS Store #' + storeId);
				$('.storedistance').hide();
			}
		}
		else {
			this.$("#iSearch").val($Target.html());
			this.findstores( "", $Target.data("latitude"), $Target.data("longitude") );
		}
		this.hidesuggestsearch();
		return false;
	},
	checkforenter: function(ev){
		if(ev.keyCode === 13){
			this.findstores(ev);
		}
	}
});

CVSJS.Promo.TemplateCache = CVSJS.Promo.TemplateCache || {
	get: function(selector){
		if(!this.templates){ this.templates = {}; }

		var template = this.templates[selector];
		if(!template){
			template = $(selector).html();
			template = _.template(template);
			this.templates[selector] = template;
		}

		return template;
	}
}

CVSJS.Promo.Helper = {
	getTotalPages: function(){
		if( CVSJS.Promo.storeList.collection.length % CVSJS.Promo.storeList.numItemsPerPage > 0 ) {
			return parseInt(CVSJS.Promo.storeList.collection.length / CVSJS.Promo.storeList.numItemsPerPage) + 1;
		} else {
			return CVSJS.Promo.storeList.collection.length / CVSJS.Promo.storeList.numItemsPerPage;
		}
	},
	getParameters: function(){
		var searchString = window.location.search.substring(1), params = searchString.split("&"), hash = {};
		for(var i = 0; i < params.length; i++){
			var val = params[i].split("=");
			hash[unescape(val[0])] = unescape(val[1]);
		}
		return hash;
	},
	testURLParmForElVis: function(urlparam,val,$el1,$el2){
		if(urlparam && urlparam == val){
			$el1.show();
			if($el2){
				$el2.show();
			}
		}
	},
	testURLParmForExistence: function(urlparam){
		if(urlparam){
			return true;
		}
		return false;
	},
	URLContains: function(inputstring){
		return window.location.href.indexOf(inputstring) >= 0;
	}
}

//Object for the app, maybe specific page context, has some controlling functions and values
CVSJS.Promo.App = {
	initialize: function(){

		//If we have a cookied store selection, let's use that
		if(CVSJS.Header.Details && CVSJS.Header.Details.sd){
			CVSJS.Promo.Data.mystore = CVSJS.Header.Details.sd;
		}
		
		CVSJS.Promo.searchBoxSection = new CVSJS.Promo.vSearch();
			
		var urlParms = CVSJS.Promo.Helper.getParameters();

		if(urlParms.m){
			CVSJS.Promo.Helper.testURLParmForElVis(urlParms.m,"1",$("#dHeaderMsg1"),$("#dNowChooseStore"));
			CVSJS.Promo.Helper.testURLParmForElVis(urlParms.m,"2",$("#dHeaderMsg2"),$("#dNowChooseStore"));
			CVSJS.Promo.Helper.testURLParmForElVis(urlParms.m,"3",$("#dHeaderMsg3"),$("#dNowChooseStore"));
			CVSJS.Promo.Helper.testURLParmForElVis(urlParms.m,"4",$("#dHeaderMsg4"),$("#dNowChooseStore"));
		}else{
			CVSJS.Promo.Helper.testURLParmForElVis("1","1",$("#dHeaderMsg1"),$("#dNowChooseStore"));
		}
		CVSJS.Promo.Helper.testURLParmForElVis(urlParms.tc,"1",$("#dPrintMsg"));
		
		if( CVSJS.Header.Flags.userIsSignedIn() || CVSJS.Header.Flags.userIsCookied() ){
			CVSJS.Promo.Services.getFavoriteStores();
		}
		
		if(CVSJS.Promo.Helper.testURLParmForExistence(urlParms.zp) && $.isEmptyObject( CVSJS.Promo.Data.mystore )){
			//use the supplied zip code
			$("#iSearch").val(urlParms.zp);
			CVSJS.Promo.searchBoxSection.findstores();
		}else if(CVSJS.Promo.Data.mystore && (CVSJS.Promo.Data.mystore.zp || (CVSJS.Promo.Data.mystore.ci && CVSJS.Promo.Data.mystore.st))){
			var searchTerm = "";
			if(CVSJS.Promo.Data.mystore.zp){
				searchTerm = CVSJS.Promo.Data.mystore.zp;
			}else{
				searchTerm = CVSJS.Promo.Data.mystore.ci + ", " + CVSJS.Promo.Data.mystore.st;
			}
			$("#iSearch").val(searchTerm);
			
			CVSJS.Promo.searchBoxSection.findstores();
		}else if(CVSJS.Header.Details.eh && CVSJS.Header.Details.eh.sd && (CVSJS.Header.Details.eh.sd[0].zp || (CVSJS.Header.Details.eh.sd[0].ci && CVSJS.Header.Details.eh.sd[0].st))){
			var searchTerm = "";
			if(CVSJS.Header.Details.eh.sd[0].zp){
				searchTerm = CVSJS.Header.Details.eh.sd[0].zp;
			}else{
				searchTerm = CVSJS.Header.Details.eh.sd[0].ci + ", " + CVSJS.Header.Details.eh.sd[0].st;
			}
			$("#iSearch").val(searchTerm);
			
			CVSJS.Promo.searchBoxSection.findstores();
		}else{
			//Geolocation
			CVSJS.Promo.searchBoxSection.geosearch();
		}
	},
	renderResults: function(){
		if(CVSJS.Promo.Data.stores.length > 0){

			CVSJS.Promo.storeListColl = new CVSJS.Promo.cStores(CVSJS.Promo.Data.stores);

			CVSJS.Promo.storeList = new CVSJS.Promo.vStoreList({ collection: CVSJS.Promo.storeListColl });
			CVSJS.Promo.storeList.render();
		
			if(CVSJS.Promo.listPagination1){
				CVSJS.Promo.listPagination1.undelegateEvents();
			}
			CVSJS.Promo.listPagination1 = new CVSJS.Promo.vPagination({ el:$("#dPagination1") });
			CVSJS.Promo.listPagination1.render();

			if(CVSJS.Promo.listPagination2){
				CVSJS.Promo.listPagination2.undelegateEvents();
			}
			CVSJS.Promo.listPagination2 = new CVSJS.Promo.vPagination({ el:$("#dPagination2") });
			CVSJS.Promo.listPagination2.render();
			
			CVSJS.Promo.listPaginationIntro = new CVSJS.Promo.vPaginationIntro({ el:$("#dPaginationIntro") });
			CVSJS.Promo.listPaginationIntro.render();
		}
	}
};

//Kick off the page
$( document ).ready( function() {
	//CVSJS.Helper.setBreadcrumb(["home","deals","myweeklyad"]);
	CVSJS.Promo.App.initialize();
});