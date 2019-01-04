import createDebug from 'debug'
const debug = createDebug('app:World')

import Stage from '../engine/Stage'
import Judge from './Judge'
import PipeGenerator from './PipeGenerator'
import ParameterController from './ParameterController'
import Game from '../engine/Game'
import HumanPlayer from '../engine/HumanPlayer'
import { FixedScoreLabel } from './ScoreLabel'

export default class World extends Stage<World> {
  readonly params: ParameterController = new ParameterController()

  readonly scoreLabel: FixedScoreLabel = new FixedScoreLabel(this)

  constructor(game: Game) {
    super('Game', game)
    ;(window as any).world = this
  }

  setup() {
    this.params.setup(this)

    this.addController(new HumanPlayer(this, 'TimNew', 'Space'))

    const judge = new Judge(this)

    this.addObject(judge)
    this.addObject(new PipeGenerator(this))

    this.addChild(this.scoreLabel)

    judge.startGame()
  }
}
