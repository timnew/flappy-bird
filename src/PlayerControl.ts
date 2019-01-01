import Game from './Game'
import { EventEmitter } from 'events'
import Player, { PlayerControlApi } from './Player'

export default class PlayerControl {
  private emitter: EventEmitter = new EventEmitter()

  constructor(readonly game: Game) {}

  registerHumanControl(playerName: string, keyCode: string) {
    console.log(
      `PlayerControl: Register Human Control: ${keyCode} -> ${playerName}`
    )
    this.game.keyboard
      .onKey(keyCode)
      .onEvent('keyDownSingle', () => this.trigger(playerName))
  }

  trigger(playerName: string) {
    console.log(`PlayerControl: Trigger ${playerName}`)
    this.emitter.emit(playerName)
  }

  registerPlayer(player: Player) {
    console.log(`PlayerControl: Register player ${player.name}`)
    this.emitter.on(player.name, player.controlApi)
  }
}
