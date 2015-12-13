var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');

var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, '.')));

var messages = [];
var sockets = [];
var messageCounter=0;

io.on('connection', function (socket) {
  messages.forEach(function (data) {
    socket.emit('message', data);
  });

  sockets.push(socket);

  socket.on('disconnect', function () {
    sockets.splice(sockets.indexOf(socket), 1);
    updateRoster();
  });

  socket.on('message', function (msg) {
    console.log("message");
    var text = String(msg || '');

    if (!text)
    return;


    var data = {
      name: socket.name,
      text: text
    };

    broadcast('message', data);

  });

  socket.on('position', function (msg) {
    console.log(messageCounter++ +" "+JSON.stringify(msg));
    var data = {
      name: socket.name,
      position: msg
    };

    broadcast('position', data);

  });

  socket.on('identify', function (name) {
    socket.name=String(name || 'Anonymous');
    console.log(name+" entered")
    updateRoster();


  });
});

function updateRoster() {
  async.map(
    sockets,
    function (socket, callback) {
      callback(socket.name);
      //socket.get('name', callback);
    },
    function (err, names) {
      broadcast('roster', names);
    }
  );
}

function broadcast(event, data) {
  sockets.forEach(function (socket) {
    socket.emit(event, data);
  });
}


server.listen(3000, "localhost", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
