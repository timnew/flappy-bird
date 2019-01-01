import createDebug from 'debug'
const debug = createDebug('app:Stage')

import { Container, Rectangle, loaders } from 'pixi.js'
import Game from './Game'
import GameObject from './GameObject'
import PlayerControl from './PlayerControl'
import Actor from './Actor'
import { MultiDictionary } from 'typescript-collections'

export default abstract class Stage<T extends Stage<T>> extends Container
  implements GameObject<Game> {
  readonly type: string = 'Stage'

  get screen(): Rectangle {
    return this.game.screen
  }

  get resources(): loaders.ResourceDictionary {
    return this.game.resources
  }

  get playerControl(): PlayerControl {
    return this.game.playerControl
  }

  readonly actors: MultiDictionary<string, Actor<T>> = new MultiDictionary()
  readonly controllers: MultiDictionary<
    string,
    GameObject<T>
  > = new MultiDictionary()

  constructor(readonly game: Game) {
    super()
  }

  addActor(actor: Actor<T>) {
    debug('Add actor: %s: %s', actor.name, actor.type)
    this.actors.setValue(actor.type, actor)
    this.addChildAt(actor, 0)
  }

  addController(object: GameObject<T>) {
    debug('Add controller: %s: %s', object.name, object.type)
    this.controllers.setValue(object.type, object)
  }

  removeActor(actor: Actor<T>) {
    debug('Remove actor: %s: %s', actor.name, actor.type)

    this.actors.remove(actor.type, actor)
    this.removeChild(actor)
  }

  removeController(object: GameObject<T>) {
    debug('Remove controller: %s: %s', object.name, object.type)

    this.controllers.remove(object.type, object)
  }

  abstract setup(): void

  update(deltaTime: number, game: Game): void {
    const stage: T = this as any // To workaround the compiler type check
    this.actors.values().forEach(actor => {
      actor.update(deltaTime, stage)
    })
    this.controllers.values().forEach(obj => {
      obj.update(deltaTime, stage)
    })

    this.updateStage()
  }

  updateStage() {}
}
