const WordPuzzle = require('../lib/word-find').WordPuzzle;

exports.index = (req, res) => {
  res.render('index');
}

exports.getNewPuzzle = (req, res) => {
  res.json(WordPuzzle.newPuzzle(15,15));
}