import Game from './classes/Game';

const gameSettings = {
  N: 10, // num of row
  M: 10, // num of column
  colors: ['red', 'green', 'blue', 'yellow', 'purple'], // all possible colors
  tileSize: 60, // size of tile,
  movesLeft: 15, // max moves,
  targetScore: 2500,
};

const game = new Game(gameSettings);

game.start();
