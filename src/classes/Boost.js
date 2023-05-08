export default class Boost {
  activeBoost = null;

  shuffleBoostLeft = 2;

  teleportBoostLeft = 4;

  firsTile = null;

  resetBoost() {
    this.shuffleBoostLeft = 2;
    this.teleportBoostLeft = 4;
  }

  setActiveBoost(boost) {
    this.activeBoost = boost;
  }

  updateShuffleBoost() {
    this.shuffleBoostLeft -= 1;
  }

  updateTeleportBoost() {
    this.teleportBoostLeft -= 1;
  }

  setFirstTile(tile) {
    this.firsTile = tile;
  }
}
