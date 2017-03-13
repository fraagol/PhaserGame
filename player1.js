var utils = require ('./utils')();
module.exports = function(params){
console.log(params);
var goalY=300;
var goalX=params.team==0?1000:0;
  return {
    action: function(ball, player){
      var res={action: "GO"};
      if(ball.owner==player.id){
        res.x=goalX;
        res.y=goalY;
      }
      else{
      if(utils.distance(player,ball)<100){
        res.x=ball.x;
        res.y=ball.y;
      } else{
        res.x=ball.x;
        res.y=ball.y;
      }
}

      return res;
    },
    params:params
  }

}
