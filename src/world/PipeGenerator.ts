import createDebug from 'debug'
const debug = createDebug('app:PipeGenerator')

import GameObject from '../engine/GameObject'
import World from './World'
import { randomInt } from '../engine/randomGenerator'
import PipeGate from './PipeGate'
import Name, { singletonName } from '../engine/Name'

export default class PipeGenerator implements GameObject<World> {
  readonly name: Name = singletonName('PipeGenerator')

  readonly initialX: number
  get distanceThreshold(): number {
    return this.world.params.minPipeDistance
  }

  private _distance: number = 0
  get distance(): number {
    return this._distance
  }

  constructor(readonly world: World) {
    this.initialX = world.screen.width
    this._distance = randomInt(world.params.pipeWidth * 3)
  }

  update(deltaTime: number, world: World): void {
    this._distance -= world.params.speed * deltaTime
    if (this.distance < this.distanceThreshold) {
      debug('Generating Pipe: %d < %d', this.distance, this.distanceThreshold)
      this.generatePipe()
      this.generateDistance()
    }
  }

  generatePipe() {
    const params = this.world.params

    const halfGapSize = randomInt(params.maxGapSize, params.minGapSize) / 2

    const gapPosition = randomInt(
      this.world.screen.height - params.minPipeBottomMargin - halfGapSize,
      params.minPipeTopMargin + halfGapSize
    )

    const x = this.distance + this.initialX

    debug('Generate Pipe: [%d, %d +- %d]', x, gapPosition, halfGapSize)

    this.world.addObject(new PipeGate(this.world, x, gapPosition, halfGapSize))
  }

  generateDistance() {
    this._distance += randomInt(
      this.world.params.maxPipeDistance,
      this.world.params.minPipeDistance
    )
    debug('new distance: %d', this.distance)
  }
}
