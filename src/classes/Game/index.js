import GameGrid from '../GameGrid';
import GameView from '../GameView';

export default class Game {
  totalScore = 0;

  constructor(gameSettings) {
    this.canvas = document.querySelector('canvas');
    this.gameGrid = new GameGrid(gameSettings);
    this.gameView = new GameView(this.canvas, this.gameGrid, gameSettings);
    this.canvasWidth = gameSettings.N * gameSettings.tileSize;
    this.canvasHeight = gameSettings.M * gameSettings.tileSize;
    this.tilesSize = gameSettings.tileSize;
    this.movesLeft = gameSettings.movesLeft;
    this.targetScore = gameSettings.targetScore;

    this.canvas.addEventListener('click', this.mouseClick.bind(this));
  }

  updateScore(score) {
    this.totalScore += score * score;
  }

  mouseClick(event) {
    if (this.movesLeft > 0) {
      const rect = this.canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const targetTile = this.gameGrid.getGrid().flat().find((tile) => (
        x < (tile.x + this.tilesSize) && y < (tile.y + this.tilesSize)
      ));

      if (targetTile) {
        this.gameGrid.findClosesTile(targetTile, this.updateScore.bind(this));
      }
    }
  }

  presetting() {
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '10px';
    this.canvas.style.left = '10px';
    this.canvas.style.zIndex = 2;
    this.canvas.style.borderRadius = '20px';
  }

  start() {
    this.presetting();
    this.gameGrid.createGrid();
    this.gameView.drawGame();
  }
}
