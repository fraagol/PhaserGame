var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');

var router = express();
var server = http.createServer(router);

router.use(express.static(path.resolve(__dirname, '.')));

server.listen(3000, "localhost", function(){
    var addr = server.address();
    console.log("Chat server listening at", addr.address + ":" + addr.port);
});