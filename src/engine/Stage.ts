import { Container, Rectangle, loaders } from 'pixi.js'
import Game from './Game'
import GameObject from './GameObject'
import PlayerControl from './PlayerControl'
import Actor from './Actor'

export default abstract class Stage<T extends Stage<T>> extends Container
  implements GameObject<Game> {
  get screen(): Rectangle {
    return this.game.screen
  }

  get resources(): loaders.ResourceDictionary {
    return this.game.resources
  }

  get playerControl(): PlayerControl {
    return this.game.playerControl
  }

  readonly actors: Actor<T>[] = []

  constructor(readonly game: Game) {
    super()
  }

  addActor(actor: Actor<T>) {
    this.actors.push(actor)
    this.addChild(actor)
  }

  abstract setup(): void

  update(deltaTime: number, game: Game): void {
    const stage: T = this as any // To workaround the compiler type check
    this.actors.forEach(actor => actor.update(deltaTime, stage))
  }
}
