import { ContainerActor } from '../engine/ContainerActor'
import World from './World'
import { Sprite, loaders, DisplayObject, Rectangle, Point } from 'pixi.js'
import FullName from '../engine/FullName'

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
    super(new FullName('PipeGate', String(PipeGate.instanceCount++)))

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

  isCollidedOn(another: DisplayObject | Rectangle | Point): boolean {
    return (
      this.topPipe.isCollidedOn(another) ||
      this.bottomPipe.isCollidedOn(another)
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
