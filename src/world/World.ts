import createDebug from 'debug'
const debug = createDebug('app:World')

import Bird from './Bird'
import Stage from '../engine/Stage'
import CollisionDetector from './CollisionDetector'
import PipeGenerator from './PipeGenerator'
import ParameterController from './ParameterController'

export default class World extends Stage<World> {
  readonly params: ParameterController = new ParameterController()

  setup() {
    this.params.setup(this)

    this.addActor(new Bird('player', this))

    this.playerControl.registerHumanControl('player', 'Space')
    this.game.keyboard
      .onKey('KeyQ')
      .onEvent('keyDownSingle', () => this.revive())

    this.addController(new CollisionDetector(this))
    this.addController(new PipeGenerator(this))
  }

  revive() {
    const players = this.actors.getValue('Player')
    if (players.every(bird => !(bird as Bird).isLive)) {
      debug('Revive a new player')

      this.addActor(new Bird('player', this))
    } else {
      debug('There is at least one active player')
    }
  }
}
