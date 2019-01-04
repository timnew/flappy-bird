import { ContainerActor } from '../engine/ContainerActor'
import World from './World'
import { Sprite, loaders } from 'pixi.js'
import Bird from './Bird'
import { typedName } from '../engine/Name'

export default class PipeGate extends ContainerActor<World> {
  static instanceCount: number = 0

  readonly topPipe: Pipe
  readonly bottomPipe: Pipe

  constructor(
    world: World,
    x: number,
    readonly gapPosition: number,
    readonly halfGapSize: number
  ) {
    super(typedName('PipeGate', String(PipeGate.instanceCount++)))

    this.x = x

    this.topPipe = new Pipe(
      world.resources,
      1,
      'topPipe',
      gapPosition - halfGapSize
    )
    this.bottomPipe = new Pipe(
      world.resources,
      0,
      'bottomPipe',
      gapPosition + halfGapSize
    )

    this.addChild(this.topPipe)
    this.addChild(this.bottomPipe)
  }

  get tint(): number {
    return this.topPipe.tint
  }

  set tint(value: number) {
    this.topPipe.tint = this.bottomPipe.tint = value
  }

  testHit(bird: Bird): boolean {
    const birdBounds = bird.getBounds()

    return (
      this.topPipe.getBounds().overlaps(birdBounds) ||
      this.bottomPipe.getBounds().overlaps(birdBounds)
    )
  }

  update(deltaTime: number, world: World): void {
    this.x -= world.params.speed * deltaTime

    if (this.getBounds().right <= 0) {
      world.removeObject(this)
    }
  }
}

class Pipe extends Sprite {
  constructor(
    resources: loaders.ResourceDictionary,
    anchor: number,
    assetName: string,
    height: number
  ) {
    super(resources[assetName].texture)

    this.anchor.set(0, anchor)

    this.x = 0
    this.y = height
  }
}
