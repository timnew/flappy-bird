import createDebug from 'debug'
const debug = createDebug('app:Player')

import World from './World'
import Actor from '../engine/Actor'

export type PlayerControlApi = () => void

class Player extends Actor<World> {
  readonly controlApi: PlayerControlApi

  constructor(readonly name: string, world: World) {
    super('Player', world.resources.bird.texture)

    this.anchor.set(0.5)

    this.x = world.screen.width / 2
    this.y = world.screen.height / 2
    const halfHeight = this.height / 2

    this.minY = halfHeight
    this.maxY = world.screen.height - halfHeight
    this.vanishX = -this.width / 2

    this.velocity = 0

    this.state = PlayerState.Drop

    this.controlApi = this.jump.bind(this)

    world.playerControl.registerPlayer(this)
  }

  readonly minY: number
  readonly maxY: number
  readonly vanishX: number

  private velocity: number

  private state: PlayerState
  get isLive(): boolean {
    switch (this.state) {
      case PlayerState.Kill:
      case PlayerState.Dead:
        return false
      default:
        return true
    }
  }

  update(deltaTime: number, world: World) {
    switch (this.state) {
      case PlayerState.Drop:
        if (this.velocity < world.maxDroppingSpeed) {
          this.velocity += world.gravity
        }
        this.updateSprite(world)
        break
      case PlayerState.Jump:
        this.state = PlayerState.Drop
        this.velocity = world.rasingForce
        this.updateSprite(world)
        break
      case PlayerState.Kill:
        this.state = PlayerState.Dead
        this.tint = 0xff00cccc
        break
      case PlayerState.Dead:
        if (this.velocity < world.maxDroppingSpeed) {
          this.velocity += world.gravity
        }

        this.updateSprite(world)

        if (this.y >= this.minY) {
          this.x -= world.speed
        }

        if (this.x <= this.vanishX) {
          world.removeActor(this)
        }
        break
    }
  }

  private updateSprite({
    screen,
    maxRasingSpeed,
    maxDroppingSpeed,
    maxRotation
  }: World) {
    this.y += this.velocity

    if (this.y < this.minY) {
      this.y = this.minY
    } else if (this.y > this.maxY) {
      this.y = this.maxY
    }

    if (this.velocity < 0) {
      this.rotation = (this.velocity / maxRasingSpeed) * maxRotation
    } else if (this.velocity > 0) {
      this.rotation = (this.velocity / maxDroppingSpeed) * maxRotation
    } else {
      this.rotation = 0
    }
  }

  jump() {
    if (this.state != PlayerState.Dead) {
      this.state = PlayerState.Jump
    }
  }

  kill() {
    if (this.state == PlayerState.Kill || this.state == PlayerState.Dead) {
      return
    }

    debug('%s is killed', this.name)
    this.state = PlayerState.Kill
  }
}

enum PlayerState {
  Jump,
  Drop,
  Kill,
  Dead
}

export default Player
