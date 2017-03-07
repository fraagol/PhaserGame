
var game = new Phaser.Game(C.worldWidth, C.worldHeight, Phaser.AUTO, 'gameDiv', {
  preload: preload,
  create: create,
  update: update
});

function preload() {

  //game.stage.disableVisibilityChange = true;
    game.load.image('field', 'images/field.png');

}
var worldStarted = false;
var cursors;
var circles = [];
var circlesGroup;
var ball=null;
//Do not create to many circles
var nextCircle = 0;

var score = 0;
var scoreText;
var myId;

var color = 0;

function create() {
  myId = getRandomInt(0, 1000);
  name = myId;
  setName();
  console.log(myId);

  game.time.advancedTiming = true;
  game.physics.startSystem(Phaser.Physics.P2JS);
  game.physics.p2.restition = 1;
  var field = game.add.sprite(0, 0, 'field');
  field.height = game.height;
  field.width = game.width;


  cursors = game.input.keyboard.createCursorKeys();

  // circlesGroup = game.add.physicsGroup(Phaser.Physics.P2JS);

  scoreText = game.add.text(16, 16, 'score: 0  position.x= ' , {
    fontSize: '18px',
    fill: '#999'
  });

createBall();
  worldStarted = true;
}

function createBall(){
  var b=game.add.graphics(50, 50);
  b.beginFill(0xFFFFFF, 1);
  b.drawCircle(0, 0, C.ballRadius*2);
  ball=b;
}

function createCircle() {
  var c = game.add.graphics(50, 50);
  c.beginFill(0xFF0000, 1);
  c.drawCircle(0, 0, C.playerRadius*2);
  c.drawRect(-5,0,10,-C.playerRadius*1.25);
  circles.push(c);
}

function update() {
  if (game.input.activePointer.isDown && game.time.now > nextCircle) {
    nextCircle = game.time.now + 1000;
    newCircleSend(game.input.mousePointer.x, game.input.mousePointer.y);
  }
  scoreText.text = 'FPS: ' + game.time.fps;
}

function setBall(b){ if (worldStarted){

    if(!ball){
      createBall();
      }

    ball.y=b.y;
    ball.x=b.x;

  }else{
    console.log("World not started for ball");
  }

}

function setCircle(c) {
  if (worldStarted) {

    if (!circles[c.id]) {
      createCircle();
    }
    var circle=circles[c.id];
    circle.y = c.y;
    circle.x = c.x;
    var angle = Math.atan2(ball.y - circle.y, ball.x - circle.x);
    circle.rotation = angle + game.math.degToRad(90);
  } else {
    console.log("World not started");
  }

}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
