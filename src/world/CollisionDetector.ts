import createDebug from 'debug'
const debug = createDebug('app:CollisionDetector')

import GameObject from '../engine/GameObject'
import World from './World'
import { Rectangle } from 'pixi.js'
import Bird from './Bird'
import FullName from '../engine/FullName'

export default class CollisionDetector implements GameObject<World> {
  readonly fullName = FullName.singleton('CollisionDetector')

  readonly collisionBox: Rectangle

  constructor(world: World) {
    this.collisionBox = new Rectangle(
      (world.screen.width - world.resources.bird.texture.width) / 2,
      0,
      world.resources.bird.texture.width,
      world.screen.height
    )
  }

  update(deltaTime: number, world: World): void {
    const harmfulPipes = world.actors
      .getValue('Pipe')
      .filter(pipe => pipe.isCollidedOn(this.collisionBox))

    if (harmfulPipes.length == 0) {
      return
    }

    debug('Harmful Pipes: %j', harmfulPipes)

    world.actors
      .getValue('Bird')
      .filter(bird => harmfulPipes.some(pipe => bird.isCollidedOn(pipe)))
      .forEach(bird => (bird as Bird).kill())
  }
}
