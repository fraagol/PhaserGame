
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
var ownerCircle;
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


  game.time.advancedTiming = true;
  var field = game.add.sprite(0, 0, 'field');
  field.height = game.height;
  field.width = game.width;


  cursors = game.input.keyboard.createCursorKeys();
  //disable rigth click
  game.canvas.oncontextmenu = function (e) { e.preventDefault(); }
game.input.mousePointer.rightButton.onDown.add(onRightDown, this);
  game.input.mousePointer.leftButton.onDown.add(onLeftDown, this);

  scoreText = game.add.text(16, 16, 'score: 0  position.x= ' , {
    fontSize: '18px',
    fill: '#999'
  });




function onRightDown(){
    newCircleSend(game.input.mousePointer.x, game.input.mousePointer.y);
  }

function onLeftDown(){
    newBallPosition(game.input.mousePointer.x, game.input.mousePointer.y);
}


createBall();
ownerCircle=game.add.graphics(-50, -50);
ownerCircle.beginFill(0x00FF00, 1);
ownerCircle.drawCircle(0, 0, C.playerRadius*2.5);
game.world.bringToTop(ownerCircle);

  worldStarted = true;
}

function createBall(){
  var b=game.add.graphics(50, 50);
  b.beginFill(0xFFFFFF, 1);
  b.drawCircle(0, 0, C.ballRadius*2);
  ball=b;
}

function createCircle(circle) {
  var c = game.add.graphics(circle.x, circle.y);
  c.beginFill(circle.id%2==0?0xFF0000:0x0000FF, 1);
  c.drawCircle(0, 0, C.playerRadius*2);
  c.drawRect(0,-4,C.playerRadius*1.25,8);
  c.playerText = game.add.text(16, 16, circle.name , {
      fontSize: '16px',
      fill: '#EEEEEE'
    });
  circles.push(c);
}

function update() {
scoreText.text = 'FPS: ' + game.time.fps;
circles.forEach(function (c){
                  c.playerText.x=c.x;
                  c.playerText.y=c.y;
                  game.world.bringToTop(c.playerText);});


//console.log(playerText);
}


function setBall(b){
  if (worldStarted){
    ball.y=b.y;
    ball.x=b.x;
    console.log(b);
    if(b.ballOwner && b.ballOwner ===-1){
      ownerCircle.x=2000;

  }
  }else{
    console.log("World not started for ball");
  }
}

function setCircle(c) {
  if (worldStarted) {

    if (!circles[c.id]) {
      createCircle(c);
    }
    var circle=circles[c.id];
    circle.y = c.y;
    circle.x = c.x;
    //var angle = Math.atan2(ball.y - circle.y, ball.x - circle.x);
    circle.rotation = -c.angle;//+ game.math.degToRad(90);
    if(c.owner){
      ownerCircle.x=c.x;
      ownerCircle.y=c.y;
      setBall({x:c.x+(Math.cos(-c.angle)*C.playerRadius*1.5),
              y:c.y+(Math.sin(-c.angle)*C.playerRadius*1.5)});

    }

  } else {
    console.log("World not started");
  }

}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
