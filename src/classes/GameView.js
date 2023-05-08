import images from '../images';
import { BACKGROUND_PADDING, TILE_PADDING } from '../constants/index';

const boostImage = new Image();
boostImage.src = images.boost;

const scoresInterfaceImage = new Image();
scoresInterfaceImage.src = images.scoreInterface;

const popupImage = new Image();
popupImage.src = images.popup;

const backgroundImg = new Image();
backgroundImg.src = images.background;

export default class GameView {
  constructor(canvas, tilesGrid, tileSize, gameIndicators, boost) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.tilesGrid = tilesGrid;
    this.tileSize = tileSize;
    this.gameIndicators = gameIndicators;
    this.boost = boost;

    const { row, colum } = tilesGrid.getGridSize();

    this.gridRowLength = row;
    this.gridColumnLength = colum;
  }

  _drawPopup(popupLabel) {
    this.context.globalAlpha = 0.2;
    this.context.fillStyle = '#20549A';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.globalAlpha = 1;
    this.context.drawImage(
      popupImage,
      this.canvas.width / 2 - 200,
      this.canvas.height / 2 - 200,
      400,
      400,
    );

    this.context.fillStyle = '#ffffff';
    this.context.fillText(popupLabel, this.canvas.width / 2, this.canvas.height / 2);
    this.context.fillText('Play again', this.canvas.width / 2, this.canvas.height / 2 + 120);
  }

  _drawBackground() {
    this.context.drawImage(
      backgroundImg,
      0,
      0,
      this.gridRowLength * this.tileSize + BACKGROUND_PADDING,
      this.gridColumnLength * this.tileSize + BACKGROUND_PADDING,
    );
  }

  _drawTeleportBoost() {
    this.context.drawImage(boostImage, 800, 300, 100, 100);

    this.context.font = '30px serif';
    this.context.fillText('teleport', 850, 335);
    this.context.font = '25px serif';
    this.context.fillText(this.boost.teleportBoostLeft, 850, 385);
  }

  _drawShuffleBoost() {
    this.context.drawImage(boostImage, 650, 300, 100, 100);

    this.context.font = '30px serif';
    this.context.fillText('shuffle', 700, 335);
    this.context.font = '25px serif';
    this.context.fillText(this.boost.shuffleBoostLeft, 700, 385);
  }

  _drawTilesGrid() {
    this.tilesGrid.getGrid().forEach((column) => {
      column.forEach((tiles) => {
        this.context.drawImage(
          tiles.image,
          tiles.positionX + TILE_PADDING,
          tiles.positionY + TILE_PADDING,
          tiles.tileSize,
          tiles.tileSize,
        );
      });
    });
  }

  _drawScoreIndicator() {
    this.context.font = '26px serif';
    this.context.fillStyle = 'white';
    this.context.textAlign = 'center';
    this.context.fillText(this.gameIndicators.getTotalScore(), 750, 140);
  }

  _drawMovesLeftIndicator() {
    this.context.font = '46px serif';
    this.context.textAlign = 'center';
    this.context.fillText(this.gameIndicators.getMovesLeft(), 750, 70);
  }

  _drawIndicators() {
    this.context.drawImage(scoresInterfaceImage, 650, -25, 200, 205);
  }

  drawGame() {
    function updateView() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this._drawTeleportBoost.apply(this);
      this._drawShuffleBoost.apply(this);
      this._drawBackground.apply(this);
      this._drawTilesGrid.apply(this);
      this._drawIndicators.apply(this);
      this._drawScoreIndicator.apply(this);
      this._drawMovesLeftIndicator.apply(this);
      if (this.gameIndicators.isPlayerWin) {
        this._drawPopup.bind(this)('You win!');
      }
      if (this.gameIndicators.isGameFail) {
        this._drawPopup.bind(this)('Game Over!');
      }
      window.requestAnimationFrame(updateView.bind(this));
    }

    updateView.apply(this);
  }
}
