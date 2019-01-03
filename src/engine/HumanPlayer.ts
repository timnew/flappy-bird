import Player from './Player'
import World from '../world/World'

export default class HumanPlayer extends Player {
  constructor(readonly world: World, name: string, readonly keyCode: string) {
    super(world, name)

    world.keyboard.onKey(keyCode).onEvent('keyDownSingle', () => {
      this.flap()
    })

    this.debug('Listening on key %s', keyCode)
  }

  dispose() {
    this.world.keyboard.silence(this.keyCode)
    this.debug('Disposed')
  }
}
