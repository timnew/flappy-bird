import World from './World'
import Actor from '../engine/Actor'

export class PipeBase extends Actor<World> {
  constructor(world: World, anchor: number, assetName: string, height: number) {
    super(world.resources[assetName].texture)
    this.anchor.set(0, anchor)

    this.y = height
    this.x = world.screen.width
  }

  update(deltaTime: number, world: World): void {
    this.x -= world.speed
  }
}

export class TopPipe extends PipeBase {
  constructor(world: World, height: number) {
    super(world, 1, 'topPipe', height)
  }
}

export class BottomPipe extends PipeBase {
  constructor(world: World, height: number) {
    super(world, 0, 'bottomPipe', height)
  }
}
