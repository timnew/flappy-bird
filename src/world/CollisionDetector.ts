import createDebug from 'debug'
const debug = createDebug('app:CollisionDetector')

import GameObject from '../engine/GameObject'
import World from './World'
import Bird from './Bird'
import FullName from '../engine/FullName'
import PipeGate from './PipeGate'

export default class CollisionDetector implements GameObject<World> {
  readonly fullName = FullName.singleton('CollisionDetector')

  readonly safeX: number

  constructor(world: World) {
    const { halfBirdWidth, pipeWidth, halfScreenWidth } = world.params

    this.safeX = halfScreenWidth - halfBirdWidth - pipeWidth
  }

  private nextPipe: PipeGate | null = null

  update(deltaTime: number, world: World): void {
    if (this.nextPipe == null || this.nextPipe.x < this.safeX) {
      this.nextPipe = this.findNextPipe(world)
    }

    if (this.nextPipe != null) {
      this.detectCollision(this.nextPipe, world)
    }
  }

  private findNextPipe(world: World): PipeGate | null {
    const futureGates = world.actors
      .getValue('PipeGate')
      .filter(pipe => pipe.x >= this.safeX)

    let nextPipe: PipeGate | null

    switch (futureGates.length) {
      case 0:
        nextPipe = null
        break
      case 1:
        nextPipe = futureGates[0] as PipeGate

        debug(
          'Next Pipe: %s[x: %d, y: %d +- %d]',
          nextPipe.name,
          nextPipe.x,
          nextPipe.position,
          nextPipe.halfGapSize
        )
        break

      default:
        nextPipe = futureGates.reduce(
          (previous, current) => (current.x < previous.x ? current : previous),
          futureGates[0]
        ) as PipeGate

        debug(
          'Next Pipe: %s[x: %d, y: %d +- %d]',
          nextPipe.name,
          nextPipe.x,
          nextPipe.position,
          nextPipe.halfGapSize
        )
        break
    }

    return nextPipe
  }

  detectCollision(pipe: PipeGate, world: World) {
    world.actors
      .getValue('Bird')
      .map(bird => {
        console.log(
          bird.getBounds(),
          pipe.getBounds(),
          pipe.topPipe.getBounds(),
          pipe.bottomPipe.getBounds()
        )
        return bird
      })
      .filter(bird => pipe.isCollidedOn(bird))
      .forEach(bird => {
        debug('Bird[%s] collides on Pipe[%s]', bird.name, pipe.name)
        ;(bird as Bird).kill()
      })
  }
}
