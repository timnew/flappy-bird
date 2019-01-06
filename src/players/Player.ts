import createDebug, { IDebugger } from 'debug'

import Bird from '../world/Bird'
import NameLabel from '../world/NameLabel'
import { AttachedScoreLabel, ScoreLabel } from '../world/ScoreLabel'
import Name, { typedName, fullName } from '../engine/Name'
import { LiveScore, ScoreRecord } from './Score'
import PipeGate from '../world/PipeGate'

export type BirdLeash = (command: string, data: any) => void

export class PlayerVisual {
  constructor(readonly vector: number[]) {}

  static create(speed: number, bird: Bird, pipe: PipeGate) {
    const { gapPosition, halfGapSize, x } = pipe

    return new PlayerVisual([
      speed,
      x - bird.x,
      2 * halfGapSize,
      gapPosition - bird.y
    ])
  }

  get speed(): number {
    return this.vector[0]
  }
  get distanceToNextPipe(): number {
    return this.vector[1]
  }
  get pipeGap(): number {
    return this.vector[2]
  }
  get heightDifference(): number {
    return this.vector[3]
  }
}

export default class Player {
  readonly debug: IDebugger

  constructor(
    readonly name: Name,
    readonly liveScore: LiveScore = new LiveScore(fullName(name)),
    readonly scoreRecord: ScoreRecord = new ScoreRecord(fullName(name))
  ) {
    this.debug = createDebug(this.name)
  }

  attach(bird: Bird) {
    this.debug('Attach to %s', bird.name)
    this.birdLeash = bird.onLeash.bind(bird)

    this.setupNameLabel(bird)
    this.setupScoreLabel(bird)

    this.renderScore()
  }

  detach(bird: Bird) {
    this.debug('Detached from $s', bird)
    this.birdLeash = null
  }

  protected setupNameLabel(bird: Bird): NameLabel {
    const label = new NameLabel(this.name, bird.birdSprite)
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
    this.instructBird('flap')
  }

  onDeath(heightOffset: number) {
    this.liveScore.die(heightOffset)
    this.scoreRecord.mergeIn(this.liveScore)
    this.liveScore.reset()
    this.debug('Dead: $d', this.scoreRecord.death)
  }

  onRevive() {
    this.debug('Revive')
  }

  onVisual(visual: PlayerVisual) {}
}
