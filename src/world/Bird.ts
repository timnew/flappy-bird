import createDebug from 'debug'
const debug = createDebug('app:Bird')

import World from './World'
import Actor from '../engine/Actor'
import FullName from '../engine/FullName'
import { Rectangle } from 'pixi.js'

export type PlayerControlApi = () => void

export default class Bird extends Actor<World> {
  readonly controlApi: PlayerControlApi

  constructor(name: string, readonly world: World, isPending: boolean = false) {
    super(new FullName('Bird', name), world.resources.bird.texture)

    this.anchor.set(0.5)

    const { screen } = world

    this.x = screen.width / 2
    this.y = screen.height / 2

    const halfHeight = this.height / 2
    const halfWidth = this.width / 2

    this.moveBounds = new Rectangle(
      -halfWidth,
      halfHeight,
      screen.width / 2 + halfWidth,
      screen.height - this.height
    )

    this.velocity = 0

    this.controlApi = this.trigger.bind(this)

    if (isPending) {
      this.state = new BirdPendingState(this)
    } else {
      this.state = new BirdLiveState(this)
    }

    world.playerControl.registerBird(this)
    ;(window as any).bird = this
  }

  readonly moveBounds: Rectangle

  velocity: number
  state: BirdState

  get isLive(): boolean {
    return this.state.isLive
  }

  update(deltaTime: number, world: World) {
    this.state.onUpdate(deltaTime)
  }

  updateVelocity(deltaTime: number) {
    const { maxDroppingSpeed, gravity } = this.world.params

    if (this.velocity < maxDroppingSpeed) {
      this.velocity += gravity * deltaTime
    }
  }

  updateX(deltaTime: number) {
    const { speed } = this.world.params
    this.x -= speed * deltaTime
    if (this.x <= this.moveBounds.left) {
      this.world.removeObject(this)
    }
  }

  updateY(deltaTime: number) {
    this.y += this.velocity * deltaTime

    if (this.y < this.moveBounds.top) {
      this.velocity = 0
      this.y = this.moveBounds.top
      this.state.onHitTop()
    } else if (this.y > this.moveBounds.bottom) {
      this.velocity = 0
      this.y = this.moveBounds.bottom
      this.state.onHitBottom()
    }
  }

  updateRotation() {
    const { maxRaisingSpeed, maxDroppingSpeed, maxRotation } = this.world.params

    if (this.velocity < 0) {
      this.rotation = (this.velocity / maxRaisingSpeed) * maxRotation
    } else if (this.velocity > 0) {
      this.rotation = (this.velocity / maxDroppingSpeed) * maxRotation
    } else {
      this.rotation = 0
    }
  }

  deregister() {
    this.world.playerControl.removeBird(this)
  }

  trigger() {
    this.state.onTrigger()
  }

  kill() {
    this.state.onKill()
  }
}

abstract class BirdState {
  constructor(
    readonly bird: Bird,
    readonly name: string,
    readonly isLive: boolean = false
  ) {
    bird.state = this
    debug('Bird[%s] state changed to %s', bird.name, name)
  }

  onUpdate(deltaTime: number): void {}

  onTrigger() {}

  onKill() {}

  onHitTop() {}

  onHitBottom() {}
}

class BirdLiveState extends BirdState {
  constructor(bird: Bird) {
    super(bird, 'Live', true)

    bird.alpha = 1
    bird.tint = 0xffffff
  }

  onUpdate(deltaTime: number): void {
    const bird = this.bird

    bird.updateY(deltaTime)
    bird.updateVelocity(deltaTime)
    bird.updateRotation()
  }

  onTrigger() {
    const bird = this.bird
    const { raisingSpeed } = bird.world.params

    bird.velocity = -raisingSpeed
    bird.updateRotation()
  }

  onKill() {
    new BirdDeadState(this.bird)
  }
}

class BirdDeadState extends BirdState {
  constructor(bird: Bird) {
    super(bird, 'Dead', false)

    bird.tint = 0xff00cccc

    bird.deregister()

    bird.world.tryRevive(bird)
  }

  onUpdate(deltaTime: number): void {
    const bird = this.bird

    bird.updateY(deltaTime)
    bird.updateVelocity(deltaTime)
    bird.updateRotation()
    bird.updateX(deltaTime)
  }
}

class BirdPendingState extends BirdState {
  constructor(bird: Bird) {
    super(bird, 'Pending', false)
    bird.alpha = 0.5
  }

  onTrigger() {
    new BirdLiveState(this.bird)
    this.bird.trigger()
  }
}
