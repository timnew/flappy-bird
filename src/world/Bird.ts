import createDebug from 'debug'
const debug = createDebug('app:Bird')

import World from './World'
import { Rectangle, Sprite, Text, TextStyle } from 'pixi.js'
import Player from '../players/Player'
import { ContainerActor } from '../engine/ContainerActor'
import { typedName } from '../engine/Name'
import PipeGate from './PipeGate'

export default class Bird extends ContainerActor<World> {
  readonly birdSprite: Sprite

  constructor(
    readonly player: Player,
    readonly world: World,
    pendingCallback: PendingCallback | null = null
  ) {
    super(typedName('Player', player.name))

    this.birdSprite = this.createBirdSprite(world)

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

    if (pendingCallback != null) {
      this.state = new BirdPendingState(this, pendingCallback)
    } else {
      this.state = new BirdLiveState(this)
    }

    player.attach(this)
  }

  private createBirdSprite(world: World): Sprite {
    const birdSprite = new Sprite(world.resources.bird.texture)

    birdSprite.anchor.set(0.5)

    birdSprite.x = 0
    birdSprite.y = 0

    this.addChild(birdSprite)

    return birdSprite
  }

  readonly moveBounds: Rectangle

  velocity: number
  state: BirdState

  get isLive(): boolean {
    return this.state.isLive
  }

  onLeash(command: string, data: any) {
    debug('Command: %s(%j)', command, data)

    switch (command) {
      case 'flap':
        this.flap()
        break
    }
  }

  update(deltaTime: number, world: World) {
    this.state.onUpdate(deltaTime)
    this.player.renderScore()
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
      this.birdSprite.rotation = (this.velocity / maxRaisingSpeed) * maxRotation
    } else if (this.velocity > 0) {
      this.birdSprite.rotation =
        (this.velocity / maxDroppingSpeed) * maxRotation
    } else {
      this.birdSprite.rotation = 0
    }
  }

  dispose() {
    this.player.detach(this)
  }

  flap() {
    this.state.onFlap()
  }

  kill(byPipe: PipeGate) {
    const heightOffset =
      Math.abs(this.y - byPipe.gapPosition) -
      byPipe.halfGapSize +
      this.height / 2
    this.state.onKill(heightOffset)
  }

  destroy() {
    this.state.onKill(0)
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

  onFlap() {}

  onKill(heightOffset: number) {}

  onHitTop() {}

  onHitBottom() {}
}

class BirdLiveState extends BirdState {
  constructor(bird: Bird) {
    super(bird, 'Live', true)

    bird.alpha = 1
    bird.birdSprite.tint = 0xffffff
  }

  onUpdate(deltaTime: number): void {
    const bird = this.bird

    bird.updateY(deltaTime)
    bird.updateVelocity(deltaTime)
    bird.updateRotation()
  }

  onFlap() {
    const bird = this.bird
    const { raisingSpeed } = bird.world.params

    bird.velocity = -raisingSpeed
    bird.updateRotation()
  }

  onHitBottom() {
    this.bird.player.liveScore.punish(500)
  }

  onHitTop() {
    this.bird.player.liveScore.punish(500)
  }

  onKill(heightOffset: number) {
    new BirdDeadState(this.bird, heightOffset)
  }
}

class BirdDeadState extends BirdState {
  constructor(bird: Bird, heightOffset: number) {
    super(bird, 'Dead', false)

    bird.birdSprite.tint = 0xff00cccc

    bird.dispose()

    bird.player.onDeath(heightOffset)
  }

  onUpdate(deltaTime: number): void {
    const bird = this.bird

    bird.updateY(deltaTime)
    bird.updateVelocity(deltaTime)
    bird.updateRotation()
    bird.updateX(deltaTime)
  }
}

export type PendingCallback = (bird: Bird) => void

class BirdPendingState extends BirdState {
  constructor(bird: Bird, readonly pendingCallback: PendingCallback) {
    super(bird, 'Pending', false)
    bird.alpha = 0.5
  }

  onFlap() {
    new BirdLiveState(this.bird)
    this.pendingCallback(this.bird)
    this.bird.player.onRevive()
    this.bird.flap()
  }
}
