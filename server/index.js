require('nodetime').profile({
    accountKey: '85d4d4be1c2fced0b27fbd20f878b6359233f701', 
    appName: 'Node.js Application'
  });

var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

// test edit
var handle = {}

handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/upload"] = requestHandlers.upload;
handle["/foo"] = requestHandlers.foo;
handle["/registerUser"] = requestHandlers.registerUser;
//handle["/findUser"] = requestHandlers.findUser;
//handle["/createApp"] = requestHandlers.createApp;
handle["/findApps"] = requestHandlers.findApps;
//handle["/removeApp"] = requestHandlers.removeApp;
//handle["/updateAppById"] = requestHandlers.updateAppById;
handle["/login"] = requestHandlers.login;
handle["/bookApp"] = requestHandlers.bookApp;

server.start(router.route, handle);
