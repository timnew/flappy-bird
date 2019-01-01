import { Sprite, Texture, Rectangle, Container, loaders } from 'pixi.js'
import GameObject from './GameObject'
import Game from './Game'

export type PlayerControlApi = () => void

class Player extends GameObject {
  readonly controlApi: PlayerControlApi

  constructor(game: Game, readonly name: string) {
    super(game.resources.bird.texture)

    this.anchor.set(0.5, 0.5)
    this.scale.set(0.1, 0.1)

    this.x = game.screen.width / 2
    this.y = game.screen.height / 2

    this.velocity = 0

    this.state = PlayerState.Drop

    this.controlApi = this.jump.bind(this)

    game.playerControl.registerPlayer(this)
  }

  velocity: number

  private state: PlayerState

  update(deltaTime: number, game: Game) {
    switch (this.state) {
      case PlayerState.Drop:
        if (this.velocity < 5) {
          this.velocity += 5
        }
        this.updateSprite(game.screen)
        break
      case PlayerState.Jump:
        this.state = PlayerState.Drop
        this.velocity = -30
        this.updateSprite(game.screen)
        break
      case PlayerState.Dead:
        break
    }
  }

  static MAX_ROTATION = Math.PI / 6

  private updateSprite(screen: Rectangle) {
    this.y += this.velocity

    if (this.y < 0) {
      this.y = 0
    } else if (this.y > screen.height) {
      this.y = screen.height
    }

    if (this.velocity < 0) {
      this.rotation = (this.velocity / 30) * Player.MAX_ROTATION
    } else if (this.velocity > 0) {
      this.rotation = (this.velocity / 5) * Player.MAX_ROTATION
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
