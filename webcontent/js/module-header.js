//Global Object
	var CVSJS = CVSJS || {};
	CVSJS.OverlayCont = "#cvs-overlay .details"; //Default wrap for overlays

	if (window.innerWidth <= 640 || window.location.href.indexOf("m.cvs.com") >= 0) {
		CVSJS.OverlayCont = "#slideout #slideOutWrap";// For modals in mobile we are setting a different wrap to place the slideout content
	}else{
		CVSJS.OverlayCont = "#cvs-overlay .details";
	}
	CVSJS.Overlays = {
			showEnrollOverlay:function(){
				   if($("#enroll-Overlay").size()<=0){
					  $("body").append('<a id="enroll-Overlay" style="display:none" data-otype="pagecontent" data-odiv="enrollOverlay"  rel="#cvs-overlay" class="noarrow overlay mr3">Enroll Overlay</a>');
					}
					$("#enroll-Overlay").trigger("click");
				},
				showEnrollErrorOverlay:function(){
					   if($("#enroll-error-Overlay").size()<=0){
							  $("body").append('<a id="enroll-error-Overlay" style="display:none" data-otype="pagecontent" data-odiv="enrollErrorOverlay"  rel="#cvs-overlay" class="noarrow overlay mr3">Enroll Overlay</a>');
							}
							$("#enroll-error-Overlay").trigger("click");
						},
				showUnEnrollOverlay:function(){
					   if($("#unenroll-Overlay").size()<=0){
						  $("body").append('<a id="unenroll-Overlay" style="display:none" data-otype="pagecontent" data-odiv="unenrollOverlay" rel="#cvs-overlay"  class="noarrow overlay mr3">Enroll Overlay</a>');
						}
						$("#unenroll-Overlay").trigger("click");
				},
				showUnEnrollErrorOverlay:function(){
					   if($("#unenroll-Error-Overlay").size()<=0){
						  $("body").append('<a id="unenroll-Error-Overlay" style="display:none" data-otype="pagecontent" data-odiv="unenrollErrorOverlay" rel="#cvs-overlay" class="noarrow overlay mr3">Enroll Overlay</a>');
						}
						$("#unenroll-Error-Overlay").trigger("click");
				},
				showPharmacyHomeEnrollOverlay:function(){

					if($("#enrollpharmacyhome-Overlay").size()<=0){
							  $("body").append('<a id="enrollpharmacyhome-Overlay" style="display:none" data-otype="pagecontent" data-odiv="enrollPharmacyHomeOverlay" rel="#cvs-overlay"  class="noarrow overlay mr3">Enroll Overlay</a>');
							}
							$("#enrollpharmacyhome-Overlay").trigger("click");
						},
						showPharmacyHomeEnrollErrorOverlay:function(){

							if($("#enrollpharmacyhome-Error-Overlay").size()<=0){
									  $("body").append('<a id="enrollpharmacyhome-Error-Overlay" style="display:none" data-otype="pagecontent" data-odiv="enrollPharmacyHomeErrorOverlay" rel="#cvs-overlay"  class="noarrow overlay mr3">Enroll Overlay</a>');
									}
									$("#enrollpharmacyhome-Error-Overlay").trigger("click");
								},
						showPharmacyHomeUnEnrollOverlay:function(){


							   if($("#unenrollpharmacyhome-Overlay").size()<=0){
								  $("body").append('<a id="unenrollpharmacyhome-Overlay" style="display:none" data-otype="pagecontent" data-odiv="unenrollPharmacyHomeOverlay" rel="#cvs-overlay"   class="noarrow overlay mr3">Enroll Overlay</a>');
								}
								$("#unenrollpharmacyhome-Overlay").trigger("click");
						},
						showPharmacyHomeUnEnrollErrorOverlay:function(){


							   if($("#unenrollpharmacyhome-Error-Overlay").size()<=0){
								  $("body").append('<a id="unenrollpharmacyhome-Error-Overlay" style="display:none" data-otype="pagecontent" data-odiv="unenrollPharmacyHomeErrorOverlay" rel="#cvs-overlay"   class="noarrow overlay mr3">Enroll Overlay</a>');
								}
								$("#unenrollpharmacyhome-Error-Overlay").trigger("click");
						},
						showMyAccountEnrollOverlay:function(){

							if($("#enrollmyaccount-Overlay").size()<=0){
									  $("body").append('<a id="enrollmyaccount-Overlay" style="display:none" data-otype="pagecontent" data-odiv="enrollMyaccountOverlay" rel="#cvs-overlay"  class="noarrow overlay mr3">Enroll Overlay</a>');
									}
									$("#enrollmyaccount-Overlay").trigger("click");
								},
								showMyAccountEnrollErrorOverlay:function(){

									if($("#enrollmyaccount-Error-Overlay").size()<=0){
											  $("body").append('<a id="enrollmyaccount-Error-Overlay" style="display:none" data-otype="pagecontent" data-odiv="enrollMyaccountErrorOverlay" rel="#cvs-overlay"  class="noarrow overlay mr3">Enroll Overlay</a>');
											}
											$("#enrollmyaccount-Error-Overlay").trigger("click");
										},
								showMyAccountUnEnrollOverlay:function(){


									   if($("#unenrollmyaccount-Overlay").size()<=0){
										  $("body").append('<a id="unenrollmyaccount-Overlay" style="display:none" data-otype="pagecontent" data-odiv="unenrollMyaccountOverlay" rel="#cvs-overlay"  class="noarrow overlay mr3">Enroll Overlay</a>');
										}
										$("#unenrollmyaccount-Overlay").trigger("click");
								},
								showMyAccountUnEnrollErrorOverlay:function(){


									   if($("#unenrollmyaccount-Error-Overlay").size()<=0){
										  $("body").append('<a id="unenrollmyaccount-Error-Overlay" style="display:none" data-otype="pagecontent" data-odiv="unenrollMyaccountErrorOverlay" rel="#cvs-overlay"  class="noarrow overlay mr3">Enroll Overlay</a>');
										}
										$("#unenrollmyaccount-Error-Overlay").trigger("click");
								},
				showUnEnrollSuccessOverlay:function(){
					   if($("#unenroll-Overlay").size()<=0){
						  $("body").append('<a id="unenrollSuccess-Overlay" style="display:none" data-otype="pagecontent" data-odiv="unenrollSuccessOverlay" rel="#cvs-overlay" class="noarrow overlay mr3">Enroll Overlay</a>');
						}
						$("#unenrollSuccess-Overlay").trigger("click");
				},
				showEnrollSuccessOverlay:function(){
					   if($("#unenroll-Overlay").size()<=0){
						  $("body").append('<a id="enrollSuccess-Overlay" style="display:none" data-otype="pagecontent" data-odiv="enrollSuccessOverlay" rel="#cvs-overlay" class="noarrow overlay mr3">Enroll Overlay</a>');
						}
						$("#enrollSuccess-Overlay").trigger("click");
				},
				showPharmacyLoginOverlay:function(){
					if($("#pharmacylogin-Overlay").size()<=0){
						  $("body").append('<a id="pharmacylogin-Overlay" style="display:none" data-otype="pagecontent" data-odiv="pharmacyLoginOverlay" rel="#cvs-overlay" class="noarrow overlay mr3">Enroll Overlay</a>');
						}
						$("#pharmacylogin-Overlay").trigger("click");
				},
				showUnenrollLoginOverlay:function(){
					if($("#unenrolllogin-Overlay").size()<=0){
						  $("body").append('<a id="unenrolllogin-Overlay" style="display:none" data-otype="pagecontent" data-odiv="unenrollLoginOverlay" rel="#cvs-overlay" class="noarrow overlay mr3">Enroll Overlay</a>');
						}
						$("#unenrolllogin-Overlay").trigger("click");
				},

				//ITPR007477 - SMS Sign Up (Online / Mobile) -Nov 2014 - REQ013:Added the function for Dispaly the popup for login page
	               showCommonLoginOverlay:function(){
	            		if($("#sms-Overlay").size()<=0){
	            	  $("body").append('<a id="sms-Overlay" style="display:none" data-otype="pagecontent" data-odiv="showCommonLoginOverlay" rel="#cvs-overlay" class="noarrow overlay mr3">Enroll Overlay</a>');
	            							}
	            		$("#sms-Overlay").trigger("click");
	               },
				showDrugInfoLoginOverlay:function(){
					if($("#druginfologin-Overlay").size()<=0){
						  $("body").append('<a id="druginfologin-Overlay" style="display:none" data-otype="pagecontent" data-odiv="drugInfoLoginOverlay" rel="#cvs-overlay" class="noarrow overlay mr3">Enroll Overlay</a>');
						}
						$("#druginfologin-Overlay").trigger("click");
				}
	};
	// Define an object in the global scope (i.e. the window object)
	window.$my =
	{
		// Initialize all the queries you want to use more than once
		shoppingCart : $("#shoppingCartContainer"),
		body : $("body"),
		globalNavTabs: $("#top-nav-tabs")

	};


	var alreadyLoadedPages = new Array();

	//Show fly down when hovering over top tabs OR tabbing
	var $flyouts = $('#pharmacy-flyout-tab,#shop-flyout-tab,#deals-flyout-tab,#extracare-flyout-tab');
	$flyouts.hover(showSubLevel,resetNavContent).focus(showSubLevel).blur(resetNavContent);

	var $flyoutTabs = $('#pharmacy-top-nav-tab,#shop-top-nav-tab,#deals-top-nav-tab,#extracare-top-nav-tab');
	//Hide the menu when leaving the flydown div but clear the timeout if entering back in
	$flyoutTabs.mouseleave(hideSubLevel).mouseenter(function(){clearTimeout($($my.globalNavTabs).data('timeoutId'));});

	//shopping cart hover logic
	var $navWrapper = $("#navWrapper");
	$navWrapper.delegate("#shoppingCartContainer:has(.full)",{hover: shoppingCart,focus: shoppingCart, blur: resetNavContent});
	$("#dNavWrapper").delegate("#shoppingCartContainer:has(.full)",{hover: shoppingCart,focus: shoppingCart, blur: resetNavContent});

	//Hide the menu when leaving the flydown div
	$navWrapper.delegate("#shoppingCartContainer","mouseleave",closeCart);
	$navWrapper.delegate(".closeBtn","click",closeCart);

	$("#dNavWrapper").delegate("#shoppingCartContainer","mouseleave",closeCart);
	$("#dNavWrapper").delegate(".closeBtn","click",closeCart);
	//END shopping cart hover logic

	//Load web content when hovering or tabbing to department link. Close when blur our mouseout
	$navWrapper.delegate("ul.sublevel-nav>li>a",{hover: loadNavContent,focus: loadNavContent, blur: resetNavContent});

	//Hide flydown on search focus
	$('#searchbox').focus(hideSubLevel);
	//Hide type ahead on blur

	//start watermark text handle logic
	$("body").delegate("#GlobalSearchForm","submit",function(e){compareSearchText(e,'searchbox');});
	$("body").delegate("#noResultsSearchForm","submit",function(e){compareSearchText(e,'noTextSuggestions');});
	$("body").delegate("#pharmacySearchForm","submit",function(e){compareSearchText(e,'pharmacyNoTextSuggestions');});
	$("body").delegate("#drugInfoForm","submit",function(e){compareSearchText(e,'drugNoTextSuggestions');});

	/*Common Overlay for Pharmacy New prescription info link*/

	$("body").delegate("#newPrescritionInfoLink","click",function(e){
		e.preventDefault();
		CVSJS.Overlays.showEnrollOverlay();

	});
	$("body").delegate("#newPrescritionUnenrollInfoLink","click",function(e){
		e.preventDefault();
		CVSJS.Overlays.showUnEnrollOverlay();
	});
	$("body").delegate("#newPrescritionInfoPharmacyHomeLink","click",function(e){
		e.preventDefault();
		CVSJS.Overlays.showPharmacyHomeEnrollOverlay();

	});$("body").delegate("#newPrescritionUnenrollInfoPharmacyHomeLink","click",function(e){
		e.preventDefault();
		CVSJS.Overlays.showPharmacyHomeUnEnrollOverlay();

	});
	$("body").delegate("#newPrescritionInfoMyAccountLink","click",function(e){
		e.preventDefault();
		CVSJS.Overlays.showMyAccountEnrollOverlay();

	});
	$("body").delegate("#newPrescritionUnenrollInfoMyAccountLink","click",function(e){
		e.preventDefault();
		CVSJS.Overlays.showMyAccountUnEnrollOverlay();

	});

	/*	13 FEB 2013 -Added for CR02522 Onsite Search Field and Search Term Tracking---STARTS*/

	$("body").delegate("#drugInfoQuery","submit",function(e){compareSearchText(e,'drug');});

	function compareSearchText(e,searchBoxId)
	{
		    var searchText=$("#"+searchBoxId).val();
		   if(searchBoxId=='noTextSuggestions')
		   {
			 if(searchText=="" || searchText=='Search')
			 {
	    		 e.preventDefault();
			 }
			 else
			 {
				 ElementInterval = setInterval(function () {

					  clearInterval(ElementInterval);
					 },1);

		   }

		   }
		   else if(searchBoxId=='searchbox')
		   {
			 if(searchText=="" || searchText=='Search')
			 {
		    	 e.preventDefault();
			 }
			 else
			 {
				 ElementInterval = setInterval(function () {

					  clearInterval(ElementInterval);
					 },1);

			 }

		   }
		   else if(searchBoxId=='pharmacyNoTextSuggestions')
		   {
		     if(searchText=="" || searchText=='Enter Drug Name')
			 {
	    		 e.preventDefault();
			 }
		     else
			 {
				 ElementInterval = setInterval(function () {

					  clearInterval(ElementInterval);
					 },1);

		   }

	}
		   else if(searchBoxId=='drugNoTextSuggestions')
		   {
		     if(searchText=="")
			 {
	    		 e.preventDefault();
			 }
		     else
			 {
				 ElementInterval = setInterval(function () {

					  clearInterval(ElementInterval);
					 },1);

			 }

		   }
		   else if(searchBoxId=='drug')
		   {
		     if(searchText=="" || searchText=='Enter Drug Name')
			 {
	    		 e.preventDefault();
			 }
		   }
	}
	/*	13 FEB 2013 -Added for CR02522 Onsite Search Field and Search Term Tracking---ENDS*/
	//end watermark text handle logic


	//Add to basket code
	$("body").delegate("a.addToBasket","click",addItemToCartHandler);
 	$("body").delegate("a.overlay,button.overlayBtn","click",showOverlayHandler);


	// added for add to list enhancement
 	$("body").delegate("#addToListOverlay","click",addItemToListHandler);

	$('#signout').click(function(){
        var myButton=$('#newButton').val();
		if (myButton !== null) {
			var Backlen = history.length;
			history.go(-Backlen);
			top.window.location.href = "/";
			$('#newButton').click();
		}
      });

	 $('#notyou').click(function(){
	        var myButton=$('#cookieButton').val();
			if (myButton !== null) {
				var Backlen = history.length;
				history.go(-Backlen);
				top.window.location.href = "/";
				$('#cookieButton').click();
			}
	 });



	function loadNavContent () {
		$('ul.sublevel-nav li a').removeClass("hover");
		var curElement = this;
		$(curElement).addClass("hover");
	    var timeoutId = setTimeout(function() {
			  var divToLoad = $(curElement).next("div");
			  var divToLoadGenericClass = divToLoad.attr('class');
			  var url = $(curElement).attr("data-url");

	    	 // $('ul.sublevel-nav li a').removeClass("hover");
	    	  $('.'+divToLoadGenericClass).hide();
	    	 // $(curElement).addClass("hover");

	    	  //only load url once on a page
	    	  if (alreadyLoadedPages[url] != 1)
	    	  {
	    		  var urltoload = url + "?src=slot";
	    		  $(divToLoad).load(urltoload);
	    		  alreadyLoadedPages[url] = 1;
	    	  }

	    	  $(divToLoad).show();
	    }, 200);
	    // Use data so trigger can be cleared.
	    $(curElement).data('timeoutId', timeoutId);
	}

	function resetNavContent () {
		var curElement = this;
		clearTimeout($(this).data('timeoutId'));
	}

	function showSubLevel () {
		var curElement = this;

	    var timeoutId = setTimeout(function() {
	    	$(curElement).addClass("hover");

	    	//show shim
	    	document.getElementById('ie_flash_shim_iframe').style.display='block';

	    	var sublevel = $(curElement).next('.sublevel');
			$('.sublevel-nav a:first',sublevel).focus();

			//Remove other tab hover classes & hide all other sublevel divs
			$flyouts.removeClass("hover");
			$('.sublevel').hide();

			//Show active sublevel div & add hover class to current tab
			$(sublevel).show();
			$(curElement).addClass("hover");
	    }, 400);

	    // Use data so trigger can be cleared.
	    $(curElement).data('timeoutId', timeoutId);
	}

	function hideSubLevel () {
		var globalTabs = $my.globalNavTabs;

		var timeoutId = setTimeout(function() {
			$('.sublevel').hide();
			$flyouts.removeClass("hover");
			document.getElementById('ie_flash_shim_iframe').style.display='none';
		}, 400);

		$(globalTabs).data('timeoutId', timeoutId);
	}

	function shoppingCart(event) {
		//alert(event.type);
		var curElement = this;

		if( event.type === 'mouseenter' || event.type === 'focus' )
		{
			//hover intent
			var timeoutId = setTimeout(function() {
				$(curElement).find(".sublevel").show();
				//show shim
				var shimHeight = $(curElement).find(".sublevel").height()-70;

				$("#ie_flash_shim_iframe2").height(shimHeight);
				document.getElementById('ie_flash_shim_iframe2').style.display='block';

				$(curElement).find("#miniCartButton, #aMiniCartBtn").addClass("fullHover");

		    }, 200);

		    // Use data so trigger can be cleared.
		    $(curElement).data('timeoutId', timeoutId);
		    $("#suggestionListBoxHeader").hide();
		}
	    else
	    {
	    	clearTimeout($(curElement).data('timeoutId'));
	    }
	}

	function closeCart() {
		document.getElementById('ie_flash_shim_iframe2').style.display='none';
		var curElement = $my.shoppingCart;
		$(curElement).find(".sublevel").hide();
		$(curElement).find("#miniCartButton, #aMiniCartBtn").removeClass("fullHover");

	}
	function addItemToCartHandler (e) {
		var curElement = this;

		showOverlay(curElement,addItemToCart);
		e.preventDefault();

	}


	function addItemToCart(curElement){

	  var skuid = $(curElement).attr("data-skuid"),
	    prodid = $(curElement).attr("data-prodid"),
	    tk = $(curElement).attr("data-tk"),
	    qty = $(curElement).attr("data-qty"),
	    itemstock = $(curElement).attr("data-itemStocklevel"),
	    oid = $(curElement).attr("data-oid"),
	    resturl = $(curElement).attr("data-resturl"),
	    quantity = $("#"+qty).val(),
	    arOption = "",
	    promotionId="",
	    arFrequency="",
	    instore = $(curElement).attr("data-instore"),
	    storeid = $(curElement).attr("data-storeid"),
	    pdp = $(curElement).attr("data-pdp"),
	    pickupflag = false,
	    strSearch = $(curElement).hasClass( "strSearch" ),
	    listPrice = $(curElement).attr("data-listPrice"),
	    salePrice = $(curElement).attr("data-salePrice"),
	    offer = $(curElement).attr("data-offer"),
	    headerText = "";

	  // Check if Pickup in store flag is on.
	  if(instore == "true") {
	    pickupflag = true;
	  }

	  if(document.getElementById("arOption22") != null)
	    arOption =document.getElementById("arOption22").value;
	  if(document.getElementById("pid") != null)
	    promotionId =document.getElementById("pid").value;
	  if(document.getElementById("ar_frequency") != null)
	    arFrequency=document.getElementById("ar_frequency").value;

	  if(qty==1 || qty==""){
	    quantity=1;
	  } else {
	    quantity = $("#"+qty).val();
	  }


	  $.ajax({
	  type: 'POST',
	  url: resturl,
	  data: {"quantity":quantity,"productId":prodid,"skuId":skuid,"sessionId":tk,"itemStockLevel":itemstock,"orderId":oid,"arOption":arOption,"promotionId":promotionId,"arFrequency":arFrequency,"inStore":instore, "storeId":storeid},
	  dataType: "JSON",
	  success: function (json) {
	    try {
	      var jsonResponse = json,
	      upcNumber = $(curElement).attr("data-upcNumber");

	      if(jsonResponse.atgResponse.statusCode==0) {

	        /* Mini My Cart */
	        var shoppingCartContainer = $my.shoppingCart;
	        var miniCart = $('<a href="/checkout/fs/shoppingcart_items.jsp" id="miniCartButton" class="full" title="My Basket"><span class="countHolder"><span class="start"></span><span	class="wrap">'+jsonResponse.atgResponse.ItemCount+'</span><span class="end"></span></span></a>');
	        var sublevel = $('<div class="sublevel"></div>');
	        var tabReplacement = $('<div class="tabReplacement"></div>');
	        var introHeader = $('<div class="introHeader"><strong>Your Cart: <span>'+jsonResponse.atgResponse.ItemCount+' items</span></strong><a href="#" class="closeBtn" title="Close">Close</a></div>');
	        var innerContent = $('<div class="innerContent"></div>');
	        var scrollableContent = $('<div class="scrollableContent"></div>');
	        var pad = $('<div class="padd"></div>');
	        var btm = $('<div class="btm"></div>');
					var cartItemOffer = "";
					var cartItemSavings = "";
					var cartQtyDiscounted = "";
	        sublevel.append(tabReplacement);
	        sublevel.append(introHeader);

	        for(var i=0;i<jsonResponse.atgResponse.ItemsInCartCount;i++) {
	            var alttext = jsonResponse.atgResponse.Items[i].displayname;
	            var noImage = $('<div class="cartImageCont"><a class="cartItemImg" href="/shop/product-detail/?skuId='+jsonResponse.atgResponse.Items[i].skuId+'"><img src="/bizcontent/merchandising/productimages/small/'+jsonResponse.atgResponse.Items[i].upcNumber+'.jpg" alt="'+alttext+'"></a></div>');

	            if(jsonResponse.atgResponse.Items[i].arInd == 'true') {
	              var cartItemDesc = $('<div class="cartItemDesc"><strong class="title">'+jsonResponse.atgResponse.Items[i].displayname+'</strong><br/>Size: '+jsonResponse.atgResponse.Items[i].size+'<br />Qty: '+jsonResponse.atgResponse.Items[i].qty+'<div class="autoShiporderContent"><div class="abs-content"><span  class="auto-ship-subs">Ship &amp; Save Subscribed</span></div></div></div>');
	            } else {
	              var cartItemDesc = $('<div class="cartItemDesc"><strong class="title">'+jsonResponse.atgResponse.Items[i].displayname+'</strong><br/>Size: '+jsonResponse.atgResponse.Items[i].size+'<br />Qty: '+jsonResponse.atgResponse.Items[i].qty+'</div>');
	            }

	            var itemOffer = jsonResponse.atgResponse.Items[i].offer;

	            if(itemOffer==null || itemOffer=="null") {
	              if(jsonResponse.atgResponse.Items[i].price < 0) {
	                var cartItemPrice = $('<div class="cartItemPrice"><strong>($'+jsonResponse.atgResponse.Items[i].price.replace(/[^a-zA-Z 0-9.]+/g,'')+')</strong></div>');
	              } else {
	                var cartItemPrice = $('<div class="cartItemPrice"><strong>$'+jsonResponse.atgResponse.Items[i].price+'</strong></div>');
	              }
	            } else if((itemOffer!=null )&&(jsonResponse.atgResponse.Items[i].salePrice == jsonResponse.atgResponse.Items[i].price) ) {
	              var cartItemPrice = $('<div class="cartItemPrice"><strong>$'+jsonResponse.atgResponse.Items[i].price+'</strong></div>');
	            } else {
	              if(jsonResponse.atgResponse.Items[i].salePrice<0) {
	                var cartItemPrice = $('<div class="cartItemPrice"><strong>($'+jsonResponse.atgResponse.Items[i].salePrice.replace(/[^a-zA-Z 0-9.]+/g,'')+')</strong><small class="strikethrough">$'+jsonResponse.atgResponse.Items[i].listPrice+'</small><div style="height: 5px;"></div></div>');
	              } else {
	                var cartItemPrice = $('<div class="cartItemPrice"><strong>$'+jsonResponse.atgResponse.Items[i].salePrice+'</strong><small class="strikethrough">$'+jsonResponse.atgResponse.Items[i].listPrice+'</small><div style="height: 5px;"></div></div>');
	              }
	            }
	            
	            var listPrice = jsonResponse.atgResponse.Items[i].listPrice;
	            
	            var salePrice = jsonResponse.atgResponse.Items[i].salePrice;
	            
	            var savingsAmount = listPrice - salePrice;
	            
				            if(savingsAmount > 0){
								savingsAmount = savingsAmount.toFixed(2);
								cartItemSavings = '<span>$'+savingsAmount+' savings</span>';
								cartQtyDiscounted = jsonResponse.atgResponse.Items[i].qtyDiscntd;
								
								if(cartQtyDiscounted != null && cartQtyDiscounted > 1){
									cartItemSavings = cartItemSavings+' on '+cartQtyDiscounted;
								}
							}else{
								cartItemSavings = "";
							}

							if(jsonResponse.atgResponse.Items[i].so) {
								cartItemOffer = $('<div class="cartSaleOffer red">'+jsonResponse.atgResponse.Items[i].so+'</div><div>'+cartItemSavings+'</div>');
							} else {
								cartItemOffer = "";
							}

	            var cartitem = $('<div class="cartItem"></div>');
	            cartitem.append(noImage);
	            cartitem.append(cartItemDesc);
	            cartitem.append(cartItemPrice);
							cartitem.append(cartItemOffer);
	            scrollableContent.append(cartitem);

	           }

	        var subTotal =jsonResponse.atgResponse.OrderSubTotal.toFixed(2);
	        var subTotal1 = subTotal.replace(/[^a-zA-Z 0-9.]+/g,'');

	        if(subTotal<0) {
	          var floatContainer1 = $('<div class="floatContainer"><div class="floatLeft"><a href="/checkout/fs/shoppingcart_items.jsp" title="Edit My Cart">Edit	My Cart</a></div><div class="floatRight"><span class="cartItemSubTotal">Subtotal:</span><span class="cartItemTotal">($'+subTotal1+')</span></div></div>');
	        } else {
	          var floatContainer1 = $('<div class="floatContainer"><div class="floatLeft"><a href="/checkout/fs/shoppingcart_items.jsp" title="Edit My Cart">Edit	My Cart</a></div><div class="floatRight"><span class="cartItemSubTotal">Subtotal:</span><span class="cartItemTotal">$'+subTotal+'</span></div></div>');
	        }
	        var floatContainer2 = $('<div class="floatContainer"><div class="floatLeft contineShopping"><a href="#"	class="closeBtn" title="Continue Shopping">Continue Shopping</a></div><div class="floatRight"><a class="cvsbtn btn-red-lrg"	href="/checkout/fs/shoppingcart_items.jsp" title="Checkout Now"><span class="left"></span> <span class="center">Checkout Now</span> <span class="right-with-arrow"></span> </a></div></div>');

	        pad.append(floatContainer1);
	        pad.append(floatContainer2);

	        innerContent.append(scrollableContent);
	        innerContent.append(pad);

	        sublevel.append(innerContent);
	        sublevel.append(btm);

	        shoppingCartContainer.html('');
	        shoppingCartContainer.append(miniCart);
	        shoppingCartContainer.append(sublevel);
	        /* End of Mini cart */

	        var productImg,
	          newItemOffer = jsonResponse.atgResponse.newItem.offer,
						productDefaults,
	          productDesc,
						productSaleOffer,
						productOffer,
	          cartItemTotal,
	          cartSubTotal,
			  		productButton,
	          overlay = $('<div id="dATBWrapper"></div>'),
	          headerDiv = $('<div class="desc"></div>'),
	          productDiv = $('<div class="dATBContainer"></div>'),
	          productDetailsDiv = $('<div class="dATBProduct"></div>'),
						productOfferDiv = $('<div class="dATBSP"></div>'),
	          hrLine = $('<hr class="hATBLine">'),
	          cartDetailDiv = $('<div class="dATBCartDetailsContainer"></div>');

	        if(quantity==1) {
	          headerText = '1 item added to your basket';
	        } else {
	          headerText = quantity+' items added to your basket';
	        }

	        productImg = $('<div class="dATBImg"><img src="/bizcontent/merchandising/productimages/small/'+upcNumber+'.jpg" alt="'+upcNumber+'"></div>');

					// Defaults
					productDefaults = $('<div class="dATBDetails"><div class="dATBTitle">'+jsonResponse.atgResponse.newItem.displayname+'</div><div class="dATBData"><span class="sProdSize">Size: '+jsonResponse.atgResponse.newItem.size+' oz</span> <br/><span class="sProdQty">Qty: '+jsonResponse.atgResponse.newItem.qty+'</span></div>');
					if(newItemOffer=="null" || newItemOffer==null) {
						if(arOption=="true") {
							// Defaults, Price, Auto Ship and save shows
							productDesc  = $('<div class="dATBPrice1">$'+jsonResponse.atgResponse.newItem.price+'</span></div>');
							productOffer = $('<span class="auto-ship-subs auto-ship-overlay">Ship &amp; Save Subscribed</span>');
						} else {
							// Defaults, Price
							productDesc  = $('<div class="dATBPrice1">$'+jsonResponse.atgResponse.newItem.price+'</span></div>');
						}
					} else {
						if(arOption=="true") {
							// Defaults, Price, Auto Ship and save shows
							productDesc  = $('<div class="dATBPrice1">$'+jsonResponse.atgResponse.newItem.price+'</span></div>');
							productOffer = $('<span class="auto-ship-subs auto-ship-overlay">Ship &amp; Save Subscribed</span>');
						} else {
							//  Defaults, Discounted Price, Strikethrough Price, Offer
							if(jsonResponse.atgResponse.newItem.sos) {
								productDesc  = $('<div class="dATBPrice1"$>'+jsonResponse.atgResponse.newItem.discountedPrice+'</span></div> <div class="dATBPrice2">$'+jsonResponse.atgResponse.newItem.price+'</div><div class="dATBPrice3">Save $'+jsonResponse.atgResponse.newItem.sos+'</div>');
							} else {
								productDesc  = $('<div class="dATBPrice1">$'+jsonResponse.atgResponse.newItem.discountedPrice+'</span></div>');
							}
							// @TODO - Commenting out for QA need to looking into further. 
							// productOffer = $('<strong class="greentxt">'+newItemOffer+'</strong>');
						}
					}

					if(jsonResponse.atgResponse.newItem.so) {
						productSaleOffer = $('<div class="dSaleOffer"><span class="red bold">'+jsonResponse.atgResponse.newItem.so+'</span></div><br class="clear">');
					}

	        cartItemTotal = $('<div class="dATBItemTotal">'+jsonResponse.atgResponse.ItemCount+' total items<span class="sEditLink"><a href="/checkout/fs/shoppingcart_items.jsp">Edit</a></span></div>');

	        if(subTotal<0) {
	          cartSubTotal = $('<div class="dATBSubtotal">Subtotal: <span class="red">($'+subTotal1+')</span></div>');
	        } else {
	          cartSubTotal = $('<div class="dATBSubtotal">Subtotal: <span class="red">$'+subTotal+'</span></div>');
	        }

	        if(pickupflag && strSearch) {
	          productButton = $('<div class="dATBButtons"><a href="#" class="dATBBtn grey reload continue" title="Continue Shopping">Continue Shopping</a><a href="/checkout/fs/shoppingcart_items.jsp" class="dATBBtn red checkoutNow" title="Checkout Now" >Checkout Now</a></div>');
	        } else {
	          productButton = $('<div class="dATBButtons"><a href="#" class="dATBBtn grey closeOverlay continue" title="Continue Shopping">Continue Shopping</a><a href="/checkout/fs/shoppingcart_items.jsp" class="dATBBtn red checkoutNow" title="Checkout Now" >Checkout Now</a></div>');
	        }

	        if(pickupflag) {
	          CVSJS.StoreLoc.Globals.changeStoreAlert = true;
	        }

	        headerDiv.text(headerText); // Add text to head
	        overlay.append(headerDiv); // append head div
	        productDetailsDiv.append(productImg); // Append product - img then details
					productDefaults.append(productDesc); // Append product pricing details
	        productDetailsDiv.append(productDefaults); // Append product general details
	        productDiv.append(productDetailsDiv); // Append product to container
					productOfferDiv.append(productSaleOffer); // Append sale/promo
					productOfferDiv.append(productOffer); // Append Ship & save offer

					productDiv.append(productOfferDiv); // Append Sales/offers
	        productDiv.append(hrLine); // Append line break
					cartDetailDiv.append(cartSubTotal); // append subtotal
					cartDetailDiv.append(cartItemTotal); // append item total
	        cartDetailDiv.append(productButton); // append buttons
	        productDiv.append(cartDetailDiv); // append cart details
					overlay.append(productDiv);


	        dcsMultiTrack('WT.si_n','ShoppingCart','WT.si_x','2','DCSext.Add2CartRefer',document.location.href,'WT.tx_e','a','WT.pn_sku',skuid,'WT.tx_u',quantity);

	        var cartId = $(curElement).attr("data-oid");
	        var s,f,c=document.cookie;

	        s = c.indexOf("ed87362384");
	        if(s==-1) {
	          s = c.indexOf("eds87362384");
	        }
	        if (s>-1) {
	          c=c.substring(s+1);
	          c=c.substring(c.indexOf("=")+1);
	          e=c.indexOf(";");
	          f=c.substring(0,e==-1? c.length:e);
	          var edialog = $('<div><img src="https://pd.ed10.net/w/0G/3OY6I7H/RU?CEDID='+f+'&et=CartAdd&pk='+cartId+'"</div>');
	        }

	      } else {
	        if(pickupflag) {
	          // Product was to be added as a pickup item and now needs to show error message in pickup modal
	          CVSJS.Bopus.Globals.addItemToCartError = jsonResponse.atgResponse.error;
	          CVSJS.Bopus.Globals.addItemToCartAdjustedValue = jsonResponse.atgResponse.availableQty;
	          CVSJS.Bopus.Globals.addItemToCartStatusCode = jsonResponse.atgResponse.statusCode;

	          if(pdp == "true") {
	            CVSJS.Bopus.Globals.productDetail = true;
	            if($("#dStorePickupAvailabilityOverlay #modalContainer").length == 0) {
	              // User has not viewed the overlay yet
	              $('.checkStoreAvail').click();
	              CVSJS.Bopus.Globals.productDetailShowError = true;
	            } else {
	              CVSJS.Bopus.ItemAvailability.reRenderWithErrors(curElement);
	            }
	          } else {
	            CVSJS.Bopus.ItemAvailability.reRenderWithErrors(curElement);
	          }
	        } else {
	        	var overlay = $('<div id="dATBWrapper"></div>'),
				   headerDiv = $('<div class="desc">Basket error</div>'),
				   descriptionDiv = $('<div id="formerrorswrapper"  style="display: block; margin-bottom:0px"><div class="flxmsg_wrpper"><div class="topLeft_corner"></div><div class="topRight_corner"></div><div id="formerrors"><div><h2>'+jsonResponse.atgResponse.error+'</h2><br /></div></div><div class="bottomLeft_corner"></div><div class="bottomRight_corner"></div></div></div>');   
				   overlay.append(headerDiv);
				   overlay.append(descriptionDiv);
	        }
	      }

	      $('#addToCart-overlay .details').html(overlay);

	    } catch (err) {
	      $('#addToCart-overlay .details').html("<div class='error'>I'm sorry there was an error processing your request.</div>");
	    }

	    },
	    error: function(jqxhr){

	    },
	    complete: function(jqxhr, textstatus){
	      if (jqxhr.status == "200") {
	      }
	    }

	  });
	}

 	function showOverlayHandler (e) {
 		var curElement = this;
 		showOverlay(curElement,null);
 		e.preventDefault();
 	}

 	function showOverlay (curElement,callbackMethod, callbackCloseMethod) {

 		var $outerCont = $("#outerRespcont");
		var $triggerElem = $(curElement);
		var $pageBody = $my.body;

		if ( ($(window).width() <= 640 || window.location.href.indexOf("m.cvs.com") >= 0) && !CVSJS.Globals.PreventATBInSlideout ) {
			var pageheight = $(window).height();
			var pagewidth = $(window).width();

			$("body,html").css({'height': pageheight});
			$("body,html").css({'overflow': 'hidden'});

			//add expose mask
			$("#innerCont").expose({
				color: '#000',
				opacity: 0.5,
				closeOnClick: false,
				closeOnEsc:false
			});

			$("#slideout").addClass("slideOutRight");
			$("#innerCont").addClass("mainSectionShrink");
			$("#slideOutWrap").css({'height': "95%"});
			$("#slideout").show();
			$("#slideOutWrap").animate({scrollTop: 0});
			$pageBody.addClass("noscroll");
 			var wrap = $("#slideOutWrap");
			buildOverlay (callbackMethod,$triggerElem,wrap);

			$('#closeSlideout').click(function(){
				if(callbackCloseMethod){
					callbackCloseMethod();
				};
				$('#slideout').hide();
				$('#innerCont').removeClass('mainSectionShrink');
				$("body,html").css({'height': 'inherit'});
				$("body,html").css({'overflow': 'auto'});
				$.mask.close();
				$triggerElem.focus();
				return false;
			});

			  // This must be during the bubble phase (i.e., last argument =
			  // false) so that inner objects have an opportunity to override it.
			 // document.addEventListener('touchmove', function(e) { e.preventDefault(); }, false);

			  //var scroller = document.getElementById('#slideOutWrap');
			  //preventOverScroll(scroller);


		} else {
			$(curElement).overlay({
		 		mask: {color: '#000',opacity: 0.5},
				load: true,
				top: "25%",
				left: "center",
				closeOnClick: false,
				closeOnEsc:false,
				fixed: false,//set to false to scroll with the browser
				onBeforeLoad: function() {
					//Add noscroll class to body
					var pageBody = $my.body;
					//$(pageBody).addClass("noscroll"); //this is used to shut off scrolling behind the overlay

		 			//append overlay to bottom of document
		 			$(document.body).append(this.getOverlay());

					// grab wrapper element inside content
		 			var wrap = this.getOverlay().find(".details");
		 			$(wrap).html('<div id="overlayLoadingImg"><img id="overlayAnimatedGif" src="/webcontent/images/common/loading_lg.gif" alt="Loading" /></div>');

					setTimeout('$("#overlayAnimatedGif").attr("src","/webcontent/images/common/loading_lg.gif")', 200);
				},
		 		onLoad: function() {
		 			//IE7 fix for z-index
		 			//this.getOverlay().insertAfter('#exposeMask');
		 			//for multiple overlay masking
		 			if($("#exposeMask").is(":hidden"))$("#exposeMask").show();
					// grab wrapper element inside content
		 			var wrap = this.getOverlay().find(".details");
		 			wrap.data("overlay",this);
		 			//curElement = $(curElement);

		 			buildOverlay(callbackMethod,$triggerElem,wrap);

				},
				onBeforeClose: function () {
					//for other calling functions, allow a callback when closed
					if(callbackCloseMethod){
						callbackCloseMethod();
					};
				},
				onClose: function () {
					//Remove scroll
					var pageBody = $my.body;
					//$(pageBody).removeClass("noscroll");//this removes the class that hides the scroll behind overlay

					//for multiple overlay masking onclose visible
		 			if($("#exposeMask").is(":visible"))$("#exposeMask").hide();

					//unbind
		 			var rtype = $triggerElem.attr("data-refresh");
		 			if (rtype!=null && rtype == 'needed'){
		 				window.parent.location.reload(true);
		 			}
				}
		 	});
		}
	}

 	function buildOverlay (callbackMethod,triggerElem,wrap)  {

 		//execute callback function if there is a callback
 		if (callbackMethod!=null){
 			if (typeof callbackMethod == 'function') { // make sure the callback is a function
 				callbackMethod(triggerElem); // brings the scope to the callback
 			}
 		}

 		//check the datatype first. If iframe then load an iframe. If ajax then call the url via ajax call.
		var dataurl = triggerElem.attr("data-url");
		var otype = triggerElem.attr("data-otype");
		var oid = triggerElem.attr("data-oid");

	 	if (oid == null || oid == ''){
	 		oid=triggerElem.attr("id");
	 	}
	 	var overlayclass = "overlayIframe-" + oid;

	 	if (otype!=null && otype == 'iframe'){//iFrame overlay
	 		//BUG03356-Changes for No scroll bar on My To-Do-List Modal, Prescription Center starts
	 		if(oid == 'csaScheduleDisplay'||oid =='smsOffStatus'||oid=='smsOnStatus'|| oid=='To-DoListRefillPop-up'|| oid=='To-DoListRenewalPop-up'
	 			|| oid=='To-DoListPrescriptionExpirePop-up'|| oid=='To-DoListFamilyAccountExpirePop-up')
	 		//BUG03356-Changes for No scroll bar on My To-Do-List Modal, Prescription Center Ends
	 		{
				var theframe = $('<iframe frameborder="0" scrolling="auto" id="overlayFrame" style="display:none"></iframe>');
			}else{
				var theframe = $('<iframe frameborder="0" scrolling="no" id="overlayFrame" style="display:none"></iframe>');
			}
			//var theframe = $('<iframe frameborder="0" scrolling="no" id="overlayFrame" style="display:none"></iframe>');
			//var protocol = window.location.protocol;
			//var host = window.location.host;
			//var iurl = protocol + "//"+host+dataurl;
			$(theframe).attr({ src: dataurl});
			$(theframe).attr("class",overlayclass);
			$(wrap).html(theframe);

			/*var screenWidth = screen.width;
		    var overlayWidth = $(theframe).width()+40;

		    var left = (screenWidth / 2 - overlayWidth / 2);
		    $(wrap).parent().css({width : overlayWidth})
		    $(wrap).parent().css({left : left})*/

			$(theframe).show();
		} else if (otype!=null && otype == 'div'){//This is used by addtocart and shoppinglist where a call back method is used to write content back into the overlay div to load
			var pageBody = $my.body;
            $(pageBody).delegate(".closeOverlay","click",function(){
                  $("#overlayCloseAdd").click();
            });
		} else if (otype!=null && otype == 'pagecontent'){//used for existing div on page which the contents will be retrieved and then loaded in
			var divtoload = triggerElem.attr("data-odiv");
			var selector = "#"+divtoload;
			if (divtoload !=null){
				$(wrap).html("");
				$(wrap).append($(selector).html());
			}
			var pageBody = $my.body;
            $(pageBody).delegate(".closeOverlay","click",function(e){
			     $("#overlayCloseAdd").click();
			     var overlay=$(this).parents(".details").data("overlay");overlay.close();
            });

				//reposition overlay
				//repositionOverlay();
		} else if (otype!=null && otype == 'loginoverride'){ //used explicityly for overriding the login overlay contents, values in data-header/data-subheader/data-hidecreate/data-redirect attributes on the link
			//determine what to show and hide
			var divtoload = triggerElem.attr("data-odiv");
			var selector = "#"+divtoload;
			if (divtoload !=null)
			{
				$(wrap).html($(selector).html());
				$(wrap).find("h3").html(triggerElem.attr("data-header"));
				$(wrap).find("p:first").html(triggerElem.attr("data-subheader"));
				if(triggerElem.attr("data-hidecreate") === "true"){
					$(wrap).find(".createAcnt").hide();
					$(wrap).find(".vert-line").hide();
				}
				$(wrap).find("p:first").next().hide();

				//Change the login redirect if it exists
				if(triggerElem.attr("data-redirect")){
					$(wrap).find("input[name='/atg/userprofiling/ProfileFormHandler.loginSuccessURL']").val(triggerElem.attr("data-redirect"));
				}
			}

			$(".closeOverlay").click(function(){
				$("#overlayCloseAdd").click();
		 	});

		}else{//ajax overlay
 			// load the page specified in the trigger
 			$.ajax({
 				  url: dataurl,
 				  async: false,
 				  success: function(data){
 					$(wrap).html("");
					$(wrap).append(data);

					$(".closeOverlay").click(function(){
						$("#overlayClose").click();
				 	});

					//center overlay
					//var screenWidth = screen.width;
				   // var overlayWidth = $(wrap).width();
				    //var left = (screenWidth / 2 - overlayWidth / 2);
				   // $(wrap).parent().css({left : left})

 				  },
 				  error: function (jqXHR, textStatus, errorThrown) {
 					 //alert('error');
 				  },
 				  complete: function(data){
 					 //reposition overlay after all content has been loaded
 					 //repositionOverlay();
 				  }
			});
	 	}
	}
	// added for add to list enhancement
	function addItemToListHandler (e) {
		var curElement = this;
		showOverlay(curElement,addItemToList);
		e.preventDefault();
	}
	// added for add to list enhancement
	function addItemToList(curElement){
		var skuid = $(curElement).attr("data-skuid");
		var prodid = $(curElement).attr("data-prodid");
		var qty = $(curElement).attr("data-qty");
		var resturl = $(curElement).attr("data-resturl");
		var quantity = $("#"+qty).val();
		if(qty==1)
		{
			quantity=1;
		}
		var jsonResponse = "";
		 $.ajax({
			type: 'POST',
			url: resturl,
			data: {"quantity":quantity,"productId":prodid,"skuId":skuid},
			dataType: "JSON",
			success: function (json) {
				try
				{
					var listPrice = $(curElement).attr("data-listPrice");
					var salePrice = $(curElement).attr("data-salePrice");
					var offer = $(curElement).attr("data-offer");
					var upcNumber = $(curElement).attr("data-upcNumber");
					var overlay = $('<div id="modalDialogBoxBor"></div>');
					if(json.atgResponse.statusCode==0){

					if(quantity==1)
					{
					var headerDiv=$('<div class="mdboxHeader"><p>1 item added to your shopping list</p></div>');
					}
					overlay.append(headerDiv);
					var closemdboxProdDiv=$('<div class="closemdboxProd"><img src="/bizcontent/merchandising/productimages/small/'+upcNumber+'.jpg" alt="'+upcNumber+'"></div>');

				    if(offer=="null" || offer==null)
					{
						var descriptionDiv=$('<div class="closemdboxDesc"><p class="title">'+json.atgResponse.Items.displayname+'</p><p class="size">Size: '+json.atgResponse.Items.size+' oz<br /><span class="qty">Qty: '+json.atgResponse.Items.qty+'</span></p><br /><b class="red">'+salePrice+'</b><br /><br /></div>');
					}
					else
					{
						var descriptionDiv=$('<div class="closemdboxDesc"><p class="title">'+json.atgResponse.Items.displayname+'</p><p class="size">Size: '+json.atgResponse.Items.size+' oz<br /><span class="qty">Qty: '+json.atgResponse.Items.qty+'</span></p><br /><b class="red">'+salePrice+'</b><br /><small class="strikethrough">'+listPrice+'</small><br /><strong class="greentxt">'+offer+'</strong></div>');
					}
					var brLine=$('<br class="clear"/>');
					var hrLine=$('<hr class="closeMdboxHr"/>');
					if(json.atgResponse.ItemsInListCount==1)
					{
						var cartDetailsDiv=$('<div class="cartDtls_ovrl" >'+json.atgResponse.ItemsInListCount+' total item</div>');
					}else{
						var cartDetailsDiv=$('<div class="cartDtls_ovrl">'+json.atgResponse.ItemsInListCount+' total items</div>');
					}

					var buttonDiv=$('<div class="shoppingBtns"><div class="floatRight"><div class="floatLeft mt10"><span><a href="#" class="closeOverlay secondaryR">Continue Shopping</a></span></div> <div class="floatLeft"><span class="ml20"><a href="/account/shopping_list.jsp" class="cvsbtn btn-red-lrg" id="list" name="list" title="shoppinglist" ><span class="left"></span><span class="center">Shopping List</span><span class="right-with-arrow"></span></a></span></div></div></div>');

					var detailsDiv=$('<div class="closemdboxCont"></div>');

					detailsDiv.append(closemdboxProdDiv);
					detailsDiv.append(descriptionDiv);
					detailsDiv.append(brLine);
					detailsDiv.append(hrLine);
					detailsDiv.append(cartDetailsDiv);
					detailsDiv.append(buttonDiv);

					overlay.append(detailsDiv);
					}else{
						var headerDiv=$('<div class="mdboxHeader"><p></p></div>');
						overlay.append(headerDiv);
						var descriptionDiv=$('<div><b class="red">'+json.atgResponse.error+'</b><br /></div>');
						var detailsDiv=$('<div class="closemdboxCont" ></div>');
						detailsDiv.append(descriptionDiv);
						overlay.append(detailsDiv);
					}

					$('#addToCart-overlay .details').html(overlay);

				} catch (err)
				{
					$('#addToCart-overlay .details').html("<div class='error'>Sorry, there was an error processing your request.</div>");
				}

			},
			error: function(jqxhr){

			},
			complete: function(jqxhr, textstatus){
				if (jqxhr.status == "200")
				{
				}
			}
		});
	}
	function saveToShopList(skuid)
	{
			$('.'+skuid+'').click();

	}

	/*function preventOverScroll(scrollPane) {
	    // See http://www.quirksmode.org/js/events_order.html
	    var CAPTURE_PHASE = true;  // happens first, outside to inside
	    var BUBBLE_PHASE  = false; // happens second, inside to outside

	    // These variables will be captured by the closures below
	    var allowScrollUp = true, allowScrollDown = true, lastY = 0;

	    scrollPane.addEventListener
	    ('touchstart',
	     function(e) {

	         // See http://www.w3.org/TR/cssom-view/#dom-element-scrolltop
	         allowScrollUp = (this.scrollTop > 0);
	         allowScrollDown = (this.scrollTop < this.scrollHeight - this.clientHeight);

	         // Remember where the touch started
	         lastY = e.pageY;
	     },
	     CAPTURE_PHASE);

	    // If the touch is on the scroll pane, don't let it get to the
	    // body object which will cancel it
	    scrollPane.addEventListener
	    ('touchmove',
	     function (e) {
	         var up   = (e.pageY > lastY);
	         var down = ! up;
	         lastY    = event.pageY;

	         // Trying to start past scroller bounds
	         if ((up && allowScrollUp) || (down && allowScrollDown)) {
	             // Stop this event from propagating, lest
	             // another object cancel it.
	             e.stopPropagation();
	         } else {
	             // Cancel this event
	             e.preventDefault();
	         }
	     },
	     CAPTURE_PHASE);
	};
*/


 	//Start TypeAhead code
 	$(document).ready(function() {
 	$("body").delegate("input#textSuggestions","keyup",getTextSuggestions);
 	$("body").delegate("input#searchboxSuggestions","keyup",getTextSuggestions);
 	$("body").delegate("input#drugTextSuggestions","keyup",getTextSuggestions);
	 	$("body").delegate("input[name='searchTermTypeAhead']","keyup",getTextSuggestions);

 	//modalClose
 	$("#sendToCardCancel").live("click", function(e){
 		$("#overlayClose").click();
 	});
 	});
 	var myTimer;
	 	var myTimerRxTypeAhead;
 	$("#suggestListDrug, #drugTextSuggestions").live("mouseleave", function() {
 		myTimer = setTimeout(function(){

 			$("#suggestListDrug").hide();}, 10000);

 	})
 	$("#suggestListDrug, #drugTextSuggestions").live("mouseenter", function() {
 		clearTimeout(myTimer);

 	})

	 	$(" div[name='suggestionListBoxDrugForRx']").live("mouseleave", function() {
	 		myTimerRxTypeAhead = setTimeout(function(){
	 			$('#typeAheadbuttonwrapper').css({'margin-bottom' : '150px'});
	 			$("div[name='suggestionListBoxDrugForRx']").hide();}, 10000);

	 	})
	 	$("div[name='suggestionListBoxDrugForRx']").live("mouseenter", function() {
	 		clearTimeout(myTimerRxTypeAhead);

	 	})

 	function getTextSuggestions (e) {
		var curElement = this;
		showSuggestions(curElement);
		e.preventDefault();
	}
	var old_length;
 	function showSuggestions(curElement)
	{
 		var searchKeyword = $(curElement).val();
		var searchBoxId = $(curElement).attr("id");
		var restUrl = $(curElement).attr("data-restUrl");
		var pageType = $(curElement).attr("data-pageType");
		var offset=$(curElement).attr("data-offset");
		var sortBy=$(curElement).attr("data-sortBy");
		var minChar  =$(curElement).attr("data-minChar");
		var seeMoreCount  =$(curElement).attr("data-seeMoreCount");
		searchKeyword = searchKeyword.replace(/^\s+|\s+$/g,'');
		searchKeyword = searchKeyword.replace(/[^A-Za-z0-9-]/g,'');
			var index=searchBoxId.substring(7,8);
			var rxTypeAheadsearchBox=searchBoxId.substring(0,7);

		if(searchKeyword.length < minChar){

				if(rxTypeAheadsearchBox=="medname")
				{
					$('#suggestionListBoxDrug'+index).hide();
					$('#typeAheadbuttonwrapper').css({'margin-bottom' : '150px'});

					$('#rxTypeAheadResults'+index).val(false);
					if(document.getElementById(searchBoxId).value=="")
					{
						document.getElementById("hidden"+searchBoxId).value="";
					}
					else
					{
						document.getElementById("hidden"+searchBoxId).value=document.getElementById(searchBoxId).value;
					}
				}
				else
			$('#suggestionListBoxDrug').hide();
		}

		if (searchKeyword.length >= minChar && searchKeyword.length != old_length)
		{
		old_length = searchKeyword.length;
		var jsonResponse = "";
			$.ajax({
				type: 'POST',
				url: restUrl,
				data: {"searchKeyword":searchKeyword,"pageType":pageType,"offset":offset,"sortBy":sortBy},
				dataType: "JSON",
				success: function (json) {
					try
					{
						var jsonResponse = json;
						var additionalDrugsMap=jsonResponse.atgResponse;
						var suggestionList="";
						var onList=additionalDrugsMap.onList;
						var prodList=additionalDrugsMap.productList;

						if(((onList != null) && (onList.length > 0)) || (prodList != null) && (prodList.length > 0) )
						{
								if(rxTypeAheadsearchBox=="medname")
								{
									var suggestListDrugForRx="suggestListDrugForRx"+index;
									suggestionList=$('<ul class="suggestionListDrug" name="retrieveMarketedProductsForRx" id="'+suggestListDrugForRx+'"></ul>');
								}
								else
								{
							suggestionList=$('<ul class="suggestionListDrug" id="suggestListDrug"></ul>');
						}
							}

						if((onList != null) && (onList.length > 0))
						{
							for(var j=0;j<onList.length;j++)
							{
								var recordMap=onList[j];
								var orderableNameId = recordMap.drugOnId;
								var orderableName = recordMap.drugOnName;
								var onType = recordMap.drugOnType;
								var onNameLink;
								if((orderableNameId != null) && (orderableNameId.length > 0)){
										onNameLink=$('<a href="#" id="'+orderableNameId+'"><li class="drugOnId" name="'+orderableName+'" data-index="'+index+'" data-medicationTextBoxId="'+searchBoxId+'" data-ontype="'+onType+'" id="'+orderableNameId+'"	data-refineType="drugOnId" >'+orderableName+'</li></a>');
									suggestionList.append(onNameLink);
								}
							}
						}

						if((prodList != null) && (prodList.length > 0))
						{
							for(var j=0;j<prodList.length;j++)
							{
								var recordMap=prodList[j];
								var recordName=recordMap.drugName;
								var recordId=recordMap.drugProductId;
								var refLink1;
									if(rxTypeAheadsearchBox=="medname")
									{

										refLink1=$('<a href="javascript:void(0);" id="'+recordId+'"><li class="prodId" data-index="'+index+'" name="'+recordName+'" id="'+recordId+'" data-refineType="prodId" data-medicationTextBoxId="'+searchBoxId+'" onclick="setmedname(this)">'+recordName+'</li></a>');
									}
									else
									{
								refLink1=$('<a href="#" id="'+recordId+'"><li class="prodId" name="'+recordName+'" id="'+recordId+'" data-refineType="prodId" >'+recordName+'</li></a>');
									}
								suggestionList.append(refLink1);
							}
						}
						if(additionalDrugsMap.totalCount >  (onList.length +prodList.length+additionalDrugsMap.filteredProdCount )){
							var seeMoreLink;
								seeMoreLink=$('<a href="#"><li class="drugOnId" name="See More" data-searchKeyWord="'+searchKeyword+'" data-index="'+index+'" data-medicationTextBoxId="'+searchBoxId+'" data-seeMoreCount="'+ seeMoreCount +'" data-offset="'+additionalDrugsMap.totalCount+'" id="seeMore" onclick="showSeeMoreOverlay(this)" rel="#cvs-overlay" data-otype="pagecontent" data-odiv="modalDialogBoxBor" data-sortBy="nameAZ">See More</li></a>');
							suggestionList.append(seeMoreLink);
						}

						if(searchBoxId=="drugTextSuggestions")
						{
							$('#suggestionListBoxDrug').hide();
							$('#suggestionListBoxDrug').html(suggestionList);
							$('.suggestionListDrug').css({'filter' : 'inherit'});
							$('#suggestionListBoxDrug').fadeIn(400);
							$('#suggestionListBoxHeader').hide();
						}
							if(rxTypeAheadsearchBox=="medname")
							{

								$('#rxTypeAheadResults'+index).val(false);
								document.getElementById("hidden"+searchBoxId).value=document.getElementById(searchBoxId).value;
								$('#suggestionListBoxDrug'+index).hide();
								$('#suggestionListBoxDrug'+index).html(suggestionList);
								$('.suggestionListDrug').css({'filter' : 'inherit'});
								$('#suggestionListBoxDrug'+index).fadeIn(400);
								$('#suggestionListBoxHeader').hide();

								if((onList.length +prodList.length)>8){

									$('#typeAheadbuttonwrapper').css({'margin-bottom' : '250px'});

								}

							}




					} catch (err)
					{
					}},
				error: function(jqxhr){
					},
				complete: function(jqxhr, textstatus){
					if (jqxhr.status == "200")
					{
					}
				}
			});
		}
		old_length = searchKeyword.length;
	}
 	//End TypeAhead code

	 	/*27 AUG 2013 -Added for CR03089 Search mechanism to identify controlled substance in Prescription information--STARTS*/
	 	function setmedname(curElement)
	 	{
	 		medname = $(curElement).attr("name");

	 	var	mednTextBoxId = $(curElement).attr("data-medicationTextBoxId");
	 	var	index = $(curElement).attr("data-index");
	 	document.getElementById(mednTextBoxId).value=medname;
	 	document.getElementById("hidden"+mednTextBoxId).value=medname;
	 	$('#rxTypeAheadResults'+index).val(true);
	 	$('#typeAheadbuttonwrapper').css({'margin-bottom' : '150px'});
		$('#suggestionListBoxDrug'+index).hide();
	 	$("#overlayClose").click();
	 	}
	 	/*27 AUG 2013 -Added for CR03089 Search mechanism to identify controlled substance in Prescription information--ENDS*/
