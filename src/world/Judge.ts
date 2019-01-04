import createDebug from 'debug'
const debug = createDebug('app:Judge')

import GameObject from '../engine/GameObject'
import World from './World'
import Bird from './Bird'
import PipeGate from './PipeGate'
import Player from '../players/Player'
import Name, { singletonName } from '../engine/Name'

export default class Judge implements GameObject<World> {
  readonly name: Name = singletonName('Judge')

  readonly safeX: number

  constructor(readonly world: World) {
    const { halfBirdWidth, pipeWidth, halfScreenWidth } = world.params

    this.safeX = halfScreenWidth - halfBirdWidth - pipeWidth
  }

  private nextPipe: PipeGate | null = null

  update(deltaTime: number, world: World): void {
    if (this.nextPipe != null && this.nextPipe.x < this.safeX) {
      this.updatePlayerPipeCount()

      this.nextPipe = null
    }

    if (this.nextPipe == null) {
      this.nextPipe = this.findNextPipe(world)
    }

    if (this.nextPipe != null) {
      this.detectCollision(this.nextPipe, world)
    }

    this.updatePlayer(deltaTime, world.params.speed)
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
    this.liveBirds
      .filter(bird => pipe.testHit(bird))
      .forEach(bird => {
        debug('Bird[%s] collides on Pipe[%s]', bird.name, pipe.name)
        ;(bird as Bird).kill()
        this.revivePlayer(bird.player)
      })
  }

  createBirdForPlayer(player: Player, isPending: boolean) {
    const bird = new Bird(player, this.world, isPending)
    this.world.addActor(bird)
  }

  get players(): Player[] {
    return this.world.players
  }

  get liveBirds(): Bird[] {
    return this.world.actors
      .getValue('Player')
      .map(bird => bird as Bird)
      .filter(bird => bird.isLive)
  }

  get livePlayers(): Player[] {
    return this.liveBirds.map(bird => bird.player)
  }

  startGame() {
    this.players.forEach(player => {
      this.createBirdForPlayer(player, true)
      player.onGameStart()
    })
  }

  private updatePlayer(deltaTime: number, speed: number) {
    const distance = deltaTime * speed

    this.liveBirds.forEach(bird => {
      const player = bird.player
      player.liveScore.increaseDistance(distance)

      if (this.nextPipe != null) {
        const { gapPosition, halfGapSize, x } = this.nextPipe
        player.onVisual({
          speed: speed,
          distanceToNextPipe: x - bird.x,
          pipeGap: 2 * halfGapSize,
          heightDifference: gapPosition - bird.y
        })
      }
    })
  }

  private updatePlayerPipeCount() {
    this.livePlayers.forEach(player => player.liveScore.increasePipeCount())
  }

  private revivePlayer(player: Player) {
    if (this.world.params.autoRevive) {
      this.createBirdForPlayer(player, true)
    }
  }
}
