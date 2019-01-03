import createDebug from 'debug'
const debug = createDebug('app:World')

import Bird from './Bird'
import Stage from '../engine/Stage'
import Judger from './Judger'
import PipeGenerator from './PipeGenerator'
import ParameterController from './ParameterController'
import Game from '../engine/Game'
import HumanPlayer from '../engine/HumanPlayer'

export default class World extends Stage<World> {
  readonly params: ParameterController = new ParameterController()

  constructor(game: Game) {
    super('Game', game)
    ;(window as any).world = this
  }

  setup() {
    this.params.setup(this)

    this.addController(new HumanPlayer(this, 'player', 'Space'))

    const judge = new Judger(this)

    this.addObject(judge)
    this.addObject(new PipeGenerator(this))

    judge.startGame()
  }
}
