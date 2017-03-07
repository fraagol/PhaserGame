 /**
 * Created by javi on 25/11/15.
 */
var socket = io.connect();

var messages = [];
var roster = [];
var name = '';
var text = '';

socket.on('connect', function() {
  //setName();
});

socket.on('message', function(msg) {
  messages.push(msg);
  messages = $scope.messages.slice(-5);

});

socket.on('roster', function(names) {
  roster = names;

});

socket.on('circle', function(msg) {
  msg.y = convertY(msg.y);
  //console.log("received:",msg);
  setCircle(msg);
});

socket.on('ball', function(msg) {
  msg.y = convertY(msg.y);
  setBall(msg);
});

function send() {
  //console.log('Sending message:', text);
  socket.emit('message', text);
  text = '';
}

function setName() {
  console.log(name);
  socket.emit('identify', name);
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
