"use strict";

var bingMapKey='AoMW7rW2AGsk7Wo_YeYlOmBYKchZhoG_RevcuFmMBwVCklJLrCAYhphAzJIQLnhY';

//This will change the brackets within templates to be <@ @>, safe for JSP
_.templateSettings = {
	interpolate: /\<\@\=(.+?)\@\>/gim,
	evaluate: /\<\@(.+?)\@\>/gim,
	escape: /\<\@\-(.+?)\@\>/gim
};

var CVSJS = CVSJS || {};
CVSJS.Promo = {};
CVSJS.Promo.Data = {
	stores: [],
	favstores: [],
	mystore: {}
}

CVSJS.Promo.Services = {
	URL: {
		getStores:			"/cvs/store/CvsStoreLocatorServices/getSearchStore",
		setFavoriteStore: 	"/cvs/store/CvsStoreLocatorServices/getAddStoreToFavoriteList",
		getFavoriteStores:	"/cvs/store/CvsStoreLocatorServices/getFavoriteStores"	
	},
	getJSON: function( serviceurl, requestData, requestType, bAsync ){
	
		var returnjson = "";

		var type = requestType ? requestType : "POST";
		var async = bAsync ? bAsync : false;
		
		$.ajax({
			url: "/rest/bean" + serviceurl,
			async: async,
			type: type,
			data: requestData,
			dataType: "json",
			success: function( json ){
				if( json.atgResponse ){
					if( json.atgResponse.ST === "00" ){
						returnjson = json.atgResponse.sd;
					} else {
						returnjson = "";
					}
				}
			},
			error: function(){
				var nogood;
			}
		});
		
		return returnjson;
	},
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
		
		var bingURL = restprotocol+"//dev.virtualearth.net/REST/v1/Locations?query=" + encodeURIComponent(searchString) + "," + countryRegion + "&output=json&key=" + bingMapKey + "&$filter=Cvs_Store_Flag%20Eq%20'Y'" + "&jsonp=?";
		
		$.getJSON( bingURL, function( data ){
			if(data && data.resourceSets.length > 0 && data.statusCode == "200"){
				return callback(data.resourceSets[0].resources, searchString, data.resourceSets[0].estimatedTotal);
			}else{
				return callback([], searchString, 0);
			}
		});
	},
	getStores: function( reqData ){
		CVSJS.Promo.Data.stores = this.getJSON( this.URL.getStores, reqData );
	},
	setFavoriteStore: function( reqData ){
		CVSJS.Promo.Data.mystore = this.getJSON( this.URL.setFavoriteStore, reqData );
		return CVSJS.Promo.Data.mystore.id;
	},
	getFavoriteStores: function( reqData ){
		var responsedata = this.getJSON( this.URL.getFavoriteStores, reqData );
		CVSJS.Promo.Data.mystore = responsedata[0];
		CVSJS.Promo.Data.favstores = responsedata;
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
		this.$el.empty();
		var renderedTemplate = this.template({pageInfo: this.pageInfo});
		this.$el.append( renderedTemplate );
				
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
		this.render();
	},
	numItemsPerPage: 9, //default value
	currentPage: 1,
	startIndex: 0,
	render: function() {
		this.startIndex = this.numItemsPerPage * this.currentPage - this.numItemsPerPage;
		var els = [];
		this.$el.empty();
		
		this.$(".results").html((this.startIndex + 1) + "-" + (this.startIndex + this.numItemsPerPage) + " of " + this.collection.length + " Results");
		
		for(var x=this.startIndex;x<(this.startIndex + this.numItemsPerPage);x++){
			var currentModel = this.collection.at(x);
			if( currentModel ){
				var storeEntry = new CVSJS.Promo.vStoreEntry({ model: currentModel, storeIndex: x+1 });
				els.push( storeEntry.render().el );
			}
		}
		this.$el.append( els );
		return this;
	},
	renderNoResults: function(){
		this.$el.empty();
		var renderedTemplate = CVSJS.Promo.TemplateCache.get("#tmplNoResults");
		this.$el.append( renderedTemplate );
	}
});

//View for a single store in the list of stores
CVSJS.Promo.vStoreEntry = Backbone.View.extend({
	initialize: function (storeData) {
		_.bindAll( this, "render" );
		this.template = CVSJS.Promo.TemplateCache.get("#tmplStore");
		this.model = storeData.model;
		this.model.set("indx", storeData.storeIndex);
		this.render();
	},
	render: function() {
		this.$el.empty();
		var renderedTemplate = this.template({ store: this.model.toJSON() });
		this.$el.append( renderedTemplate );
		return this;
	},
	events: {
		"click .shopstorelink" : "selectstore"
	},
	selectstore: function(ev){
		if(CVSJS.Promo.Services.setFavoriteStore({ storeId: this.model.id })){
			CVSJS.Helper.redirect(CVSJS.Header.browseurl);
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
		this.$el.empty();
		var renderedTemplate = this.template();
		this.$el.append( renderedTemplate );
		
		return this;
	},
	events: {
		"click #btnFindStores" : "findstores",
		"keyup #iSearch" : "checkforenter",
		"click .searchtermlink" : "selectsearchterm",
		"click .closesuggest" : "hidesuggestsearch"
	},
	findstores: function( ev, latitudeData, longitudeData ){

		if( latitudeData && longitudeData ){
			//We have lat/long from a clicked link in the suggest box
			CVSJS.Promo.Services.getStores({ latitude: latitudeData, longitude: longitudeData });

			if(CVSJS.Promo.Data.stores.length > 0){
	 			$("#suggestBox").hide();
	 			$(".pagination").show();
	 			$(".content-block").show();
	 			CVSJS.Promo.App.renderResults();
	 		}
		}else{
			var currentView = this;
			//We only have a search term, send it to bing to get results
			CVSJS.Promo.Services.getBingResults($("#iSearch").val(), function(bingResults, searchTerm, totalPlaces){
				if(totalPlaces > 1)
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
			 					if(bingResults[i].address.adminDistrict != null){
			 						address = address+', ' + bingResults[i].address.adminDistrict;
			 					}
			 					if(bingResults[i].address.adminDistrict2 != null){
			 						address = address + ', ' + bingResults[i].address.adminDistrict2;
			 					}
			 					
								if(data.resourceSets[0].resources[0].name === "United States" || data.resourceSets[0].resources[0].name === "Puerto Rico"){
									currentView.$('#iSearch').val(searchTerm);
								}else{
									currentView.$('#iSearch').val(data.resourceSets[0].resources[0].name);
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
			 			CVSJS.Promo.storeList.renderNoResults();
			 		}
				}else if (totalPlaces === 1){
					CVSJS.Promo.Services.getStores({ latitude: bingResults[0].point.coordinates[0], longitude: bingResults[0].point.coordinates[1] });
				}else{
		 			CVSJS.Promo.storeList.renderNoResults();
				}

				if(CVSJS.Promo.Data.stores.length > 0){
					currentView.$("#suggestBox").hide();
					$(".pagination").show();
					$(".content-block").show();
		 			CVSJS.Promo.App.renderResults();
		 		}
			});
		}
	},
	hidesuggestsearch: function(){
		$("#suggestBoxHolderCont").hide();
	},
	selectsearchterm: function(ev){
		var $Target = $(ev.target);
		this.$("#iSearch").val($Target.html());
		$("#suggestBoxHolderCont").hide();
		
		this.findstores( "", $Target.data("latitude"), $Target.data("longitude") );
	},
	checkforenter: function(ev){
		//Submit search on Enter
		if(ev.keyCode === 13){
			this.findstores();
		}
	}
});

//Object for the app, maybe specific page context, has some controlling functions and values
CVSJS.Promo.App = {
	initialize: function(){
			
		var urlParms = CVSJS.Promo.Helper.getParameters();

		CVSJS.Promo.Helper.testURLParmForElVis(urlParms.m,"1",$("#dHeaderMsg1"));
		CVSJS.Promo.Helper.testURLParmForElVis(urlParms.m,"2",$("#dHeaderMsg2"));
		CVSJS.Promo.Helper.testURLParmForElVis(urlParms.m,"3",$("#dHeaderMsg3"));
		CVSJS.Promo.Helper.testURLParmForElVis(urlParms.m,"4",$("#dHeaderMsg4"));
		CVSJS.Promo.Helper.testURLParmForElVis(urlParms.tc,"1",$("#dPrintMsg"));

		CVSJS.Promo.searchBoxSection = new CVSJS.Promo.vSearch();
		
		//Call service to get user's selected store
		CVSJS.Promo.Services.getFavoriteStores();
		
		if(CVSJS.Promo.Data.mystore){
			var searchTerm = "";
			if(CVSJS.Promo.Data.mystore.zp){
				searchTerm = CVSJS.Promo.Data.mystore.zp;
			}else{
				searchTerm = CVSJS.Promo.Data.mystore.ci + ", " + CVSJS.Promo.Data.mystore.st;
			}
			//Setstore location in search box
			$("#iSearch").val(searchTerm)
		}
		
		//Call get stores
		CVSJS.Promo.searchBoxSection.findstores();
	},
	renderResults: function(){
		if(CVSJS.Promo.Data.stores.length > 0){
			
			CVSJS.Promo.storeListColl = new CVSJS.Promo.cStores(CVSJS.Promo.Data.stores);
			
			CVSJS.Promo.storeList = new CVSJS.Promo.vStoreList({ collection: CVSJS.Promo.storeListColl });
			CVSJS.Promo.storeList.render();
		
			CVSJS.Promo.listPagination1 = new CVSJS.Promo.vPagination({ el:$("#dPagination1") });
			CVSJS.Promo.listPagination1.render();

			CVSJS.Promo.listPagination2 = new CVSJS.Promo.vPagination({ el:$("#dPagination2") });
			CVSJS.Promo.listPagination2.render();
			
			CVSJS.Promo.listPaginationIntro = new CVSJS.Promo.vPaginationIntro({ el:$("#dPaginationIntro") });
			CVSJS.Promo.listPaginationIntro.render();
		}
	}
};

CVSJS.Promo.TemplateCache = CVSJS.Promo.TemplateCache || {
	get: function(selector){
		if(!this.templates){ this.templates = {}; }

		var template = this.templates[selector];
		if(!template){
			template = $(selector).html();

			//precompile the template, for underscore.js templates
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
	testURLParmForElVis: function(urlparam,val,$el){
		if(urlparam && urlparam == val){
			$el.show();
		}else{
			$el.hide();
		}
	}
}

//Kick off the page
$( document ).ready( function() {
	CVSJS.Promo.App.initialize();
});