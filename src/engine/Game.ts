import { Application, Rectangle, loaders, ticker } from 'pixi.js'
import KeyboardListener from './KeyboardListener'
import World from '../world/World'
import Player from '../players/Player'
import HumanPlayer from './HumanPlayer'
import PlayerManager from '../players/PlayerManager'

class Game {
  constructor(private app: Application) {}

  readonly playerManager: PlayerManager = new PlayerManager()

  get players(): Player[] {
    return this.playerManager.players
  }

  get screen(): Rectangle {
    return this.app.screen
  }

  get resources(): loaders.ResourceDictionary {
    return this.app.loader.resources
  }

  world: World = new World(this)

  run() {
    this.app.loader.load(() => {
      this.setup()
      this.app.ticker.add(this.loop.bind(this))
    })
  }

  readonly keyboard: KeyboardListener = new KeyboardListener()

  setup() {
    this.keyboard.subscribe()

    this.playerManager.addHuman(
      new HumanPlayer('TimNew', this.keyboard.onKey('Space'))
    )

    this.world.setup()

    this.app.stage = this.world
  }

  loop() {
    const ticker = this.app.ticker

    this.world.update(ticker.elapsedMS / 1000)
  }
}

export default Game
