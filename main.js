var ajaxURLPrefix = null;
var updateID = null;
var networkAvailable = true;

var pageVisited = {
    appointment : false,
    contact : false,
    note : false,
    task : false
};

$(document).on("mobileinit", function() {

	$.mobile.defaultPageTransition = "none";
	$.mobile.defaultDialogTransition = "none";
	$.mobile.phonegapNavigationEnable = true;
	$.mobile.loader.prototype.options.text = "...Please Wait ...";
	$.mobile.loader.prototype.options.textVisible = true;
	
	if(document.location.protocol.toLowerCase().indexOf("file") != -1) {
		ajaxURLPrefix = "http://127.0.0.1:80 ";
	}else{
		ajaxURLPrefix = " http://www.etherient.com:80 ";
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
	
$("#confirmClearYes").on("click", function() {
	clearData();

});

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
    loaded_appointment : false, loaded_contact : false,
    loaded_note : false, loaded_task : false,
    data_appointment : null, data_contact : null,
    data_note : null, data_task : null
  };
}


