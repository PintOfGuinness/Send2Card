/*! Viewport Selectors for jQuery - http://www.appelsiini.net/projects/viewport */
(function($){$.belowthefold=function(element,settings){var fold=$(window).height()+$(window).scrollTop();return fold<=$(element).offset().top-settings.threshold;};$.abovethetop=function(element,settings){var top=$(window).scrollTop();return top>=$(element).offset().top+$(element).height()-settings.threshold;};$.rightofscreen=function(element,settings){var fold=$(window).width()+$(window).scrollLeft();return fold<=$(element).offset().left-settings.threshold;};$.leftofscreen=function(element,settings){var left=$(window).scrollLeft();return left>=$(element).offset().left+$(element).width()-settings.threshold;};$.inviewport=function(element,settings){return!$.rightofscreen(element,settings)&&!$.leftofscreen(element,settings)&&!$.belowthefold(element,settings)&&!$.abovethetop(element,settings);};$.extend($.expr[':'],{"below-the-fold":function(a,i,m){return $.belowthefold(a,{threshold:0});},"above-the-top":function(a,i,m){return $.abovethetop(a,{threshold:0});},"left-of-screen":function(a,i,m){return $.leftofscreen(a,{threshold:0});},"right-of-screen":function(a,i,m){return $.rightofscreen(a,{threshold:0});},"in-viewport":function(a,i,m){return $.inviewport(a,{threshold:0});}});})(jQuery);

/*!
 * jquery.unevent.js 0.1
 * https://github.com/yckart/jquery.unevent.js
 *
 *
 * Copyright (c) 2012 Yannick Albert (http://yckart.com)
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php).
 * 2013/02/08
**/
;(function ($) {
    var methods = { on: $.fn.on, bind: $.fn.bind };
    $.each(methods, function(k){
        $.fn[k] = function () {
            var args = [].slice.call(arguments),
                delay = args.pop(),
                fn = args.pop(),
                timer;

            args.push(function () {
                var self = this,
                    arg = arguments;
                clearTimeout(timer);
                timer = setTimeout(function(){
                    fn.apply(self, [].slice.call(arg));
                }, delay);
            });

            return methods[k].apply(this, isNaN(delay) ? arguments : args);
        };
    });
}(jQuery));

//jQuery plugin to determine if something is visible (adds 500px below the fold to accommodate pre-loading
$.fn.isVisible = function(partial,$container){
	var $el	= $(this).eq(0),
	$w = $(window),
	viewTop	= $w.scrollTop(),
	viewBottom = viewTop + $w.height() + 540,
	_elTop = $el.offset().top,
	_elBottom = _elTop + $el.height();

	var elIsVisible = ($el.css('display') != "none");

	var elTopAboveVPTop = _elTop < viewTop,
	elTopBelowVPTop = _elTop >= viewTop,
	elTopAboveVPBottom = _elTop < viewBottom,
	elTopBelowVPBottom = _elTop >= viewBottom;
	
	var elBottomAboveVPTop = _elBottom < viewTop,
	elBottomBelowVPTop = _elBottom >= viewTop,
	elBottomAboveVPBottom = _elBottom < viewBottom,
	elBottomBelowVPBottom = _elBottom >= viewBottom;

	var elEntirelyWithinVP = (elTopBelowVPTop && elBottomAboveVPBottom),
	elPartiallyAboveVP = (elTopAboveVPTop && elBottomBelowVPTop && elBottomAboveVPBottom),
	elPartiallyBelowVP = (elTopBelowVPTop && elBottomBelowVPBottom && elTopAboveVPBottom),
	elEncompassesVP = (elTopAboveVPTop && elBottomBelowVPBottom);
	
	if(partial || (elEntirelyWithinVP && elIsVisible)){
		if((elEntirelyWithinVP || elPartiallyAboveVP || elPartiallyBelowVP || elEncompassesVP) && elIsVisible){
			return true;
		}

		return false;
	}

	return false;
}