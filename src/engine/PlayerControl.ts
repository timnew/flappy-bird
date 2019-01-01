import createDebug from 'debug'

const debug = createDebug('app:PlayerControl')

import Game from './Game'
import { EventEmitter } from 'events'
import Player from '../world/Player'

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

  registerPlayer(player: Player) {
    debug(`Register player %s`, player.name)
    this.emitter.on(player.name, player.controlApi)
  }
}
