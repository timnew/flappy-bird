import GameObject from '../engine/GameObject'
import World from './World'
import { randomInt } from '../engine/randomGenerator'
import { TopPipe, BottomPipe } from './Pipe'

export default class PipeGenerator implements GameObject<World> {
  readonly name: string = 'PipeGenerator'
  readonly type: string = 'PipeGenerator'

  readonly initialX: number
  get distanceThreshold(): number {
    return this.world.speed
  }

  private _distance: number = 0
  get distance(): number {
    return this._distance
  }

  constructor(readonly world: World) {
    this.initialX = world.screen.width
    this.generateDistance(50)
  }

  update(deltaTime: number, world: World): void {
    this._distance -= world.speed

    if (this.distance < this.distanceThreshold) {
      this.generatePipe()
      this.generateDistance()
    }
  }

  generatePipe() {
    const halfGapSize =
      randomInt(this.world.maxGapSize, this.world.minGapSize) / 2

    const gapPosition = randomInt(
      this.world.screen.height - this.world.minPipeBottomMargin - halfGapSize,
      this.world.minPipeTopMargin + halfGapSize
    )

    const x = this.distance + this.initialX

    this.world.addActor(new TopPipe(this.world, gapPosition - halfGapSize, x))
    this.world.addActor(
      new BottomPipe(this.world, gapPosition + halfGapSize, x)
    )
  }

  generateDistance(maxDistance: number = this.world.maxPipeDistance) {
    this._distance = randomInt(maxDistance)
  }
}
