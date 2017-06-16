// app.js

var directions = {
  horizontal: (x,y, i) => { return {x: x+i, y: y}},
  vertical: (x,y,i) => {return {x: x, y: y+i}},
  verticalUp: (x,y,i) => {return {x: x, y: y-i}},
  diagonal: (x,y,i) => {return {x: x+i, y: y+i}},
  diagonalBack: (x,y,i) => {return {x: x-1, y: y+i}},
  diagonalUp: (x,y,i) => {return {x: x+i, y: y-i}},

};

new Vue({
  el: "#wordPuzzle",

  data: {
          puzzle: [],
          wordsList: [],
          solution: []
        },

  mounted: function() {
    this.newPuzzle();
  },

  methods: {
    newPuzzle: function() {
      this.$http.get('/newPuzzle')
        .then((result) => {
          console.log('result=', result);
          this.$set(this, 'puzzle', result.data.result.puzzle);
          this.$set(this, 'wordsList', result.data.wordsList);
          this.$set(this, 'solution', result.data.result.solution);
        }, (err) => {
          console.log('error=', err);
        });
    },
    check: function(row, col) {
      console.log("row=", row);
      console.log("col=", col);
    },

    solve: function() {
      for (var i = 0; i < this.solution.length; i++) {
        var word = this.solution[i].word;
        var orientation = this.solution[i].location;
        var x = orientation.x, y = orientation.y;
        var next = directions[orientation.direction];
        console.log('direction=', orientation.direction);

        for (var j = 0; j < word.length; j++) {
          var nextPos = next(x, y, j);
          console.log('nextPos=', nextPos);
          var myId = "row=" + nextPos.y + "col=" + nextPos.x;
          console.log('calculated_id=', myId);
          var box = document.getElementById(myId);
          for (var temp = 0; i<3; i++) {
            box.classList.remove('solved'+temp);
          }
          box.classList.add('solved' + i % 5);
        }
      }
    }
  }
});