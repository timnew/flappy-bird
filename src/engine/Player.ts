import createDebug, { IDebugger } from 'debug'

import FullName from './FullName'
import World from '../world/World'
import GameObject from './GameObject'
import Bird from '../world/Bird'
import { Text } from 'pixi.js'
import NameLabel from '../world/NameLabel'
import { AttachedScoreLabel, ScoreLabel } from '../world/ScoreLabel'

export type BirdLeash = (command: string, data: any) => void

export interface PlayerVisual {
  speed: number
  distanceToNextPipe: number
  pipeGap: number
  heightDifference: number
}

export default class Player implements GameObject<World> {
  get name() {
    return this.fullName.name
  }
  readonly fullName: FullName
  readonly debug: IDebugger

  constructor(readonly world: World, name: string) {
    this.fullName = new FullName('Player', name)

    this.debug = createDebug(this.fullName.fullName)

    this.reportScore()
  }

  attach(bird: Bird) {
    this.birdLeash = bird.onLeash.bind(bird)

    this.setupNameLabel(bird)
    this.setupScoreLabel(bird)

    this.renderScore()
  }

  detach(bird: Bird) {
    this.birdLeash = null
  }

  protected setupNameLabel(bird: Bird): NameLabel {
    const text = `${this.fullName.name}:${this.death}`
    const label = new NameLabel(text, bird.birdSprite)
    bird.addChild(label)
    return label
  }

  protected scoreLabel: ScoreLabel | null = null

  protected setupScoreLabel(bird: Bird): ScoreLabel {
    const label = new AttachedScoreLabel(bird)
    this.scoreLabel = label
    return label
  }

  protected renderScore() {
    if (this.scoreLabel != null) {
      this.scoreLabel.renderScore(this)
    }
  }

  score: number = 0
  bestScore: number = 0

  distance: number = 0
  bestDistance: number = 0

  pipeCount: number = 0
  bestPipeCount: number = 0

  death: number = 0

  birdLeash: BirdLeash | null = null

  instructBird(command: string, data: any = null) {
    if (this.birdLeash != null) {
      this.birdLeash(command, data)
    } else {
      this.debug('Player not yet registered')
    }
  }

  onGameStart() {
    this.debug('Game start')
  }

  flap() {
    this.debug('Flap Bird')
    this.instructBird('flap')
  }

  onIncreaseDistance(deltaDistance: number) {
    this.distance += deltaDistance
    this.updateScore(false)
  }

  onIncreasePipeCount() {
    this.pipeCount += 1
    this.updateScore()
  }

  private updateScore(report: boolean = true) {
    this.score = this.distance + this.pipeCount * 500

    this.renderScore()

    if (report) {
      this.debug(
        'Score: d: %d p: %d s: %d',
        this.distance,
        this.pipeCount,
        this.score
      )
      this.reportScore()
    }
  }

  onDeath() {
    this.death += 1

    this.debug('Dead: $d', this.death)

    this.bestScore = Math.max(this.bestScore, this.score)
    this.score = 0

    this.bestDistance = Math.max(this.bestDistance, this.distance)
    this.distance = 0

    this.bestPipeCount = Math.max(this.bestPipeCount, this.pipeCount)
    this.pipeCount = 0

    this.updateScore()
  }

  onRevive() {
    this.debug('Revive')
  }

  onVisual(visual: PlayerVisual) {}

  update(deltaTime: number, stage: World): void {}

  private reportScore() {
    if (window.gameObserver != null) {
      window.gameObserver.reportPlayerScore({
        name: this.fullName.name,
        score: this.score,
        bestScore: this.bestScore,
        distance: this.distance,
        bestDistance: this.bestDistance,
        pipeCount: this.pipeCount,
        bestPipeCount: this.bestPipeCount,
        death: this.death
      })
    }
  }
}
