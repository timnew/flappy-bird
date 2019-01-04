import createDebug, { IDebugger } from 'debug'

import Bird from '../world/Bird'
import NameLabel from '../world/NameLabel'
import { AttachedScoreLabel, ScoreLabel } from '../world/ScoreLabel'
import Name, { typedName, fullName } from '../engine/Name'
import { LiveScore, ScoreRecord } from './Score'

export type BirdLeash = (command: string, data: any) => void

export interface PlayerVisual {
  speed: number
  distanceToNextPipe: number
  pipeGap: number
  heightDifference: number
}

export default class Player {
  readonly name: Name
  readonly debug: IDebugger

  constructor(
    name: string,
    readonly liveScore: LiveScore = new LiveScore(fullName(name)),
    readonly scoreRecord: ScoreRecord = new ScoreRecord(fullName(name))
  ) {
    this.name = typedName('Player', name)

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
    this.debug('Flap Bird')
    this.instructBird('flap')
  }

  onDeath() {
    this.scoreRecord.mergeIn(this.liveScore)
    this.liveScore.reset(true)
    this.debug('Dead: $d', this.scoreRecord.death)
  }

  onRevive() {
    this.debug('Revive')
  }

  onVisual(visual: PlayerVisual) {}
}