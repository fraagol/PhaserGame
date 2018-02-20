 /**
 * Created by javi on 25/11/15.
 */
var socket = io.connect();

var name = '';
var text = '';

socket.on('circle', function(msg) {
  msg.y = convertY(msg.y);
  console.log("received:",msg);
  setCircle(msg);
});

socket.on('playersData',(msg)=>{
  
  msg.forEach(element => {
   element.y = convertY(element.y);
   setCircle(element);
  });
});

socket.on('ball', function(msg) {
  msg.y = convertY(msg.y);
  setBall(msg);
});

function send() {
  //console.log('Sending message:', text)<;
  socket.emit('message', text);
  text = '';
}

function setName() {
  console.log(name);
  socket.emit('identify', name);
}

function newBallPosition(x,y){
  socket.emit('newBallPosition',{x:x, y:convertY(y)});
}
function newCircleSend(x, y) {
  console.log("creating new circle", x, y);
  socket.emit('newCircle', {
    x: x,
    y: convertY(y)
  });
}

function convertY(y) {
  return C.worldHeight - y;
}
