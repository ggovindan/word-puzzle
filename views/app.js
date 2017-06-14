// app.js
const WordPuzzle = require('../lib/word-find').WordPuzzle;
new Vue({
  // we want to target the div with and Id of 'events'
  el: "#events",

  data: {message: "Hello World",
        puzzle: "puzzle goes here",
        },

  ready: function() {},

  methods: {
    newPuzzle: function() {
      const newPuzzle = WordPuzzle.newPuzzle();
      console.log('newPuzzle created');
    }
  }
});