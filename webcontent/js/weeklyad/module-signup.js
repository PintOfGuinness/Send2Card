
function calcDOB(dob){
 if(dob!=null && dob!=""){
		var dobArray=new Array();
		dobArray=dob.split("-");
		var month = dobArray[1].replace(/^0+/, '');
		document.weeklyadgetNewCard.dob_year.value=dobArray[0];
		document.weeklyadgetNewCard.dob_month.selectedIndex=month; 
		document.weeklyadgetNewCard.dob_day.value=dobArray[2];
	}
}

function goToBlankPhoneNumber(idField){
    if($('#' + idField).val() == "000-000-0000" || $('#' + idField).val() == "000" || $('#' + idField).val() == "0000") {
    	$('#' + idField).val("");
	}
}

function mergeeccardPhNumber() {
	var phNo = $('#ph1').val() + "-"+$('#ph2').val()+"-"+$('#ph3').val();
	if(phNo=="000-000-0000" || phNo=="--")
	{
	$('#phNumber').val("");
	}
	else
	{
	$('#phNumber').val(phNo);
	}
}




function validateInpAttributes(pForm,btn,event)
{
	var fields = $(pForm).find("input[type='text']");
	$.each(fields, function(idx, el){
		var fieldPHTxt = $(el).attr("data-placeholder");
		if($(el).val() == fieldPHTxt)
		{
		$(el).val("");
		}
	});
	document.getElementById(event).click();
	return false;
}


function validateCreateInpAttributes(pForm,btn,event)
{	
var fields = $(pForm).find("input[type='text']");
var valid = "true";
	$.each(fields, function(idx, el){
		var fieldPHTxt = $(el).attr("data-placeholder");
		var selectedVal = "";
		var selected = $("input[type='radio'][name='eccard']:checked");
		if (selected.length > 0)
		{		
			if(selected.val() == "ecno")
			{
				if($(el).attr('id') == "extracareCardNumber")
				{			
				}
				else
				{			
					if($(el).val() == fieldPHTxt)
					{
					$(el).val("");
					}
				}
			}
			else if(selected.val() == "ecyes")
			{
				if($(el).val() == fieldPHTxt)
				{
				$(el).val("");
				}
			}
		}
			
	});
	document.getElementById(event).click();
	return false;
	
}


function mergeeccardPhoneNumber(){
	var phNo = $('#phone1').val() + "-"+$('#phone2').val()+"-"+$('#phone3').val();
	if(phNo=="000-000-0000" || phNo=="--"){
		$('#phoneNumber').val("");
	}else{
		$('#phoneNumber').val(phNo);
	}
}

function restorePhoneNo1(phNo) {
	if(phNo!='' && phNo!='--') {
		var n=phNo.split('-');
		document.getElementById("phone1").value =  n[0];
		document.getElementById("phone2").value =  n[1];
		document.getElementById("phone3").value =  n[2];
	} else {
		/*document.getElementById("phone1").value = "000";
		document.getElementById("phone2").value = "000";
		document.getElementById("phone3").value = "0000";*/
	}
}


function restorePhoneNoExtraCare(phNo) {
	
	if(phNo!='' && phNo!='--') {
		var n=phNo.split('-');
		document.getElementById("ph1").value = n[0];
		document.getElementById("ph2").value = n[1];
		document.getElementById("ph3").value = n[2];
	} else {
		/*if(document.getElementById("ph1").value=='')
			document.getElementById("ph1").value = "000";
		if(document.getElementById("ph2").value=='')
			document.getElementById("ph2").value = "000";
		if(document.getElementById("ph3").value=='')
			document.getElementById("ph3").value = "0000";*/
	}
}
function restorePhoneNoExtraCare1(phNo) {
	
if(phNo!='' && phNo!='--') {
	var n=phNo.split('-');
		document.getElementById("phone1").value = n[0];
		document.getElementById("phone2").value = n[1];
		document.getElementById("phone3").value = n[2];
	} else {
		/*if(document.getElementById("phone1").value=='')
			document.getElementById("phone1").value = "000";
		if(document.getElementById("phone2").value=='')
			document.getElementById("phone2").value = "000";
		if(document.getElementById("phone3").value=='')
			document.getElementById("phone3").value = "0000";*/
	}
}

function openPopup(){
	window.name = 'win_terms_conditions';
	var xWin = window.open('/pharmacy/manage/popups/dialog_terms_of_use.jsp', 'termsConditionsPopupWindow', 'top=100, left=100, height=530, width=550, status=no, menubar=no, resizable=no, scrollbars=no, toolbar=no, location=no');
	xWin.focus();
}
	


function displaykey() {

	if (window.event) {
		var keyPressed = String.fromCharCode(event.keyCode);
		if (keyPressed == '<' || keyPressed == '>'  || keyPressed == '=' || keyPressed == ';') {
			return false;
		} else {
			return true;
		}
	}
}


function restoreDOB(DOB) {
	if(DOB!=null&&DOB!="") {
		var n=DOB.split('/');
		document.getElementById("dob_month").selectedIndex =n[0];
		document.getElementById("dob_day").value =n[1];
		document.getElementById("dob_year").value =n[2];
		
	} 
	
}

function restoreDOB1(DOB) {
	if(DOB!=null&&DOB!="") {
			var n=DOB.split('/');
			document.getElementById("dob").selectedIndex = n[0];
			if(n[1]!="")
			document.getElementById("date").value = n[1];
			else
				document.getElementById("date").value =  $("#date").val();
			if(n[2]!="")
			document.getElementById("year").value =  n[2];
			else
				document.getElementById("year").value =  $("#year").val();

		
	} 
	
}
function calcPhone(Phone)
{

	if(Phone!=null&&Phone!="") {
		var n=Phone.split('-');
	document.getElementById("phone1").value =n[0];
	document.getElementById("phone2").value =n[1];
	document.getElementById("phone3").value =n[2];
	
} 
}

function calcPhoneTie(Phone)
{

	if(Phone!=null&&Phone!="") {
		var n=Phone.split('-');
	document.getElementById("ph1").value =n[0];
	document.getElementById("ph2").value =n[1];
	document.getElementById("ph3").value =n[2];
	
} 
}



function trim(promonth,dob)
{
	if(dob!=null&&dob!="")
	{
		dob = dob.replace(/^0+/, '');
	document.getElementById("dob_month").selectedIndex = dob;
	}


}
	