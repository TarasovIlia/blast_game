export default class Indicators {
  isGameFail = false;

  isPlayerWin = false;

  constructor(gameSettings) {
    this.gameSettings = gameSettings;
    this.totalScore = 0;
    this.targetScore = gameSettings.targetScore;
    this.movesLeft = gameSettings.movesLeft;
  }

  resetGameStatus() {
    this.totalScore = 0;
    this.movesLeft = this.gameSettings.movesLeft;
    this.isPlayerWin = false;
    this.isGameFail = false;
  }

  _checkGameProgress() {
    if (this.totalScore >= this.targetScore) {
      this.isPlayerWin = true;
    }
  }

  _checkMovesLeft() {
    if (!this.movesLeft) {
      this.isGameFail = true;
    }
  }

  updateScore(score) {
    this.totalScore += score * score;
    this._checkGameProgress();
  }

  updateMoves() {
    this.movesLeft -= 1;
    this._checkMovesLeft();
  }

  getTotalScore() {
    return this.totalScore;
  }

  getMovesLeft() {
    return this.movesLeft;
  }
}
