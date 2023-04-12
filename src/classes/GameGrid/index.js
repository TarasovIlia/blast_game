import images from '../../images';
import callWithInterval from '../../utils';

export default class GameGrid {
  grid = [];

  constructor({
    N, M, colors, tileSize,
  }) {
    this.tableNumRow = M;
    this.tableNumColumn = N;
    this.colors = colors;
    this.tileSize = tileSize;
  }

  _getRandomColor() {
    const maxColors = this.colors.length;
    const colorIndex = Math.floor(Math.random() * maxColors);
    return this.colors[colorIndex];
  }

  createGrid() {
    for (let i = 0; i < this.tableNumRow; i++) {
      this.grid[i] = [];
    }

    callWithInterval(this._fillGrid.bind(this), 350);
    callWithInterval(this._updateGrid.bind(this), 10);
  }

  _fillGrid() {
    this.grid.forEach((column, index) => {
      if (column.length < this.tableNumColumn) {
        const color = this._getRandomColor();
        const img = new Image();
        img.src = images[color];
        const tile = {
          color,
          x: index * this.tileSize,
          y: -this.tileSize,
          img,
        };
        column.unshift(tile);
      }
    });
  }

  _updateGrid() {
    this.grid = this.grid.map((column) => column.map((tile, index) => {
      if (tile.y < index * this.tileSize) {
        const currentY = tile.y;
        return { ...tile, y: currentY + 2 };
      }

      return tile;
    }));
  }

  findClosesTile(tile, callback) {
    const closesTiles = [tile];

    function safePush(checkingTile) {
      if (
        !closesTiles.includes(checkingTile)
      ) {
        closesTiles.push(checkingTile);
      }
    }

    function checkClosesTiles() {
      const prevLength = closesTiles.length;
      closesTiles.forEach(({ x, y, color }) => {
        const columnIndex = x / this.tileSize;
        const tileIndex = y / this.tileSize;
        const leftColumn = this.grid[columnIndex - 1] || undefined;
        const rightColumn = this.grid[columnIndex + 1] || undefined;
        const upperTile = this.grid[columnIndex][tileIndex - 1] || undefined;
        const bottomTile = this.grid[columnIndex][tileIndex + 1] || undefined;

        const closestColumns = [leftColumn, rightColumn];
        const closesVerticalTiles = [upperTile, bottomTile];

        closestColumns.forEach((column) => {
          if (column && column[tileIndex]?.color === color) {
            safePush(column[tileIndex]);
          }
        });

        closesVerticalTiles.forEach((_tile) => {
          if (_tile && _tile.color === color) {
            safePush(_tile);
          }
        });
      });
      const newLength = closesTiles.length;

      if (prevLength !== newLength) {
        checkClosesTiles.apply(this);
      }
    }

    checkClosesTiles.apply(this);

    if (closesTiles.length > 1) {
      this._removeTile(closesTiles);

      callback(closesTiles.length);
    }
  }

  _removeTile(tiles) {
    this.grid = this.grid.map((column, index) => {
      const tilesFromCurrentColumn = tiles.filter(({ x }) => {
        const columnIndex = x / this.tileSize;
        return columnIndex === index;
      });
      if (tilesFromCurrentColumn.length > 0) {
        return column.filter((tile) => !tilesFromCurrentColumn.includes(tile));
      }

      return column;
    });
  }

  getGrid() {
    return this.grid;
  }
}
