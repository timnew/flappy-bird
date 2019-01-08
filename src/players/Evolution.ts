import createDebug from 'debug'
const debug = createDebug('AI:Evolution')

import AiPlayer from './ai/AiPlayer'
import { Set } from 'typescript-collections'
import shuffle from 'lodash.shuffle'
import maxBy from 'lodash.maxby'
import chunk from 'lodash.chunk'
import Gene, { crossoverAndMutateGene, Group, mutateGene } from './ai/Gene'
import flatten from 'lodash.flatten'
import Name, { typedName } from '../engine/Name'

// [X] 1. Fitness should calculate vertical distance from the center of gap on death
// [X] 2. Input should include vertical velocity
// [X] 3. Better selection algorithm
// [X] 4. Crossover Rate
// [X] 5. Mutation Rate
// [X] 6. Crossover Point

// [X] 1. Punish bird hits sky or ground
// [X] 2. Fix collision detection
// [X] 3. Cap and normalize input vector // Implemented by Add an activation layer
// [X] 4. Review model generation/mutation, make sure no input factors is way to overpowered!

function nameOnly(player: any): string {
  return String(player.name)
}

function nameAndScore(player: any): string {
  return `${player.name.toString()}[${Math.round(player.lastScore.overall)}]`
}

function dumpNames(players: any[]): string {
  return `[${players.map(p => nameOnly(p)).join(', ')}]`
}

function dumpNamesWithScore(players: any[]): string {
  return `[${players.map(p => nameAndScore(p)).join(', ')}]`
}

export default class Evolution {
  static generation: number = 0

  private index: number = 0
  constructor(readonly players: Set<AiPlayer>) {
    Evolution.generation++
  }

  generateName(parent: Name | Name[], type: string): Name {
    if (parent instanceof Array) {
      return typedName(
        parent.map(p => p.localName).join('X'),
        `${type}${Evolution.generation}-${this.index++}`
      )
    } else {
      return typedName(
        parent.localName,
        `${type}${Evolution.generation}-${this.index++}`
      )
    }
  }

  run() {
    const players = this.players.toArray()
    this.players.clear()

    debug('All players: %s', dumpNamesWithScore(players))

    const addPlayer = (player: AiPlayer) => {
      this.players.add(player)
    }
    const selected = this.tournamentSelection(players, 2, 2)

    selected.forEach(addPlayer)

    const { crossoverGroup, remainGroup } = this.crossoverDividePlayers(
      selected
    )
    remainGroup.forEach(addPlayer)

    this.crossoverPlayers(crossoverGroup).forEach(addPlayer)

    this.mutatePlayers(selected, 'M', 0.1, 2).forEach(addPlayer)
    this.mutatePlayers(selected, 'm', 0.5, 0.5).forEach(addPlayer)
  }

  tournamentSelection(
    players: AiPlayer[],
    groupSize: number = 2,
    rounds: number = 1
  ): AiPlayer[] {
    debug(`Start tournament round ${rounds}`)
    const shuffled = players
    shuffle(shuffled)

    const selected = chunk(shuffled, groupSize).map(group => {
      debug('Compete: %s', dumpNamesWithScore(group))
      const winner = maxBy(group, p => p.lastScore.overall) as AiPlayer

      debug('Winner: %s', nameAndScore(winner))

      return winner
    }) as AiPlayer[]

    debug(`Tournament #${rounds} finished`)
    if (rounds == 1) {
      return selected
    }

    return this.tournamentSelection(selected, groupSize, rounds - 1)
  }

  crossoverDividePlayers(
    players: AiPlayer[],
    crossoverRate = 0.8
  ): { crossoverGroup: AiPlayer[]; remainGroup: AiPlayer[] } {
    const crossoverGroup: AiPlayer[] = []
    const remainGroup: AiPlayer[] = []

    players.forEach(player => {
      if (Math.random() < crossoverRate) {
        crossoverGroup.push(player)
      } else {
        remainGroup.push(player)
      }
    })

    if (crossoverGroup.length % 2 == 1) {
      // ensure crossoverGroup contains 2n players
      remainGroup.push(crossoverGroup.pop()!)
    }

    return {
      crossoverGroup,
      remainGroup
    }
  }

  crossoverPlayers(
    players: AiPlayer[],
    mutateRate: number = 0.01,
    mutateStrength: number = 0.5
  ): AiPlayer[] {
    debug('Crossover players: %s', dumpNames(players))
    const pairs = chunk(players, 2)
    const afterCrossover = pairs.map(group => {
      const parentNames = group.map(p => p.name)
      const genes = group.map(player => player.gene) as Group<Gene>

      const newPlayers = crossoverAndMutateGene(
        genes,
        [
          this.generateName(parentNames, 'C'),
          this.generateName(parentNames, 'C')
        ] as Group<Name>,
        mutateRate,
        mutateStrength
      ).map(g => new AiPlayer(g))

      debug('Cross over: %s => %s', dumpNames(group), dumpNames(newPlayers))

      return newPlayers
    })

    debug('Crossover finished')

    return flatten(afterCrossover)
  }

  mutatePlayers(
    players: AiPlayer[],
    type: string,
    mutateRate: number,
    mutateStrength: number
  ): AiPlayer[] {
    return players
      .map(p => {
        const newPlayer = mutateGene(
          p.gene,
          this.generateName(p.name, type),
          mutateRate,
          mutateStrength
        )

        debug(`Mutate: ${nameOnly(p)} -> ${nameOnly(newPlayer)}`)

        return newPlayer
      })
      .map(g => new AiPlayer(g))
  }
}
