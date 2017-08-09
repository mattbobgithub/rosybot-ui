/** 
* intiate the cart with the order from the api
 */

$body = $("body");

$(document).on({
    ajaxStart: function() { $body.addClass("loading");    },
     ajaxStop: function() { $body.removeClass("loading"); }    
});

$(document)
		.ready(
				function() {
					
					$('#confirmMessage').hide();				
				
					orderId = getURLParameter("ro");
				
					var postData1 = new Object();
					postData1.id = orderId;
					postData2 = JSON.stringify(postData1);
					console.log(postData2);
					
					$
							.ajax({
								type : 'POST',
								url : 'https://tn59sjpc9c.execute-api.us-east-1.amazonaws.com/dev/api/rosyorder',
								data : postData2, // or JSON.stringify ({name:
													// 'jonas'}),
								success : function(data) {
									// alert('data: ' + data);
									console.log(data);
									console.log('successful call:');
									
									// console.log(data);
									jsonData = JSON.parse(data);
									console.log(jsonData)
									loadRosyOrderData(jsonData);
									
									
									//now autoclick the checkout button to take you to checkout
									//cannot do it!! cannot access iframe content from javascript because it's all hosted on paypal servers.  
									//imagine getting the username /passworrd field, you can't do it.  user must click the pay now button.
									
									//if order is paid, display paid confirmation
									if(jsonData.rosyOrderStatus=='PAID' || jsonData.rosyOrderStatus=='FULFILLED' ){
										$('#confirmMessage').show();
										$('#confirmMessage').text('THANKS! YOUR ORDER # is ' + jsonData.rosyOrderId + '. YOU WILL RECEIVE A TEXT CONFIRMATION SHORTLY');
										var form = document.getElementById("rosyOrder");
										var elements = form.elements;
										for (var i = 0, len = elements.length; i < len; ++i) {
										    elements[i].readOnly = true;
										    elements[i].disabled = true;
										}
										$('#rosyClickableArea').hide();
									}
									
									
								},
							  error: function (response) {
								  
						           //Handle error
									$('#confirmMessage').show();
									$('#confirmMessage').text('ROSY HAD A PROBLEM RETRIEVING YOUR ORDER, PLEASE TRY AGAIN.');
									var form = document.getElementById("rosyOrder");
									var elements = form.elements;
									for (var i = 0, len = elements.length; i < len; ++i) {
									    elements[i].readOnly = true;
									    elements[i].disabled = true;
									}
									$('#rosyClickableArea').hide();
						           

						    }           ,
								contentType : "application/json",
								dataType : 'json'
							});

				});






function loadRosyOrderData(rod) {
	console.log(rod);

	document.forms['rosyOrder'].elements['id'].value = rod.id;
	document.forms['rosyOrder'].elements['cardMessage'].value = rod.cardMessage;
	document.forms['rosyOrder'].elements['customerEmail'].value = rod.customerEmail;
	document.forms['rosyOrder'].elements['customerFullName'].value = rod.customerFullName;
	var displayPhone = convertPhoneForDisplay(rod.customerPhone);
	document.forms['rosyOrder'].elements['customerPhone'].value = displayPhone;
	
	var displayDate = convertDateForDisplay(rod.deliveryDate);
	
	document.forms['rosyOrder'].elements['deliveryDate'].value = displayDate;
	document.forms['rosyOrder'].elements['recipientCity'].value = rod.recipientCity;
	document.forms['rosyOrder'].elements['recipientCountry'].value = rod.recipientCountry;
	document.forms['rosyOrder'].elements['recipientFullName'].value = rod.recipientFullName;

	document.forms['rosyOrder'].elements['recipientPhone'].value = rod.recipientPhone;
	document.forms['rosyOrder'].elements['recipientPostalCode'].value = rod.recipientPostalCode;
	document.forms['rosyOrder'].elements['recipientState'].value = rod.recipientState;
	document.forms['rosyOrder'].elements['recipientStreetAddress1'].value = rod.recipientStreetAddress1;
	document.forms['rosyOrder'].elements['recipientStreetAddress2'].value = rod.recipientStreetAddress2;
	
	//update imageUrl
	console.log(rod.productImageUrl);

	
	document.getElementById("rosyOrderImage").src=rod.productImageUrl;


	document.getElementById("productName").textContent = rod.productName;
	document.getElementById("productCode").textContent = 'Rosy Product Code - ' + rod.productCode;
	document.getElementById("orderTotal").textContent = rod.orderTotal;

}

// $( "rosyOrder" ).submit(function( event ) {
// console.log( $( this ).serializeArray() );
// event.preventDefault();
// });

//$("#rosyOrder")
//		.submit(
//				function(e) {
//					e.preventDefault();
//					console.log(e);
//					var arrayInput = $(this).serializeArray();
//					console.log(arrayInput);
//
//					var postData1 = objectifyForm(arrayInput);
//					console.log(postData1);
//					postData2 = JSON.stringify(postData1);
//					console.log(postData2);
//
//					$.ajax({
//								type : 'POST',
//								url : 'https://tn59sjpc9c.execute-api.us-east-1.amazonaws.com/dev/api/rosyorder',
//								data : postData2, // or JSON.stringify ({name:
//													// 'jonas'}),
//								success : function(data) {
//									// alert('data: ' + data);
//									console.log('successful update call:');
//									console.log(data);
//									// console.log(data);
//									jsonData = JSON.parse(data);
//									// reload order data from response of
//									// updated order
//									loadRosyOrderData(jsonData);
//								},
//								contentType : "application/json",
//								dataType : 'json'
//							});
//
//				});


function updateRosyOrder(){
	
	var arrayInput = $('#rosyOrder').serializeArray();
	var postData1 = objectifyForm(arrayInput);
	var outputDate = convertDateForSave(postData1.deliveryDate);
	postData1.deliveryDate = outputDate;
	var outputPhone = convertPhoneForSave(postData1.customerPhone);
	postData1.customerPhone = outputPhone;

	
	postData2 = JSON.stringify(postData1);
	
	
	$.ajax({
				type : 'POST',
				url : 'https://tn59sjpc9c.execute-api.us-east-1.amazonaws.com/dev/api/rosyorder',
				data : postData2, // or JSON.stringify ({name:
									// 'jonas'}),
				success : function(data) {
					console.log('successful update call:');
					jsonData = JSON.parse(data);
					// reload order data from response of
					// updated order
					loadRosyOrderData(jsonData);
				},
				contentType : "application/json",
				dataType : 'json'
			});
	}














Array.prototype.move = function(from, to) {
	this.splice(to, 0, this.splice(from, 1)[0]);
};

function objectifyForm(formArray) {// serialize data function

	var returnArray = {};
	for (var i = 0; i < formArray.length; i++) {
		
		//find delivery date
		returnArray[formArray[i]['name']] = formArray[i]['value'];
	}
	return returnArray;
}

function getURLParameter(name) {
	return decodeURIComponent((new RegExp('[?|&]' + name + '='
			+ '([^&;]+?)(&|#|;|$)').exec(location.search) || [ null, '' ])[1]
			.replace(/\+/g, '%20'))
			|| null;
}


function convertDateForDisplay(dateStr_MM_DD_YYYY){
	var dateArray = dateStr_MM_DD_YYYY.split("-");
	var mm = dateArray[0];
	var dd = dateArray[1];
	var yyyy = dateArray[2];
	return yyyy+"-"+mm+"-"+dd;
}

function convertDateForSave(dateStr_YYYY_MM_DD){
	var dateArray = dateStr_YYYY_MM_DD.split("-");
	var yyyy = dateArray[0];
	var mm = dateArray[1];
	var dd = dateArray[2];
	return mm+"-"+dd+"-"+yyyy;
}



function convertPhoneForDisplay(phone){
	if(phone.charAt(0)==='1'){
	phone =  phone.substr(1);	
}

	return phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
}

function convertPhoneForSave(phone){
	phone = phone.replace(/\D/g,'')
	phone = '1'+phone;
	return phone;
}




