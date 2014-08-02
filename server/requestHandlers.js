var mongoose = require('mongoose');
var url = require('url');
var querystring = require('querystring');

var db = mongoose.connection;

db.on('error', console.error);
//db.once('open',function() {

	var appSchema = new mongoose.Schema({
		doc: String,
		date: String,
		time: String,
		duration: {type: Number, default: 15},
		booked: {type: Boolean, default: false},
		patient: String,
		appType: {type: String},
		reason: String
	});
	var Appointment = mongoose.model('Appointment', appSchema);

	var userSchema = new mongoose.Schema({
		email: String,
		password: String,
		first: String,
		last: String,
		gender: String,
		dob: Date
	});
	var User = mongoose.model('User', userSchema);
//});

mongoose.connect('mongodb://admin:12345@ds049219.mongolab.com:49219/senghaoyan');



function start(request, response) {
	console.log("Request handler 'start' was called");
	
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write("Server started");
	response.end();
}

function upload(request, response) {
	console.log("Request handler 'upload' was called");
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write("Hello Upload");
	response.end();
}

function foo(request, response) {
	console.log("Request handler 'foo' was called");
	response.writeHead(200, {"Content-Type": "text/plain"});
        response.write("Foo haha");
        response.end();
}


function registerUser(request, response) {
	console.log(request.url);
	db.on('error',console.error);
	var arg = request.url.replace(/(\&callback=callback)|(callback=callback\&)/g, "");
	arg = arg.replace(/\&_=[0-9]*/g, "");
	console.log(arg);
	var queryAsObject = new User(url.parse(arg,true).query);
	queryAsObject.save(function(err,User) {
		if (err) return console.error(err);
		response.writeHead(200, {"Content-Type": "text/plain"});
		//response.write("user registed");
		response.write("callback(" + JSON.stringify(User, undefined, 2) + ");");
		response.end();
	});
}
// for testing
function findUser(request, response) {
	console.log(request.url);
	db.on('error', console.error);
	var arg = request.url.replace(/(\&callback=callback)|(callback=callback\&)/g, "");
	arg = arg.replace(/\&_=[0-9]*/g, "");
	console.log(arg);
	User.find(url.parse(arg,true).query, function(err, User) {
		//console.log("data: ;
		if (err) return console.error(err);
		response.writeHead(200, {"Content-Type": "text/plain"});
		response.write("callback(" + JSON.stringify(User, undefined, 2) + ");");
		response.end();
	});
}

function login(request, response) {
	console.log(request.url);
	db.on('error', console.error);
	var arg = request.url.replace(/(\&callback=callback)|(callback=callback\&)/g, "");
	arg = arg.replace(/\&_=[0-9]*/g, "");
	console.log(arg);
	var dataObj = url.parse(arg,true).query;
	var queryObj = {};
	queryObj.email = dataObj.email;
	User.find(queryObj, function(err, User) {
		console.log("data: " + JSON.stringify(User));
		if (err) return console.error(err);
		response.writeHead(200, {"Content-Type": "text/plain"});
		var result = {};
		console.log("password in: " + dataObj.password);
		console.log("correct password: " + User[0].password);
		if (User[0].password == dataObj.password) {
			result.loggedIn = true;
			result.first = User[0].first;
			result.last = User[0].last;
		} else {
			result.loggedIn = false;
		}

		response.write("callback(" + JSON.stringify(result, undefined, 0) + ");");
		response.end();
	});
}
// for testing
function createApp(request, response) {
	console.log(request.url);
	db.on('error',console.error);
	var arg = request.url.replace(/(\&callback=callback)|(callback=callback\&)/g, "");
	arg = arg.replace(/\&_=[0-9]*/g, "");
	console.log(arg);
	var queryAsObject = new Appointment(url.parse(arg,true).query);
	queryAsObject.save(function(err,Appointment) {
		if (err) return console.error(err);
		response.writeHead(200, {"Content-Type": "text/plain"});
		response.write("callback(" + JSON.stringify(Appointment, undefined, 2) + ");");
		response.end();
	});
}

function findApps(request, response) {
	
	console.log(request.url);
	db.on('error', console.error);
	var arg = request.url.replace(/(\&callback=callback)|(callback=callback\&)/g, "");
	arg = arg.replace(/\&_=[0-9]*/g, "");
	console.log(arg);
	console.log("10 seconds delay");
	setTimeout(function () {
		Appointment.find(url.parse(arg,true).query, function(err, Appointments) {
			if (err) return console.error(err);
			response.writeHead(200, {"Content-Type": "text/plain"});
			response.write("callback(" + JSON.stringify(Appointments, undefined, 2) + ");");
			response.end();
		});	
	}, 10000);
	console.log("10 seconds past");
}
// for testing
function removeApp(request, response) {
	console.log(request.url);
	db.on('error', console.error);
	var arg = request.url.replace(/(\&callback=callback)|(callback=callback\&)/g, "");
	arg = arg.replace(/\&_=[0-9]*/g, "");
	console.log(arg);
	Appointment.remove(url.parse(arg,true).query, function(err, Appointments) {
		if (err) return console.error(err);
		response.writeHead(200, {"Content-Type": "text/plain"});
		response.write("callback(" + JSON.stringify(Appointments, undefined, 2) + ");");
		response.end();
	});
}

function updateAppById(request, response) {
	console.log(request.url);
	db.on('error', console.error);
	var arg = request.url.replace(/(\&callback=callback)|(callback=callback\&)/g, "");
	arg = arg.replace(/\&_=[0-9]*/g, "");
	console.log(arg);
	var dataObj = url.parse(arg,true).query;
	var queryObj = {};
	console.log("dataObj= "+JSON.stringify(dataObj));
	queryObj._id = dataObj._id;
	delete dataObj._id;
	console.log("query: " + JSON.stringify(queryObj));
	console.log("modifying: " + JSON.stringify(dataObj));
	Appointment.update(queryObj, dataObj, function(err, Appointments) {
		if (err) return console.error(err);
		response.writeHead(200, {"Content-Type": "text/plain"});
		response.write("callback(" + JSON.stringify(Appointments, undefined, 2) + ");");
		response.end();
	});
}


function bookApp(request, response) {
	console.log(request.url);
	db.on('error', console.error);
	var arg = request.url.replace(/(\&callback=callback)|(callback=callback\&)/g, "");
	arg = arg.replace(/\&_=[0-9]*/g, "");
	console.log(arg);
	var dataObj = url.parse(arg,true).query;
	var passwordCheck = {}
	var queryObj = {};
	passwordCheck.email = dataObj.email;
	var passwordIn = dataObj.password;
	//console.log("dataObj= "+JSON.stringify(dataObj));
	queryObj._id = dataObj._id;
	delete dataObj._id;
	delete dataObj.email;
	delete dataObj.password;
	//console.log("query: " + JSON.stringify(queryObj));
	//console.log("modifying: " + JSON.stringify(dataObj));
	console.log("passwordCheck " + JSON.stringify(passwordCheck));
	User.find(passwordCheck, function(err, User) {
		if (err) return console.error(err);
		if (User[0].password != passwordIn) {	
		response.writeHead(200, {"Content-Type": "text/plain"});
		response.write("accsess denied");
		response.end();
		return;
		}
	});
	Appointment.update(queryObj, dataObj, function(err, Appointments) {
		if (err) return console.error(err);
		response.writeHead(200, {"Content-Type": "text/plain"});
		response.write("callback(" + JSON.stringify(Appointments, undefined, 2) + ");");
		response.end();
	});
}

exports.start = start;
exports.upload = upload;
exports.foo = foo;
exports.registerUser = registerUser;
exports.findUser = findUser;
exports.createApp = createApp;
exports.findApps = findApps;
exports.removeApp = removeApp;
exports.updateAppById = updateAppById;
exports.login = login;
exports.bookApp = bookApp;
