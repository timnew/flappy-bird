import createDebug from 'debug'
const debug = createDebug('app:Stage')

import { Container, Rectangle, loaders, DisplayObject } from 'pixi.js'
import Game from './Game'
import GameObject from './GameObject'
import PlayerControl from './PlayerControl'
import Actor from './Actor'
import { MultiDictionary } from 'typescript-collections'
import { StructuredName } from './SturcturedName'

export default abstract class Stage<T extends Stage<T>> extends Container
  implements GameObject<Game> {
  readonly name: string
  constructor(name: string, readonly game: Game) {
    super()
    this.name = `Stage:${name}`
  }

  get screen(): Rectangle {
    return this.game.screen
  }

  get resources(): loaders.ResourceDictionary {
    return this.game.resources
  }

  get playerControl(): PlayerControl {
    return this.game.playerControl
  }

  readonly actors: MultiDictionary<
    string,
    GameObject<T> & DisplayObject
  > = new MultiDictionary()
  readonly controllers: MultiDictionary<
    string,
    GameObject<T>
  > = new MultiDictionary()

  addObject(obj: GameObject<T>) {
    const name = StructuredName.parse(obj.name)

    if (obj instanceof DisplayObject) {
      this.addActor(name, obj)
    } else {
      this.addController(name, obj)
    }
  }

  removeObject(obj: GameObject<T>) {
    const name = StructuredName.parse(obj.name)

    if (obj instanceof DisplayObject) {
      this.removeActor(name, obj)
    } else {
      this.removeController(name, obj)
    }
  }

  private addActor(name: StructuredName, actor: GameObject<T> & DisplayObject) {
    debug('Add actor: %s', actor.name)
    this.actors.setValue(name.type, actor)
    this.addChildAt(actor as DisplayObject, 0)
  }

  private addController(name: StructuredName, controller: GameObject<T>) {
    debug('Add controller: %s', controller.name)
    this.controllers.setValue(name.type, controller)
  }

  private removeActor(
    name: StructuredName,
    actor: GameObject<T> & DisplayObject
  ) {
    debug('Remove actor: %s', actor.name)

    this.actors.remove(name.type, actor)
    this.removeChild(actor)
  }

  private removeController(name: StructuredName, controller: GameObject<T>) {
    debug('Remove controller: %s', controller.name)

    this.controllers.remove(name.type, controller)
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

    this.updateOthers()
  }

  updateOthers() {}
}
