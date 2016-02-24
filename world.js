var p2 = require('p2');

var broadcast;

module.exports={
  init:function(f){
    broadcast=f;
  },
  createCircle: createCircle
};

var circles=[];

//P2 Physics
// Create a physics world, where bodies and constraints live
var world = new p2.World({
    gravity:[0, -1.82]
});
  world.defaultContactMaterial.restitution = 1;

createCircle(50,600);
createCircle(55,1000);

function createCircle(x,y){
  var circleBody = new p2.Body({
      mass: 1,
      position: [x,y]
  });

  var circleShape = new p2.Circle({ radius: 25 });
  circleBody.addShape(circleShape);
  world.addBody(circleBody);
  circles.push(circleBody);
}

var counter=0;
var counterIteration=0;


// Create an infinite ground plane.
var groundBody = new p2.Body({
    mass: 0 // Setting mass to 0 makes the body static
});
var groundShape = new p2.Plane();
groundBody.addShape(groundShape);
world.addBody(groundBody);

var wallBody= new p2.Body({mass:0,angle: (3*Math.PI)/2});
wallBody.addShape(new p2.Plane());
world.addBody(wallBody);

// To get the trajectories of the bodies,
// we must step the world forward in time.
// This is done using a fixed time step size.
var timeStep = 1 / 60; // seconds

// The "Game loop". Could be replaced by, for example, requestAnimationFrame.
setInterval(function(){
   counterIteration++;
   for (var i = 0; i < circles.length; i++) {
     var circle=circles[i];
     circle.oldPositionY=circle.position[1];
   }
    // The step method moves the bodies forward in time.
    world.step(timeStep);


if( counterIteration%10==0){
    for (var i = 0; i < circles.length; i++) {
      var circle=circles[i];
      if (circle.position[1]!=circle.oldPositionY) {

    //  console.log("Circle1 y position: " + circleBody.position[1]);
    var data={
      id:i,
      x:circle.position[0],
      y:circle.position[1]
    };
    broadcast("circle", data);

      }
    }
  }




}, 100 * timeStep);
