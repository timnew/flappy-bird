import { Application, Rectangle, Container, ticker, loaders } from 'pixi.js'
import Player from './Player'
import GameObject from './GameObject'
import KeyboardBinding from './KeyboardBinding'

class Game {
  constructor(private app: Application) {
    console.log(this.screen)
  }

  get screen(): Rectangle {
    return this.app.screen
  }

  get stage(): Container {
    return this.app.stage
  }

  get ticker(): ticker.Ticker {
    return this.app.ticker
  }

  get loader(): loaders.Loader {
    return this.app.loader
  }

  run() {
    this.app.loader.load(() => {
      this.setup()
      this.app.ticker.add(this.loop.bind(this))
    })
  }

  private gameObjects: GameObject[] = []

  private playerControl: KeyboardBinding = new KeyboardBinding('Space')

  setup() {
    const resources = this.app.loader.resources

    const player = new Player(
      resources.bird.texture,
      this.screen.width / 2,
      this.screen.height / 2
    )
    this.gameObjects.push(player)

    this.playerControl.onKeyDown = () => player.jump()

    this.stage.addChild(...this.gameObjects)
  }

  loop(deltaTime: number) {
    this.gameObjects.forEach(obj => obj.update(deltaTime, this))
  }
}

export default Game
