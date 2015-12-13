/**
* Created by javi on 25/11/15.
*/
  var socket = io.connect();

  var messages = [];
  var roster = [];
  var name = '';
  var text = '';

  socket.on('connect', function () {
    //setName();
  });

  socket.on('message', function (msg) {
    messages.push(msg);
    messages=$scope.messages.slice(-5);

  });

  socket.on('roster', function (names) {
    roster = names;

  });

  socket.on('position', function(msg){
    if(msg.name==name){
      //It's me, do nothing
    } else{
      setPosition(msg.position.x,msg.position.y);

    }

  });

   function send() {
    console.log('Sending message:', text);
    socket.emit('message', text);
    text = '';
  }

   function sendPositionToServer(x,y) {
    console.log('Sending message:', x);
    socket.emit('position', {x:x, y:y});

  }

  function setName() {
    console.log(name);
    socket.emit('identify', name);
  }
