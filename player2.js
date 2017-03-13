var utils = require ('./utils')();
module.exports = function(params){
  var initialX=params.x;
  var initialY=params.y;
  var goalY=300;
  var goalX=params.team==0?1000:0;
  console.log(params);
  return {
    action: function(ball, player){
      var res={action: "GO"};
      if(ball.owner==player.id){
        res.action="SHOOT";
        res.x=goalX;
        res.y=goalY;
      }
      else{
      if(utils.distance(player,ball)<150){
        res.x=ball.x;
        res.y=ball.y;
      } else{
        if(utils.distance4(player.x,player.y,params.x,params.y)<5){
          res.action="STAY";
        }
        res.x=params.x;
        res.y=params.y;
      }
}

      return res;
    },
    params:params
  }

}
