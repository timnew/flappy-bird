import createDebug from 'debug'

const debug = createDebug('app:PlayerControl')

import Game from './Game'
import { EventEmitter } from 'events'
import Bird from '../world/Bird'
import { StructuredName } from './SturcturedName'

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
    const name = StructuredName.parse(bird.name)
    debug(`Register player %s`, name.name)
    this.emitter.on(name.name, bird.controlApi)
  }
}
