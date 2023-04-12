import callWithInterval from '../../utils';
import images from '../../images';

const BACKGROUND_PADDING = 20;

export default class GameView {
  constructor(canvas, gameGrid, gameSettings) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.gameGrid = gameGrid;
    this.tileSize = gameSettings.tileSize;
  }

  _drawBackground() {
    const backgroundImg = new Image();
    backgroundImg.src = images.background;
    backgroundImg.style.width = `${this.canvas.width + BACKGROUND_PADDING}px`;
    backgroundImg.style.height = `${this.canvas.height + BACKGROUND_PADDING}px`;
    backgroundImg.style.position = 'absolute';
    backgroundImg.style.top = '0px';
    backgroundImg.style.left = '0px';
    backgroundImg.style.zIndex = 1;
    document.body.append(backgroundImg);
  }

  _drawGrid() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.gameGrid.getGrid().forEach((column) => {
      column.forEach((tiles) => {
        this.context.drawImage(tiles.img, tiles.x, tiles.y, this.tileSize, this.tileSize);
      });
    });
  }

  drawGame() {
    this._drawBackground();
    callWithInterval(this._drawGrid.bind(this), 10);
  }
}
