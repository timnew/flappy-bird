import AiPlayer from './ai/AiPlayer'
import { Set } from 'typescript-collections'
import shuffle from 'lodash.shuffle'
import maxBy from 'lodash.maxby'
import chunk from 'lodash.chunk'
import Gene, { crossoverAndMutate, Group } from './ai/Gene'
import flatten from 'lodash.flatten'

// [X] 1. Fitness should calculate vertical distance from the center of gap on death
// [X] 2. Input should include vertical velocity
// [X] 3. Better selection algorithm
// [X] 4. Crossover Rate
// [X] 5. Mutation Rate
// [X] 6. Crossover Point

class Evolution {
  constructor(readonly players: Set<AiPlayer>) {}

  run() {
    const players = this.players
    const addPlayer = players.add.bind(players)
    const selected = this.tournamentSelection(players.toArray(), 2, 2)
    players.clear()

    const { crossoverGroup, remainGroup } = this.crossoverDivide(selected)
    remainGroup.forEach(addPlayer)

    const newGeneration = this.nextGeneration(crossoverGroup)
    newGeneration.forEach(addPlayer)
  }

  tournamentSelection(
    players: AiPlayer[],
    groupSize: number = 2,
    rounds: number = 1
  ): AiPlayer[] {
    const shuffled = players
    shuffle(shuffled)

    const selected = chunk(shuffled, groupSize).map(group =>
      maxBy(group, p => p.liveScore.overall)
    ) as AiPlayer[]

    if (rounds == 1) {
      return selected
    }

    return this.tournamentSelection(selected, groupSize, rounds - 1)
  }

  crossoverDivide(
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

  nextGeneration(players: AiPlayer[], mutateRate: number = 0.1): AiPlayer[] {
    const pairs = chunk(players, 2)
    const afterCrossover = pairs.map(group => {
      const genes = group.map(player => player.gene) as Group<Gene>

      return crossoverAndMutate(genes, mutateRate).map(g => new AiPlayer(g))
    })

    return flatten(afterCrossover)
  }
}
