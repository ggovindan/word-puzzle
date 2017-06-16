const WordPuzzle = require('../lib/word-find').WordPuzzle;

exports.index = (req, res) => {
  res.render('index');
}

exports.getNewPuzzle = (req, res) => {
  res.json(WordPuzzle.newPuzzle(15,15));
}

exports.getDirections = (req, res) => {
  console.log('got a request for getDirections');
  res.json(WordPuzzle.puzzleDirection);
}