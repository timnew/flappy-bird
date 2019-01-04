import Player from '../players/Player'
import World from '../world/World'
import Bird from '../world/Bird'
import { Text } from 'pixi.js'
import NameLabel from '../world/NameLabel'
import { ScoreLabel } from '../world/ScoreLabel'

export default class HumanPlayer extends Player {
  constructor(readonly world: World, name: string, readonly keyCode: string) {
    super(world, name)

    world.keyboard.onKey(keyCode).onEvent('keyDownSingle', () => {
      this.flap()
    })

    this.debug('Listening on key %s', keyCode)
  }

  protected setupNameLabel(bird: Bird): NameLabel {
    const label = super.setupNameLabel(bird)

    label.text = `${this.name.localName}:${this.death}`

    label.alpha = 0.7

    return label
  }

  protected setupScoreLabel(bird: Bird): ScoreLabel {
    this.scoreLabel = this.world.scoreLabel
    return this.scoreLabel
  }

  dispose() {
    this.world.keyboard.silence(this.keyCode)
    this.debug('Disposed')
  }
}
