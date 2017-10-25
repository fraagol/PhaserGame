var http = require('http');
var path = require('path');

var world = require('./world');
var safe= require('safe-eval');
var async = require('async');
var socketio = require('socket.io');
var express = require('express');
var C= require('./constants');
var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, '.')));
var team=0;
var players=[require('./player1')({x:300,y:310,speed:150,team:(team++)%2,name:"piojo"}),
            require('./player1')({x:700,y:300,speed:100,team:(team++)%2,name:"xavi"}),
            require('./player2')({x:150,y:200,speed:200,team:(team++)%2,name:"ayala"}),
            require('./player2')({x:850,y:200,speed:200,team:(team++)%2,name:"iniesta"}),
            require('./player2')({x:150,y:400,speed:100,team:(team++)%2,name:"javi"}),
            require('./player2')({x:850,y:400,speed:150,team:(team++)%2,name:"aurea"}),
            require('./player2')({x:100,y:300,speed:100,team:(team++)%2,name:"albelda"}),
            require('./player2')({x:900,y:300,speed:100,team:(team++)%2,name:"puyol"}),
            require('./player3')({x:900,y:300,speed:100,team:(team++)%2,name:"cristiano"})

];




world.init(broadcast,players);

world.start();


var sockets = [];
var messageCounter = 0;

io.on('connection', function(socket) {
  sockets.push(socket);

  socket.on('disconnect', function() {
    sockets.splice(sockets.indexOf(socket), 1);
  });


  socket.on('newCircle', function(msg) {
    console.log("newCircle received", messageCounter++ + " " + socket.name +
      " " + JSON.stringify(msg));
    var data = {
      name: socket.name,
      position: msg
    };

    world.createCircle(null,msg.x, msg.y);

  });

  socket.on('newBallPosition', function(msg) {
    console.log("newBallPosition received", messageCounter++ + " " + socket.name +
      " " + JSON.stringify(msg));
    var data = {
      name: socket.name,
      position: msg
    };

    world.newBallPosition( msg.x, msg.y);

  });

  socket.on('identify', function(name) {
    socket.name = String(name || 'Anonymous');
    console.log(name + " entered")
    });
});

function broadcast(event, data) {
  sockets.forEach(function(socket) {
    socket.emit(event, data);
  });
}

router.get('/constants', function(req,res){
var msg= 'var C='+JSON.stringify(C)+';';
 res.send(msg);
  });

  router.get('/sendJS',function(req,res){
    var text=req.query.text;
        console.log(text);
        console.time("a");
    var d= safe(text,{h:hola,w:world});
    console.timeEnd("a");
    res.send('Holaaa '+JSON.stringify(d));
  });

  function hola(t) {
    console.log(t);
    return 3;
  }

server.listen(process.env.PORT || 3000, process.env.IP || "localhost", function() {
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
