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

    this.velocity = 0

    this.state = PlayerState.Drop

    this.controlApi = this.jump.bind(this)

    world.playerControl.registerPlayer(this)
  }

  private velocity: number

  private state: PlayerState

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
      case PlayerState.Dead:
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

    if (this.y < 0) {
      this.y = 0
    } else if (this.y > screen.height) {
      this.y = screen.height
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
}

enum PlayerState {
  Jump,
  Drop,
  Dead
}

export default Player
