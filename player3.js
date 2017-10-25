var utils = require ('./utils')();
module.exports = function(params){

var i=0;

  return {
    action: function(ball, player){
      var res={action: "GO"};

        res.x=500+ Math.abs((Math.cos(++i/50)*100));
        res.y=300+ (Math.sin(i/50)*100);

      return res;
    },
    params:params
  }

}
