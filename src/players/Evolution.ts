import AiPlayer from './ai/AiPlayer'
import { Set } from 'typescript-collections'
import shuffle from 'lodash.shuffle'
import maxBy from 'lodash.maxby'

// [X] 1. Fitness should calculate vertical distance from the center of gap on death
// [X] 2. Input should include vertical velocity
// [X] 3. Better selection algorithm
// [ ] 4. Crossover Rate
// [ ] 5. Mutation Rate
// [ ] 6. Crossover Point

class Evolution {
  static readonly crossoverRate = 0.8
  static readonly mutateRate = 0.1

  constructor(readonly playerSet: Set<AiPlayer>) {}

  run() {
    const playerSet = this.playerSet
    let players = playerSet.toArray()
    players = this.tournamentSelection(players)
    players = this.crossover(players)
    playerSet.clear()
    players.forEach(playerSet.add.bind(playerSet))
  }

  tournamentSelection(
    players: AiPlayer[],
    matchSize: number = 2,
    matchRound: number = 1
  ): AiPlayer[] {
    let remaining = players
    shuffle(remaining)
    const selected: AiPlayer[] = []

    while (remaining.length > 0) {
      const candidates = remaining.slice(0, matchSize)
      selected.push(maxBy(candidates, p => p.liveScore.overall)!)

      remaining = remaining.slice(matchSize)
    }

    if (matchRound == 1) {
      return selected
    }

    return this.tournamentSelection(selected, matchSize, matchRound - 1)
  }

  crossover(players: AiPlayer[]): AiPlayer[] {}
}
