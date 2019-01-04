import { Text, TextStyle, Container } from 'pixi.js'
import Player from '../players/Player'
import Bird from './Bird'
import World from './World'

export interface ScoreLabel {
  renderScore(player: Player): void
}

export class AttachedScoreLabel extends Text implements ScoreLabel {
  constructor(bird: Bird) {
    const style = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 16,
      fill: ['#efeeac', '#d6d30e'],
      stroke: '#333333',
      strokeThickness: 1
    })

    super('', style)

    this.anchor.set(0.5, 0)
    this.x = 0
    this.y = bird.birdSprite.height / 2 + 10
    bird.addChild(this)
  }

  renderScore(player: Player): void {
    const { score, pipeCount, death } = player
    this.text = `S: ${Math.round(score)}\nP: ${pipeCount} L: ${death}`
  }
}

export class FixedScoreLabel extends Container implements ScoreLabel {
  readonly leftLabel: Text
  readonly rightLabel: Text

  constructor(world: World) {
    super()

    this.x = 0
    this.y = 0

    this.leftLabel = new Text(
      '',
      new TextStyle({
        fontFamily: 'Arial',
        fontSize: 16,
        fill: ['#efeeac', '#d6d30e'],
        stroke: '#333333',
        strokeThickness: 1
      })
    )

    this.leftLabel.anchor.set(0, 0)
    this.leftLabel.x = 5
    this.leftLabel.y = 5
    this.addChild(this.leftLabel)

    this.rightLabel = new Text(
      '',
      new TextStyle({
        fontFamily: 'Arial',
        fontSize: 16,
        fill: ['#bcfff9', '#0acebc'],
        stroke: '#333333',
        strokeThickness: 1
      })
    )

    this.rightLabel.anchor.set(1, 0)
    this.rightLabel.x = world.screen.width - 5
    this.rightLabel.y = 5
    this.addChild(this.rightLabel)
  }

  renderScore(player: Player): void {
    const {
      name,
      score,
      pipeCount,
      distance,
      death,
      bestScore,
      bestDistance,
      bestPipeCount
    } = player

    this.leftLabel.text = [
      `    ${name} [${death} gen]`,
      `        Score: ${Math.round(score)}`,
      `         Pipe: ${pipeCount}`,
      `     Distance: ${Math.round(distance)}`
    ].join('\n')

    this.rightLabel.text = [
      `   Best Score: ${Math.round(bestScore)}`,
      `    Best Pipe: ${bestPipeCount}`,
      `Best Distance: ${Math.round(bestDistance)}`
    ].join('\n')
  }
}
