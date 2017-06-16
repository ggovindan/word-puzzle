# word-puzzle

----


> As I learn the various web techonology. This is yet another excercise to learn to use NodeJS with Vue.

----
## Preview
A preview of this game is available in [Heroku](https://word-maze.heroku.com)

----
## Implementation details
The core logic to generate random words, place them at different locations inside a two dimensional array is written in nodeJS

Vue is used for rendering the page with some simple JQueries.
Some Javascipt code inside vue app is written to render solved puzzle

To run just the nodejs part and use your own client side code
you can clone this repo and  `node lib/word-find.js`
After adding the following lines
 
    myPuzzle = new WordPuzzle();
    result = myPuzzle.newPuzzle();

    // result.puzzle contains the puzzle
    // result.solution contains the solution with details about orientation and coordinates of the first letter
    //result.words contains the word list


----
## TODO
* Need to add implementation to figure out mouse drag and highlight the words the user finds
* Some basic Unit testing

----
## Copyright
* MIT

