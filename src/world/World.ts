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
    super('Game', game)
    ;(window as any).world = this
  }

  setup() {
    this.params.setup(this)

    this.playerControl.registerHumanControl('player', 'Space')
    this.game.keyboard
      .onKey('KeyF')
      .onEvent('keyDownSingle', () =>
        this.addActor(new Bird('player', this, true), true)
      )

    this.addObject(new CollisionDetector(this))
    this.addObject(new PipeGenerator(this))

    this.addObject(new Bird('player', this))
  }

  hasLiveBird(): boolean {
    const birds = this.actors.getValue('Bird')
    return birds.some(bird => (bird as Bird).isLive)
  }

  tryRevive(bird: Bird) {
    if (this.params.autoRevive && !this.hasLiveBird()) {
      debug('Revive bird: %s', bird.name)

      this.addActor(new Bird(bird.fullName.name, this, true), true)
    }
  }
}
