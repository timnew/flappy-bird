import Name from '../engine/Name'

export class Score {
  constructor(
    readonly name: Name,
    public overall: number = 0,
    public pipeCount: number = 0,
    public distance: number = 0,
    public death: number = 0
  ) {}
}

export function emptyScore(name: Name): Score {
  return new Score(name)
}

export class LiveScore extends Score {
  increaseDistance(deltaDistance: number) {
    this.distance += deltaDistance
    this.updateOverall()
  }

  increasePipeCount() {
    this.pipeCount += 1
    this.updateOverall()
  }

  private updateOverall() {
    this.overall = this.distance + this.pipeCount * 500
  }

  die(heightOffset: number): Score {
    this.death++
    this.overall -= heightOffset * 50

    const snapshot = this.snapshot()

    this.reset()

    return snapshot
  }

  punish(score: number) {
    this.overall -= score
  }

  reset() {
    this.overall = this.pipeCount = this.distance = 0
  }

  snapshot(): Score {
    return new Score(
      this.name,
      this.overall,
      this.pipeCount,
      this.distance,
      this.death
    )
  }
}

export class ScoreRecord extends Score {
  mergeIn(score: Score) {
    this.overall = Math.max(this.overall, score.overall)
    this.pipeCount = Math.max(this.pipeCount, score.pipeCount)
    this.distance = Math.max(this.distance, score.distance)
    this.death = score.death
  }
}
