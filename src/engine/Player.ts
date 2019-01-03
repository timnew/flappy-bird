import createDebug, { IDebugger } from 'debug'

import FullName from './FullName'
import World from '../world/World'
import GameObject from './GameObject'

export type BirdLeash = () => void

export interface PlayerVisual {
  speed: number
  distanceToNextPipe: number
  pipeGap: number
  heightDifference: number
}

export default class Player implements GameObject<World> {
  readonly fullName: FullName
  readonly debug: IDebugger

  constructor(readonly world: World, name: string) {
    this.fullName = new FullName('Player', name)
    this.debug = createDebug(this.fullName.fullName)
  }

  score: number = 0
  bestScore: number = 0

  distance: number = 0
  bestDistance: number = 0

  pipeCount: number = 0
  bestPipeCount: number = 0

  death: number = 0

  birdLeash: BirdLeash | null = null

  onGameStart() {
    this.debug('Game start')
  }

  flap() {
    this.debug('Flap Bird')
    if (this.birdLeash != null) {
      this.birdLeash()
    } else {
      this.debug('Player not yet registered')
    }
  }

  onIncreaseDistance(deltaDistance: number) {
    this.distance += deltaDistance
    this.updateScore()
  }

  onIncreasePipeCount() {
    this.pipeCount += 1
    this.updateScore(true)
  }

  private updateScore(log: boolean = false) {
    this.score = this.distance + this.pipeCount * 5
    if (log) {
      this.debug(
        'Score: d: %d p: %d s: %d',
        this.distance,
        this.pipeCount,
        this.score
      )
    }
  }

  onDeath() {
    this.bestScore = Math.max(this.bestScore, this.score)
    this.score = 0

    this.bestDistance = Math.max(this.bestDistance, this.distance)
    this.distance = 0

    this.bestPipeCount = Math.max(this.bestPipeCount, this.pipeCount)
    this.pipeCount = 0

    this.death += 1

    this.debug('Dead: $d', this.death)
  }

  onRevive() {
    this.debug('Revive')
  }

  onVisual(visual: PlayerVisual) {}

  update(deltaTime: number, stage: World): void {}
}
