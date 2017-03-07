var p2 = require('p2');
var C= require('./constants')
var broadcast;
var pl1;
var pl2;
console.log(111111111);
console.log(pl1);
module.exports = {
  init: function(f, player1,player2) {

    broadcast = f;
    pl1=player1;
    pl2=player2;
    console.log(222222222);
    console.log(player2);
    createCircle(200, 300, pl1);
    createCircle(800, 300,pl2);
  },
  createCircle: createCircle,
  newBallPosition: newBallPosition
};

console.log(333333333);
var circles = [];
var ball;

//P2 Physics
// Create a physics world, where bodies and constraints live
var world = new p2.World({
  gravity: [0, 0],
  frictionGravity: 1
});
world.defaultContactMaterial.restitution = 1;



createBall(200,300);


function createBall(x, y) {
  var b = new p2.Body({
    mass: 0.1,
    position: [x, y],
    velocity: [0, 0]
  });

  var circleShape = new p2.Circle({
    radius: C.ballRadius
  });
  b.addShape(circleShape);
  world.addBody(b);
  ball=b;

}

function newBallPosition(x,y){
  ball.position[0]=x;
  ball.position[1]=y;
}

function createCircle(x, y,player) {
    player = typeof player !== 'undefined' ? player : pl1;
  var circleBody = new p2.Body({
    mass: 0.1,
    position: [x, y],
    velocity: [0, 0]
  });

  var circleShape = new p2.Circle({
    radius: C.playerRadius
  });
  circleBody.addShape(circleShape);
  world.addBody(circleBody);
  console.log(player);
  circleBody.player=player;
  circles.push(circleBody);

}

var counter = 0;
var counterIteration = 0;


// Create an infinite ground plane.
var groundBody = new p2.Body({
  mass: 0 // Setting mass to 0 makes the body static
});
var groundShape = new p2.Plane();
groundBody.addShape(groundShape);
world.addBody(groundBody);

var wallBody = new p2.Body({
  mass: 0,
  angle: (3 * Math.PI) / 2
});
wallBody.addShape(new p2.Plane());
world.addBody(wallBody);

var wallBody2 = new p2.Body({
  mass: 0,
  angle: (Math.PI) / 2,
  position: [C.worldWidth, 0]
});
wallBody2.addShape(new p2.Plane());
world.addBody(wallBody2);

var top = new p2.Body({
  mass: 0,
  angle: (Math.PI),
  position: [0, C.worldHeight]
});
top.addShape(new p2.Plane());
world.addBody(top);

// To get the trajectories of the bodies,
// we must step the world forward in time.
// This is done using a fixed time step size.
var timeStep = 1 / 60; // seconds

// The "Game loop". Could be replaced by, for example, requestAnimationFrame.
setInterval(function() {
  counterIteration++;
  //console.log("before", timeMS());
var S=100;
  for (var i = 0; i < circles.length; i++) {
    var circle = circles[i];
  //   var forceX=ball.position[0]-circle.position[0];
  //   forceX=forceX>S?S:forceX<-S?-S:forceX;
  //   var forceY=ball.position[1]-circle.position[1];
  //   forceY=forceY>S?S:forceY<-S?-S:forceY;
  //   circle.force[0]=forceX;
  //   circle.force[1]=forceY;
  //

  var action=circle.player.action(ball.position[0],ball.position[1]);
  var angle = Math.atan2(action.y - circle.position[1], action.x - circle.position[0]);

   circle.velocity[0]= S*Math.cos(angle);
   circle.velocity[1]= S*Math.sin(angle);
}

  world.step(timeStep);
  //console.log("after", timeMS());

  for (var i = 0; i < circles.length; i++) {
    var circle = circles[i];
    var data = {
      id: i,
      x: circle.position[0],
      y: circle.position[1]
    };

    broadcast("circle", data);
  }
  //  }

//send ball position
var data = {

  x: ball.position[0],
  y: ball.position[1]
};

broadcast("ball", data);


}, 1000 * timeStep);

// Get current time, in seconds.
function timeSeconds() {
  return timeMS() / 1000;
}

// Get current time, in milliseconds.
function timeMS() {
  return new Date().getTime();
}
