import GameObject from '../engine/GameObject'
import World from './World'
import { Rectangle } from 'pixi.js'
import Player from './Player'

export default class CollisionDetector implements GameObject<World> {
  readonly name: string = 'Collision Detector'
  readonly type: string = 'CollisionDetector'

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

    world.actors
      .getValue('Player')
      .filter(player => harmfulPipes.some(pipe => player.isCollidedOn(pipe)))
      .forEach(player => (player as Player).kill())
  }
}
