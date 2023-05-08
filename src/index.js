import Game from './classes/Game';
import GameView from './classes/GameView';
import TilesGrid from './classes/TilesGrid';
import Boost from './classes/Boost';
import Indicators from './classes/Indicators';

const gameSettings = {
  N: 9, // num of row
  M: 9, // num of column
  colors: ['red', 'green', 'blue', 'yellow', 'purple'], // all possible colors
  tileSize: 60, // size of tile,
  movesLeft: 15, // max moves,
  targetScore: 200,
};

const canvas = document.querySelector('canvas');

const boost = new Boost();

const gameIndicators = new Indicators(gameSettings);

const tilesGrid = new TilesGrid(gameSettings);

const gameView = new GameView(canvas, tilesGrid, gameSettings.tileSize, gameIndicators, boost);

const game = new Game(gameSettings, canvas, gameView, gameIndicators, boost, tilesGrid);

game.start();
