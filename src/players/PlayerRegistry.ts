import createDebug from 'debug'
const debug = createDebug('app:PlayerRegistry')

import HumanPlayer from '../engine/HumanPlayer'
import Player from './Player'
import { Dictionary, Set } from 'typescript-collections'
import Name, { typedName } from '../engine/Name'
import { KeyBinding } from '../engine/KeyboardListener'
import AiPlayer from './ai/AiPlayer'
import Gene, { createGene } from './ai/Gene'

export default class PlayerRegistry {
  readonly players: Dictionary<Name, Player> = new Dictionary()

  readonly aiPlayers: Set<AiPlayer> = new Set(p => p.name)

  createAi(count: number) {
    for (let i = 0; i < count; i++) {
      this.addAi(createGene(typedName('G', String(i))))
    }
  }

  addAi(gene: Gene) {
    const player = new AiPlayer(gene)
    this.aiPlayers.add(player)
    debug('Created AI %s', player.name)
  }

  evolute() {
    this.terminateWorst()
    this.mutate()
  }

  terminateWorst() {
    const players = this.aiPlayers.toArray()
    players.sort((a, b) => a.scoreRecord.overall - b.scoreRecord.overall)

    const half = Math.floor(players.length / 2)
    const worst = players.slice(0, half)

    worst.forEach(player => {
      this.aiPlayers.remove(player)
      debug('Terminate %s [%d]', player.name, player.scoreRecord.overall)
    })
  }

  mutate() {
    const genes = this.aiPlayers.toArray().map(p => p.gene)
    const count = genes.length
    const limit = Math.floor(count / 2)

    const groupA = genes.slice(0, limit)
    const groupB = genes.reverse().slice(0, limit)

    groupA.forEach((a, index) => {
      a.crossover(groupB[index]).forEach(this.addAi.bind(this))
    })
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
