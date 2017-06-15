// app.js

new Vue({
  el: "#wordPuzzle",

  data: {
          puzzle: [],
          wordsList: []
        },

  mounted: function() {
    this.newPuzzle();
  },

  methods: {
    newPuzzle: function() {
      this.$http.get('/newPuzzle')
        .then((result) => {
          console.log('result=', result);
          this.$set(this, 'puzzle', result.data.puzzle);
          this.$set(this, 'wordsList', result.data.wordsList);
        }, (err) => {
          console.log('error=', err);
        });
    }
  }
});