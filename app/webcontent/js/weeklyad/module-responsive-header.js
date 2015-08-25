"use strict";

var CVSJS = CVSJS || {};

CVSJS.Defaults = {
	servicetimeoutms: 30000
}

CVSJS.Services = {
	sessionKeepAlive: function(callback){
		$.ajax({
			url: "/weeklyad/common/ping.ping",
			async: true,
			type: "GET",
			timeout: 30000,
			success: function(){
				callback(true);
			},
			error: function(){
				callback(false);
			}
		});
	},
	getJSON: function( serviceurl, requestData, requestType, useServerSideTimeout ){
		
		//Fix this for production
		var returnjson = "";
		
		var type = requestType ? requestType : "POST";
		var timeout = CVSJS.Defaults.servicetimeoutms;
		
		if(useServerSideTimeout && CVSJS.Header && CVSJS.Header.Details && CVSJS.Header.Details.au && CVSJS.Header.Details.au[6]){
			timeout = CVSJS.Header.Details.au[6] * 1000;
		}

		$.ajax({
			url: "/rest/bean" + serviceurl,
			async: false,
			type: type,
			data: requestData,
			dataType: "json",
			timeout: timeout,
			success: function( json ){
				if( json.atgResponse ){
					if( json.atgResponse.sc === "00" ){
						returnjson = json.atgResponse;
					}else{
						returnjson = { error: json.atgResponse.sc };
					}
				}else{
					returnjson = { error: "500" };
				}
			},
			error: function(xhrObj, errorType, errorThrown){
				//Redirect to fatal error page if headerdetails service fails.
				if(serviceurl.indexOf("getHeaderDetails") != -1){
					CVSJS.Helper.redirect("/weeklyad/common/error-page.html");
				}
				if(errorType == "timeout"){
					returnjson = { error: "999" };
				}else{
					returnjson = { error: "500" };
				}
			}
		});
		
		return returnjson;
	},
	getAsyncJSON: function( serviceurl, requestData, requestType, useServerSideTimeout, callback ){
		
		//Fix this for production
		var returnjson = "";
		
		var type = requestType ? requestType : "POST";
		var timeout = CVSJS.Defaults.servicetimeoutms;
		
		if(useServerSideTimeout && CVSJS.Header && CVSJS.Header.Details && CVSJS.Header.Details.au && CVSJS.Header.Details.au[6]){
			timeout = CVSJS.Header.Details.au[6] * 1000;
		}
		
		$.ajax({
			url: "/rest/bean" + serviceurl,
			async: true,
			type: type,
			data: requestData,
			dataType: "json",
			timeout: timeout,
			success: function( json ){
				if( json.atgResponse ){
					if( json.atgResponse.sc === "00" ){
						callback(json.atgResponse);
					}else{
						callback({ error: json.atgResponse.sc });
					}
				}else{
					callback({ error: "500" });
				}
			},
			error: function(xhrObj, errorType, errorThrown){
				if(errorType == "timeout"){
					callback({ error: "999" });
				}else{
					callback({ error: "500" });
				}
			}
		});
		
		return returnjson;
	}
}

CVSJS.Header = {};

CVSJS.Header.Details = {};

CVSJS.Header.Services = {
	URL: {
		getHeaderDetails:	"/cvs/weeklyad/CvsWeeklyAdBrowseServices/getHeaderDetails",
		logOut: 			"/cvs/commerce/profile/CvsWeeklyAdProfileServices/logoutUser",
		notYou:             "/cvs/commerce/profile/CvsWeeklyAdProfileServices/logoutUser?ny=yes"
	},
	getHeaderDetails: function(){
		var data = CVSJS.Services.getJSON( this.URL.getHeaderDetails, { issneakpeek : window.location.href.indexOf("issneakpeek=true") >= 0 } );
		if(data && data.hd){
			CVSJS.Header.Details = data.hd;
		}
		
		var redirectToSignIn = function(){
			if(CVSJS.Header.Details){
				if(CVSJS.Header.Details.li){
					return true; //needs to login
				}
			}
			
			return false; //all other cases
		}
		
		var redirectToStoreLocator = function(){
			if(CVSJS.Header.Details){
				if(CVSJS.Header.Details.sd && CVSJS.Header.Details.sd.id){
					return false; //has a default store
				}
			}
			
			return true; //all other cases, send to select a store
		}
		
		var redirectToAttachECCard = function(){
			if(CVSJS.Header.Details){
				if(CVSJS.Header.Details.ie){
					return true; //should be redirected
				}
			}
			
			return false; //all other cases, don't redirect
		}

		var redirectToAttachECCardPrevPurchase = function(){
			if(CVSJS.Helper.URLContains("#" + CVSJS.Promo.URL.prevpurchases)){
				if(CVSJS.Header.Details){
					if(CVSJS.Header.Details.ec == false){
						return true; //should be redirected
					}
				}
			}
			
			return false; //all other cases, don't redirect
		}
		


		if( (CVSJS.Helper.URLContains("ExtraCareEC") || CVSJS.Helper.URLContains("YourDealsEC")) &&  CVSJS.Header.Flags.userIsEcOptedIn() ) {
			// Opted in
			var ecPathFull = ( CVSJS.Helper.URLContains("ExtraCareEC") ) ? CVSJS.Promo.URL.extracarefull : CVSJS.Promo.URL.yourdealsfull;
			var ecPathPart = ( CVSJS.Helper.URLContains("ExtraCareEC") ) ? '#' + CVSJS.Promo.URL.extracare : '#' +CVSJS.Promo.URL.yourdeals;

			CVSJS.Promo.Helper.setCookie('CVS_WEEKLYAD_RELOAD', 'true', 2000);

				if(CVSJS.Header.Flags.userIsSignedIn() || CVSJS.Header.Flags.userIsCookied() ) {
					// loggedin/hybrind 
					if( redirectToStoreLocator() ) {
						CVSJS.Helper.redirect(CVSJS.Promo.URL.storelocator + '?redirect=false' + ecPathPart);
					} else {
						$('.browse-home-mainPage').show();
						CVSJS.Helper.redirect(ecPathFull);
					}

				} else {
					// Guest
					if( redirectToStoreLocator() ) {
						CVSJS.Helper.redirect(CVSJS.Promo.URL.storelocator + '?redirect=false' + ecPathPart);
					} else {
						$('.browse-home-mainPage').show();
						CVSJS.Helper.redirect(ecPathFull);
						
					}
				}
		}else if( (CVSJS.Helper.URLContains("ExtraCareEC") || CVSJS.Helper.URLContains("YourDealsEC")) && (CVSJS.Header.Flags.userIsSignedIn() || CVSJS.Header.Flags.userIsCookied()) && (CVSJS.Header.Flags.userHasECCard()) ) {
			// loggedin/hybrid and not opted in.
			var ecPathFull = ( CVSJS.Helper.URLContains("ExtraCareEC") ) ? CVSJS.Promo.URL.extracarefull : CVSJS.Promo.URL.yourdealsfull;
			var ecPathPart = ( CVSJS.Helper.URLContains("ExtraCareEC") ) ? '#' + CVSJS.Promo.URL.extracare : '#' +CVSJS.Promo.URL.yourdeals;
			CVSJS.Promo.Helper.setCookie('CVS_WEEKLYAD_RELOAD', 'true', 2000);
				
				if( redirectToStoreLocator() ) {
					CVSJS.Helper.redirect(CVSJS.Promo.URL.storelocator + '?redirect=false' + ecPathPart);
				} else {
					$('.browse-home-mainPage').show();
					CVSJS.Helper.redirect(ecPathFull);
				}
		}else if(CVSJS.Helper.URLContains("/weeklyad/browse/browse-home.jsp") || CVSJS.Helper.URLContains("/weeklyad/browse/browse-home-wa.jsp")){
			if(redirectToSignIn() && !CVSJS.Helper.URLContains("#Detail/")){

				//Get the current URL to redirect after sign in
				var parmSneakPeek = "";
				if(CVSJS.Helper.URLContains("issneakpeek=true")){
					parmSneakPeek = "?issneakpeek=true";
				}
				var currentPath = encodeURIComponent(window.location.pathname + parmSneakPeek + window.location.hash);
				CVSJS.Helper.redirect(CVSJS.Promo.URL.signin + "?screenname=" + currentPath);
			}else if(redirectToAttachECCard() && !CVSJS.Helper.URLContains("#Detail/")){
				CVSJS.Helper.redirect(CVSJS.Promo.URL.attacheccard);
			}else if(redirectToAttachECCardPrevPurchase() && !CVSJS.Helper.URLContains("#Detail/")){
				CVSJS.Helper.redirect(CVSJS.Promo.URL.attacheccard);
			}else if(redirectToStoreLocator()){
				if(CVSJS.Helper.URLContains("#Detail/")){
					var dealDetailDetails = window.location.href.substring(window.location.href.indexOf("#Detail/"));
					CVSJS.Helper.redirect(CVSJS.Promo.URL.storelocator + dealDetailDetails);
				}else{
				     var webTrendsString = CVSJS.Header.getParameterByName('WT.mc_id');
                     if(webTrendsString) {
                          CVSJS.Helper.redirect(CVSJS.Promo.URL.storelocator+ '?WT.mc_id=' + webTrendsString);
                      } else {
                       CVSJS.Helper.redirect(CVSJS.Promo.URL.storelocator);
                     }
				}
			}else {
				$('.browse-home-mainPage').show(); //Show browse page, which is hidden by default
			}
		}
	},
	logOut: function(){
		//This response has different JSON structure. We've modified to comply with the iPad logout service.
		$.ajax({
			url: "/rest/bean" + this.URL.logOut,
			async: false,
			type: "POST",
			dataType: "json",
			timeout: CVSJS.Defaults.servicetimeoutms,
			success: function( json ){
				if( json.atgResponse && json.atgResponse.status && json.atgResponse.status.code && json.atgResponse.status.code === "0000" ){
					CVSJS.Helper.redirect(CVSJS.Promo.URL.home);
				}
			},
			error: function(xhrObj, errorType, errorThrown){
			}
		});
	},
	notYou: function(){
		var data = CVSJS.Services.getJSON( this.URL.notYou );
		if(data){
			CVSJS.Helper.redirect(CVSJS.Promo.URL.login);
		}
	}
};

CVSJS.Header.TemplateCache = CVSJS.Header.TemplateCache || {
	get: function(selector){
		if (!this.templates){ 
			this.templates = {}; 
		}

		var template = this.templates[selector];
		if (!template){
			template = $(selector).html();

			//precompile the template, for underscore.js templates
			template = _.template(template);

			this.templates[selector] = template;
		}

		return template;
	}
}

//Details.au flags
//0 = IsPPRequired, 1 = IsPersonalizationEnabled, 2 = User State, 3 = First Name, 4 = IsSneakPeek Available, 5 = IsExtraCare Tied, 6 = Service Timeout, 7 = GeoLocation
CVSJS.Header.Flags = CVSJS.Header.Flags || {
	userIsGuest: function(){
		if(CVSJS.Header.Details.au && CVSJS.Header.Details.au[2]){
			return CVSJS.Header.Details.au[2] === "0" ? true : false;
		}
		return false;
	},
	userIsCookied: function(){
		if(CVSJS.Header.Details.au && CVSJS.Header.Details.au[2]){
			return CVSJS.Header.Details.au[2] === "2" ? true : false;
		}
		return false;
	},
	userIsSignedIn: function(){
		if(CVSJS.Header.Details.au && CVSJS.Header.Details.au[2]){
			return CVSJS.Header.Details.au[2] === "3" ? true : false;
		}
		return false;
	},
	userHasECCard: function(){
		if(CVSJS.Header.Details.au && CVSJS.Header.Details.au[5]){
			return CVSJS.Header.Details.au[5] == "1" ? true : false;
		}
		return false;
	},
	showSneakPeek: function(){
		if(CVSJS.Header.Details.au && CVSJS.Header.Details.au[4]){
			return CVSJS.Header.Details.au[4] == "1" ? true : false;
		}
		return false;
	},
	personalizationEnabled: function(){
		if(CVSJS.Header.Details.au && CVSJS.Header.Details.au[1]){
			return CVSJS.Header.Details.au[1] === "1" ? true : false;
		}
		return false;
	},
	noDealsAvailable: function(){
		if((CVSJS.Header.Details.sd && CVSJS.Header.Details.sd.wf && CVSJS.Header.Details.sd.wf != "Y") || CVSJS.Header.Details.ei == null){
			return true
		}
		return false;
	},
	showPrevPurchases: function(){
		if(CVSJS.Header.Details.au && CVSJS.Header.Details.au[0]){
			return CVSJS.Header.Details.au[0] === "1" ? true : false;
		}
		return false;
	},
	/* Start ITPR007726 - CR03451 - Extracare COOKIE OPT-IN -Added EC opt in flag */
	userIsEcOptedIn: function(){
		if(CVSJS.Header.Details.au && CVSJS.Header.Details.au[8]){
			return CVSJS.Header.Details.au[8] === "1" ? true : false;
		}
		return false;
		/* End ITPR007726 - CR03451 - Extracare COOKIE OPT-IN */
	}
}
CVSJS.Header.BuildShoppingCart = function(){
	var data = CVSJS.Header.Details.io;
	if(data && data.ItemCount && data.ItemCount > 0){
		$(".countHolder .wrap").html(data.ItemCount);
		$(".sItemCount").html(data.ItemCount);
		$(".aCartItem").show();
		$(".aCartEmpty").hide();
		$("#flyoutcart").addClass("sublevel");
		$("#sCartTotal").append(data.OrderSubTotal);
		CVSJS.Header.PopulateShoppingCartFlydown();
	}else{
		$(".aCartItem").hide();
		$(".aCartEmpty").show();
		$("#flyoutcart").hide();
	}
}

CVSJS.Header.getParameterByName = function (name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

CVSJS.Header.PopulateShoppingCartFlydown = function(){
	var data = CVSJS.Header.Details.io;
	var returnHTML = "";
		
	if(data && data.Items){
		$.each( data.Items, function( key, value ) {
			//value		
			returnHTML += CVSJS.Header.CreateCartItem(value);
				
		});
		
		$("#dCartItemCont").append(returnHTML);
	}
}

CVSJS.Header.CreateCartItem = function(cartObj){
	var returnHTML = "";
	returnHTML += "<div class='cartItem'>";
	returnHTML += "<div class='cartImageCont'><a class='cartItemImg' href='"+ cartObj.skuLink +"'><img src='/bizcontent/merchandising/productimages/small/" + cartObj.upcNumber + ".jpg' alt='" + cartObj.displayname + "'></a></div>";
	returnHTML += "<div class='cartItemDesc'><strong class='title'><a class='cont_discountaltsub' href='"+ cartObj.skuLink +"'>" + cartObj.description + "</a> <br />" + cartObj.displayname + " </strong> <br /><br /> Size: " + cartObj.size + "<br> Qty: " + cartObj.qty + "</div>";
	returnHTML += "<div class='cartItemPrice'><strong> $" + cartObj.salePrice + "</strong>"
	if(cartObj.offer){
		returnHTML += "<span class='strikethrough'> $" + cartObj.listPrice + "</span><br /><span class='greentxt'> " + cartObj.offer + " </span>";
	}
	returnHTML += "</div></div>";
	
	return returnHTML;
}

// Populate FlyDown menu items
String.prototype.toTitleCase=function(){
	var str=this;
	return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

CVSJS.Header.PopulateSubMenuItems = function(el,label,obj){
	var subMenuItems = obj["im"],rc = obj["rc"],lc = obj["lc"], leftContainer,subLevelContainer, subNavContainer, subLinkContainer;
	//var subLevelContainer = $(el).find(".sublevel");
	if($(el).find(".sublevel").size()<=0){
		$(el).append('<div id="'+label+'-flyout" class="sublevel twoCols"></div>');
	}
	subLevelContainer = $(el).find(".sublevel");
	if(subLevelContainer.find(".sublevel-nav").size() <= 0){
		subLevelContainer.append("<ul class='sublevel-nav'></ul>");
	}
	subNavContainer = subLevelContainer.find(".sublevel-nav");
	subNavContainer.empty();
	subNavContainer.append('<div class="menu_footer_img_' + label + '">&nbsp;</div>');
	if(subMenuItems.length>0){
		var subNavAppendHTML = "";
		$.each(subMenuItems,function(index,item){
			subNavAppendHTML += '<li><a href="' + item["au"] + '" data-url="' + item["du"] + '">' + item["nm"] + '</a><div class="menu-data-load-cont" style="display: none;"></div></li>';
		});
		subNavContainer.append(subNavAppendHTML);
	}
	leftContainer = "home_menu_deals_dynamic_" + label.toTitleCase();
	subNavContainer.append('<div id="' + leftContainer + '"></div>');
	subNavContainer.find("#"+leftContainer).load(lc);
	CVSJS.Header.LoadSubMenuFooterContent(subNavContainer.find(".menu_footer_img_" + label),rc);
}

CVSJS.Header.LoadSubMenuFooterContent = function(container,url){
	$.get(url,function(data){
		$("body").append(data);
	});
}

CVSJS.Header.PopulateSubMenu = function(){
	if(CVSJS.Header.Details){
		var mainNavItems = $("#top-nav-tabs li.top-nav-tab");
		if(mainNavItems.size() > 0){
			$.each(mainNavItems,function(index,item){
				var itemId = $(item).attr("id"),subMenuItems,subMenuLinks,promotionImage;
				if(itemId){
					switch(itemId){
						case "pharmacy-top-nav-tab":
							if(CVSJS.Header.Details["dp"]){
								var dataList=CVSJS.Header.Details["dp"];
								if(dataList && dataList["lc"] && dataList["rc"]){
									$(item).data("lc",dataList["lc"]);
									$(item).data("rc",dataList["rc"]);
									CVSJS.Header.PopulateSubMenuItems(item,"pharmacy",dataList);
								}
							}
							break;
						case "shop-top-nav-tab":
							if(CVSJS.Header.Details["ds"]){
								var dataList=CVSJS.Header.Details["ds"];
								if(dataList && dataList["lc"] && dataList["rc"]){
									$(item).data("lc",dataList["lc"]);
									$(item).data("rc",dataList["rc"]);
									CVSJS.Header.PopulateSubMenuItems(item,"shop",dataList);
								}
							}
							break;
						case "deals-top-nav-tab":
							if(CVSJS.Header.Details["dd"]){
								var dataList=CVSJS.Header.Details["dd"];
								if(dataList && dataList["lc"] && dataList["rc"]){
									$(item).data("lc",dataList["lc"]);
									$(item).data("rc",dataList["rc"]);
									CVSJS.Header.PopulateSubMenuItems(item,"deals",dataList);
								}
							}
							break;
						case "extracare-top-nav-tab":
							if(CVSJS.Header.Details["de"]){
								var dataList=CVSJS.Header.Details["de"];
								if(dataList && dataList["lc"] && dataList["rc"]){
									$(item).data("lc",dataList["lc"]);
									$(item).data("rc",dataList["rc"]);
									CVSJS.Header.PopulateSubMenuItems(item,"extracare",dataList);
								}
							}
							break;
						default:
							break;
					}
				}
			});
		}
	}
}

CVSJS.Helper = CVSJS.Helper || {
	getCookieValue: function(c_name){
		var c_value = document.cookie;
		var c_start = c_value.indexOf(" " + c_name + "=");
		if (c_start == -1) {
			c_start = c_value.indexOf(c_name + "=");
		}
		if (c_start == -1){
			c_value = null;
		}else{
			c_start = c_value.indexOf("=", c_start) + 1;
			var c_end = c_value.indexOf(";", c_start);
			if (c_end == -1){
				c_end = c_value.length;
			}
			c_value = unescape(c_value.substring(c_start,c_end));
		}
		return c_value;
	},
	redirect: function(url){
		window.location.href = url;
	},
	URLContains: function(inputstring){
		return window.location.href.indexOf(inputstring) >= 0;
	},
	raiseGlobalErrors: function(arrError){
		$("#dWeeklyadGlobalErrorBox").show();
		$("#lErrorList").empty();
		$.each(arrError, function(idx){
			$("#lErrorList").append("<li>" + arrError[idx] + "</li>");
		});
	},
	setHeaderText: function(section, callback){
		var appendHTML = '';
		switch(section){
			case "browse":
			case "myweeklyad":
			case "dealdetails":
				//if(CVSJS.Header.Flags.userIsSignedIn()){
					appendHTML = this.getMyCVShtml()+ '<span class="text-section">Weekly Ad</span>';
				//}else if(CVSJS.Header.Flags.userIsCookied()){
				//	appendHTML = '<span class="text-section">My Weekly Ad</span>';
				//}else{
				//	appendHTML = '<span class="text-section">Weekly Ad</span>';
				//}
				break;
			case "shoppinglist":
				//if(CVSJS.Header.Flags.userIsSignedIn()){
					appendHTML = this.getMyCVShtml()+ '<span class="text-section">Shopping List</span>';
				//}else if(CVSJS.Header.Flags.userIsCookied()){
				//	appendHTML = '<span class="text-section">My Shopping List</span>';
				//}else{
				//	appendHTML = '<span class="text-section">Shopping List</span>';
				//}
				break;
			case "previouspurchases":
				appendHTML = this.getMyCVShtml()+ '<span class="text-section">Purchase History</span>';
				break;
		}
		return callback(appendHTML);
	},
	getMyCVShtml: function() {
		return '<span class="myCVS"><span class="text-my">my</span></span>';
	},
	showError: function(errMsg){
		$("#dWeeklyadGlobalErrorBox").show();
		$("#lErrorList").empty();
		$("#lErrorList").append("<li>" + errMsg + "</li>");
	}
}

CVSJS.Promo = CVSJS.Promo || {};

CVSJS.Promo.URL = {
	browsefull: 	"/weeklyad/browse/browse-home.jsp#Browse",
	extracarefull: 	"/weeklyad/browse/browse-home.jsp#ExtraCare",
	yourdealsfull: 	"/weeklyad/browse/browse-home.jsp#YourDeals",
	browse: 		"Browse",
	extracare:      "ExtraCare",
	yourdeals:      "YourDeals",
	shoppinglist: 	"ShoppingList",
	shoplistfull:	"/weeklyad/browse/browse-home.jsp?#ShoppingList",
	dealdetails:	"/weeklyad/browse/browse-home.jsp",
	prevpurchases: 	"PreviousPurchases",
	sneakpeek:	 	"/weeklyad/browse/browse-home.jsp?issneakpeek=true#SneakPeek",
	storelocator: 	"/weeklyad/access-path/store-locator.jsp",
	attacheccard: 	"/weeklyad/access-path/weeklyad_extracare_tie.jsp",
	signin: 		"/weeklyad/access-path/weeklyAdSignIn.jsp",
	home:			"/",
	deals:			"/deals/deals.jsp",
	login:			"/account/login.jsp"
};

$( document ).ready( function() {
	
// NIDC Commented out	CVSJS.Header.Services.getHeaderDetails();
		
	// Populate mybasket item details
	CVSJS.Header.BuildShoppingCart();
	
	// Populate flydown menu details
	CVSJS.Header.PopulateSubMenu();

		
	$("#aSignout").click(function(event){
		event.preventDefault();
		CVSJS.Header.Services.logOut();
		CVSJS.Helper.redirect(CVSJS.Promo.URL.home);
	});
	$("#notyou").click(function(event){
		event.preventDefault();
		CVSJS.Header.Services.notYou();
		CVSJS.Helper.redirect(CVSJS.Promo.URL.login);
	});	
		
	//Mobile
	$("#aSignOutMob").click(function(event){
		event.preventDefault();
		CVSJS.Header.Services.logOut();
		CVSJS.Helper.redirect(CVSJS.Promo.URL.home);
	});	
	$("#m-notyou").click(function(event){
		event.preventDefault();
		CVSJS.Header.Services.notYou();
		CVSJS.Helper.redirect(CVSJS.Promo.URL.login);
	});	
	$(".aMheaderSignIn").click(function(event){
		event.preventDefault();
		var currentPath = encodeURIComponent(window.location.pathname + window.location.hash);
		CVSJS.Helper.redirect("/weeklyad/access-path/weeklyAdSignIn.jsp" + "?screenname=" + currentPath);
	});	

	$("#sWelcome").show();	
	$("#signInLinks .sDivider").show();	
	$("#sLoadingImg").hide();
	$("#sLoadingImgMob").hide();
	
	//Trim first name in header to show max 12 characters.
	if(CVSJS.Header.Details.au && CVSJS.Header.Details.au[3]){
		var firstName = CVSJS.Header.Details.au[3];			
		if(firstName && firstName.length > 13){
			firstName = firstName.substring(0,12) + "...";
		}
	}	
	
	if( CVSJS.Header.Flags.userIsSignedIn() ){
		//The user is signed in					
		CVSJS.Header.Details.au[3] ? $("#sWelcome").html( "Welcome " + firstName ) : $("#sWelcome").html( "Welcome");		
		$("#aSignout").show();
		$("#myaccount").show();
		$("#sMyCvsIcon").show();		
		//Mobile		
		$("#aSignOutMob").show();
		CVSJS.Header.Details.au[3] ? $("#sWelcomeMob").html( "Welcome " + firstName ) : $("#sWelcomeMob").html( "Welcome");
		$("#sWelcomeMob").show();		
	}else if( CVSJS.Header.Flags.userIsCookied() ){
		//Not signed in, has cookie		
		CVSJS.Header.Details.au[3] ? $("#sWelcome").html( "Welcome " + firstName ) : $("#sWelcome").html( "Welcome");		
		CVSJS.Header.Details.au[3] ? $("#sWelcomeMob").html( "Welcome " + firstName ) : $("#sWelcomeMob").html( "Welcome");
		$("#signInOverlay").show();
		$("#notyou").show();		
		//Mobile		
		//$("#aSignInMob").show();
		$("#sCookiedMob").show();
	}else{				
		$("#signInOverlay").show();
		$("#ortext").show();
		$("#createaccount").show();			
		//Mobile		
		$("#sWelcomeMob").show();
		$("#aSignInMob").show();		
	}
	
	/*Mobile responsive header top nav flydowns*/
	function toggleMenu(){
		$("#menu-mob-id").toggleClass("un_menPan2");			    	
		$("#mob-menu-flydwn").slideToggle();
	}
	function toggleStore(){
		$("#store-mob-id").toggleClass("un_storePan2");
		$("#mob-store-flydwn").slideToggle();
	}
	function toggleSearch(){
		$("#search-mob-id").toggleClass("un_searchPan2");
		$("#mob-search-flydwn").slideToggle();
	}

	$("#menuExp0").bind({
		"click": function(){
			if ($('#mob-store-flydwn').css('display') === 'block'){		    	
				toggleStore();
			}else if ($('#mob-search-flydwn').css('display') === 'block'){
				toggleSearch();
			}			
			toggleMenu();	
		}
	});
	
	$(".un_menuCell").bind({
		"click": function(){						
			toggleMenu();	
		}
	});	
	
	$("#storeExp0").bind({
		"click": function(){
			if ($('#mob-menu-flydwn').css('display') === 'block'){		    	
				toggleMenu();
			}else if ($('#mob-search-flydwn').css('display') === 'block'){
				toggleSearch();
			}			
			toggleStore();	
		}
	});
	
	$("#searchExp0").bind({
		"click": function(){
			if ($('#mob-store-flydwn').css('display') === 'block'){		    	
				toggleStore();
			}else if ($('#mob-menu-flydwn').css('display') === 'block'){
				toggleMenu();
			}			
			toggleSearch();		    	
		}
	});

	//@TODO - This should NOT happen on just load. Check to see if this breaks anything.
	// Show mobile header if your are on m.cvs.com. also update the overlay wrap to mobile slider.
	 if(CVSJS.Helper.URLContains("m.cvs.com") || window.innerWidth <= 640){
	 	$("#desktopResponsiveHeader").hide();
	 	$("#breadcrumb").hide();
	 	$("#responsiveMainwrapper").addClass("mobileMainwrapper");
	 	$("#mobileResponsiveHeader").addClass("showMobileH");
	 	$("#mobileResponsiveHeader").show();		
	 }
	 else{
	 	$("#mobileResponsiveHeader").hide();		
	 	$("#responsiveMainwrapper").removeClass("mobileMainwrapper");
	 	$("#breadcrumb").show();
	 	$("#desktopResponsiveHeader").show();
	 }
});
