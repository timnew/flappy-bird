import Player from './Player'
import Stage from '../engine/Stage'
import { TopPipe, BottomPipe, Pipe } from './Pipe'
import { Rectangle } from 'pixi.js'

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

  private collisionBox = Rectangle.EMPTY

  setup() {
    const player = new Player('player', this)
    this.addActor(player)

    this.collisionBox = new Rectangle(
      (this.screen.width - this.resources.bird.texture.width) / 2,
      0,
      this.resources.bird.texture.width,
      this.screen.height
    )

    this.playerControl.registerHumanControl('player', 'Space')

    this.addActor(new TopPipe(this, 30))
    this.addActor(new BottomPipe(this, 90))
  }

  updateStage() {
    const harmfulPipes = this.actors
      .getValue('Pipe')
      .filter(pipe => pipe.isCollidedOn(this.collisionBox))

    this.actors
      .getValue('Player')
      .filter(player => harmfulPipes.some(pipe => player.isCollidedOn(pipe)))
      .forEach(player => (player as Player).kill())
  }
}
