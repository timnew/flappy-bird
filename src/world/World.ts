import createDebug from 'debug'
const debug = createDebug('app:World')

import Player from './Player'
import Stage from '../engine/Stage'
import { TopPipe, BottomPipe, Pipe } from './Pipe'
import CollisionDetector from './CollisionDetector'
import PipeGenerator from './PipeGenerator'

export default class World extends Stage<World> {
  readonly rasingForce = -30
  readonly maxRasingSpeed = -30
  readonly gravity = 5
  readonly maxDroppingSpeed = 5
  readonly maxRotation = Math.PI / 6

  readonly maxPipeDistance = 100
  readonly minGapSize = 60
  readonly maxGapSize = 150
  readonly minPipeTopMargin = 30
  readonly minPipeBottomMargin = 30

  private _speed: number = 1
  get speed(): number {
    return this._speed
  }

  setup() {
    this.addActor(new Player('player', this))

    this.playerControl.registerHumanControl('player', 'Space')
    this.game.keyboard
      .onKey('KeyR')
      .onEvent('keyDownSingle', () => this.revive())

    this.addController(new CollisionDetector(this))
    this.addController(new PipeGenerator(this))
  }

  revive() {
    const players = this.actors.getValue('Player')
    if (players.every(player => !(player as Player).isLive)) {
      debug('Revive a new player')

      this.addActor(new Player('player', this))
    } else {
      debug('There is at least one active player')
    }
  }
}
