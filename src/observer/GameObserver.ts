export interface PlayerScore {
  name: string

  score: number
  bestScore: number

  distance: number
  bestDistance: number

  pipeCount: number
  bestPipeCount: number

  death: number
}

export default interface GameObserver {
  reportPlayerScore(score: PlayerScore): void
}

declare global {
  interface Window {
    gameObserver: GameObserver | undefined
  }
}
