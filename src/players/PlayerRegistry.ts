import HumanPlayer from '../engine/HumanPlayer'
import Player from './Player'
import { Dictionary, Set } from 'typescript-collections'
import Name from '../engine/Name'
import { KeyBinding } from '../engine/KeyboardListener'

export default class PlayerRegistry {
  readonly players: Dictionary<Name, Player> = new Dictionary()

  addPlayer(player: Player) {
    this.players.setValue(player.name, player)
  }

  addHumanPlayer(name: string, keyBinding: KeyBinding) {
    this.addPlayer(new HumanPlayer(name, keyBinding))
  }

  get allPlayers(): Player[] {
    return this.players.values()
  }
}
