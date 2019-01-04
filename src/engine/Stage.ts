import createDebug from 'debug'
const debug = createDebug('app:Stage')

import { Container, Rectangle, loaders, DisplayObject } from 'pixi.js'
import Game from './Game'
import GameObject from './GameObject'
import { MultiDictionary } from 'typescript-collections'
import KeyboardListener from './KeyboardListener'
import Name, { typedName } from './Name'
import Player from '../players/Player'

export default abstract class Stage<T extends Stage<T>> extends Container
  implements GameObject<Game> {
  readonly name: Name
  constructor(localName: string, readonly game: Game) {
    super()
    this.name = typedName('Stage', localName)
  }

  get screen(): Rectangle {
    return this.game.screen
  }

  get resources(): loaders.ResourceDictionary {
    return this.game.resources
  }

  get keyboard(): KeyboardListener {
    return this.game.keyboard
  }

  get players(): Player[] {
    return this.game.players
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
    this.actors.setValue(actor.name.type, actor)
    if (onTop) {
      this.addChild(actor as DisplayObject)
    } else {
      this.addChildAt(actor as DisplayObject, 0)
    }
  }

  addController(controller: GameObject<T>) {
    debug('Add controller: %s', controller.name)
    this.controllers.setValue(controller.name.type, controller)
  }

  removeActor(actor: GameObject<T> & DisplayObject) {
    debug('Remove actor: %s', actor.name)

    this.actors.remove(actor.name.type, actor)
    this.removeChild(actor)
  }

  removeController(controller: GameObject<T>) {
    debug('Remove controller: %s', controller.name)

    this.controllers.remove(controller.name.type, controller)
  }

  abstract setup(): void

  update(deltaTime: number): void {
    const stage: T = (this as any) as T
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
