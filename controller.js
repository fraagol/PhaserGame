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
            $scope.$apply();
        });

        socket.on('roster', function (names) {
            $scope.roster = names;
            $scope.$apply();
        });

        $scope.send = function send() {
            console.log('Sending message:', $scope.text);
            socket.emit('message', $scope.text);
            $scope.text = '';
        };

        $scope.sendPosition = function sendPosition(x) {
            console.log('Sending message:', x);
            socket.emit('message', x);

        };

        $scope.setName = function setName() {
            socket.emit('identify', $scope.name);
        };
    });


