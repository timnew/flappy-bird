import { Container, loaders, Rectangle } from 'pixi.js'
import Game from './Game'
import Player from '../world/Player'
import PlayerControl from './PlayerControl'
import Actor from './Actor'

export default class World extends Container {
  get screen(): Rectangle {
    return this.game.screen
  }

  get resources(): loaders.ResourceDictionary {
    return this.game.resources
  }

  get playerControl(): PlayerControl {
    return this.game.playerControl
  }

  readonly actors: Actor[] = []

  constructor(readonly game: Game) {
    super()
  }

  addActor(actor: Actor) {
    this.actors.push(actor)
    this.addChild(actor)
  }

  setup() {
    this.addActor(new Player('player', this))

    this.playerControl.registerHumanControl('player', 'Space')
  }

  update(deltaTime: number): void {
    this.actors.forEach(actor => actor.update(deltaTime, this))
  }
}
