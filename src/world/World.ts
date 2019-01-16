import createDebug from 'debug'
const debug = createDebug('app:World')

import Stage from '../engine/Stage'
import Judge from './Judge'
import PipeGenerator from './PipeGenerator'
import ParameterController from './ParameterController'
import Game from '../engine/Game'
import { GlobalScoreBoard } from './ScoreLabel'
import GameEnd from '../gameEnd/GameEnd'

export default class World extends Stage<World> {
  readonly params: ParameterController = new ParameterController()

  readonly scoreBoard: GlobalScoreBoard = new GlobalScoreBoard(this)

  constructor(game: Game) {
    super('Game', game)
    ;(window as any).world = this
  }

  setup() {
    this.params.setup(this)

    const judge = new Judge(this)

    this.addObject(judge)
    this.addObject(new PipeGenerator(this))

    this.addChild(this.scoreBoard)

    judge.startGame()

    this.game.keyboard
      .onKey('KeyK')
      .onEvent('keyDownSingle', () => judge.destroyAllBirds())
  }

  gameOver() {
    // const gameEnd = new GameEnd(this.game)

    // gameEnd.setup()

    // this.game.stage = gameEnd

    // this.game.keyboard.silence('KeyQ')
    this.game.keyboard.silence('KeyK')
    this.game.playerRegistry.evolute()
    const game = new World(this.game)
    game.setup()
    this.game.stage = game
  }
}
