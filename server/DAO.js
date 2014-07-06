var mongoose = require("mongoose");

var schemas = {
	appointment : mongoose.Schema({
		category : "string", title : "string", description : "string",
		location : "string", date : "date", allDay : "boolean",
		startTimeHour: "number", startTimeMinute : "number",
		startTimeMeridiem : "string", endTimeHour : "number",
		endTimeMinute : "number", endTimeMeridiem : "string"
	}),
	
	note : mongoose.Schema({
		category : "string", title : "string", text : "string"
	})
	
};

var models = {
	appointment : mongoose.model("appointment", schemas.appointment),
	note : mongoose.model("note", schemas.note)
};

mongoose.connect('mongodb://user2:user2@ds049219.mongolab.com:49219/awesome');


function POST(opType, dataObj) {
	
	console.log(dataObj.id + ":DAO.POST() - CREATE : " + opType);
	
	var obj = new models[opType](dataObj.data);
	console.log(dataObj.id + ": obj: " + JSON.stringify(obj));
	obj.save(function (inError, inObj) {
		if (inError) {
			throw "Error: " + JSON.stringify(inError);
		} else {
			console.log(dataObj.id + ": Success: " + inObj._id);
			completeResponse(dataObj, 200, "text", "" + inObj._id);
		}
	});
	
}

function GET(opType, dataObj) {
	
	console.log(dataObj.id + ": DAO.GET() READ: " + opType);
	
	models[opType].findById(dataObj.indent,
		function (inError, inObj) {
			if (inError) {
				throw "Error: " + JSON.stringify(inError);
			} else {
				if (inObj == null) {
					console.log(dataObj.id + ": Object not found");
					completeResponse(dataObj, 404, "json", "");
				} else {
					console.log(dataObj.id + ": Success: " + JSON.stringify(inObj));
					completeResponse(dataObj, 200, "json", JSON.stringify(inObj));
				}
			}
		});
}


function GET_ALL(opType, dataObj) {
	
	console.log(dataObj.id + ": DAO.POST() : " + opType);
	
	var opts = { sort: { } };
	switch (opType) {
		case "contact":
			opts.sort.lastName = 1;
		break;
		case "appointment": case "note": case "task":
			opts.sort.title = 1;
		break;
	}
	
	models[opType].find(null, null, opts, function (inError, inObjs) {
		if (inError) {
			throw "Error: " + JSON.stringify(inError);
		} else {
			console.log(dataObj.id + ": Success: " + JSON.stringify(inObjs));
			completeResponse(dataObj, 200, "json", JSON.stringify(inObjs));
		}
	});
}

function PUT(opType, dataObj) {
	
	console.log(dataObj.id + ": DAO.PUT() UPDATE : " + opType);
	
	models[opType].findByIdAndUpdate(dataObj.ident, dataObj.data, { },
		function (inError, inObj) {
			if (inError) {
				throw "Error: " + JSON.stringify(inError);
			} else {
				console.log(dataObj.id + ": Success'");
				completeResponse(dataObj, 200, "text", "" + inObj._id);
			}
		});
}


function DELETE(opType, dataObj) {
	
	console.log(dataObj.id + ": DAO.DELETE() DELETE: " + opType);
	
	models[opType].findByIdAndRemove(dataObj.ident,
		function (inError, inObj) {
			if (inError) {
				throw "Error: " + JSON.stringify(inError);
			} else {
				console.log(dataObj.id + ": Success");
				completeResponse(dataObj, 200, "text", "" + inObj._id);
			}
		});
}

function CLEAR_DATA(dataObj) {
	
	console.log(dataObj.id + ": DAO.CLEAR_DATA()");
	
	models.appointment.remove({}, function(inError) {
		if (inError) {
			throw "Error: " + JSON.stringify(inError);
		} else {
			models.note.remove({}, function(inError) {
				if (inError) {
					throw "Error: " + JSON.stringify(inError);
				} else {
					console.log(dataObj.id + ": Success");
					completeResponse(dataObj, 200, "text", "");
				}
			});
		}
	});

}

var user1 = new models.appointment({
	category : "asdasdioqwoeqojewqoiq", title : "asd", description : "ad",
	location : "asdsa", date : "1", allDay : "true",
	startTimeHour: "123", startTimeMinute : "123",
	startTimeMeridiem : "asd", endTimeHour : "12",
	endTimeMinute : "12", endTimeMeridiem : "asd"
});

user1.save(function(err, user1) {
	if (err) return console.error(err);
	console.dir(user1);
});

exports.POST = POST;
exports.GET = GET;
exports.PUT = PUT;
exports.DELETE = DELETE;
exports.GET_ALL = GET_ALL;
exports.CLEAR_DATA = CLEAR_DATA;
	
