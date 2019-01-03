import GameObserver, { PlayerScore } from './GameObserver'

export default class ConsoleObserver implements GameObserver {
  constructor() {
    window.gameObserver = this
  }

  reportPlayerScore(score: PlayerScore): void {
    console.table(score)
  }
}
