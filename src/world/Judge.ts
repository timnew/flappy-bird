import createDebug from 'debug'
const debug = createDebug('app:Judge')

import GameObject from '../engine/GameObject'
import World from './World'
import Bird, { PendingCallback } from './Bird'
import PipeGate from './PipeGate'
import Player from '../players/Player'
import Name, { singletonName } from '../engine/Name'
import PlayerRegistry from '../players/PlayerRegistry'
import { Set } from 'typescript-collections'
import { captureVisual } from '../players/PlayerVisual'

export default class Judge implements GameObject<World> {
  readonly name: Name = singletonName('Judge')

  readonly safeX: number

  readonly playerManager: PlayerManager

  constructor(readonly world: World) {
    const { halfBirdWidth, pipeWidth, halfScreenWidth } = world.params

    this.safeX = halfScreenWidth - halfBirdWidth - pipeWidth

    this.playerManager = new PlayerManager(world.game.playerRegistry)
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

    if (!this.playerManager.hasPendingOrAlive) {
      this.world.gameOver()
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
    this.birdsAlive
      .filter(bird => pipe.testHit(bird))
      .forEach(sprite => {
        const bird = sprite as Bird
        debug('Bird[%s] collides on Pipe[%s]', bird.name, pipe.name)
        bird.kill(pipe)
        this.playerManager.removeBird(bird)
        this.revivePlayer(bird.player)
      })
  }

  createBirdForPlayer(
    player: Player,
    pendingCallback: PendingCallback | null = null
  ) {
    const bird = new Bird(player, this.world, pendingCallback)
    if (bird.isLive) {
      this.playerManager.addBird(bird)
    } else {
      this.playerManager.addPending(bird)
    }
    this.world.addActor(bird)
  }

  get birdsAlive(): Bird[] {
    return this.world.actors
      .getValue('Player')
      .map(bird => bird as Bird)
      .filter(bird => bird.isLive)
  }

  startGame() {
    this.playerManager.reset()

    this.playerManager.allPlayers.forEach(player => {
      this.createBirdForPlayer(player)
      player.onGameStart()
    })
  }

  private updatePlayer(deltaTime: number, speed: number) {
    const distance = deltaTime * speed

    this.playerManager.birdsAlive.forEach(bird => {
      const player = bird.player
      player.liveScore.increaseDistance(distance)

      if (this.nextPipe != null) {
        player.onVisual(captureVisual(speed, bird, this.nextPipe))
      }
    })
  }

  private updatePlayerPipeCount() {
    this.playerManager.playersAlive.forEach(player =>
      player.liveScore.increasePipeCount()
    )
  }

  private revivePlayer(player: Player) {
    // if (player.scoreRecord.death < 10) {
    //   this.createBirdForPlayer(player, this.playerManager.onActivate())
    // }
  }
}

class PlayerManager {
  readonly playersAlive: Set<Player> = new Set(p => p.name)
  readonly birdsAlive: Set<Bird> = new Set(p => p.name)
  readonly pendingBirds: Set<Bird> = new Set(p => p.name)

  constructor(readonly playerRegistry: PlayerRegistry) {}

  get allPlayers(): Player[] {
    return this.playerRegistry.allPlayers
  }

  get hasAlive(): boolean {
    return this.playersAlive.size() > 0
  }

  get hasPending(): boolean {
    return this.pendingBirds.size() > 0
  }

  get hasPendingOrAlive(): boolean {
    return this.hasAlive || this.hasPending
  }

  addPending(bird: Bird) {
    this.pendingBirds.add(bird)
  }

  activate(bird: Bird) {
    this.pendingBirds.remove(bird)
    this.addBird(bird)
  }

  onActivate(): PendingCallback {
    return this.activate.bind(this)
  }

  addBird(bird: Bird) {
    this.birdsAlive.add(bird)
    this.playersAlive.add(bird.player)
  }

  removeBird(bird: Bird) {
    this.birdsAlive.remove(bird)
    this.playersAlive.remove(bird.player)
  }

  reset() {
    this.playersAlive.clear()
    this.birdsAlive.clear()
    this.pendingBirds.clear()
  }
}
