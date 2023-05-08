import {
  INTERFACE_EVENT, TILES_EVENT, SHUFFLE_BOOST, TELEPORT_BOOST, TILE_PADDING,
} from '../constants/index';
import { getInterfaceTarget, callWithInterval } from '../utils';

export default class Game {
  constructor(gameSettings, canvas, gameView, gameIndicators, boost, tilesGrid) {
    this.canvas = canvas;
    this.gameView = gameView;
    this.boost = boost;
    this.tilesGrid = tilesGrid;
    this.gameIndicators = gameIndicators;
    this.tilesSize = gameSettings.tileSize;
  }

  _mouseClickHandler(event) {
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // off display if game over
    if (this.gameIndicators.isGameFail || this.gameIndicators.isPlayerWin) {
      this._popupClickHandler(x, y);

      return;
    }

    if (this.tilesGrid.isTilesMove) {
      // should not process click while tiles moves
      return;
    }

    const eventType = this._getEventType(x, y);

    if (eventType === INTERFACE_EVENT) {
      this._interfaceClickHandler(x, y);
    }
    if (eventType === TILES_EVENT) {
      // each tile is displayed with padding to fit into the background,
      // so the correct coordinate will be x/y - TILE_PADDING
      this._tileClickHandler(x - TILE_PADDING, y - TILE_PADDING);
    }
  }

  _popupClickHandler(x, y) {
    if (
      x >= (this.canvas.width / 2 - 200)
      && x <= (this.canvas.width / 2 + 200)
      && y >= (this.canvas.height / 2 - 200)
      && y <= (this.canvas.height / 2 + 200)
    ) {
      this.tilesGrid.removeAllTiles();
      this.gameIndicators.resetGameStatus();
      this.boost.resetBoost();
    }
  }

  _tileClickHandler(x, y) {
    const targetTile = this.tilesGrid.getTargetTile(x, y);

    if (targetTile) {
      const { activeBoost } = this.boost;

      if (!activeBoost) {
        const closesTiles = this.tilesGrid.getClosesTiles(targetTile);

        if (closesTiles.length > 1) {
          this.tilesGrid.removeTile(closesTiles);
          this.gameIndicators.updateScore(closesTiles.length);
          this.gameIndicators.updateMoves();
        }

        return;
      }

      if (activeBoost === TELEPORT_BOOST) {
        if (this.boost.firsTile) {
          this.tilesGrid.boosterTeleport(targetTile, this.boost.firsTile);
          this.boost.setFirstTile(null);
          this.boost.setActiveBoost(null);

          return;
        }

        this.boost.setFirstTile(targetTile);
      }
    }
  }

  _interfaceClickHandler(x, y) {
    const interfaceTarget = getInterfaceTarget(x, y);

    if (interfaceTarget === SHUFFLE_BOOST) {
      if (this.boost.shuffleBoostLeft > 0) {
        this.boost.updateShuffleBoost();
        this.tilesGrid.shuffleTiles();
      }
    }

    if (interfaceTarget === TELEPORT_BOOST) {
      if (this.boost.teleportBoostLeft > 0) {
        this.boost.setActiveBoost(TELEPORT_BOOST);
        this.boost.updateTeleportBoost();
      }
    }
  }

  _getEventType(x, y) {
    const { colum, row } = this.tilesGrid.getGridSize();
    if (x > colum * this.tilesSize || y > row * this.tilesSize) {
      return INTERFACE_EVENT;
    }

    return TILES_EVENT;
  }

  presetting() {
    this.canvas.addEventListener('click', this._mouseClickHandler.bind(this));
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.textAlign = 'center';
    document.querySelector('body').style.background = '#011e3b';
  }

  start() {
    this.presetting();
    this.tilesGrid.createGrid();
    this.gameView.drawGame();

    callWithInterval(this.tilesGrid.fillGrid.bind(this.tilesGrid), 480);
    callWithInterval(this.tilesGrid.updateGrid.bind(this.tilesGrid), 16);
  }
}
