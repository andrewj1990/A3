var ajaxURLPrefix = null;
var updateID = null;
var networkAvailable = true;

$(document).ready(function() {
	
}
		
$(document).on("mobileinit", function() {

	$.mobile.defaultPageTransition = "none";
	$.mobile.defaultDialogTransition = "none";
	$.mobile.phonegapNavigationEnable = true;
	$.mobile.loader.prototype.options.text = "...Please Wait ...";
	$.mobile.loader.prototype.options.textVisible = true;
	
	if(document.location.protocol.toLowerCase().indexOf("file") != -1) {
		ajaxURLPrefix = "http://127.0.0.1:80 ";
	}else{
		ajaxURLPrefix = " ";
	}
});

$(document).on("ready", function() {

	if (navigator && navigator.connection &&
		navigator.connection.type == Connection.NONE
		){
		showConnectivityMsg();
	}else{
		downloadServerData();
	}
});
	
/*$("#confirmClearYes").on("click", function() {
	clearData();

});*/


function showConnectivityMsg(){

	networkAvailable = false;
	$("#infoDialogHeader").html("No Network Connectivity");
	$("#infoDialogContent").html(
		"Network connectivity is currently unavailable. The ability to " +
		"create new items, update items and delete items has been " +
    	"disabled. You can still browse locally-cached data. Restart " +
  		"the app when connectivity has been restored."
  	);
  	$.mobile.changePage($("#infoDialog"), { role : "dialog" });
}

function downloadServerData() {
 
  $.mobile.loading("show");
 
  var fetching = {
    loaded_appointment : false, 
    loaded_note : false,
    data_appointment : null,
    data_note : null
  };
  
	var completeLoad = function(inType, inResponse) {
    	fetching["loaded_" + inType] = true;
    	fetching["data_" + inType] = inResponse;
		if (fetching.loaded_appointment && fetching.loaded_note) {
			if (fetching.data_appointment && fetching.data_note) {
				window.localStorage.clear();
					var types = [ "appointment", "note"];
					for (var i = 0; i < types.length; i++) {
						var typ = types[i];
						var dat = fetching["data_" + typ];
						var len = dat.length;
						var lst = window.localStorage;
						for (var j = 0; j < len; j++) {
							var obj = dat[j];
							lst.setItem(typ + "_" + obj._id, JSON.stringify(obj));
						}
					}
				function supports_html5_storage() {
					try {
						return 'localStorage' in window && window['localStorage'] !== null;
					} catch (e) {
						return false;
					}
				}
			fetching = null;
			$.mobile.loading("hide");
			$.ajax({ url:ajaxURLPrefix + "/appointment" })
			.done(function(inResponse) {completeLoad("appointment". inResponse); })
			.fail(function(inXHR, inStatus) { completeLoad("appointment", null); });
			}
		}
	}
			
}

function getAllFromLocalStorage(inType) {

	var items = [ ];
	
	var lst = window.localStorage;
	for (var itemKey in lst){
		    if (itemKey.indexOf(inType) == 0) {
				var sObj = lst.getItem(itemKey);
  			    items.push(JSON.parse(sObj));
  			  }
	}
	items.sort(function(a, b) {
  		switch (inType) {
   			case "contact":
      		return a.lastName > b.lastName;
   		break;
    		case "appointment": case "note": case "task":
      		return a.title > b.title;
   		break;
 		}
	});
 
	return items;
}

function showListView(inType) {
 
  updateID = null;
  document.getElementById(inType + "EntryForm").reset();
 
  $("#" + inType + "Entry").hide("fast");
  $("#" + inType + "List").show("fast");
  $("#" + inType + "Menu" ).popup("close");
 
}

function doSave(inType) {
 
	if (!validations["check_" + inType](inType)) {
    	$("#infoDialogHeader").html("Error");
    	$("#infoDialogContent").html(
      	"Please provide values for all required fields"
    	);
    	$.mobile.changePage($("#infoDialog"), { role : "dialog" });
    	return;
	}
	$.mobile.loading("show");
	$("#" + inType + "Entry").hide();
	$("#" + inType + "List").show();
	$("#" + inType + "Menu" ).popup("close");
	
	var httpMethod = "post";
	var uid= "";
	if (updateID) {
 		httpMethod = "put";
  		uid= "/" + updateID;
	}
	var frmData = getFormAsJSON(inType);
	updateID = null;
	document.getElementById(inType + "EntryForm").reset();
	
	$.ajax({
 		url : ajaxURLPrefix + "/" + inType + uid, type : httpMethod,
		contentType: "application/json", data : frmData
	})
	
	.done(function(inResponse) {
 		frmData = frmData.slice(0, frmData.length - 1);
  		frmData = frmData + ",\"__v\":\"0\",\"_id\":\"" + inResponse + "\"}";
  		window.localStorage.setItem(inType + "_" + inResponse, frmData);
  		populateList(inType);
  		$.mobile.loading("hide");
  		$("#infoDialogHeader").html("Success");
  		$("#infoDialogContent").html("Save to server complete");
  		$.mobile.changePage($("#infoDialog"), { role : "dialog" });
	})
	
	{ title : "My Note", text : "My note text" }

	.fail(function(inXHR, inStatus) {
  		$.mobile.loading("hide");
  		$("#infoDialogHeader").html("Error");
  		$("#infoDialogContent").html(inStatus);
  		$.mobile.changePage($("#infoDialog"), { role : "dialog" });
	});
	
}

function getFormAsJSON(inType) {
 
  var frmData = $("#" + inType + "EntryForm").serializeArray();
  var frmObj = { };
  for (var i = 0; i < frmData.length; i++) {
    var fld = frmData[i];
    frmObj[fld.name] = fld.value;
  }
  return JSON.stringify(frmObj);
 
}
 
  


