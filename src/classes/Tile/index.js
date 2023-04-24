import images from '../../images';

export default class Tile {
  constructor(x, y, color, size, setIsTilesMove) {
    const img = new Image();
    img.src = images[color];

    this.positionX = x;
    this.positionY = y;
    this.image = img;
    this.color = color;
    this.tileSize = size;
    this.uniqKey = new Date();
    this.setIsTilesMove = setIsTilesMove;
  }

  getColumnIndex() {
    return this.positionX / this.tileSize;
  }

  getTileIndex() {
    return this.positionY / this.tileSize;
  }

  startRemoveAnimation() {
    this.tileSize -= 4;
    this.positionX += 2;
    this.positionY += 2;
    if (this.tileSize > 0) {
      window.requestAnimationFrame(this.startRemoveAnimation.bind(this));
    }
  }

  changeColor(color) {
    this.color = color;
    this.image.src = images[color];
  }

  checkPositionY(positionY) {
    return !(this.positionY < positionY);
  }

  updatePositionY() {
    this.positionY += 2;
  }
}
