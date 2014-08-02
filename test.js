

// $(document).ready(function () {
	// somefunction();
// });


// function somefunction() {
	// $.getJSON( "https://mongolab.com/databases/awesome/collections/appointments/databases?apiKey=rLUUxPVKhy2W-XPpLSXbJ35iM6SLlrpW", function( json ) {
	// console.log( "JSON Data: " + json );
	// alert("hi");
	// }
// );

// }


// Because we are going to be using a remote connection, be sure
// to start the MongoDB Shell (mongo) with the --nodb flag. Then,
// we can connect and define our own db instance.

// Connect to the MongoLab database.
var connection = new Mongo( "ds049219.mongolab.com:49219" );

// Connect to the test database.
var db = connection.getDB( "user2-test" );

// Authorize this connection.
db.auth( "user2", "user2");

print( "> MongoLab connection and DB defined." );


function getMyData(data) {
	
	
}

