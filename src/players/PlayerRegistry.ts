import createDebug from 'debug'
const debug = createDebug('app:PlayerRegistry')

import HumanPlayer from '../engine/HumanPlayer'
import Player from './Player'
import { Dictionary, Set } from 'typescript-collections'
import Name, { typedName, singletonName } from '../engine/Name'
import { KeyBinding } from '../engine/KeyboardListener'
import AiPlayer from './ai/AiPlayer'
import Gene, { createGene } from './ai/Gene'
import Evolution from './Evolution'

export default class PlayerRegistry {
  readonly players: Dictionary<Name, Player> = new Dictionary()

  readonly aiPlayers: Set<AiPlayer> = new Set(p => p.name)

  createAi(count: number) {
    for (let i = 0; i < count; i++) {
      this.addAi(createGene(singletonName(`G0-${i}`)))
    }
  }

  addAi(gene: Gene) {
    const player = new AiPlayer(gene)
    this.aiPlayers.add(player)
    debug('Created AI %s', player.name)
  }

  evolute() {
    new Evolution(this.aiPlayers).run()
  }

  addHumanPlayer(name: string, keyBinding: KeyBinding) {
    const player = new HumanPlayer(name, keyBinding)
    this.players.setValue(player.name, player)
    debug('Added Human %s[%s]', player.name, player.keyBinding.code)
  }

  get allPlayers(): Player[] {
    return this.players.values().concat(this.aiPlayers.toArray())
  }
}
