import createDebug from 'debug'
const debug = createDebug('app:Stage')

import { Container, Rectangle, loaders, DisplayObject } from 'pixi.js'
import Game from './Game'
import GameObject from './GameObject'
import { MultiDictionary } from 'typescript-collections'
import FullName from './FullName'

export default abstract class Stage<T extends Stage<T>> extends Container
  implements GameObject<Game> {
  readonly fullName: FullName
  constructor(name: string, readonly game: Game) {
    super()
    this.fullName = new FullName('Stage', name)
    this.name = this.fullName.toString()
  }

  get screen(): Rectangle {
    return this.game.screen
  }

  get resources(): loaders.ResourceDictionary {
    return this.game.resources
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
    if (obj instanceof DisplayObject) {
      this.addActor(obj)
    } else {
      this.addController(obj)
    }
  }

  removeObject(obj: GameObject<T>) {
    if (obj instanceof DisplayObject) {
      this.removeActor(obj)
    } else {
      this.removeController(obj)
    }
  }

  addActor(actor: GameObject<T> & DisplayObject, onTop: boolean = false) {
    debug('Add actor: %s', actor.name)
    this.actors.setValue(actor.fullName.type, actor)
    if (onTop) {
      this.addChild(actor as DisplayObject)
    } else {
      this.addChildAt(actor as DisplayObject, 0)
    }
  }

  addController(controller: GameObject<T>) {
    debug('Add controller: %s', controller.fullName)
    this.controllers.setValue(controller.fullName.type, controller)
  }

  removeActor(actor: GameObject<T> & DisplayObject) {
    debug('Remove actor: %s', actor.name)

    this.actors.remove(actor.fullName.type, actor)
    this.removeChild(actor)
  }

  removeController(controller: GameObject<T>) {
    debug('Remove controller: %s', controller.fullName)

    this.controllers.remove(controller.fullName.name, controller)
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
