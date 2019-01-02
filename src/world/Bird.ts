import createDebug from 'debug'
const debug = createDebug('app:Bird')

import World from './World'
import Actor from '../engine/Actor'
import ParameterController from './ParameterController'

export type PlayerControlApi = () => void

export default class Bird extends Actor<World> {
  readonly controlApi: PlayerControlApi

  constructor(name: string, world: World) {
    super('Bird', name, world.resources.bird.texture)

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

    world.playerControl.registerBird(this)
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
    const params = world.params

    switch (this.state) {
      case PlayerState.Drop:
        if (this.velocity < params.maxDroppingSpeed) {
          this.velocity += params.gravity * deltaTime
        }
        this.updateSprite(deltaTime, params)
        break
      case PlayerState.Jump:
        this.state = PlayerState.Drop
        this.velocity = -params.raisingSpeed
        this.updateSprite(deltaTime, params)
        break
      case PlayerState.Kill:
        this.state = PlayerState.Dead
        this.tint = 0xff00cccc
        break
      case PlayerState.Dead:
        if (this.velocity < params.maxDroppingSpeed) {
          this.velocity += params.gravity * deltaTime
        }

        this.updateSprite(deltaTime, params)

        if (this.y >= this.minY) {
          this.x -= params.speed * deltaTime
        }

        if (this.x <= this.vanishX) {
          world.removeObject(this)
        }
        break
    }
  }

  private updateSprite(
    deltaTime: number,
    { maxRaisingSpeed, maxDroppingSpeed, maxRotation }: ParameterController
  ) {
    this.y += this.velocity * deltaTime

    if (this.y < this.minY) {
      this.y = this.minY
    } else if (this.y > this.maxY) {
      this.y = this.maxY
    }

    if (this.velocity < 0) {
      this.rotation = (this.velocity / maxRaisingSpeed) * maxRotation
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

export enum PlayerState {
  Jump,
  Drop,
  Kill,
  Dead
}
