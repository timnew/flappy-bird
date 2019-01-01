import { Application, Rectangle, Container, ticker, loaders } from 'pixi.js'
import Player from './Player'
import GameObject from './GameObject'
import KeyboardBinding from './KeyboardBinding'
import KeyboardListener from './KeyboardListener'
import PlayerControl from './PlayerControl'

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

  get resources(): loaders.ResourceDictionary {
    return this.loader.resources
  }

  run() {
    this.app.loader.load(() => {
      this.setup()
      this.app.ticker.add(this.loop.bind(this))
    })
  }

  readonly gameObjects: GameObject[] = []

  readonly keyboard: KeyboardListener = new KeyboardListener()

  readonly playerControl: PlayerControl = new PlayerControl(this)

  setup() {
    const resources = this.app.loader.resources

    this.gameObjects.push(new Player(this, 'player'))

    this.stage.addChild(...this.gameObjects)

    this.playerControl.registerHumanControl('player', 'Space')

    this.keyboard.subscribe()
  }

  loop(deltaTime: number) {
    this.gameObjects.forEach(obj => obj.update(deltaTime, this))
  }
}

export default Game
