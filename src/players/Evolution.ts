import AiPlayer from './ai/AiPlayer'

// 1. Fitness should calculate vertical distance from the center of gap on death
// 2. Input should include vertical velocity
// 3. Crossover Rate
// 4. Mutation Rate
// 5. Crossover Point

class Evolution {
  constructor(readonly players: AiPlayer[]) {}

  run(): AiPlayer[] {
    return []
  }
}
