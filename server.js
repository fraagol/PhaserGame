var http = require('http');
var path = require('path');

var async = require('async');
var socketio = require('socket.io');
var express = require('express');
var p2 = require('p2');

var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);

router.use(express.static(path.resolve(__dirname, '.')));


//P2 Physics
// Create a physics world, where bodies and constraints live
var world = new p2.World({
    gravity:[0, -9.82]
});

  world.defaultContactMaterial.restitution = 0.8;

// Create an empty dynamic body
var circleBody = new p2.Body({
    mass: 1,
    position: [0, 600]
});

var circleBody2 = new p2.Body({
    mass: 1,
    position: [0, 1800]
});

var counter=0;
var counterIteration=0;

// Add a circle shape to the body.
var circleShape = new p2.Circle({ radius: 25 });
circleBody.addShape(circleShape);

var circleShape2 = new p2.Circle({ radius: 25 });
circleBody2.addShape(circleShape2);

// ...and add the body to the world.
// If we don't add it to the world, it won't be simulated.
world.addBody(circleBody);
world.addBody(circleBody2);

// Create an infinite ground plane.
var groundBody = new p2.Body({
    mass: 0 // Setting mass to 0 makes the body static
});
var groundShape = new p2.Plane();
groundBody.addShape(groundShape);
world.addBody(groundBody);

// To get the trajectories of the bodies,
// we must step the world forward in time.
// This is done using a fixed time step size.
var timeStep = 1 / 60; // seconds

// The "Game loop". Could be replaced by, for example, requestAnimationFrame.
setInterval(function(){
   counterIteration++;
    circleBody.oldPositionY=circleBody.position[1];
    circleBody2.oldPositionY=circleBody2.position[1];
    // The step method moves the bodies forward in time.
    world.step(timeStep);

    // Print the circle position to console.
    // Could be replaced by a render call.
if( counterIteration%10==0){
    if (circleBody.position[1]!=circleBody.oldPositionY) {

//  console.log("Circle1 y position: " + circleBody.position[1]);
  broadcast("circle1",{y:circleBody.position[1]});

//  console.log("sent");
    }
    if (circleBody2.position[1]!=circleBody2.oldPositionY) {

//  console.log("Circle2 y position: " + circleBody2.position[1]);
  broadcast("circle2",{y:circleBody2.position[1]});
//  console.log("sent");
    }
  }
}, 100 * timeStep);


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
    console.log(messageCounter++ +" "+socket.name+" "+JSON.stringify(msg));
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
//  console.log("broadcast: "+ event+data);
  sockets.forEach(function (socket) {
    socket.emit(event, data);
  });
}


server.listen(process.env.PORT||3000, process.env.IP||"localhost", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});
