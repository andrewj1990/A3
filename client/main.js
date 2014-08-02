var logedInUser = "-1";
var loggedInEmail;
var loggedInPassword;
var _doctor;
var _date;
var _time;
var global_id;
var _reason;
var allapps;
var preloaded = false;

$(window).load(function() {
	logedInUser = localStorage.getItem('logedInUser');
	loggedInEmail = localStorage.getItem('loggedInEmail');
	loggedInPassword = localStorage.getItem('loggedInPassword');
	if (logedInUser == null || logedInUser == "-1") {
		$('#welcome').hide();
	} else {
		$('#login').hide();
		$('#welcomeText').html("Welcome " + logedInUser);
	}
	
	preloadApps();
	
	//alert('hi ' + logedInUser );
});

function preloadApps() {
	var booked = false;
	var dataObj = {};
	dataObj.booked = booked;
	$.ajax({
		type: "GET",
		url: "http://localhost:8888/findApps",
		data: dataObj,
		dataType: 'jsonp',
		jsonpCallback: 'callback', 
		success: function(res) {
			
			
			allapps = res;
			// alert(allapps);
		
			allapps.sort(compareTime);
			// allapps.sort(compareDate);	
			preloaded = true;
		}
		/* error: function (a, b ,c) {
			 alert("bad");
		 } */
	});

}

window.setInterval(function(){
	preloadApps();
}, 10000);

$(document).ready(function () {
	$("#col1 h3 a").click(function (event) {
			if ($("#col1").hasClass('ui-collapsible-collapsed')) {
				return true;
			} else return false;
	});
	
	$("#col2 h3 a").click(function (event) {
			if ($("#col2").hasClass('ui-collapsible-collapsed')) {
				if (logedInUser == "-1") {
					alert("Please Log In");
					return false;
				}
				return true;    
			} else return false;
	});
	
	$("#col3 h3 a").click(function (event) {
			if ($("#col3").hasClass('ui-collapsible-collapsed')) {
				
				var booked = true;
				var dataObj = {};
				dataObj.booked = booked;
				dataObj.patient = logedInUser;
				if (logedInUser == "-1") {
					alert("Please Log In");
					return false;
				}
				$.ajax({
					type: "GET",
					url: "http://localhost:8888/findApps",
					data: dataObj,
					dataType: 'jsonp',
					jsonpCallback: 'callback', 
					success: function(res) {
						res.sort(compareTime);
						res.sort(compareDate);
						$('#check_table tbody').remove();
						$.each(res, function(i, item) {
							var $tr = $('<tr>').append(
							$('<td>').text(item.doc),
							$('<td>').text(item.date),
							$('<td>').text(item.time),
							$('<td>').text(item.duration)
							).appendTo('#check_table');
						});
						// allapps = res;
						// alert(allapps);
						
					}
					/* error: function (a, b ,c) {
						 alert("bad");
					 } */
				});
				return true;    
			} else return false;

	});
	
    $('#records_table').on('click', 'tbody tr', function() {

		$('#dialog').dialog({modal: true});
		$('#dialog').css('display', 'block');
		$('#dialog p').html("Doctor: " + $(this).find("td").eq(0).html() + "<br>Date: " + $(this).find("td").eq(1).html() + "<br>Start time: " + $(this).find('td').eq(2).html() + "<br>Duration: " + $(this).find('td').eq(3).html());
		

		_doc = $(this).find("td").eq(0).html();
		_date = $(this).find("td").eq(1).html();
		_time = $(this).find("td").eq(2).html();
		
		var dataObj = {};
		var flag = false;
		var id = "";
		
		dataObj.doc = _doc;
		dataObj.date = _date;
		dataObj.time = _time;
		
		$.ajax({
			type: "GET",
			url: "http://localhost:8888/findApps",
			data: dataObj,
			dataType: 'jsonp',
			jsonpCallback: 'callback',
			success: function(res) {
			
				if (res[0].booked == false) {
					flag = true;
					global_id = res[0]._id;
				} else {
					alert("appointment booked already");
					$('#dialog').dialog('close');
				}
			},
			error: function(a, b, c) {
				alert('db error');
			}		
		});
		
	});
	
	
	
	
	$(document).on('click', '.ui-widget-overlay', function() {
		$('.ui-dialog-content').each(function() {
		   $(this).dialog('close'); 
		});
	});
	
	$('#check_table').on('click','tbody tr',function() {
		
		$('#dialog_check').dialog({modal: true});
		$('#dialog_check').css('display', 'block');
		
		
		_doc = $(this).find("td").eq(0).html();
		_date = $(this).find("td").eq(1).html();
		_time = $(this).find("td").eq(2).html();
		
		var dataObj = {};
		var id = "";
		
		dataObj.doc = _doc;
		dataObj.date = _date;
		dataObj.time = _time;
		
		$.ajax({
			type: "GET",
			url: "http://localhost:8888/findApps",
			data: dataObj,
			dataType: 'jsonp',
			jsonpCallback: 'callback',
			success: function(res) {
				global_id = res[0]._id;
				_reason = res[0].reason;
			},
			error: function(a, b, c) {
				alert('db error');
			}		
		});
		$('#dialog_check p').html("Doctor: " + $(this).find("td").eq(0).html() + "<br>Date: " + $(this).find("td").eq(1).html() + "<br>Start time: " + $(this).find("td").eq(2).html() + "<br>Duration: " + $(this).find("td").eq(3).html()+"<br>Reason: "+ _reason);
			
	
	});	

});



// function delay() {
    // setTimeout(function () {
        // alert('VIDEO HAS STOPPED');
        // }
    // , 10000);
// }



function bookApp() {

var reason = $('#reason_input').val();
		var modify = {};
		
		modify._id = global_id;
		modify.patient = logedInUser;
		modify.reason = reason;
		modify.booked = "true";
		modify.password = loggedInPassword;
		modify.email = loggedInEmail;
		
		$.ajax({
			type: "put",
			url: "http://localhost:8888/bookApp",
			data: modify,
			dataType: 'jsonp',
			jsonpCallback: 'callback',
			success: function(res) {
				alert("Appointment Booked");
				$('#dialog').dialog('close');
				searchAvailableApps();
			},
			error: function(a, b, c) {
				alert('db error');
			}		
		});
}

function cancelApp(){

		var modify = {};
		
		modify._id = global_id;
		modify.patient = "";
		modify.reason = "";
		modify.booked = "false";	
		modify.password = loggedInPassword;
		modify.email = loggedInEmail;
		$.ajax({
			type: "put",
			url: "http://localhost:8888/bookApp",
			data: modify,
			dataType: 'jsonp',
			jsonpCallback: 'callback',
			success: function(res) {
				alert("Appointment Cancelled");
				$('#dialog_check').dialog('close');
				updateMyApps();
			},
			error: function(a, b, c) {
				alert('db error');
			}		
		});

}


function doLogin() {
	var email = $('#emailIn').val();
	var password = $('#passwordIn').val();
	if (email == "") {
		alert("User name is empty. Please input your user email");
		return;
	}
	if (password == "") {
		alert("Password is empty. Please input your password");
		return;
	}
	var dataObj = {};
	dataObj.email=email;
	dataObj.password = password;
	$.ajax({
		type: "GET",
		url: "http://localhost:8888/login",
		data: dataObj,
		dataType: 'jsonp',
		jsonpCallback: 'callback', 
		error: function (a, b ,c) {
			alert("Server Error");
		}
	}).done(function(res) {
		if (res.loggedIn == true) {
			logedInUser = res.first + " " + res.last;
			localStorage.setItem('logedInUser', logedInUser);
			loggedInEmail = email;
			localStorage.setItem('loggedInEmail', email);
			loggedInPassword = password;
			localStorage.setItem('loggedInPassword', loggedInPassword);
			$('#login').hide();
			$('#welcomeText').html("Welcome " + logedInUser);
			$('#welcome').show();
			alert("Welcome, "+ logedInUser);
		} else {
			alert("User name and password doesn't match, please try again");
		}
	});
}

function logOut() {
	logedInUser = "-1";
	loggedInEmail = "-1";
	loggedInPassword = null;
	localStorage.setItem('logedInUser', logedInUser);
	localStorage.setItem('loggedInEmail', loggedInEmail);
	localStorage.setItem('loggedInPassword', loggedInPassword);
	$('#login').show();
	$('#welcome').hide();
	alert("User loged out");
}

function searchAvailableApps() {


		// alert(JSON.stringify(allapps));
		if (preloaded == true) {
			var doctor = $('#doctor').val();
			var date = $('#mydate').val();
			if (date == "") {
				alert("please select a date");
				return;
			}
			// allapps.sort(compareTime);
			// allapps.sort(compareDate);
			
			$('#records_table tbody').remove();
			$.each(allapps, function(i, item) {
				if (date != item.date) {
					// alert('sad');
				} else if (item.doc == doctor || doctor == "null") {
						var $tr = $('<tr>').append(
						$('<td>').text(item.doc),
						$('<td>').text(item.date),
						$('<td>').text(item.time),
						$('<td>').text(item.duration)
						).appendTo('#records_table');
				} 
				
			});
		} else {
			alert('Server is busy, Please try again in a couple of seconds');
		}
		
}

function updateMyApps(){

	var booked = true;
	var dataObj = {};
	dataObj.booked = booked;
	dataObj.patient = logedInUser;
	$.ajax({
		type: "GET",
		url: "http://localhost:8888/findApps",
		data: dataObj,
		dataType: 'jsonp',
		jsonpCallback: 'callback', 
		success: function(res) {
			res.sort(compareTime);
			res.sort(compareDate);
			$('#check_table tbody').remove();
			$.each(res, function(i, item) {
				var $tr = $('<tr>').append(
				$('<td>').text(item.doc),
				$('<td>').text(item.date),
				$('<td>').text(item.time),
				$('<td>').text(item.duration)
				).appendTo('#check_table');
			});
		}
			// error: function (a, b ,c) {
				// alert("bad");
			// }
	});


}

function compareTime(a,b){
	if(a.time < b.time)
		return -1 ;
	if(a.time > b.time)
		return 1;
	
	return 0;

}

function compareDate(a,b){
	if(a.date < b.date)
		return -1 ;
	if(a.date > b.date)
		return 1;
	
	return 0;
}

function signUp(){
	$("#dialog_signup").dialog({modal: true});

}
function doRegisterUser(){
	var firstName = $("#registerFirstName").val();
	var lastName = $("#registerLastName").val();
	var email = $("#registerEmail").val();
	var gender = $("#registerGender").val();
	var birthDate = $("#registerBirthDate").val();
	var password = $("#registerPassword").val();
	var confirmPassword = $("#confirmPassword").val();
	
	if(firstName == ""){alert("Please enter your first name !"); return; }
	if(lastName == ""){alert("Please enter your last name !"); return; }
	if(email == ""){alert("Please enter your Email !"); return; }
	if(gender == ""){alert("Please select your Gender !"); return; }
	if(birthDate == ""){alert("Please enter your date of birth !"); return; }
	if(password == ""){alert("Please enter your password !"); return; }
	if(confirmPassword == ""){alert("Please confirm your password !"); return; }
	if(confirmPassword != password ){alert("Confirm password does not match password, Please re-confirm your password !"); return; }
	
	var dataObj = {};
	dataObj.email = email;
	dataObj.password = password;
	dataObj.first = firstName;
	dataObj.last = lastName;
	dataObj.gender = gender;
	dataObj.dob = birthDate;
	
	$.ajax({
		type: "POST",
		url: "http://localhost:8888/registerUser",
		data: dataObj,
		dataType: 'jsonp',
		jsonpCallback: 'callback',
		success: function(res) {
			logedInUser = res.first + " " + res.last;
			localStorage.setItem('logedInUser', logedInUser);
			loggedInEmail = res.email;
			localStorage.setItem('loggedInEmail', email);
			loggedInPassword = password;
			localStorage.setItem('loggedInPassword', loggedInPassword);
			$('#login').hide();
			$('#welcomeText').html("Welcome " + logedInUser);
			$('#welcome').show();
			alert("Welcome, "+ logedInUser);
		},
		error: function(a, b, c) {
			alert('db error');
		}		
	});

}
function doFunction(){
	//var var1 = document.getElementByid("clickMe").value;
	//alert('hello');
	$.ajax({
		type: 'get',
		url: 'http://localhost:8888/findApps?doc=Dr.Who',
		dataType: 'jsonp',
		jsonpCallback: 'callback',
		success: function(data) {
			alert(JSON.stringify(data));
		},
		error: function(jqXHR, textStatus, errorThrown) {
			alert('bad');
		}
	});
}

