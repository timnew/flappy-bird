import Player from './Player'
import World from '../world/World'

export default class HumanPlayer extends Player {
  constructor(readonly world: World, name: string, readonly keyCode: string) {
    super(world, name)

    world.game.keyboard.onKey(keyCode).onEvent('keyDownSingle', () => {
      this.flap()
    })

    this.debug('Listening on key %s', keyCode)
  }

  dispose() {
    this.world.game.keyboard.silence(this.keyCode)
    this.debug('Disposed')
  }
}
