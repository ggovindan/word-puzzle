const _ = require('lodash');
const fs = require('fs');
const uniqueRandomArray = require('unique-random-array');
const wordList = require('word-list');

/*
Main function
*/

const letters = 'abcdefgijklmnopqrstuvwxyz';

function WordPuzzle() {
  this.wordArray = fs.readFileSync(wordList, 'utf8').split('\n');
  this.getRandomWords = uniqueRandomArray(this.wordArray);
}


/**
  Calculate the next position where x, y is the starting position 
*/
WordPuzzle.prototype.puzzleDirection = {
  horizontal: (x,y, i) => { return {x: x+i, y: y}},
  vertical: (x,y,i) => {return {x: x, y: y+i}},
  verticalUp: (x,y,i) => {return {x: x, y: y-i}},
  diagonal: (x,y,i) => {return {x: x+i, y: y+i}},
  diagonalBack: (x,y,i) => {return {x: x-1, y: y+i}},
  diagonalUp: (x,y,i) => {return {x: x+i, y: y-i}},

};

/**
Find if the direction of the puzzle is feasible given 
(x,y0 is the starting position, h,w is height and width of the puzzle
l is the length of the word
*/

WordPuzzle.prototype.willFit = {
  horizontal:     (x,y,h,w,l) => w >= x + l,
  vertical:       (x,y,h,w,l) => h >= y + l,
  verticalUp:     (x,y,h,w,l) => y + 1 >= l,
  diagonal:       (x,y,h,w,l) => (w >= x + l) && (h >= y + l),
  diagonalBack:   (x,y,h,w,l) => (x + 1 >= l) && (h >= y + l),
  diagonalUp:     (x,y,h,w,l) => (w >= x + l) && (y + 1 >= l),
};

/**
  This utility will optimize the search for a proper next location instead
  of blindly looking at every square for every direction
*/
WordPuzzle.prototype.nextLocation = {
  horizontal: (x,y,l) => {return {x: 0, y: y+1}},
  vertical: (x,y,l) => {return {x: 0, y: y+100}},
  verticalUp: (x,y,l) => {return {x: 0, y: l-1}},
  diagonal: (x,y,l) => {return {x: 0, y: y+1}},
  diagonalBack: (x,y,l) => {return {x: l-1, y: x>=l-1?y+1:y}},
  diagonalUp: (x,y,l) => {return {x: 0, y: y<l-1?l-1:y+1}},
}


/**
  Makes sure that once we find a location where the word will fit,
  it does not have any overlap with another word with a different letter
*/
WordPuzzle.prototype.checkOverlap = function (word, puzzle, x, y, direction) {
  var overlap = 0;

  // go through every location in the matrix to check if the word fits
  for (var i = 0, len = word.length; i < len; i++) {

    var next = direction(x, y, i),
        square = puzzle[next.y][next.x];
    
    // if the matrix already contains the letter we
    // are looking for, increment to make sure it is not entire overlap/substring
    if (square === word[i]) {
      overlap++;
    }
    // if it contains a different letter, than our word doesn't fit
    // here, return -1
    else if (square !== '' ) {
      return -1;
    }
  }

  // if the entire word is overlapping, skip it to ensure words aren't
  // hidden in other words
  return overlap;
};

WordPuzzle.prototype.findAllLocations = function (puzzle, word) {
  var i, x=0, y=0, locations = [];

  // loop through all the location for every possible direction to look for the best fit
  for (key in this.puzzleDirection) {
    check = this.willFit[key];
    skipToLocation = this.nextLocation[key];
    x = 0; y = 0;

    while (y < this.height) {
      // check if this word will fit for this direction
      if (check(x, y, this.height, this.width, word.length)) {
        if (this.checkOverlap(word, puzzle, x, y, this.puzzleDirection[key]) > -1) {
          // console.log(`word ${word} has a location x:${x} y: ${y} direction: ${key}`);
          locations.push({x: x, y: y, direction: key});
        }
        ++x;
        if (x >= this.width) {
          x = 0;
          ++y;
        }
      } else {
        // The current location did not fit the word skip to the next
        // logical one for the word
        const nextPosition = skipToLocation(x, y, word.length);
        x = nextPosition.x;
        y = nextPosition.y;
      }
    }
  }
  console.log('returning locations locations.size=', locations.length);
  return locations;
}

WordPuzzle.prototype.fillPuzzle = function (words, height, width) {
  //create an empty 2 dimentional array first
  var i, j, puzzle = [];
  for (i=0; i<height; i++) {
    puzzle.push([]);
    for( j=0; j<width; j++) {
      puzzle[i].push('');
    }
  }
  console.log('after filling empty puzzle=', puzzle);

  //Add each word into the puzzle
  for (i =0; i < words.length; i++) {
    const currentWord = words[i];
    var locations = this.findAllLocations(puzzle, currentWord);

    if (locations.length === 0) {
      console.log(`could not find a proper location to fit the word=${currentWord}`);
      // Should try increasing the size of the puzzle and try before giving up
      return puzzle;
    }
    const location = locations[Math.floor(Math.random() * locations.length)];
    console.log('the chosen location is ', location);

    //Now place the word
    for (j=0; j<currentWord.length; j++) {
      const direction = this.puzzleDirection[location.direction];
      const next = direction(location.x, location.y, j);
      puzzle[next.y][next.x] = currentWord[j].toUpperCase();
    }
  }
  return puzzle;
};

WordPuzzle.prototype.fillBlanks = function (puzzle) {
  var i, j;
  for (i = 0; i < puzzle.length; i++) {
    for (j = 0; j < puzzle[i].length; j++) {
      if (puzzle[i][j] === '') {
        puzzle[i][j] = letters[Math.floor(Math.random() * letters.length)].toUpperCase();
      }
    }
  }
}

WordPuzzle.prototype.prettyPrint = function (puzzle) {
  var puzzleString = '';
  for (var i = 0; i < puzzle.length; i++) {
    var row = puzzle[i];
    for (var j = 0; j < row.length; j++) {
      puzzleString += (row[j] === '' ? ' ' : row[j]) + ' ';
    }
    puzzleString += '\n';
  }
  console.log(puzzleString);
  return puzzleString;
}

WordPuzzle.prototype.newPuzzle = function newPuzzle(height, width) {
  var words = [], i;
  if (height <10 || width < 10) {
    console.log('height and width have to be atleast 10 in size');
  }

  for(i=0; i< (height+width); i++) {
    words.push(this.getRandomWords());
  }

  console.log('words=', words);

  //Get the length of the longest word and +2 should be the size of our puzzle
  this.height = this.width = words.sort((a, b) => b.length - a.length)[0].length + 2;

  console.log('Before fillPuzzle words selected =', words);
  var puzzle = this.fillPuzzle(words, this.height, this.width);
  this.fillBlanks(puzzle);
  console.log('finally puzzle is created !!!');
  // return this.prettyPrint(puzzle);
  return {puzzle: puzzle, wordsList: words};
}

exports.WordPuzzle = new WordPuzzle();

// const myWordPuzzle = new WordPuzzle();

// myWordPuzzle.newPuzzle(10,10);