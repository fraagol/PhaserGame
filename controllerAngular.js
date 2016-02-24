 /**
 * Created by javi on 25/11/15.
 */
angular.module('gameApp',[])
    .controller("ChatController",function($scope){
        var socket = io.connect();

        $scope.messages = [];
        $scope.roster = [];
        $scope.name = '';
        $scope.text = '';

        socket.on('connect', function () {
            $scope.setName();
        });

        socket.on('message', function (msg) {
            $scope.messages.push(msg);
            $scope.messages=$scope.messages.slice(-5);
            $scope.$apply();
        });

        socket.on('roster', function (names) {
            $scope.roster = names;
            $scope.$apply();
        });

        socket.on('position', function(msg){
            if(msg.name==$scope.name){
              //It's me, do nothing
            } else{
              setPosition(msg.position.x,msg.position.y);

            }

        });

        $scope.send = function send() {
            console.log('Sending message:', $scope.text);
            socket.emit('message', $scope.text);
            $scope.text = '';
        };

        $scope.sendPosition = function sendPosition(x,y) {
            console.log('Sending message:', x);
            socket.emit('position', {x:x, y:y});

        };

        $scope.setName = function setName() {
          console.log($scope.name);
            socket.emit('identify', $scope.name);
        };
    });
