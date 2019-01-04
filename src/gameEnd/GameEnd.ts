import Stage from '../engine/Stage'
import Game from '../engine/Game'
import { Text, TextStyle } from 'pixi.js'
import World from '../world/World'

export default class GameEnd extends Stage<GameEnd> {
  constructor(game: Game) {
    super('Game End', game)
  }

  setup(): void {
    this.addChild(this.renderGameOver())

    this.addChild(this.renderRetry())
  }

  renderGameOver(): Text {
    const style = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 64,
      fontStyle: 'italic',
      fontWeight: 'bold',
      fill: ['#f4a297', '#7c0f01'],
      stroke: '##2e0042',
      strokeThickness: 5,
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6
    })

    const gameOver = new Text('Game End', style)

    gameOver.anchor.set(0.5, 1)
    gameOver.x = this.screen.width / 2
    gameOver.y = this.screen.height / 2 - 30

    return gameOver
  }

  renderRetry(): Text {
    const style = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 42,
      fontStyle: 'italic',
      fontWeight: 'bold',
      fill: ['#e5dab0', '#fcc800'],
      stroke: '#969696',
      strokeThickness: 5,
      dropShadow: true,
      dropShadowColor: '#ffffff',
      dropShadowBlur: 8,
      dropShadowAngle: 0,
      dropShadowDistance: 0
    })

    const retry = new Text('Retry', style)

    retry.anchor.set(0.5, 0)
    retry.x = this.screen.width / 2
    retry.y = this.screen.height / 2 + 30

    retry.interactive = true
    retry.buttonMode = true
    retry.on('pointerdown', () => this.retry())

    return retry
  }

  retry() {
    const word = new World(this.game)

    word.setup()

    this.game.stage = word
  }
}
