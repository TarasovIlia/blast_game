import Tile from './Tile';

export default class TilesGrid {
  tilesGrid = [];

  isTilesMove = false;

  constructor({
    N, M, colors, tileSize,
  }) {
    this.tableNumRow = M;
    this.tableNumColumn = N;
    this.colors = colors;
    this.tileSize = tileSize;
  }

  setIsTilesMove(isMove) {
    this.isTilesMove = isMove;
  }

  _getRandomColor() {
    const maxColors = this.colors.length;
    const colorIndex = Math.floor(Math.random() * maxColors);
    return this.colors[colorIndex];
  }

  removeAllTiles() {
    this.tilesGrid = this.tilesGrid.map(() => []);
  }

  createGrid() {
    for (let i = 0; i < this.tableNumRow; i++) {
      this.tilesGrid[i] = [];
    }
  }

  fillGrid() {
    this.tilesGrid.forEach((column, index) => {
      if (column.length < this.tableNumColumn) {
        const color = this._getRandomColor();
        const tile = new Tile(
          index * this.tileSize,
          -this.tileSize,
          color,
          this.tileSize,
          this.setIsTilesMove.bind(this),
        );
        column.unshift(tile);
      }
    });
  }

  shuffleTiles() {
    const shuffledColors = this.tilesGrid.flat()
      .sort(() => Math.random() - 0.5).map((tile) => tile.color);
    this.tilesGrid.forEach((column) => {
      column.forEach((tile) => {
        tile.changeColor(shuffledColors[0]);
        shuffledColors.shift();
      });
    });
  }

  updateGrid() {
    let isUpdate = false;
    this.tilesGrid.forEach((column) => column.forEach((tile, index) => {
      const isPositionCorrect = tile.checkPositionY(index * this.tileSize);
      if (!isPositionCorrect) {
        isUpdate = true;
        tile.updatePositionY();
      }
    }));

    if (!isUpdate) {
      this.setIsTilesMove(false);

      return;
    }
    this.setIsTilesMove(true);
  }

  boosterTeleport(firstTile, secondTile) {
    const colorFirst = firstTile.color;
    const colorSecond = secondTile.color;
    this.tilesGrid[secondTile.getColumnIndex()][secondTile.getTileIndex()].changeColor(colorFirst);
    this.tilesGrid[firstTile.getColumnIndex()][firstTile.getTileIndex()].changeColor(colorSecond);
  }

  getClosesTiles(tile) {
    const closesTiles = new Set([tile]);

    function checkClosesTiles() {
      const prevLength = closesTiles.size;
      closesTiles.forEach((closesTile) => {
        const columnIndex = closesTile.getColumnIndex();
        const tileIndex = closesTile.getTileIndex();
        const leftColumn = this.tilesGrid[columnIndex - 1] || undefined;
        const rightColumn = this.tilesGrid[columnIndex + 1] || undefined;
        const upperTile = this.tilesGrid[columnIndex][tileIndex - 1] || undefined;
        const bottomTile = this.tilesGrid[columnIndex][tileIndex + 1] || undefined;

        const closestColumns = [leftColumn, rightColumn];
        const closesVerticalTiles = [upperTile, bottomTile];

        closestColumns.forEach((column) => {
          if (column && column[tileIndex]?.color === closesTile.color) {
            closesTiles.add(column[tileIndex]);
          }
        });

        closesVerticalTiles.forEach((_tile) => {
          if (_tile && _tile.color === closesTile.color) {
            closesTiles.add(_tile);
          }
        });
      });

      // if closesTiles length has not changed that means there is no more tile with the same color
      if (prevLength !== closesTiles.size) {
        checkClosesTiles.apply(this);
      }
    }

    checkClosesTiles.apply(this);

    return Array.from(closesTiles);
  }

  removeTile(tiles) {
    const removedKeys = tiles.map((tile) => tile.uniqKey);
    tiles.forEach((tile) => tile.startRemoveAnimation());
    const updatedTilesGrid = this.tilesGrid.map((column) => (
      column.filter((tile) => !removedKeys.includes(tile.uniqKey))
    ));
    // delay before updating tilesGrid is necessary to show remove animation
    setTimeout(() => {
      this.tilesGrid = updatedTilesGrid;
    }, 200);
  }

  getTargetTile(x, y) {
    return this.tilesGrid.flat().find((tile) => (
      x <= (tile.positionX + this.tileSize)
      && x >= (tile.positionX)
      && y <= (tile.positionY + this.tileSize)
      && y >= (tile.positionY)
    ));
  }

  getGrid() {
    return this.tilesGrid;
  }

  getGridSize() {
    return { row: this.tableNumRow, colum: this.tableNumColumn };
  }
}
