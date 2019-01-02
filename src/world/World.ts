import createDebug from 'debug'
const debug = createDebug('app:World')

import Bird from './Bird'
import Stage from '../engine/Stage'
import CollisionDetector from './CollisionDetector'
import PipeGenerator from './PipeGenerator'
import ParameterController from './ParameterController'
import Game from '../engine/Game'

export default class World extends Stage<World> {
  readonly params: ParameterController = new ParameterController()

  constructor(game: Game) {
    super('World', game)
    ;(window as any).world = this
  }

  setup() {
    this.params.setup(this)

    this.playerControl.registerHumanControl('player', 'Space')
    this.game.keyboard
      .onKey('KeyQ')
      .onEvent('keyDownSingle', () => this.revive())

    this.addObject(new CollisionDetector(this))
    this.addObject(new PipeGenerator(this))

    this.addObject(new Bird('player', this))
  }

  revive() {
    const players = this.actors.getValue('Player')
    if (players.every(bird => !(bird as Bird).isLive)) {
      debug('Revive a new player')

      this.addObject(new Bird('player', this))
    } else {
      debug('There is at least one active player')
    }
  }
}
