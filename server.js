var http = require('http');
var path = require('path');

var world = require('./world');
var safe= require('safe-eval');
var async = require('async');
var socketio = require('socket.io');
var express = require('express');


var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, '.')));

router.get('/sendJS',function(req,res){
  var text=req.query.text;
  console.log(text);
  var d= safe(text,{h:hola,w:world});
  console.log(d);
  res.send('Holaaa '+d);
});

world.init(broadcast);

function hola() {
  console.log("hola");
  return 3;
}


 
var messages = [];
var sockets = []; 
var messageCounter = 0;

io.on('connection', function(socket) {
  messages.forEach(function(data) {
    socket.emit('message', data);
  });

  sockets.push(socket);

  socket.on('disconnect', function() {
    sockets.splice(sockets.indexOf(socket), 1);
    updateRoster();
  });

  socket.on('message', function(msg) {
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

  socket.on('position', function(msg) {
    //console.log(messageCounter++ +" "+socket.name+" "+JSON.stringify(msg));
    var data = {
      name: socket.name,
      position: msg
    };

    broadcast('position', data);

  });


  socket.on('newCircle', function(msg) {
    console.log("newCircle received", messageCounter++ + " " + socket.name +
      " " + JSON.stringify(msg));
    var data = {
      name: socket.name,
      position: msg
    };

    world.createCircle(msg.x, msg.y);

  });


  socket.on('identify', function(name) {
    socket.name = String(name || 'Anonymous');
    console.log(name + " entered")
    updateRoster();


  });
});


function updateRoster() {
  async.map(
    sockets,
    function(socket, callback) {
      callback(socket.name);
      //socket.get('name', callback);
    },
    function(err, names) {
      broadcast('roster', names);
    }
  );
}

function broadcast(event, data) {
  sockets.forEach(function(socket) {
    socket.emit(event, data);
  });
}


server.listen(process.env.PORT || 3000, process.env.IP || "localhost", function() {
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
