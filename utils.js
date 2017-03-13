module.exports = function(){
  return {
    distance: function(a,b){
      return Math.hypot(b.x-a.x, b.y-a.y);
    },
    distance4: function(x1,y1,x2,y2){
      return Math.hypot(x2-x1, y2-y1);
    }
  }
}
