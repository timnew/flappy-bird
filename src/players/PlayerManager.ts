import HumanPlayer from '../engine/HumanPlayer'
import Player from './Player'

export default class PlayerManager {
  players: Player[] = []

  addHuman(player: HumanPlayer) {
    this.players.push(player)
  }
}
