// WebTrends SmartSource Data Collector Tag v10.4.7
// Copyright (c) 2013 Webtrends Inc.  All rights reserved.
// Tag Builder Version: 4.1.2.4
// Created: 2013.08.13
window.webtrendsAsyncInit=function(){
    var dcs=new Webtrends.dcs().init({
        dcsid:"dcscnww13100008eg8v7k3x39_3j3x",
        domain:"statse.webtrendslive.com",
        timezone:-5,
        i18n:true,
        offsite:true,
        download:true,
        downloadtypes:"xls,doc,pdf,txt,csv,zip,docx,xlsx,rar,gzip",
        anchor:true,
        javascript: true,
        onsitedoms:"cvs.com",
        fpcdom:".cvs.com",
        plugins:{
            //hm:{src:"//s.webtrends.com/js/webtrends.hm.js"}
        }
        }).track();
};
(function(){
    var s=document.createElement("script"); s.async=true; s.src="webcontent/js/webtrends.min.js";    
    var s2=document.getElementsByTagName("script")[0]; s2.parentNode.insertBefore(s,s2);
}());

