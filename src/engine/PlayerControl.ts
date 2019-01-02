import createDebug from 'debug'

const debug = createDebug('app:PlayerControl')

import Game from './Game'
import { EventEmitter } from 'events'
import Bird from '../world/Bird'

export default class PlayerControl {
  private emitter: EventEmitter = new EventEmitter()

  constructor(readonly game: Game) {}

  registerHumanControl(playerName: string, keyCode: string) {
    debug('Register Human Control: %s -> %s', keyCode, playerName)

    this.game.keyboard
      .onKey(keyCode)
      .onEvent('keyDownSingle', () => this.trigger(playerName))
  }

  trigger(playerName: string) {
    debug(`Trigger %s`, playerName)
    this.emitter.emit(playerName)
  }

  registerBird(bird: Bird) {
    debug(`Register player %s`, bird.fullName.name)
    this.emitter.on(bird.fullName.name, bird.controlApi)
  }

  removeBird(bird: Bird) {
    debug(`Remove player %s`, bird.fullName.name)
    this.emitter.removeListener(bird.fullName.name, bird.controlApi)
  }
}
