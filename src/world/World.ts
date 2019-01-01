import Player from './Player'
import Stage from '../engine/Stage'
import { TopPipe, BottomPipe } from './Pipe'

export default class World extends Stage<World> {
  readonly rasingForce = -30
  readonly maxRasingSpeed = -30
  readonly gravity = 5
  readonly maxDroppingSpeed = 5
  readonly maxRotation = Math.PI / 6

  private _speed: number = 1
  get speed(): number {
    return this._speed
  }

  setup() {
    this.addActor(new Player('player', this))

    this.playerControl.registerHumanControl('player', 'Space')

    this.addActor(new TopPipe(this, 30))
    this.addActor(new BottomPipe(this, 90))
  }
}
