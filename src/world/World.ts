import { Container, loaders, Rectangle } from 'pixi.js'
import Game from '../engine/Game'
import Player from './Player'
import PlayerControl from '../engine/PlayerControl'
import Actor from '../engine/Actor'
import GameObject from '../engine/GameObject'

export default class World extends Container implements GameObject<Game> {
  get screen(): Rectangle {
    return this.game.screen
  }

  get resources(): loaders.ResourceDictionary {
    return this.game.resources
  }

  get playerControl(): PlayerControl {
    return this.game.playerControl
  }

  readonly actors: Actor<World>[] = []

  constructor(readonly game: Game) {
    super()
  }

  addActor(actor: Actor<World>) {
    this.actors.push(actor)
    this.addChild(actor)
  }

  setup() {
    this.addActor(new Player('player', this))

    this.playerControl.registerHumanControl('player', 'Space')
  }

  update(deltaTime: number, game: Game): void {
    this.actors.forEach(actor => actor.update(deltaTime, this))
  }
}
