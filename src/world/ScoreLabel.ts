import { Text, TextStyle, Container } from 'pixi.js'
import Player from '../players/Player'
import Bird from './Bird'
import World from './World'
import { Score } from '../players/Score'

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
    const { overall: bs, pipeCount: bp, death: d } = player.scoreRecord
    const { overall: s, pipeCount: p } = player.liveScore
    this.text = `D: ${d}\nBS: ${Math.round(bs)} BP: ${bp}\nS: ${Math.round(
      s
    )} P: ${p}`
  }
}

export class GlobalScoreBoard extends Container implements ScoreLabel {
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
    this.renderLeft(player.liveScore)
    this.renderRight(player.scoreRecord)
  }

  renderLeft({ name, overall, pipeCount, distance, death }: Score) {
    this.leftLabel.text = [
      `    ${name} [${death} gen]`,
      `      Overall: ${Math.round(overall)}`,
      `         Pipe: ${pipeCount}`,
      `     Distance: ${Math.round(distance)}`
    ].join('\n')
  }

  renderRight({ overall, pipeCount, distance, death }: Score) {
    this.rightLabel.text = [
      ` Best Overall: ${Math.round(overall)}`,
      `    Best Pipe: ${pipeCount}`,
      `Best Distance: ${Math.round(distance)}`,
      `  Total Death: ${death}`
    ].join('\n')
  }
}
