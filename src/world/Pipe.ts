import World from './World'
import Actor from '../engine/Actor'

let instanceCount = 0
export abstract class Pipe extends Actor<World> {
  constructor(world: World, anchor: number, assetName: string, height: number) {
    super('Pipe', world.resources[assetName].texture)
    this.anchor.set(0, anchor)

    this.y = height
    this.x = world.screen.width

    this.name = `${assetName} ${instanceCount}`
    instanceCount++
  }

  update(deltaTime: number, world: World): void {
    this.x -= world.speed
  }
}

export class TopPipe extends Pipe {
  constructor(world: World, height: number) {
    super(world, 1, 'topPipe', height)
  }
}

export class BottomPipe extends Pipe {
  constructor(world: World, height: number) {
    super(world, 0, 'bottomPipe', height)
  }
}
