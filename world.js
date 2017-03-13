var p2 = require('p2');
var C= require('./constants')
var U= require('./utils')();
var broadcast;
var pl1;
var pl2;

module.exports = {
  init: function(f,playersList) {
    broadcast = f;
    pl1=playersList[0];
    playersList.forEach(function(e,index){createCircle(e,index)});
  },
  start: start,
  createCircle: createCircle,
  newBallPosition: newBallPosition
};

var started=false;
var players = [];
var ball;
var ballInWorld=false;
var world = new p2.World({gravity: [0, 0],frictionGravity: 10});
world.defaultContactMaterial.restitution = 0.9;

ball = new p2.Body({mass: 0.01,position: [500, 300],damping: 0.4});
ball.addShape(new p2.Circle({radius: C.ballRadius}));
world.addBody(ball);
ballInWorld=true;


function start(){
  started=true;
}

function newBallPosition(x,y){
  ball.position[0]=x;
  ball.position[1]=y;
  ballOwner=-1;
  if(!ballInWorld){
    world.addBody(ball);
    ballInWorld=true;
  }
}

function createCircle(player,index) {
    player = typeof player !== 'undefined' && player !== null ? player : pl1;
  var circleBody = new p2.Body({
    mass: 0.1,
    position: [player.params.x, player.params.y],
    velocity: [0, 0]
  });

  circleBody.addShape( new p2.Circle({radius: C.playerRadius}));
  world.addBody(circleBody);
  circleBody.player=player;
  players.push(circleBody);



  //broadcast("circle", data);

}

var counter = 0;
var counterIteration = 0;
var ballOwner=-1;


var groundBody = new p2.Body({  mass: 0});
groundBody.addShape( new p2.Plane());
world.addBody(groundBody);

var wallBody = new p2.Body({mass: 0,angle: (3 * Math.PI) / 2});
wallBody.addShape(new p2.Plane());
world.addBody(wallBody);

var w = new p2.Body({mass: 0,angle: (Math.PI) / 2,position: [C.worldWidth, 0]});
w.addShape(new p2.Plane());
world.addBody(w);

var top = new p2.Body({mass: 0,angle: (Math.PI),position: [0, C.worldHeight]});
top.addShape(new p2.Plane());
world.addBody(top);


// To get the trajectories of the bodies,
// we must step the world forward in time.
// This is done using a fixed time step size.
var timeStep = 1 / 60; // seconds
var newOwner=0;
// The "Game loop". Could be replaced by, for example, requestAnimationFrame.
setInterval(function() {
  if(started){
  counterIteration++;
  //console.log("before", timeMS());

  var ballData={x:ball.position[0], y:ball.position[1],owner:ballOwner};

  for (var i = 0; i < players.length; i++) {
    var circle = players[i];

  var playerData={x:circle.position[0], y:circle.position[1],id:i};
  var action=circle.player.action(ballData,playerData);
  switch (action.action) {
    case "STAY":
    circle.velocity[0]= 0;
    circle.velocity[1]=0;
      var angle = Math.atan2(ball.position[1] - circle.position[1], ball.position[0] - circle.position[0]);
     circle.myRotation= angle;
      break;
    case "SHOOT":
      console.log("SHOOT", action.x,action.y);
      if(ballOwner==i){
        world.addBody(ball);
        ballInWorld=true;
        ballOwner=-1;
        var angle = Math.atan2(action.y - circle.position[1], action.x - circle.position[0]);
        ball.position[0]=circle.position[0]+(Math.cos(angle)*C.playerRadius*1.5);
        ball.position[1]=circle.position[1]+(Math.sin(angle)*C.playerRadius*1.5);
        ball.velocity[0]= C.shootVelocity*Math.cos(angle)*1.5;
        ball.velocity[1]= C.shootVelocity*Math.sin(angle)*1.5;
      }


    default:
      var angle = Math.atan2(action.y - circle.position[1], action.x - circle.position[0]);

     circle.velocity[0]= circle.player.params.speed*Math.cos(angle);
     circle.velocity[1]= circle.player.params.speed*Math.sin(angle);
     circle.myRotation= angle;
  }


}

  world.step(timeStep);
  //console.log("after", timeMS());

  var minDistance=100;
  for (var i = 0; i < players.length; i++) {
    var circle = players[i];

    //Check who owns the ball
    var distanceToBall=U.distance4(circle.position[0],circle.position[1],ball.position[0], ball.position[1]);

    if(C.control && distanceToBall<20 && distanceToBall>15 && distanceToBall<minDistance && counterIteration>newOwner+30 && !myTeam(i,ballOwner) ){

      minDistance=distanceToBall;
      ballOwner=i;
      newOwner=counterIteration;

    }
  }

if(C.control && ballInWorld && ballOwner>-1){

  world.removeBody(ball);
  ball.position[0]=players[ballOwner].position[0];
  ball.position[1]=players[ballOwner].position[1];
}else{
if(!ballInWorld){
  world.addBody(ball);
  ballOwner=-1;
  ballInWorld=true;
}
}

for (var i = 0; i < players.length; i++) {
  var circle = players[i];
    //send player's data
    var data = {
      id: i,
      x: circle.position[0],
      y: circle.position[1],
      angle: circle.myRotation,
      owner:i==ballOwner,
      name: circle.player.params.name
    };

    broadcast("circle", data);
  }

//send ball position
if(ballOwner==-1){
    broadcast("ball", {  x: ball.position[0],y: ball.position[1]});
  }
}
}, 1000 * timeStep);

function myTeam(a,b){
  return a%2==b%2;
}

// Get current time, in seconds.
function timeSeconds() {
  return timeMS() / 1000;
}

// Get current time, in milliseconds.
function timeMS() {
  return new Date().getTime();
}
